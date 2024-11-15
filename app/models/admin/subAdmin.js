import mongoose from "mongoose";
const generateUniqueId = require('generate-unique-id');

var subAdminSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    fullName: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null,
    },
    simplePassword: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: "",
    },
    subAdminId: {
        type: String,
        default: (generateUniqueId({ length: 7,useLetters: true }).toUpperCase()),
    },
    moduleAccess: [{
        moduleName: {
            type: String,
            default: ""
        },
        view: {
            type: Boolean,
            default: false
        },
        actions: {
            type: Boolean,
            default: false
        },
    }],
    address: {
        type: String,
        default: "",
    },
    assignedCountry: {
        type: String,
        default: "",
    },
    assignedCity: {
        type: String,
        default: "",
    },
    wareHouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WareHouse',
        default: null
    },
    isBlocked: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    accessToken: {
        type: String,
        default:null
    },
    deviceToken: {
        type: String,
        default: null,
    },
    deviceType: {
        type: Number,
        default: null,
    },
    lastLogin: {
        type: Number,
        default: null,
    },
    lastLogout: {
        type: Number,
        default: null
      },
    createdAt: {
        type: Number,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: Number,
        default: new Date().getTime(),
    },
}, {
    strict: true,
    collection: 'subAdmin',
    versionKey: false,
    timestamps: false
});

const SubAdminModel = mongoose.model("subAdmin", subAdminSchema);
export default SubAdminModel;
