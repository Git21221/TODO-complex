import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./route/user.route.js";

app.get('/', (req, res) => {
  return res.json({"Hii": 'from saikat'});
})

//making user router
app.use("/api/v1/users", userRouter);

//making admin router
// app.use("api/v1/admin", );

export { app };
