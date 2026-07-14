import fs from 'fs';
import path from 'path';

/**
 * Deletes a previously uploaded file from the uploads/<folder> directory.
 * Safe to call even if the filename is empty/undefined or the file
 * doesn't exist on disk (e.g. already removed, or was never set).
 *
 * @param {string} folder - sub-folder inside /uploads (e.g. 'items', 'categories', 'pfp')
 * @param {string} filename - the filename stored on the document (e.g. req.file.filename of the OLD file)
 */
export const deleteUploadedFile = (folder, filename) => {
    if (!filename) return;

    const filePath = path.join('uploads', folder, filename);

    fs.unlink(filePath, (err) => {
        // ENOENT just means the file was already gone - nothing to worry about.
        if (err && err.code !== 'ENOENT') {
            console.error(`Failed to delete old file (${filePath}):`, err.message);
        }
    });
};
