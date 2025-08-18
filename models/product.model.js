import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },

    images: { type: Array, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    inStock: {
      type: Boolean,
    },
    sizes: { type: Array, required: true },

    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.inStock = this.quantity > 0;
  next();
});

// productSchema.pre("save", function (next) {
//   // Update status for all items in info array
//   this.info.forEach((item) => (item.inStock = item.quantity > 0));
//   this.inStock = this.info.some((item) => item.inStock);

//   next();
// });

export const Product = mongoose.model("Product", productSchema);
