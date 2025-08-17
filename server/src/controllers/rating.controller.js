import prisma from "../util/prisma.js";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";


/**
 * @desc add rating
 * @access private only to authenticated user
 * @body { storeId, value }
 * @requires { userId } from user
 * @description Add a rating for a store
 * @returns {Promise<Response>}
 */
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

/**
 * @desc update rating
 * @access Private only to authenticated user
 * @params { id } rating id
 * @body { value } rating value
 * @requires { userId } from user
 * @description Update a rating for a store
 * @returns {Promise<Response>}
 */
export const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new CustomError("Rating not found", 404);

    // i added simple checks for the valid users 
    if (rating.userId !== userId) throw new CustomError("Not authorized to update this rating", 403);

    const updated = await prisma.rating.update({ where: { id }, data: { value } });

    return customResponse(res, "Rating updated successfully", updated);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get rating from specific store
 * @access Private only to authenticated user
 * @params { id } store id
 * @description Get all ratings for a specific store
 * @returns {Promise<Response>}
 */
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


/**
 * @desc Get average rating for a specific store
 * @access Private only to authenticated user
 * @params { storeId } store id
 * @returns {Promise<Response>}
 */
export const getAverageRatingForStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
        throw new CustomError("invalid store id", 400);
    }

// using prisma aggregate we get the average rating for the store
    const averageRating = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { value: true }
    });

    return customResponse(res, "Average rating fetched successfully", averageRating);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all users who rated a specific store
 * @access Private only to store owner
 * @params { storeId } store id
 * @returns {Promise<Response>}
 */
export const getUsersWhoRatedStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new CustomError("Store not found", 404);


    // beloew we return the ratings for the specific store with user information like id name and email
    const ratings = await prisma.rating.findMany({
      where: { storeId },
      select: {
        value: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return customResponse(res, "Users who rated this store fetched successfully", ratings);
  } catch (err) {
    next(err);
  }
};
