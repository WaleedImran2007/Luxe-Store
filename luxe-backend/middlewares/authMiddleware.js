import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        };

        // Extract token (Bearer <token>)

        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;

        next();
    }

    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                code: "TOKEN_EXPIRED",
                message: "Your session has expired. Please login again."
            });
        }

        return res.status(401).json({
            code: "INVALID_TOKEN",
            message: "Invalid token."
        });
    }
}