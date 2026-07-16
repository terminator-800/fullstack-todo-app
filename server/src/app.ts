import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import todoRoutes from "./routes/todo.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("🚀 API is running!");
});

app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/", todoRoutes);

export default app;