// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { signupSchema, verifyEmailSchema } from "../schemas/auth.schemas";
import { fromError } from "zod-validation-error";
import { sendVerificationEmail } from "../service/mail.service";

const SALT_ROUNDS = 10;

export class AuthController {
  private generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private issueAuthCookie(res: Response, userId: string, email: string) {
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

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
      const verificationCode = this.generateVerificationCode();

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verificationCode,
        },
      });

      await sendVerificationEmail(user.email, user.name, verificationCode);

      return res.status(201).json({
        message: "Account created. Check your email for a verification code.",
        email: user.email,
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const parsed = verifyEmailSchema.safeParse(req.body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }

    const { email, code } = parsed.data;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "No account found with this email" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "This account is already verified" });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          verificationCode: null,
        },
      });

      this.issueAuthCookie(res, updatedUser.id, updatedUser.email);

      return res.status(200).json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error("Verify email error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async resendCode(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "No account found with this email" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "This account is already verified" });
      }

      const verificationCode = this.generateVerificationCode();

      await prisma.user.update({
        where: { email },
        data: { verificationCode },
      });

      await sendVerificationEmail(user.email, user.name, verificationCode);

      return res.status(200).json({ message: "Verification code resent" });
    } catch (error) {
      console.error("Resend code error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const authController = new AuthController();