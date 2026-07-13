// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export interface AuthPayload {
  id: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "You must be logged in to do this" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}