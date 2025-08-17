import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import { CustomError } from "./util/customError.js";
import storeRoutes from "./routes/store.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import adminRoutes from "./routes/admin.routes.js"

/**
 * @description Express application
 * @requires { express } for creating the server
 * @returns { express.Application } Express application instance
*/
const app = express();


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);


// centralized error handling for 404 errors
app.use((req, res, next) => {
    return new CustomError("Not Found", 404);
});

// centralized error handling middleware for all other errors 
app.use(errorHandler);

export default app;
