import mongoose from "mongoose";

const deliveryChargeSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    airFreight: {
        perKgCharge: {
            type: Number,
            required: true,
        },
        handlingCharge: {
            type: Number,
            required: true,
        },
        minimumWeight: {
          type: Number,
          required: true,
        }
    },
    seaFreight: {
        perKgCharge: {
            type: Number,
            required: true,
        },
        handlingCharge: {
            type: Number,
            required: true,
        },
        minimumWeight: {
          type: Number,
          required: true,
        }
    },
    taxPercent: {
      type: Number,
      default: 0,
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
    collection: "DeliveryCharge",
    versionKey: false,
    timestamps: true,
  }
);

const DeliveryChargeModel = mongoose.model("DeliveryCharge", deliveryChargeSchema);
export default DeliveryChargeModel;
