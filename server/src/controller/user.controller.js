import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Todo } from "../model/todo.model.js";

const options = {
  maxAge: 3000 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
};

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      400,
      "Internal error while generating access and refresh token!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;

  if ([fullName, email, password, username].some((field) => field === ""))
    throw new apiError(401, "All fields are required!");

  const existedUser = await User.findOne(
    {
      $or: [{ username }, { email }],
    },
    { new: true }
  );
  if (existedUser)
    throw new apiError(
      400,
      "User already exist with that email id or username!"
    );

  const user = await User.create({ fullName, email, username, password });

  console.log(user);

  return res
    .status(200)
    .json(new apiResponse(200, "User created successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field.trim() === ""))
    throw new apiError(401, "All fields are required!");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    throw new apiError(401, "Didn't find user with that username or email");

  const checkPass = await user.isPasswordCorrect(password);
  if (!checkPass) throw new apiError(400, "password do not match");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

  try {
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
  } catch (error) {
    console.log(error.message);
  }
  console.log(loggedinUser);

  return res
    .status(200)
    .json(new apiResponse(200, "Loggedin successfully", loggedinUser));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  return res.status(200).json(new apiResponse(200, "User found", user));
});

const addTodo = asyncHandler(async (req, res) => {
  const { todoName, todoDesc } = req.body;

  if ([todoName, todoDesc].some((field) => field === ""))
    throw new apiError(401, "All fields are required");

  const createdtodo = await Todo.create({ todoName, todoDesc });

  if (!createdtodo)
    throw new apiError(401, "Something went wrong while creating todo");

  await createdtodo.save();

  const userid = req.user.id;

  const user = await User.findById(userid);

  user.todos.push(createdtodo);
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, "todo added successfully", user));
});

const alltodos = asyncHandler(async (req, res) => {
  const userid = req.user.id;

  const user = await User.findById(userid);

  if (!user) throw new apiError(401, "user not found");

  const todos = user.todos;

  return res.status(200).json(new apiResponse(200, "todos are here", todos));
});

export { registerUser, loginUser, getCurrentUser, addTodo, alltodos };
