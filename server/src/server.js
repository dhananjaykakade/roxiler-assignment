import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import app from "./app.js";
import logger from "./util/logger.js";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;


// I started the server using immediate invocation of an async function
(async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Connected to PostgreSQL");

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
})()



