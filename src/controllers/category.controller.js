import _ from "lodash";
import { validateCategory, validateCategoryUpdate } from "../validation/category.validation.js";
import * as categoryService from "../services/category.service.js";
import * as redisClient from "../bootstrap/redis-client.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";

const CATEGORY_CACHE_KEY = process.env.REDIS_CATEGORY_CACHE_KEY;
const CATEGORY_CACHE_EXPIRATION = process.env.REDIS_CATEGORY_CACHE_EXPIRATION;

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Public
 */
const createNewCategory = catchAsync(async (req, res, next) => {
  const { error } = validateCategory(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const payload = _.pick(req.body, ["name", "description"]);
  const newCategory = await categoryService.createNewCategory(payload);

  // Invalidate the cache for all categories
  await redisClient.delAsync(`${CATEGORY_CACHE_KEY}:*`);

  res.status(201).json(new ApiResponse(201, newCategory, "Category created successfully"));
});

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const cacheKey = `${CATEGORY_CACHE_KEY}:page:${page}:limit:${limit}`;

  const cachedCategories = await redisClient.getAsync(cacheKey);
  if (cachedCategories) {
    return res.status(200).json(new ApiResponse(200, JSON.parse(cachedCategories)));
  }

  const allCategories = await categoryService.getAllCategories({}, page, limit);

  // Store the result in the cache with expiration
  await redisClient.setAsync(cacheKey, JSON.stringify(allCategories), "EX", CATEGORY_CACHE_EXPIRATION);

  res.status(200).json(new ApiResponse(200, allCategories));
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getOneCategory = catchAsync(async (req, res, next) => {
  const cacheKey = `${CATEGORY_CACHE_KEY}:${req.params.id}`;
  const cachedCategory = await redisClient.getAsync(cacheKey);
  if (cachedCategory) {
    return res.status(200).json(new ApiResponse(200, JSON.parse(cachedCategory)));
  }

  const category = await categoryService.getOneCategory({ id: req.params.id });
  if (!category) return next(new AppError("No category found with this id.", 404));

  // Store the result in the cache with expiration
  await redisClient.setAsync(cacheKey, JSON.stringify(category), "EX", CATEGORY_CACHE_EXPIRATION);

  res.status(200).json(new ApiResponse(200, category));
});

/**
 * @desc    Update single category
 * @route   PATCH /api/categories/:id
 * @access  Public
 */
const updateOneCategory = catchAsync(async (req, res, next) => {
  const { error } = validateCategoryUpdate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const payload = _.pick(req.body, ["name", "description"]);

  const updatedId = await categoryService.updateOneCategory({ id: req.params.id }, payload);
  if (!updatedId[0]) return next(new AppError("No category found with this id.", 404));

  const updatedCategory = await categoryService.getOneCategory({ id: updatedId[0] });

  // Invalidate the specific category cache
  await redisClient.delAsync(`${CATEGORY_CACHE_KEY}:${req.params.id}`);

  // Invalidate the cache for all categories
  await redisClient.delAsync(`${CATEGORY_CACHE_KEY}:*`);

  res.status(200).json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});

/**
 * @desc    Delete single category
 * @route   DELETE /api/categories/:id
 * @access  Public
 */
const deleteOneCategory = catchAsync(async (req, res, next) => {
  const deletedId = await categoryService.deleteOneCategory({ id: req.params.id });
  if (!deletedId[0]) return next(new AppError("No category found with this id.", 404));

  // Invalidate the specific category cache
  await redisClient.delAsync(`${CATEGORY_CACHE_KEY}:${req.params.id}`);

  // Invalidate the cache for all categories
  await redisClient.delAsync(`${CATEGORY_CACHE_KEY}:*`);

  res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

export { getAllCategories, createNewCategory, getOneCategory, updateOneCategory, deleteOneCategory };
