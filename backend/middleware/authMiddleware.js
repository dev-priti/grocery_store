const jwt = require("jsonwebtoken");

const authMiddleware = (req, resp, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return resp.status(401).json({
            message: "No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return resp.status(401).json({
            message: "Invalid or expired token",
        });

    }
};

module.exports = authMiddleware;
