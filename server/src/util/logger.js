import pino from "pino";


/**
 * @description Logger middleware for incoming requests * 
 */
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

export default logger;
