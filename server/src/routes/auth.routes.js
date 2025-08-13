import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;
