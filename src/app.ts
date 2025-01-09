import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import userRouter from './routes/userRoutes'
import { verifyAccessToken } from "./middlewares/verifyAccessToken";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();

connectDB();

app.use(cors({ origin: process.env.FRONT_END_ORIGIN }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRouter);
app.use("/api/user",verifyAccessToken, userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
