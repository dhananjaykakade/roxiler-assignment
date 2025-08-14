import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addRating,deleteRating,updateRating,getRatingsForStore ,getAverageRatingForStore} from "../controllers/rating.controller.js";

const router = Router();

router.post("/", authMiddleware, addRating);
router.put("/:id", authMiddleware, updateRating);
router.delete("/:id", authMiddleware, deleteRating);
router.get("/:storeId", getRatingsForStore);
router.get("/:storeId/average", getAverageRatingForStore);

export default router;
