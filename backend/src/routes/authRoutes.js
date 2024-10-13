import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 * @access  Public
 */
router.route("/register").post(registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.route("/login").post(loginUser);

/**
 * @route   POST /api/users/logout
 * @desc    Logout User
 * @access  Private (Authenticated Person Only)
 */
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
