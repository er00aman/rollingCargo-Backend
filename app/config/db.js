import mongoose from "mongoose";
import { db } from './index.js';

require('dotenv').config();

// LOCAL_IP // SERVER_IP
let db_connection = `mongodb://${db.DB_USERNAME}:${db.DB_PASSWORD}@${db.LOCAL_IP}:${db.DB_PORT}/${db.DB_NAME}`

// console.log(db_connection)
const conn = mongoose.connect(db_connection);
conn
  .then(() => {
    console.log(`\x1b[34m\x1b[1m
      🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
                                    \x1b[1m🚀🎉✅ Mongodb connected successfully.✅ 🎉🚀
      🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
      \x1b[0m
    `);
  })

  .catch((err) => {
    console.error("❌ Error connecting to MongoDB ❌");
    console.error(err);
  });

export { mongoose, conn };