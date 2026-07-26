// src/routes/todo.routes.ts
import { Router } from "express";
import { todoController } from "../controller/todo.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/add-todos", requireAuth, requireRole([Role.USER]), todoController.addTodo.bind(todoController));
router.get("/todos", requireAuth, requireRole([Role.USER]), todoController.getTodos.bind(todoController));
router.put("/todos/:id", requireAuth, requireRole([Role.USER]), todoController.editTodo.bind(todoController));
router.delete("/todos/:id", requireAuth, requireRole([Role.USER]), todoController.deleteTodo.bind(todoController));
router.patch("/todos/:id/complete", requireAuth, requireRole([Role.USER]), todoController.toggleTodo.bind(todoController));
router.patch("/todos/archive-completed", requireAuth, requireRole([Role.USER]), todoController.archiveCompleted.bind(todoController));
router.get("/todos/archived", requireAuth, requireRole([Role.USER]), todoController.getArchived.bind(todoController));
router.patch("/todos/:id/restore", requireAuth, requireRole([Role.USER]), todoController.restoreTodo.bind(todoController));

export default router;