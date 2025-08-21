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

    inStock: { type: Boolean },

    newArrival: { type: Boolean, default: true },

    info: [
      {
        size: String,
        quantity: Number,
        inStock: {
          type: Boolean,
          default: function () {
            return this.quantity > 0;
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// For save
productSchema.pre("save", function (next) {
  if (this.info && Array.isArray(this.info)) {
    this.info.forEach((item) => {
      item.inStock = item.quantity > 0;
    });
    this.inStock = this.info.some((item) => item.inStock);
  }
  next();
});

// For findOneAndUpdate / updateOne / updateMany
productSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    const update = this.getUpdate();

    if (update.info && Array.isArray(update.info)) {
      update.info = update.info.map((item) => ({
        ...item,
        inStock: item.quantity > 0,
      }));

      update.inStock = update.info.some((item) => item.inStock);
      this.setUpdate(update);
    }

    next();
  }
);

export const Product = mongoose.model("Product", productSchema);
