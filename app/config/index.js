require("dotenv").config();

export const db = {
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    SERVER_IP: process.env.SERVER_IP,
    LOCAL_IP: process.env.LOCAL_IP,
    DB_PORT: process.env.DB_PORT,
    S3_USER: process.env.S3_USER,
    BUCKET_REGION: process.env.BUCKET_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    FIREBASE_SERVER_KEY: process.env.FIREBASE_SERVER_KEY,
    SECRET_KEY: 'rollingCargo_Super_S@cr@t',
    DEFAULT_OTP_EXPIRE_TIME: process.env.DEFAULT_OTP_EXPIRE_TIME,
    SEND_GRID_KEY: '1234'
};
