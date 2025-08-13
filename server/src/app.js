import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import { CustomError } from "./util/customError.js";
import { customResponse } from "./util/responseHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
 customResponse(res, "Page Not Found", {}, 404);
});

app.use(errorHandler);

export default app;
