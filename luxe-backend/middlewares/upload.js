import multer from 'multer';
import path from 'path';

export const upload = (folder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + '-' + file.originalname;
            cb(null, uniqueName);
        }
    })

    return multer({ storage });
}