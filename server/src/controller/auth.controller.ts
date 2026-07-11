// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { signupSchema } from "../schemas/auth.schemas";
import { fromError } from "zod-validation-error";

const SALT_ROUNDS = 10;

export class AuthController {
  async signup(req: Request, res: Response) {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }

    const { name, email, password } = parsed.data;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const authController = new AuthController();