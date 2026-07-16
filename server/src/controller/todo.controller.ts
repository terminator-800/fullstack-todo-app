// src/controllers/todo.controller.ts
import type { Request, Response } from "express";
import prisma from "../config/db";
import { createTodoSchema } from "../schemas/todo.schemas";
import { fromError } from "zod-validation-error";

export class TodoController {
    
  async addTodo(req: Request, res: Response) {
  
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }

    const { title, description, priority, dueDate, tags } = parsed.data;

    try {
      const todo = await prisma.todo.create({
        data: {
          title,
          description: description || null,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags || [],
          userId,
        },
      });

      return res.status(201).json({ todo });
    } catch (error) {
      console.error("Add todo error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async getTodos(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const todos = await prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ todos });
    } catch (error) {
      console.error("Get todos error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const todoController = new TodoController();