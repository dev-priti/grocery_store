const express = require('express');
const app = express();
const PORT = 3000;
const connectDB = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, resp) => {
    resp.json({
      message: "Grocery API is running",  
    })
});

app.post("/api/test", (req,resp) => {
    console.log(req.body);

    resp.json({
        message: "Data received",
        data: req.body,        
    })
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

