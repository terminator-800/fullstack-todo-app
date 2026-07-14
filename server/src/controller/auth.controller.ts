// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { signupSchema, verifyEmailSchema, loginSchema } from "../schemas/auth.schemas";
import { fromError } from "zod-validation-error";
import { sendVerificationEmail } from "../service/mail.service";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

export class AuthController {
  private generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private issueAuthCookie(res: Response, userId: string, email: string, role: Role) {
    const token = jwt.sign(
      { id: userId, email, role },
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
        return res.status(409).json({ message: "This email is already verified. Try logging in instead." });
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

      this.issueAuthCookie(res, updatedUser.id, updatedUser.email, updatedUser.role);

      return res.status(200).json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role, // NEW: expose role to the frontend
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
        return res.status(409).json({ message: "This email is already verified. Try logging in instead." });
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

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
 
    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }
 
    const { email, password } = parsed.data;
 
    try {
      const user = await prisma.user.findUnique({ where: { email } });
 
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
 
      const passwordMatches = await bcrypt.compare(password, user.password);
 
      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
 
      if (!user.isVerified) {
        return res.status(403).json({
          message: "Please verify your email before logging in",
          email: user.email,
        });
      }
 
      this.issueAuthCookie(res, user.id, user.email, user.role);
 
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async me(req: Request, res: Response) {
    const token = req.cookies?.token;
 
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
 
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
 
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
 
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
 
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        },
      });
    } catch (error) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Clear the JWT token cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
  
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const authController = new AuthController();