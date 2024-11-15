import mongoose from "mongoose";

const goodsCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Number,
      default: new Date().getTime(),
    },
    updatedAt: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  {
    strict: true,
    collection: "GoodsCategory",
    versionKey: false,
    timestamps: true,
  }
);

const GoodsCategoryModel = mongoose.model("GoodsCategory", goodsCategorySchema);
export default GoodsCategoryModel;
