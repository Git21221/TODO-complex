import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
