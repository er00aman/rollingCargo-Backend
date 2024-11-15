import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponName: {
      type: String,
      required: true,
    },
    couponCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    validFrom: {
        type: Number,
    },
    validTill: {
        type: Number,
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
    collection: "Coupon",
    versionKey: false,
    timestamps: true,
  }
);

const CouponModel = mongoose.model("Coupon", couponSchema);
export default CouponModel;
