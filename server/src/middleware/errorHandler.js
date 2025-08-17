import { customResponse } from "../util/responseHandler.js";


/**
 * @desc centralized error handler
 * @access Public
 * @returns {Promise<Response>}
 */

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  return customResponse(res, message, {}, statusCode);
};
