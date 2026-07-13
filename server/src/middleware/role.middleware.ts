// src/middleware/role.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

// Wraps requireAuth's output — assumes req.user is already populated by
// requireAuth running first in the middleware chain. Checks that the
// authenticated user's role is one of the allowed roles for this route.
export function requireRole(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "You must be logged in to do this" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this" });
    }

    next();
  };
}