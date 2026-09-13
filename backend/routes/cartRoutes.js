const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, resp) => {
    try {
        const existingCart = await Cart.findOne({
            userId: req.userId,
        });

        if (existingCart) {
            return resp.status(400).json({
                message: "Cart already exists",
            });
        }

        const cart = await Cart.create({
            userId: req.userId,
            items: [],
        });

        resp.status(201).json({
            message: "Cart created successfully",
            cart,
        });
    } catch( error ){
        console.error("Get cart error:", error);
        resp.status(500).json({
            message: "Failed to fetch cart",
        });
    }
});

router.get("/", authMiddleware, async (req, resp) => {
    try {
        const cart = await Cart.findOne({
            userId: req.userId,
        });

        resp.json(cart);
    } catch (error) {
        console.error("Get cart error:", error);

        resp.status(500).json({
            message: "Failed to fetch cart",
        });
    }
});

router.post("/items", authMiddleware, async (req, resp) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return resp.status(400).json({
                message: "Invalid product or quantity",
            });
        }

        const product = await Product.findOne({
            id: productId,
        });

        if (!product) {
            return resp.status(404).json({
                message: "Product not found",
            });
        }

        const cart = await Cart.findOne({
            userId: req.userId,
        });

        if (!cart) {
            return resp.status(404).json({
                message: "Cart not found",
            });
        }

        const existingItem = cart.items.find(
            item => item.productId === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
                return resp.status(400).json({
                    message: "Not enough stock",
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            if (quantity > product.stock) {
                return resp.status(400).json({
                    message: "Not enough stock",
                });
            }

            cart.items.push({
                productId,
                quantity,
            });
        }

        await cart.save();

        resp.json({
            message: "Item added to cart",
            cart,
        });

        if (quantity > product.stock) {
            return resp.status(400).json({
                message: "Not enough stock",
            });
        }

        if (quantity > product.stock) {
            return resp.status(400).json({
                message: "Not enough stock",
            });
        }

        router.delete("/items/:productId", authMiddleware, async (req, resp) => {
            try {
                const productId = Number(req.params.productId);

                const cart = await Cart.findOne({
                    userId: req.userId,
                });

                if(!cart) {
                    return resp.status(400).json({
                        message: "Cart not found"
                    });
                }

                cart.items = cart.items.filter(
                    item => item.productId !== productId
                );

            } catch (error) {
                console.error("Remove cart item error:", error);

                resp.status(500).json({
                    message: "Failed to remove item from cart",
                });
            }
        });
    } catch (error) {
        console.error("Add cart item error:", error);

        resp.status(500).json({
            message: "Failed to add item to cart",
        });
    }
});

router.delete("/items/:productId", authMiddleware, async (req, resp) => {
    try {
        const productId = Number(req.params.productId);

        const cart = await Cart.findOne({
            userId: req.userId,
        });

        if (!cart) {
            return resp.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            item => item.productId !== productId
        );

        await cart.save();

        resp.json({
            message: "Item removed from cart",
            cart,
        });
    } catch (error) {
        console.error("Remove cart item error:", error);

        resp.status(500).json({
            message: "Failed to remove item from cart",
        });
    }
});

router.patch("/items/:productId", authMiddleware, async (req, resp) => {
    try {
        const productId = Number(req.params.productId);
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return resp.status(400).json({
                message: "Invalid quantity",
            });
        }

        const product = await Product.findOne({
            id: productId,
        });

        if (!product) {
            return resp.status(404).json({
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return resp.status(400).json({
                message: "Not enough stock",
            });
        }

        const cart = await Cart.findOne({
            userId: req.userId,
        });

        if (!cart) {
            return resp.status(404).json({
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            item => item.productId === productId
        );

        if (!item) {
            return resp.status(404).json({
                message: "Item not found in cart",
            });
        }

        item.quantity = quantity;

        await cart.save();

        resp.json({
            message: "Cart item quantity updated",
            cart,
        });
    } catch (error) {
        console.error("Update cart item error:", error);

        resp.status(500).json({
            message: "Failed to update cart item",
        });
    }
});

router.delete("/", authMiddleware, async (req, resp) => {
    try {
        const cart = await Cart.findOne({
            userId: req.userId,
        });

        if (!cart) {
            return resp.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = [];

        await cart.save();

        resp.json({
            message: "Cart cleared successfully",
            cart,
        });
    } catch (error) {
        console.error("Clear cart error:", error);

        resp.status(500).json({
            message: "Failed to clear cart",
        });
    }
});

module.exports = router;
