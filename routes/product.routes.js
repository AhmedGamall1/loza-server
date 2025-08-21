import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategoryName,
  getSingleProduct,
} from "../controllers/product.controller.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";
import { isAuthenticatd } from "../middlewares/auth/isAuthenticated.js";

const productRouter = express.Router();

productRouter.post(
  "/create-product",
  isAuthenticatd,
  authorizeRoles("admin"),
  createProduct
);

productRouter.get("/get-products", getAllProducts);

productRouter.get("/get-products/:categoryName", getProductsByCategoryName);

productRouter.get("/get-single-product/:id", getSingleProduct);

export default productRouter;
