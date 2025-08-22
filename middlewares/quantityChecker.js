import { Product } from "../models/product.model.js";

export const quantityChecker = async (req, res, next) => {
  try {
    const { orderItems } = req.body;
    let insufficientStock = false;
    let unexistProduct = false;
    let checkedProducts = [];
    let totalPrice = 0; // new

    for (const orderedProduct of orderItems) {
      const product = await Product.findById(orderedProduct.id);

      if (!product) {
        unexistProduct = true;
        return res.status(400).json({ message: "Product does not exist" });
      }

      let sizeMatched = false;

      for (const [index, item] of product.info.entries()) {
        if (item.size === orderedProduct.size) {
          sizeMatched = true;

          if (item.quantity < orderedProduct.quantity) {
            insufficientStock = true;
            return res
              .status(400)
              .json({ message: "Not enough product in stock" });
          }

          // reduce stock
          product.info[index].quantity -= orderedProduct.quantity;

          // calc price
          totalPrice += orderedProduct.quantity * product.price;

          checkedProducts.push(product);
        }
      }

      if (!sizeMatched) {
        return res.status(400).json({ message: "Selected size not available" });
      }
    }

    if (insufficientStock || unexistProduct) {
      return;
    }

    req.products = checkedProducts;
    req.totalPrice = totalPrice; // attach total price
    next();
  } catch (error) {
    console.log("quantityChecker middleware error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
