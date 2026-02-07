import fs from "fs";
import path from "path";

export const TMP_DIR = "/app/data/tmp";
export const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

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