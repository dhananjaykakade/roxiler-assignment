
/**
 * @description i developed a custom response handler for uniform API responses so that all responses have a consistent structure
 */
export const customResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    data
  });
};