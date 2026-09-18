const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    itemName: {
        type: String,
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
    priceAtPurchase: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    itemSubtotal: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        shippingPrice: {
            type: Number,
            default: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        shippingAddressId: {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Address",
        },

        billingAddressId: {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Address",
        },

        shippingMethod: {
            type: String,
            enum: ["standard", "express"],
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cod"],
            required: true,
        },

        paymentId: {
            type: String,
        },

        transactionId: {
            type: String,
        },

        paymentStatus: {
            type: String,
            default: "pending",
        },

        orderStatus: {
            type: String,
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const addressSnapshotSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
            default: "",
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
    },
    {
        _id: false,
    }
);

module.exports = mongoose.model("Order", orderSchema);
