import env from "../../env.js";
import multer from 'multer'
import multerS3 from 'multer-s3'


const config = {
    endpoint: env.LIARA_ENDPOINT,
    accessKeyId: env.LIARA_ACCESS_KEY,
    secretAccessKey: env.LIARA_SECRET_KEY,
    region: "default",
};

const upload = multer({
    storage: multerS3({
        s3,
        bucket: env.LIARA_BUCKET_NAME,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        },
    }),
});
