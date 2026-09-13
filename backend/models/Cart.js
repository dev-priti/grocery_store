const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    size: {
        type: String,
    },
    shade: {
        type: String,
    },
    image: {
        type: String,
    }
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
