import jwt from "jsonwebtoken";
import { CustomError } from "./customError.js";


/**
 * @desc Generate JWT token
 * @description Generate JWT token
 */
export const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new CustomError("Invalid or expired token", 401);
  }
};
