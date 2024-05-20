import { Router } from "express";
import {
  addTodo,
  alltodos,
  deleteProfile,
  deleteTodo,
  editProfile,
  editTodo,
  forgetPassword,
  getCurrentUser,
  homepage,
  loginUser,
  logout,
  registerUser,
  // sendEmail,
  // validateEmail,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(homepage);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getCurrentuser").get(verifyJWT, getCurrentUser);
router.route("/addTodo").post(verifyJWT, addTodo);
router.route("/alltodos").get(verifyJWT, alltodos);
router
  .route("/editProfile")
  .post(upload.single("avatar"), verifyJWT, editProfile);
router.route("/deleteProfile").get(verifyJWT, deleteProfile);
router.route("/logout").get(verifyJWT, logout);
router.route("/editTodo").post(verifyJWT, editTodo);
router.route("/deleteTodo").post(verifyJWT, deleteTodo);
// router.route("/validateEmail").post(validateEmail);
// router.route("/sendEmail").get(sendEmail);
router.route("/forgetPassword").post(forgetPassword);

export default router;