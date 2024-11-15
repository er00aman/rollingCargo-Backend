require('dotenv').config();

var aws = require('aws-sdk');
var multer = require('multer');
const multerS3 = require('multer-s3');
import { db } from '../config/index';

aws.config.update({
    secretAccessKey: db.S3_SECRET_KEY,
    accessKeyId: db.S3_ACCESS_KEY,
    region: db.BUCKET_REGION // region correctly set
});

var s3 = new aws.S3();

// Admin File Upload
let uploadAdmin = multer({
    storage: multerS3({
        s3: s3,
        bucket: db.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'private',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log("Original Image :", file.originalname);
            cb(null, "Uploads/Admin/" + Date.now() + "/" + file.originalname);
        }
    })
});

// Delivery File Upload
let uploadDelivery = multer({
    storage: multerS3({
        s3: s3,
        bucket: db.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'private',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, "Uploads/Delivery/" + Date.now() + "/" + file.originalname);
        }
    })
});

// Similar structure for `uploadUser` and `uploadSalesMan`

// Example of upload function
exports.uploadAdminFile = (req, res, next) => {
    uploadAdmin.fields([
        { name: 'upload_admin_file', maxCount: 5 },
        { name: 'upload_user_file', maxCount: 5 }
    ])(req, res, function (err) {
        if (err) {
            return res.status(422).send({
                message: err.message,
                response: null
            });
        }
        next();
    });
};
