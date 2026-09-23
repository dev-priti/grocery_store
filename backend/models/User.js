const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true,
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    dob: {
        type: Date,
        required: false,
    },

    phone: {
        type: String,
        default: "",
        trim: true,
    },

    acceptedTerms: {
        type: Number,
        default: 0,
    },

    emailOptin: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("User", userSchema);
