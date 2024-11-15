import mongoose from "mongoose";
const generateUniqueId = require('generate-unique-id');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            default: (generateUniqueId({ length: 7,useLetters: true }).toUpperCase())
        },
        profileImg: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            required: true,
        },
        countryIsoCode: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: null,
        },
        city: {
            type: String,
            default: null,
        },
        deviceToken: {
            type: String,
            default: null,
        },
        accessToken: {
            type: String,
            default: null,
        },
        // location: {
        //     type: {
        //         type: String,
        //         default: 'Point'
        //     },
        //     coordinates: [Number, Number]
        // },
        // latitude: {
        //     type: Number,
        // },
        // longitude: {
        //     type: Number,
        // },
        otp: {
            type: Number,
            default:1234
        },
        otpExpTime: {
            type: Date
        },
        tempMobileNo: {
            type: String
        },
        tempCountryCode: {
            type: String,
        },
        tempEmail: {
            type: String,
        },
        tempOtp: {
            type: Number,
        },
        isOtpVerified: {
            type: Boolean,
            default: false,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
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
        lastLogin: {
            type: Number,
            default: new Date().getTime(),
        },
    },
    {
        strict: true,
        collection: "User",
        versionKey: false,
        timestamps: false
    }
);

// userSchema.index({
//     'location': '2dsphere'
// })

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
