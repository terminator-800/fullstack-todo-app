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

  async editTodo(req: Request, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params as { id: string };

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }

    try {
      // Check if todo exists and belongs to user
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (existingTodo.userId !== userId) {
        return res.status(403).json({ message: "You do not have permission to edit this todo" });
      }

      const { title, description, priority, dueDate, tags } = parsed.data;

      const updatedTodo = await prisma.todo.update({
        where: { id },
        data: {
          title,
          description: description || null,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags || [],
        },
      });

      return res.status(200).json({ todo: updatedTodo });
    } catch (error) {
      console.error("Edit todo error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params as { id: string };

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Check if todo exists and belongs to user
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (existingTodo.userId !== userId) {
        return res.status(403).json({ message: "You do not have permission to delete this todo" });
      }

      await prisma.todo.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      console.error("Delete todo error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }

  async toggleTodo(req: Request, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params as { id: string };
    const { completed } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must be a boolean" });
    }

    try {
      // Check if todo exists and belongs to user
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      if (existingTodo.userId !== userId) {
        return res.status(403).json({ message: "You do not have permission to update this todo" });
      }

      const updatedTodo = await prisma.todo.update({
        where: { id },
        data: { completed },
      });

      return res.status(200).json({ todo: updatedTodo });
    } catch (error) {
      console.error("Toggle todo error:", error);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  }
}

export const todoController = new TodoController();