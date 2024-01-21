import { Router } from "express";
import {
  addTodo,
  alltodos,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getCurrentuser").get(verifyJWT, getCurrentUser);
router.route("/addTodo").post(verifyJWT, addTodo);
router.route("/alltodos").get(verifyJWT, alltodos);

export default router;
