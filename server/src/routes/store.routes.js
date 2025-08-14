import { Router } from "express";
import {createStore,updateStore,getStoreById,listAllStores} from "../controllers/store.controller.js";
import {validate} from "../middleware/validate.js";
import { checkRole,authMiddleware } from "../middleware/auth.middleware.js";
import { createStoreSchema,updateStoreSchema } from "../validations/store.validation.js";


const router = Router();

router.post("/",authMiddleware, checkRole(['ADMIN']), validate(createStoreSchema), createStore);
router.put("/:id", checkRole(['admin']), validate(updateStoreSchema), updateStore);
router.get("/:id", getStoreById);
router.get("/", listAllStores);

export default router;
