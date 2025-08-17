import jwt from "jsonwebtoken";

import {CustomError} from "../util/customError.js";


/**
 * @desc Authenticate user
 * @requires { headers } from user
 * @returns {Promise<Response>}
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Authorization token missing or invalid", 401);
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new CustomError("Invalid or expired token", 401);
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(err);
  }
};


/**
 * @desc check user role
 * @requires { user } from request
 * @returns {Promise<Response>}
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new CustomError("Forbidden", 403));
    }
    next();
  };
};