

/**
 * @description  i made a custom error class for handling errors so that error handling is more consistent
 * @extends Error
 * @property {number} statusCode - HTTP status code
 * @property {boolean} success - Indicates if the error is a success or not
 * 
 */
export class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}
