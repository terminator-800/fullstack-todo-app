import { Router } from "express";
import { todoController } from "../controller/todo.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/add-todos", requireAuth, requireRole([Role.USER, Role.ADMIN, Role.SUPERADMIN]), todoController.addTodo.bind(todoController));

export default router;