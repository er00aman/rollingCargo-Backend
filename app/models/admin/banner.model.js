import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    image: {
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
    collection: "Banner",
    versionKey: false,
    timestamps: true,
  }
);

const BannerModel = mongoose.model("Banner", bannerSchema);
export default BannerModel;
