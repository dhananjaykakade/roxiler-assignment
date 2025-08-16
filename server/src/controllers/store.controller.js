import prisma from "../util/prisma.js";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";

/**
 * Create a new store
 * @param {*} req - Request object containing name, address, and ownerId
 * @param {*} res - Response object
 */
export const createStore = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const { id } = req.user;

    const owner = await prisma.user.findUnique({ where: { id } });
    if (!owner || owner.role !== "OWNER") {
      throw new CustomError("Invalid ownerId", 400);
    }

    const store = await prisma.store.create({
      data: { name, address, ownerId: id }
    });

    return customResponse(res, "Store created successfully", store, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing store
 * @param {*} req - Request object containing storeId, name, and address
 * @param {*} res - Response object
 */
export const updateStore = async (req, res, next) => {
  try {
    // incoming data should be optional
    const { storeId, name, address } = req.body;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new CustomError("Store not found", 404);
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { name, address }
    });

    return customResponse(res, "Store updated successfully", updatedStore, 200);
  } catch (err) {
    next(err);
  }
};

export const listAllStores = async (req, res, next) => {
  try {
    const { search, order = "desc", page = 1, limit = 10 } = req.query; // default desc
    const skip = Number(page - 1) * Number(limit);


    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } }
        ]
      }
      : {};

    const stores = await prisma.store.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { id: true, value: true, userId: true, user: { select: { name: true } } } },
      },
      orderBy: { createdAt: order.toLowerCase() === "asc" ? "asc" : "desc" }
    });

    const averageRating = stores.map(store => {
      const updatedRatings = store.ratings.map(r => ({
        id: r.id,
        value: r.value,
        userId: r.userId,
        name: r.user.name
      }));

      const total = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner: store.owner,
        averageRating: total / store.ratings.length || 0,
        rating: updatedRatings
      };
    });

    return customResponse(res, "Stores fetched successfully", { stores: averageRating });
  } catch (err) {
    next(err);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new CustomError("Store not found", 404);
    }
    return customResponse(res, "Store retrieved successfully", store, 200);
  } catch (err) {
    next(err);
  }
};
export const getStoreByOwnerId = async (req, res, next) => {
  try {
    const { id } = req.user;
    const store = await prisma.store.findFirst({
      where: { ownerId: id },
      include: { ratings: { include: { user: true } } },
    })
    if (!store) {
      throw new CustomError("Store not found", 404);
    }
    return customResponse(res, "Store retrieved successfully", store, 200);
  } catch (err) {
    next(err);
  }
};
