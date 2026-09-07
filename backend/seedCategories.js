require("dotenv").config();

const connectDB = require("./db");
const Category = require("./models/Category");
const categories = require("../src/data/categories.json");

const seedCategories = async () => {
    try {
        await connectDB();
        await Category.deleteMany();
        await Category.insertMany(categories);
        console.log("Categories seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Failed to seed categories:", error);
        process.exit(1);
    }
};

seedCategories();

module.exports = seedCategories;
 