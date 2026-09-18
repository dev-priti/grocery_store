const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        firstName: {
            type: String,
            required: true,            
        },

        lastName: {
            type: String,
            required: true,            
        },        

        phone: {
            type: Number,
            required: true,
        },

        addressLine1: {
            type: String,
            required: true,
        },

        addressLine2: {
            type: String,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            default: "India",
        },

        isDefault: {
            type: Number,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Address", addressSchema);
