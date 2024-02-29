import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Todo } from "../model/todo.model.js";
import { uploadOnCloudianry } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const accessTokenOptions = {
  maxAge: 24 * 60 * 60 * 1000, // 1 day validity
  httpOnly: false,
  secure: true,
  sameSite: "None",
  path: "/",
};
const refreshTokenOptions = {
  maxAge: 6 * 30 * 24 * 60 * 60 * 1000, //6 months validity
  httpOnly: false,
  secure: true,
  sameSite: "None",
  path: "/",
};

const homepage = (req, res) => {
  res.status(200).json("Hii");
};

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken)
      throw new apiError(400, "Error in rerfresh or access Token");

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

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req?.cookies?.refreshToken;

    if (!incomingRefreshToken) throw new apiError(401, "Invalid refresh Token");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) throw new apiError(401, "failed to decode refreshToken");

    const userid = decodedToken._id;
    const user = await User.findById(userid);

    if (!user) throw new apiError(400, "user not found with that refreshToken");

    console.log(user);

    if (incomingRefreshToken !== user.refreshToken)
      throw new apiError(400, "RefreshToken doesn't match with user");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    res
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(400, error?.message || "Invalid refreshToken");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;

  if ([fullName, email, password, username].some((field) => field === ""))
    return res.status(400).json(new apiError(400, "All fields are required!"));

  const existedUser = await User.findOne(
    {
      $or: [{ username }, { email }],
    },
    { new: true }
  );
  if (existedUser)
    return res.status(401).json(new apiError(400, "User already exist!"));

  const user = await User.create({
    fullName,
    email,
    username,
    password,
  });

  return res
    .set("X-Content-Type-Options", "nosniff")
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
    return res.status(401).json(new apiError(401, "Wrong username or email"));

  const checkPass = await user.isPasswordCorrect(password);
  if (!checkPass) throw new apiError(400, "password do not match");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  try {
    res
      .set("X-Content-Type-Options", "nosniff")
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions);
  } catch (error) {
    console.log(error.message);
  }

  return res
    .status(200)
    .json(new apiResponse(200, "Login successful", loggedinUser));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  return res.status(200).json(new apiResponse(200, "User found", user));
});

const addTodo = asyncHandler(async (req, res) => {
  const { todoName, todoDesc } = req.body;
  const ownerid = req.user._id;

  if ([todoName, todoDesc].some((field) => field === ""))
    throw new apiError(401, "All fields are required");

  const createdtodo = await Todo.create({ todoName, todoDesc, owner: ownerid });

  return res
    .status(200)
    .json(new apiResponse(200, "todo added successfully", createdtodo));
});

const alltodos = asyncHandler(async (req, res) => {
  const userid = req.user._id;

  const todos = await Todo.aggregate([
    {
      $match: {
        owner: userid,
      },
    },
  ]);

  return res
    .set("X-Content-Type-Options", "nosniff")
    .status(200)
    .json(new apiResponse(200, "todos are here", todos));
});

const editProfile = asyncHandler(async (req, res) => {
  let {
    updatedName,
    updatedEmail,
    updatedGender,
    updatedDate,
    updatedMonth,
    updatedYear,
  } = req.body;

  if (updatedEmail === "") updatedEmail = req.user.email;
  if (updatedName === "") updatedName = req.user.fullName;

  let avatarLocalPath = "";

  if (req?.file) avatarLocalPath = req?.file?.path;

  let prevImage = req.user.avatar;

  let avatarImage;

  if (avatarLocalPath !== "")
    avatarImage = await uploadOnCloudianry(avatarLocalPath);

  const userid = req.user?._id;

  const updatedInfo = await User.findByIdAndUpdate(
    userid,
    {
      $set: {
        fullName: updatedName,
        email: updatedEmail,
        avatar: avatarImage?.url || prevImage,
        gender: updatedGender,
        dateofBirth: updatedDate,
        monthofBirth: updatedMonth,
        yearofBirth: updatedYear,
      },
    },
    { new: true, upsert: true }
  );

  if (!updatedInfo)
    throw new apiError(401, "Something went wrong while updating information");

  return res
    .status(200)
    .json(new apiResponse(200, "User updated succeessfully", updatedInfo));
});

const deleteProfile = asyncHandler(async (req, res) => {
  const result = await User.deleteOne(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json(new apiResponse(200, "User deleted successfully", result));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json(new apiResponse(200, "User loggedout", {}));
});

const editTodo = asyncHandler(async (req, res) => {
  const { todoid, todoName, todoDesc } = req.body;

  await Todo.findById(todoid).updateOne({
    todoName,
    todoDesc,
  });

  return res.status(200).json(new apiResponse(200, "todo updated"));
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  addTodo,
  alltodos,
  editProfile,
  deleteProfile,
  logout,
  editTodo,
  refreshAccessToken,
  homepage,
};
