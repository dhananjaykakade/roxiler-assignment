import express from "express";
import cors from "cors";
import logger from "./util/logger.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running " });
});

export default app;
