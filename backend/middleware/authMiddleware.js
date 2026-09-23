const jwt = require("jsonwebtoken");

const authMiddleware = (req, resp, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return resp.status(401).json({
            message: "No token provided",
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return resp.status(401).json({
            message: "Authorization header must use Bearer scheme",
        });
    }

    const token = parts[1];

    if (!token) {
        return resp.status(401).json({
            message: "Token missing from authorization header",
        });
    }

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
