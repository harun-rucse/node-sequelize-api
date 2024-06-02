import express from "express";
import * as controller from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").post(controller.createNewProduct).get(controller.getAllProducts);

router
  .route("/:id")
  .get(controller.getOneProduct)
  .patch(controller.updateOneProduct)
  .delete(controller.deleteOneProduct);

export default router;
