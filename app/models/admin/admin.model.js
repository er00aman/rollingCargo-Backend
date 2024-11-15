import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            default: null,
        },
        phoneNumber: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
        otp: {
            type: Number,
        },
        role: {
            type: Number,
            default: 0, // 0 for Admin, 1 for subAdmin
        },
        deviceToken: {
            type: String,
            default: null,
        },
        location: {
            type: { type: String, default: "Point" },
            coordinates: [Number],
        },
        accessToken: {
            type: String,
            default: null,
        },
        isBlocked: {
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
        lastLogin: {
            type: Number,
            default: new Date().getTime(),
        },
    },
    {
        strict: true,
        collection: "Admin",
        versionKey: false,
    }
);

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;
