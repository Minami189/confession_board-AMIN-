import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//So that the backend cannot be used without the token
//Meaning, only accessible with frontend
export function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Bearer header
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWTKEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        next();
    });
}