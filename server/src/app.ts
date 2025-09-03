import express from "express";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import gifRouter from "./routes/gif.router";
import ratingRouter from "./routes/rating.router";
import commentRouter from "./routes/comment.router";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.use("/api/gifs", gifRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/comments", commentRouter);

export default app;
