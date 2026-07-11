// src/routes/auth.routes.ts
import { Router } from "express";
import { authController } from "../controller/auth.controller";

const router = Router();

router.post("/signup", authController.signup.bind(authController));
router.post("/verify-email", authController.verifyEmail.bind(authController));
router.post("/resend-code", authController.resendCode.bind(authController));

export default router;