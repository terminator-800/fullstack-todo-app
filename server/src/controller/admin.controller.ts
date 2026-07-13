// src/controllers/admin.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/db";
import { createAdminSchema } from "../schemas/admin.schemas";
import { fromError } from "zod-validation-error";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

export class AdminController {
  async createAdmin(req: Request, res: Response) {
    const parsed = createAdminSchema.safeParse(req.body);

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

      const admin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN,
          isVerified: true,
        },
      });

      return res.status(201).json({
        message: "Admin account created",
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Create admin error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const adminController = new AdminController();