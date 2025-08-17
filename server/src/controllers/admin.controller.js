import prisma from "../util/prisma.js";
import bcrypt from "bcrypt";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";


/**
 * @desc Get all users
 * @access Private only to admin
 * @query { search, order, role, page, limit }
 * @description Get all users with pagination and filtering
 * @returns {Promise<Response>}
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, order = "desc", role, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(role ? { role } : {})
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: order.toLowerCase() === "asc" ? "asc" : "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
           stores: {
            select: {
              id: true,
              name: true,
              address: true,
              ratings: {
                select: {
                  value: true
                }
              }
            }
          }
        },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where })
    ]);

const usersWithRatings = users.map(user => {
  let averageRating = null;

  if (user.role === "OWNER" && user.stores.length > 0) {
    const store = user.stores[0];
    if (store.ratings.length > 0) {
      const total = store.ratings.map(r => r.value).reduce((sum, value) => sum + value, 0);
      averageRating = total / store.ratings.length;
    }
    
  }

  return {
    ...user,
    averageRating,
  }
});

    return customResponse(res, "Users fetched successfully", {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      users: usersWithRatings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get User by ID
 * @access Private only to admin
 * @params { id }
 * @returns {Promise<Response>}
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: { include: { ratings: true } } 
      }
    });

    if (!user) throw new CustomError("User not found", 404);

    if (user.role === "OWNER" && user.stores.length === 1) {
      const store = user.stores[0];
      if (store.ratings.length > 0) {
        const total = store.ratings.reduce((sum, r) => sum + r.value, 0);
        user.averageRating = total / store.ratings.length;
      } else {
        user.averageRating = null;
      }
    }

    return customResponse(res, "User details fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc create a new user from admin panel
 * @access Private only to admin
 * @body { name, email, password, address, role }
 * @returns {Promise<Response>}
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new CustomError("Email already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role }
    });

    return customResponse(res, "User created successfully", user, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all stores with ratings
 * @access Private only to admin
 * @returns {Promise<Response>}
 */
export const getAllStoresWithRating = async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: true
      }
    });

    const storesWithRating = stores.map(store => {
      const total = store.ratings.reduce((sum, r) => sum + r.value, 0);
      const average = store.ratings.length > 0 ? total / store.ratings.length : null;
      return { ...store, averageRating: average };
    });

    return customResponse(res, "Stores fetched successfully", storesWithRating);
  } catch (err) {
    next(err);
  }
};


/**
 * @desc Get dashboard statistics
 * @access Private only to admin
 * @returns {Promise<Response>}
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);

    return customResponse(res, "Dashboard statistics fetched successfully", {
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount
    });
  } catch (err) {
    next(err);
  }
};