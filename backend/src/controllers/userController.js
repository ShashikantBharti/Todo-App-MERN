import { User } from "../models/userModel.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      `Error: ${error.message} while generating access and refresh token`
    );
  }
};

export const registerUser = async (req, res) => {
  try {
    // Get user details
    const { name, email, password } = req.body;

    // Check if all necessary data is provided
    if ([name, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // create new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    const createdUser = await User.findById(newUser._id).select("-password");
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error registering user Error: ${error.message}`,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Get credentials
    const { email, password } = req.body;
    // Check if all necessary data is provided
    if (email.trim() === "" || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "email and password is required!",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists!",
      });
    }
    // Verify Credentials
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Access and Refresh Token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // send cookie
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in Successfully",
        data: {
          ...loggedInUser.toObject(), // To convert mongoose document to plain javascript object
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error: ${error.message} while login`,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error: ${error.message} while logout`,
    });
  }
};
