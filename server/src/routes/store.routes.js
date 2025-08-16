import { Router } from "express";
import {createStore,updateStore,getStoreById,listAllStores,getStoreByOwnerId} from "../controllers/store.controller.js";
import {validate} from "../middleware/validate.js";
import { checkRole,authMiddleware } from "../middleware/auth.middleware.js";
import { createStoreSchema,updateStoreSchema } from "../validations/store.validation.js";


const router = Router();

router.post("/",authMiddleware, checkRole(['OWNER']), validate(createStoreSchema), createStore);
router.put("/:id", checkRole(['admin']), validate(updateStoreSchema), updateStore);
router.get("/:id", getStoreById);
router.get("/", listAllStores);
router.get("/get/owner", authMiddleware, getStoreByOwnerId);

export default router;
