import { Router } from "express" 
import { authMiddleware,checkRole } from "../middleware/auth.middleware.js";
import {getAllStoresWithRating,getAllUsers,getDashboardStats,getUserById,createUser } from "../controllers/admin.controller.js"


const router = Router();

router.get("/users", authMiddleware, checkRole("ADMIN"), getAllUsers);
router.get("/users/:id", authMiddleware, checkRole("ADMIN"), getUserById);
router.post("/users", authMiddleware, checkRole("ADMIN"), createUser);
router.get("/stores", authMiddleware, checkRole("ADMIN"), getAllStoresWithRating);
router.get("/dashboard", authMiddleware, checkRole("ADMIN"), getDashboardStats);

export default router;

