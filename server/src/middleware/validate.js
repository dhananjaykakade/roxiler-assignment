import { CustomError } from "../util/customError.js";


/**
 * @desc Validate request body against schema
 * @requires { request } from user
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const message = err.errors?.[0]?.message || "Validation error";
    next(new CustomError(message, 400));
  }
};
