import prisma from "../util/prisma.js";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";

/**
 * @desc create a new store
 * @access Private only to authenticated user
 * @body { name, address } store details
 * @requires { userId } from user
 * @returns {Promise<Response>}
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
 * @desc get list all the stores
 * @access public any user
 * @query { search, order, page, limit }
 * @returns {Promise<Response>}
 */
export const listAllStores = async (req, res, next) => {
  try {
    const { search, order = "desc", page = 1, limit = 10 } = req.query; 
    const skip = Number(page - 1) * Number(limit);

    // i made a change here user can now search by store name and address should be capital or not does not matter
    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } }
        ]
      }
      : {};


      // i added pagination so that if huge amount of data is there it can be fetched in chunks
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

    // i added a calculation for average rating with mapping of required fields
    const averageRating = stores.map(store => {
      const updatedRatings = store.ratings.map(r => ({
        id: r.id,
        value: r.value,
        userId: r.userId,
        name: r.user.name
      }));

      // i added a calculation for total rating which return the sum of all ratings
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

/**
 * @desc get store by id 
 * @access Private only to authenticated user
 * @params { id } store id
 * @returns {Promise<Response>}
 */
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
/**
 * @desc get store by owner id
 * @access Private only to authenticated user
 * @requires { userId } from user
 * @returns {Promise<Response>}
 */
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
