
import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date.getTime()
    },
    updatedAt: {
        type: Date,
        default: new Date.getTime()
    }
});

const ContactUsModel = mongoose.model('ContactUs', contactUsSchema);
export default ContactUsModel