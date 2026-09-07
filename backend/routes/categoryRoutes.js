const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.get("/", async (req, resp) => {
    try {
        const categories = await Category.find();
        resp.json(categories);
    } catch (error) {
        resp.status(500).json({
            message: "Failed to fetch categories",
        });
    }
})

module.exports = router;
