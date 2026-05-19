import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passesRoutes from "./routes/passes.routes";
import usersRoutes from "./routes/users.routes";
import { errorMiddleware } from "./infrastructure/errorMiddleware";

const app = express();
app.get("/__version", (req, res) => {
  res.json({ version: "api-v1-test" });
});

console.log("APP FILE WITH API V1 LOADED");

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/v1", passesRoutes);
app.use("/api/v1", usersRoutes);

app.use(errorMiddleware);

export default app;