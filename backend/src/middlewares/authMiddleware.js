import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      return res
        .status(401)
        .json({ message: `Access denied. No token provided.` });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error("Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: `Unauthorized Access! Error: ${error.message}`,
    });
  }
};
