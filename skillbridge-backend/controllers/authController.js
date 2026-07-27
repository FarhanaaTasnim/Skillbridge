import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const signToken = (user) =>
  jwt.sign({sub: user._id.toString()}, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ...
if (!EMAIL_RE.test(email)) {
  return res
    .status(400)
    .json({message: "Please provide a valid email address"});
}
export const registerUser = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({message: "Name, email and password are required"});
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({message: "Password must be at least 6 characters"});
    }

    const existing = await User.findOne({email: email.toLowerCase().trim()});
    if (existing) {
      return res
        .status(409)
        .json({message: "An account with this email already exists"});
    }

    const user = await User.create({name, email, password});
    const token = signToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({message: "Registration failed"});
  }
};

export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "Email and password are required"});
    }

    const user = await User.findOne({email: email.toLowerCase().trim()});
    if (!user) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({message: "Login failed"});
  }
};
