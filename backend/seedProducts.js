require("dotenv").config();

const connectDB = require("./db");
const Products = require("./models/Products");
const products = require("../src/data/products.json");

const seedProducts = async () => {
    try {
        await connectDB();
        await Products.deleteMany();
        await Products.insertMany(products);
        console.log("Products seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Failed to seed products:", error);
        process.exit(1);
    }
};

seedProducts();

module.exports = seedProducts;
 