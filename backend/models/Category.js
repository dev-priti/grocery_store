const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Category", categorySchema);
