const express = require("express");
const Product = require("../models/Products");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/", authMiddleware, async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        // const { items } = req.body;

        session.startTransaction();

        const cart = await Cart.findOne({
            userId: req.userId,
        });

        if (!cart || cart.items.length === 0) {
            return resp.status(400).json({
                message: "Cart is empty",
            });
        }

        const items = cart.items;
        const productIds = items.map(item => item.productId);

        const products = await Product.find({
            id: {$in: productIds},
        });

        if (products.length != productIds.length) {
            return resp.status(400).json({
                message: "One or more products were not found",
            });            
        }
        if (!items || items.length === 0) {
            return resp.status(400).json({
                message: "Order must contain at least one item",
            });
        }

        for (const item of items ) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return resp.status(400).json({
                    message: "Invalid order item",
                })
            }

            const product = products.find(
                product => product.id === item.productId
            );

            if (item.quantity > product.stock) {
                return resp.status(400).json({
                    message: `Not enough stock for ${product.name}`,
                });
            }

            await Product.updateOne(
                { id: item.productId },
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        cart.items = [];

        await cart.save({ session });

        const orderItems = items.map(item => {
            const product = products.find(
                product => product.id === item.productId
            );

            const itemSubtotal = product.price * item.quantity;

            return {
                productId: product.id,
                itemName: product.name,
                quantity: item.quantity,
                priceAtPurchase: product.price,
                discountedPrice: product.price,
                itemSubtotal,
            };
        });

        const subtotal = orderItems.reduce(
            (total, item) => total + item.itemSubtotal,
            0
        );

        const discount = 0;
        const tax = 0;
        const shippingPrice = 0;

        const totalPrice = subtotal - discount + tax + shippingPrice;

        // Creating transaction. Suppose when the order is created, API fails to reduce the stock. Then it will give incorrect results.
        // So we make this as transaction to ensure atomicity.
        const order = await Order.create(
            [
                {
                    userId: req.userId,
                    items: orderItems,
                    subtotal,
                    discount,
                    tax,
                    shippingPrice,
                    totalPrice,
                    image: product.image,
                },
            ],
            { session }
        );

        const createdOrder = order[0];

        await session.commitTransaction();
        session.endSession();
        console.log("user placing the order ", req.userId);

        resp.status(201).json({
            message: "Order created successfully",
            order: createdOrder,
        });

    } catch(error) {
        console.error("Create order error:", error);

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        session.endSession();

        resp.status(500).json({
            message: "Failed to create order",
        });
    }
});

router.get("/", authMiddleware, async (req, resp) => {
    try {
        const orders = await Order.find({
            userId: req.userId,
        }).sort({
            createdAt: -1,
        });

        resp.json(orders);
    } catch (error) {
        console.error("Get orders error:", error);

        resp.status(500).json({
            message: "Failed to fetch orders",
        });
    }
});

router.get("/:orderId", authMiddleware, async (req, resp) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.userId,
        });

        if (!order) {
            return resp.status(404).json({
                message: "Order not found",
            });
        }

        resp.json(order);
    } catch (error) {
        console.error("Get order error:", error);

        resp.status(500).json({
            message: "Failed to fetch order",
        });
    }
});

module.exports = router;
