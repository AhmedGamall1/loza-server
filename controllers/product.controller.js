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
