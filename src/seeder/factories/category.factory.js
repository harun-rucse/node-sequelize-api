import { faker } from "@faker-js/faker";
import db from "../../models/index.js";
const Category = db.categories;
import * as seederFactory from "./index.js";

const seed = async (quantity = 1) => {
  const categoryData = [];

  for (let i = 0; i < quantity; i++) {
    const name = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const obj = {
      name: `${name}_${i + 1}`,
      description,
    };

    categoryData.push(obj);
  }
  await seederFactory.seedTable(Category, categoryData);
};

const drop = async () => {
  await seederFactory.dropTable(Category);
};

export { seed, drop };
