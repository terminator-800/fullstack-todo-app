// src/routes/admin.routes.ts
import { Router } from "express";
import { adminController } from "../controller/admin.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/admin/create-admin",
  requireAuth,
  requireRole([Role.SUPERADMIN]),
  adminController.createAdmin.bind(adminController)
);

export default router;