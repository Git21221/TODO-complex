import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Todo } from "../model/todo.model.js";
import { uploadOnCloudianry } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

// const resend = new Resend("re_7RwEjxwT_4wBGHAWmL1AidZMehFUVS2rb");

const accessTokenOptions = {
  maxAge: 20 * 1000, // 1 day validity
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

const generateEmailVerificationToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (!user) throw new apiError(400, "User not found");
    const token = await user.generateEmailVerificationToken();
    if (!token)
      throw new apiError(400, "Error in generating email verification token");
    return token;
  } catch (error) {
    throw new apiError(401, "Error in generating email verification token");
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
    isEmailVerified: false,
    emailVerificationToken: "",
  });

  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: await generateEmailVerificationToken(user._id),
  });

  return res
    .set("X-Content-Type-Options", "nosniff")
    .status(200)
    .json(new apiResponse(200, "User created successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === ""))
    return res.staus(400).json(new apiError(401, "All fields are required!"));

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    return res.status(401).json(new apiError(401, "Wrong username or email"));

  // if (user.isEmailVerified === false)
  //   return res
  //     .status(401)
  //     .json(new apiError(401, "Please verify your email first!"));

  // const checkPass = await user.isPasswordCorrect(password);
  // if (!checkPass) res.status(400).json(new apiError(400, "Wrong password"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new apiResponse(200, "Login successful", loggedinUser));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  if (!user) return res.status(400).json(new apiError(400, "Please login!"));

  return res
    .status(200)
    .json(new apiResponse(200, `Welcome back ${req.user.fullName}`, user));
});

const addTodo = asyncHandler(async (req, res) => {
  const { todoName, todoDesc } = req.body;
  const ownerid = req.user._id;

  if ([todoName, todoDesc].some((field) => field === ""))
    return res.status(400).json(new apiError(401, "All fields are required"));

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
    return res.status(401).json(new apiError(401, "Something went wrong!"));

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

  if (todoName == "" && todoDesc == "") {
    await Todo.findByIdAndDelete(todoid);
    return res.status(200).json(new apiResponse(200, "Empty todo deleted"));
  }

  const todo = await Todo.findById(todoid)?.updateOne({
    todoName,
    todoDesc,
  });

  if (!todo)
    return res.status(400).json(new apiError(400, "Couldn't find todo!"));

  return res
    .status(200)
    .json(new apiResponse(200, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todoid } = req.body;
  await Todo.findByIdAndDelete(todoid);
  return res
    .status(200)
    .json(new apiResponse(200, "Todo deleted successfully"));
});

// const sendEmail = asyncHandler(async (req, res) => {
//   const { data, error } = await resend.emails.send({
//     from: "Saikat <saikat@resend.dev>",
//     to: ["saikatdas40g@gmail.com"],
//     subject: "Verify your email",
//     html: "<button onClick={handleverifyEmailClick}>Verify Email</button>",
//   });
//   console.log(data, error);
//   if (error)
//     return res.status(400).json(new apiError(400, "Error in sending email"));
//   return res
//     .status(200)
//     .json(new apiResponse(200, "Email sent successfully", data));
// });

// const validateEmail = asyncHandler(async (req, res) => {
//   const { token } = req.query;
//   console.log(token);
//   if (!token) return res.status(400).json(new apiError(400, "Invalid token"));

//   const decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
//   if (!decodedToken)
//     return res.status(400).json(new apiError(400, "Could not parse token"));
//   console.log(decodedToken);
//   const userid = decodedToken._id;
//   if (!userid)
//     return res.status(400).json(new apiError(400, "Invalid user id"));

//   const user = await User.findById(userid);
//   console.log(user);
//   if (!user) return res.status(400).json(new apiError(400, "User not found!"));

//   const emailToken = user.emailVerificationToken;
//   console.log(emailToken);
//   if (token === emailToken) {
//     const emailVerificationUpdate = await User.findByIdAndUpdate(userid, {
//       isEmailVerified: true,
//       emailVerificationToken: "",
//     });
//     if (!emailVerificationUpdate)
//       return res
//         .status(400)
//         .json(new apiError(400, "Error in updating email verification"));
//     return res
//       .status(200)
//       .json(new apiResponse(200, "Email verified successfully"));
//   }
//   return res.status(401).json(new apiError(401, "Invalid token"));
// });

const forgetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  console.log(email, newPassword, confirmNewPassword);

  if ([email, newPassword, confirmNewPassword].some((field) => field === ""))
    return res.status(400).json(new apiError(400, "All fields are required!"));

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json(new apiError(400, "User not found!"));

  if (newPassword !== confirmNewPassword)
    return res.status(400).json(new apiError(400, "Password doesn't match!"));

  const checkPass = await user.isPasswordCorrect(newPassword);
  if (checkPass)
    return res
      .status(400)
      .json(new apiError(400, "New password is same as old password!"));
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new apiResponse(200, "Password updated successfully"));
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
  deleteTodo,
  // validateEmail,
  // sendEmail,
  forgetPassword,
};
