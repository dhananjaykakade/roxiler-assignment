import prisma from "../util/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../util/jwt.js";
import { customResponse } from "../util/responseHandler.js";
import { CustomError } from "../util/customError.js";
/**
 * @desc Register a new Normal User
 * @route POST /api/auth/signup
 */

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new CustomError("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default role USER
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: "USER"
      },
      select: { id: true, name: true, email: true, address: true, role: true }
    });

    return customResponse(res, "User registered successfully", newUser, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Login and get JWT token
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user 
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 401);
    }


    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

const { password: userPassword, ...userWithoutPassword } = user;

    return customResponse(res, "Login successful", { User:userWithoutPassword,token}, 200);
  } catch (err) {
    next(err);
  }
};
