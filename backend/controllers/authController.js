import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("User Is Already Existed", 400));
  }
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    verificationCode,
    verificationCodeExpiresAt:Date.now() + 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    status: "success",
    message: "User created",
    data: {
      newUser,
    },
  });
  next();
});
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isEqual = await bcrypt.compare(password, user.password);
  if (!user || !isEqual) {
    return next(new AppError("Email or Password is not Correct"));
  }
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "90d",
    }
  );
  res
    .cookie("access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      status: "success",
      message: "Logged in successfully",
      email,
      name: user.name,
      token,
    });
});
