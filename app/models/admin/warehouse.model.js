import mongoose from "mongoose";

const wareHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subAdminId: {
        type: mongoose.Types.ObjectId,
        ref: "subAdmin",
        default: null
    },
    addressDetails: {
        buildingNumber: {
            type: String,
            default: ""
        },
        streetNumber: {
            type: String,
            default: ""
        },
        cityName: {
            type: String,
            default: ""
        },
        address: {
          type: String,
          default: ""
        },
        zipCode: {
            type: String,
            default: ""
        },
        latitude: {
          type: Number,
        },
        longitude: {
            type: Number,
        },
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
    collection: "WareHouse",
    versionKey: false,
    timestamps: true,
  }
);

const WareHouseModel = mongoose.model("WareHouse", wareHouseSchema);
export default WareHouseModel;
