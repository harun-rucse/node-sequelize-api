import db from "../models/index.js";

const Product = db.products;
const Category = db.categories;

const getAllProducts = async (filter = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where: filter,
    include: {
      model: Category,
      attributes: ["id", "name"],
    },
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: rows,
  };
};

const getOneProduct = (filter) => {
  return Product.findOne({ where: filter, include: { model: Category, attributes: ["id", "name"] } });
};

const createNewProduct = (payload) => {
  const product = Product.build(payload);

  return product.save();
};

const updateOneProduct = async (filter, payload) => {
  const [updatedCount] = await Product.update(payload, { where: filter });
  return updatedCount > 0;
};

const deleteOneProduct = async (filter) => {
  const deletedCount = await Product.destroy({ where: filter });
  return deletedCount > 0;
};

export { getAllProducts, getOneProduct, createNewProduct, updateOneProduct, deleteOneProduct };
