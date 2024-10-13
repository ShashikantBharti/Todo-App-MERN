import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/users", authRoutes);

export default app;
