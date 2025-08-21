import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadProductImageService } from "../services/product.service.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data.name || !data.price) {
      return res.status(400).json({ message: "Missed data" });
    }

    const existProduct = await Product.findOne({ name: data.name });
    if (existProduct) {
      return res.status(400).json({
        message: "Product name already exists",
      });
    }

    // HANDLE IMAGE UPLOAD
    const uploadedImgsData = await uploadProductImageService(data.images, res);

    data.images = uploadedImgsData;
    await Product.create(data);

    // increment category productsCount
    await Category.findByIdAndUpdate(data.category, {
      $inc: { products: 1 },
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.log("product controller error (createProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    0, res.status(200).json(products);
  } catch (error) {
    console.log("product controller error (getAllProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET PRODUCTS BY CATEGORY NAME OR NEW ARRIVALS
export const getProductsByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let products;

    if (categoryName.toLowerCase() === "new-arrival") {
      products = await Product.find({ newArrival: true }).populate(
        "category",
        "name"
      );
    } else {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      products = await Product.find({ category: category._id }).populate(
        "category",
        "name"
      );
    }

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(
      "product controller error (getProductsByCategoryName) :",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("product controller error (getSingleProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
