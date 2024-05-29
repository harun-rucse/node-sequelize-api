import db from "../models/index.js";

const connectDB = () => {
  return db.sequelize.authenticate();
};

export default connectDB;
