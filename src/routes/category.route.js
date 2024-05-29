import express from "express";
import * as controller from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").post(controller.createNewCategory).get(controller.getAllCategories);

router
  .route("/:id")
  .get(controller.getOneCategory)
  .patch(controller.updateOneCategory)
  .delete(controller.deleteOneCategory);

export default router;
