const express = require("express");
const Products = require("../models/Products");
const router = express.Router();

router.get("/", async (req, resp) => {
    try {
        const products = await Products.find();
        resp.json(products);
    } catch (error) {
        resp.status(500).json({
            message: "Failed to fetch products",
        });
    }
})

module.exports = router;
