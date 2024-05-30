import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import db from "../models/index.js";
import connectDB from "../bootstrap/database.js";
import databaseSeeder from "./database-seeder.js";

db.sequelize.sync().then(() => console.log("DB sync."));

connectDB()
  .then(() => {
    console.log(`DB connection successful!`);
    console.log(`---Seeding to ${process.env.NODE_ENV} database---`);
    databaseSeeder();
  })
  .catch(() => {
    console.log(`DB connection failed!`);
  });
