import { Router } from "express";
import {createStore,getStoreById,listAllStores,getStoreByOwnerId} from "../controllers/store.controller.js";
import {validate} from "../middleware/validate.js";
import { checkRole,authMiddleware } from "../middleware/auth.middleware.js";
import { createStoreSchema } from "../validations/store.validation.js";


const router = Router();

/**
 * @description Store routes
 * @access Private only to authenticated users with owner role and some are open to all
 */

router.post("/",authMiddleware, checkRole(['OWNER']), validate(createStoreSchema), createStore);
router.get("/:id", getStoreById);
router.get("/", listAllStores);
router.get("/get/owner", authMiddleware, checkRole(['ADMIN', 'OWNER']), getStoreByOwnerId);

export default router;
