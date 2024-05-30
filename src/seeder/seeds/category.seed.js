import * as categoryFactory from "../factories/category.factory.js";

export default async (type) => {
  if (type === "seed") {
    await categoryFactory.seed(100);
  } else if (type === "drop") {
    await categoryFactory.drop();
  }
};
