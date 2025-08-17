import { Router } from "express";
import { signup, login,changePassword,getProfile } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @description User authentication routes
 * @access Public
 */

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/change-password", authMiddleware, changePassword);
router.get("/profile", authMiddleware, getProfile);

export default router;
