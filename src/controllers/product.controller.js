import _ from "lodash";
import { validateProduct, validateProductUpdate } from "../validation/product.validation.js";
import * as productService from "../services/product.service.js";
import * as redisClient from "../bootstrap/redis-client.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";

const PRODUCT_CACHE_KEY = process.env.REDIS_PRODUCT_CACHE_KEY;
const PRODUCT_CACHE_EXPIRATION = process.env.REDIS_PRODUCT_CACHE_EXPIRATION;

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Public
 */
const createNewProduct = catchAsync(async (req, res, next) => {
  const { error } = validateProduct(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const payload = _.pick(req.body, ["name", "price", "description", "categoryId"]);
  const newProduct = await productService.createNewProduct(payload);

  // Invalidate the cache for all products
  await redisClient.delAsync(`${PRODUCT_CACHE_KEY}:*`);

  res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully"));
});

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const cacheKey = `${PRODUCT_CACHE_KEY}:page:${page}:limit:${limit}`;

  const cachedProducts = await redisClient.getAsync(cacheKey);
  if (cachedProducts) {
    return res.status(200).json(new ApiResponse(200, JSON.parse(cachedProducts)));
  }

  const allProducts = await productService.getAllProducts({}, page, limit);

  // Store the result in the cache with expiration
  await redisClient.setAsync(cacheKey, JSON.stringify(allProducts), "EX", PRODUCT_CACHE_EXPIRATION);

  res.status(200).json(new ApiResponse(200, allProducts));
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getOneProduct = catchAsync(async (req, res, next) => {
  const cacheKey = `${PRODUCT_CACHE_KEY}:${req.params.id}`;
  const cachedProduct = await redisClient.getAsync(cacheKey);
  if (cachedProduct) {
    return res.status(200).json(new ApiResponse(200, JSON.parse(cachedProduct)));
  }

  const product = await productService.getOneProduct({ id: req.params.id });
  if (!product) return next(new AppError("No product found with this id.", 404));

  // Store the result in the cache with expiration
  await redisClient.setAsync(cacheKey, JSON.stringify(product), "EX", PRODUCT_CACHE_EXPIRATION);

  res.status(200).json(new ApiResponse(200, product));
});

/**
 * @desc    Update single product
 * @route   PATCH /api/products/:id
 * @access  Public
 */
const updateOneProduct = catchAsync(async (req, res, next) => {
  const { error } = validateProductUpdate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const payload = _.pick(req.body, ["name", "price", "description"]);

  const isUpdated = await productService.updateOneProduct({ id: req.params.id }, payload);
  if (!isUpdated) return next(new AppError("No product found with this id.", 404));

  const updatedProduct = await productService.getOneProduct({ id: req.params.id });

  // Invalidate the specific product cache
  await redisClient.delAsync(`${PRODUCT_CACHE_KEY}:${req.params.id}`);

  // Invalidate the cache for all products
  await redisClient.delAsync(`${PRODUCT_CACHE_KEY}:*`);

  res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

/**
 * @desc    Delete single product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteOneProduct = catchAsync(async (req, res, next) => {
  const isDeleted = await productService.deleteOneProduct({ id: req.params.id });
  if (!isDeleted) return next(new AppError("No product found with this id.", 404));

  // Invalidate the specific product cache
  await redisClient.delAsync(`${PRODUCT_CACHE_KEY}:${req.params.id}`);

  // Invalidate the cache for all products
  await redisClient.delAsync(`${PRODUCT_CACHE_KEY}:*`);

  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

export { getAllProducts, createNewProduct, getOneProduct, updateOneProduct, deleteOneProduct };
