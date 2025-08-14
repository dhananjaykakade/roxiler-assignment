import prisma from "../util/prisma.js";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";
import { th } from "zod/v4/locales";

export const addRating = async (req, res, next) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

    if(value < 1 || value > 5) {
        throw new CustomError("Invalid rating value", 400);
    }
    // Check store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new CustomError("Store not found", 404);

    // Check if user already rated this store
    const existing = await prisma.rating.findFirst({ where: { storeId, userId } });
    if (existing) throw new CustomError("You have already rated this store", 400);

    const rating = await prisma.rating.create({
      data: { storeId, userId, value }
    });

    return customResponse(res, "Rating added successfully", rating, 201);
  } catch (err) {
    next(err);
  }
};

// Update rating
export const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new CustomError("Rating not found", 404);
    if (rating.userId !== userId) throw new CustomError("Not authorized to update this rating", 403);

    const updated = await prisma.rating.update({ where: { id }, data: { value } });

    return customResponse(res, "Rating updated successfully", updated);
  } catch (err) {
    next(err);
  }
};

// Delete rating
export const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new CustomError("Rating not found", 404);

    if (rating.userId !== userId && userRole !== "ADMIN") {
      throw new CustomError("Not authorized to delete this rating", 403);
    }

    await prisma.rating.delete({ where: { id } });

    return customResponse(res, "Rating deleted successfully");
  } catch (err) {
    next(err);
  }
};

// Get all ratings for a store
export const getRatingsForStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });

    return customResponse(res, "Ratings fetched successfully", ratings);
  } catch (err) {
    next(err);
  }
};

export const getAverageRatingForStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
        throw new CustomError("invalid store id", 400);
    }
    

    const averageRating = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { value: true }
    });

    return customResponse(res, "Average rating fetched successfully", averageRating);
  } catch (err) {
    next(err);
  }
};