import express, { NextFunction, Request, Response } from "express";
import passesRoutes from "./routes/passes.routes";
import usersRoutes from "./routes/users.routes";
import { errorMiddleware } from "./infrastructure/errorMiddleware";

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", passesRoutes);
app.use("/api", usersRoutes);

app.use(errorMiddleware);

export default app;