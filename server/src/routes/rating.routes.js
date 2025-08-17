import { Router } from "express";
import { authMiddleware,checkRole } from "../middleware/auth.middleware.js";
import { addRating,updateRating,getRatingsForStore ,getAverageRatingForStore,getUsersWhoRatedStore} from "../controllers/rating.controller.js";

const router = Router();

/**
 * @description Rating routes
 * @access Private only to authenticated users
 */


router.post("/", authMiddleware, addRating);
router.put("/:id", authMiddleware, updateRating);
router.get("/:storeId", getRatingsForStore);
router.get("/:storeId/average", getAverageRatingForStore);
router.get("/:storeId/users",authMiddleware,checkRole(["ADMIN","OWNER"]), getUsersWhoRatedStore);

export default router;
