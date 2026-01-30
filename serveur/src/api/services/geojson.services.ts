import multer from "multer";
import { TMP_DIR, peekGeojsonColumns, cleanupOldTempFiles } from "../repositories/geojsonTemp.repositories";
import { Feature } from "geojson";
import { streamArray } from "stream-json/streamers/StreamArray";
import { pick } from "stream-json/filters/Pick";
import { parser } from "stream-json";
const storage = multer.diskStorage({
    destination: TMP_DIR,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({ storage });

export async function handleTempUpload(filePath: string) {
    // peek columns
    const columns = await peekGeojsonColumns(filePath);
    // cleanup old files
    await cleanupOldTempFiles();
    return columns;
}

