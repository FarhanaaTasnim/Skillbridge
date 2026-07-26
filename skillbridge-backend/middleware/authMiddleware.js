import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Not authorized, invalid or expired token" });
    }

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({ message: "Authentication error" });
  }
};

export default protect;