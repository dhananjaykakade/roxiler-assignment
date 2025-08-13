export const customResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    data
  });
};