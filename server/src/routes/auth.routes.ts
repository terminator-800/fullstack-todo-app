// src/routes/auth.routes.ts
import { Router } from "express";
import { authController } from "../controller/auth.controller";

const router = Router();

router.post("/signup", authController.signup.bind(authController));

export default router;