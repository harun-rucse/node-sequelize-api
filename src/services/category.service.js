import db from "../models/index.js";
const Category = db.categories;

const getAllCategories = async (filter = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Category.findAndCountAll({
    where: filter,
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    categories: rows,
  };
};

const getOneCategory = (filter) => {
  return Category.findOne({ where: filter });
};

const createNewCategory = (payload) => {
  const category = Category.build(payload);

  return category.save();
};

const updateOneCategory = async (filter, payload) => {
  const [updatedCount] = await Category.update(payload, { where: filter });
  return updatedCount > 0;
};

const deleteOneCategory = async (filter) => {
  const deletedCount = await Category.destroy({ where: filter });
  return deletedCount > 0;
};

export { getAllCategories, getOneCategory, createNewCategory, updateOneCategory, deleteOneCategory };
