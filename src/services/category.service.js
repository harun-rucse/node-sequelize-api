import db from "../models/index.js";
const Category = db.categories;

const getAllCategories = (filter) => {
  return Category.findAll({ where: filter });
};

const getOneCategory = (filter) => {
  return Category.findOne({ where: filter });
};

const createNewCategory = (payload) => {
  const category = Category.build(payload);

  return category.save();
};

const updateOneCategory = (filter, payload) => {
  return Category.update(payload, { where: filter });
};

const deleteOneCategory = (filter) => {
  return Category.destroy({ where: filter });
};

export { getAllCategories, getOneCategory, createNewCategory, updateOneCategory, deleteOneCategory };
