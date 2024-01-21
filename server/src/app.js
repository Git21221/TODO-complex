import express from "express";
import 'dotenv/config'
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./route/user.route.js";

//making user router
app.use("/api/v1/users", userRouter);

//making admin router
// app.use("api/v1/admin", );

export { app };
