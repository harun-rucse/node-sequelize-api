import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(`.env.${process.env.NODE_ENV}`) });

import Category from "./category.model.js";
import logger from "../logger/index.js";

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.categories = Category(sequelize, DataTypes);

db.sequelize
  .sync()
  .then(() => {
    logger.info("DB synced successful!");
  })
  .catch((err) => {
    logger.error("Failed to sync db: " + err.message);
  });

export default db;
