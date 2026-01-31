import { Feature } from "geojson";
import fs from "fs";
import path from "path";
import { parser,} from "stream-json";
import{pick} from "stream-json/filters/Pick";
import { streamArray } from "stream-json/streamers/StreamArray";
import {Client, PoolClient} from 'pg';
export const TMP_DIR = "/app/data/tmp";
export const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours
export type MulterRequest = Request & {
  file?: Express.Multer.File;
};

export type ColumnMapping = Record<string, string>;
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

export async function cleanupOldTempFiles() {
    try {
        const files = await fs.promises.readdir(TMP_DIR);
        const now = Date.now();
        await Promise.all(
            files.map(async (file) => {
                const fullPath = path.join(TMP_DIR, file);
                const stat = await fs.promises.stat(fullPath);
                if (now - stat.mtimeMs > MAX_AGE_MS) {
                    await fs.promises.unlink(fullPath);
                    console.log("Deleted old temp file:", fullPath);
                }
            })
        );
    } catch (err) {
        console.warn("Temp cleanup skipped:", err);
    }
}

export async function peekGeojsonColumns(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const columnsSet = new Set<string>();
        let done = false;

        const fileStream = fs.createReadStream(filePath);
        const jsonParser = parser();
        const pickFeatures = pick({ filter: "features" }); // pick the top-level 'features' array
        const featureStream = streamArray();

        featureStream.on("data", ({ value }: { value: Feature }) => {
            if (!done && value.properties) {
                Object.keys(value.properties).forEach((k) => columnsSet.add(k));
                done = true;
                fileStream.destroy(); // stop reading early
                resolve(Array.from(columnsSet));
            }
        });

        featureStream.on("end", () => {
            if (!done) resolve(Array.from(columnsSet));
        });

        featureStream.on("error", reject);
        fileStream.on("error", reject);

        // pipe through parser -> pick 'features' -> stream array
        fileStream.pipe(jsonParser).pipe(pickFeatures).pipe(featureStream);
    });
}

export async function insertGeojsonFile(
    filePath: string,
    mapping: Record<string, string>,
    tableName: string,
    dbClient: PoolClient
): Promise<number> {
    let fileStream:fs.ReadStream|null=null;
    try {
        const BATCH_SIZE = 500;
        let insertedCount = 0;
        let batch: Record<string, any>[] = [];

        await dbClient.query(`DELETE from ${tableName}`);
        fileStream = fs.createReadStream(filePath);
        const jsonParser = parser();
        const pickFeatures = pick({ filter: "features" });
        const featureStream = streamArray();

        // Use async iterator to avoid overlapping inserts
        const pipeline = fileStream.pipe(jsonParser).pipe(pickFeatures).pipe(featureStream);
        for await (const { value } of pipeline) {
            if (!value.properties) continue;

            const row: Record<string, any> = {};

            // Map columns from user mapping
            for (const [fileCol, dbCol] of Object.entries(mapping)) {
                row[dbCol] = value.properties[fileCol] ?? null;
            }

            // Add geometry as GeoJSON string
            row["geometry"] = JSON.stringify(value.geometry);

            batch.push(row);

            // Insert batch if full
            if (batch.length >= BATCH_SIZE) {
                await insertBatch(batch, tableName, dbClient);
                insertedCount += batch.length;
                batch = [];
                console.log(`Inserted ${insertedCount} so far`)
            }
        }

        // Insert any remaining rows
        if (batch.length > 0) {
            await insertBatch(batch, tableName, dbClient);
            insertedCount += batch.length;
            console.log(`Inserted${insertedCount} total`)
        }

        return insertedCount;
    } finally {
        if( fileStream){
            fileStream.close();
        }
    }
}


// Helper: insert a batch of rows
async function insertBatch(
    batch: Record<string, any>[],
    tableName: string,
    dbClient: PoolClient
) {
    const columns = Object.keys(batch[0]);
    const colNames = columns.map((c) => `"${c}"`).join(",");

    const placeholders = batch
        .map((_, i) =>
            `(${columns
                .map((col, j) =>
                    col === "geometry"
                        ? `ST_SetSRID(ST_GeomFromGeoJSON($${i * columns.length + j + 1}),4326)`
                        : `$${i * columns.length + j + 1}`
                )
                .join(",")})`
        )
        .join(",");

    const values = batch.flatMap((r) => columns.map((c) => r[c]));

    // If geom column exists, wrap it in ST_GeomFromGeoJSON
    let query = `INSERT INTO ${tableName} (${colNames}) VALUES ${placeholders}`;


    await dbClient.query(query, values);
}