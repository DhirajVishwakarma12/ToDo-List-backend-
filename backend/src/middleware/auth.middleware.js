import jwt from "jsonwebtoken"
import config from "../config/config.js";

export default async function authMiddleware(req, res, next) {

  const accessToken = req.headers.authorization?.split(" ")[1];
    
    if (!accessToken) {
        return res.status(401).json({
            message: "Access token not found"
        });
    }

    try {
        const decoded = jwt.verify(accessToken, config.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}

