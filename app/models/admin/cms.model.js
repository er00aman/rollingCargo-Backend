import mongoose from 'mongoose'

const cmsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['terms', 'privacy', 'about'], // Differentiates between the three sections
        required: true
    },
    content: {
        type: String,
        required: true
    },
    twitterLink: {
        type: String,
        default: ""
    },
    instagramLink: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: Date,
        default: new Date().getTime(),
    }
});

const CMSModel = mongoose.model('CMS', cmsSchema);
export default CMSModel;
