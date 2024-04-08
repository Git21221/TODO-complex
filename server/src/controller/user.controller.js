import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Todo } from "../model/todo.model.js";
import { uploadOnCloudianry } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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
    return res.staus(400).json(new apiError(401, "All fields are required!"));

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    return res.status(401).json(new apiError(401, "Wrong username or email"));

  const checkPass = await user.isPasswordCorrect(password);
  if (!checkPass)
    res.status(400).json(new apiError(400, "Wrong password"));

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

  if(todoName == "" && todoDesc == ""){
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

const getAllJobs = asyncHandler(async (req, res) => {
  const data = {
    "job_updates": [
      {
        "job_title": "Software Engineer",
        "company": "Tech Innovations Inc.",
        "location": "San Francisco, CA",
        "posted_date": "2024-04-08",
        "description": "We are seeking a talented software engineer to join our team. The ideal candidate will have experience in building scalable web applications using modern technologies such as React and Node.js. Please see our website for more details and to apply.",
        "requirements": [
          "Bachelor's degree in Computer Science or related field",
          "2+ years of experience in software development",
          "Proficiency in JavaScript, HTML, and CSS",
          "Experience with RESTful APIs"
        ],
        "salary": "$90,000 - $120,000 per year",
        "apply_link": "https://example.com/careers/software-engineer"
      },
      {
        "job_title": "Marketing Manager",
        "company": "Global Marketing Solutions",
        "location": "New York, NY",
        "posted_date": "2024-04-07",
        "description": "We are looking for a creative and strategic Marketing Manager to lead our marketing efforts. The ideal candidate will have experience in digital marketing, content creation, and campaign management. If you're passionate about marketing and ready to take on a leadership role, apply now!",
        "requirements": [
          "Bachelor's degree in Marketing or related field",
          "5+ years of experience in marketing",
          "Strong understanding of digital marketing channels",
          "Excellent communication and leadership skills"
        ],
        "salary": "$80,000 - $100,000 per year",
        "apply_link": "https://example.com/careers/marketing-manager"
      },
      {
        "job_title": "Data Scientist",
        "company": "Analytics Pro",
        "location": "Chicago, IL",
        "posted_date": "2024-04-06",
        "description": "We are seeking a skilled Data Scientist to join our analytics team. The ideal candidate will have experience in machine learning, statistical analysis, and data visualization. If you're passionate about leveraging data to drive insights and decision-making, apply now!",
        "requirements": [
          "Master's degree or PhD in Statistics, Mathematics, Computer Science, or related field",
          "3+ years of experience in data science or analytics",
          "Proficiency in Python, R, or similar programming languages",
          "Experience with machine learning libraries such as TensorFlow or scikit-learn"
        ],
        "salary": "$100,000 - $130,000 per year",
        "apply_link": "https://example.com/careers/data-scientist"
      },
      {
        "job_title": "Graphic Designer",
        "company": "Creative Designs Agency",
        "location": "Los Angeles, CA",
        "posted_date": "2024-04-05",
        "description": "We are seeking a talented Graphic Designer to join our creative team. The ideal candidate will have a strong portfolio demonstrating proficiency in Adobe Creative Suite and a keen eye for design aesthetics. Apply now to be a part of our exciting projects!",
        "requirements": [
          "Bachelor's degree in Graphic Design or related field",
          "2+ years of experience in graphic design",
          "Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
          "Strong conceptual and visual communication skills"
        ],
        "salary": "$50,000 - $70,000 per year",
        "apply_link": "https://example.com/careers/graphic-designer"
      },
      {
        "job_title": "Financial Analyst",
        "company": "Investment Partners LLC",
        "location": "Boston, MA",
        "posted_date": "2024-04-04",
        "description": "We are looking for a detail-oriented Financial Analyst to join our finance team. The ideal candidate will have experience in financial modeling, forecasting, and reporting. If you have strong analytical skills and a passion for finance, apply now!",
        "requirements": [
          "Bachelor's degree in Finance, Accounting, Economics, or related field",
          "2+ years of experience in financial analysis or accounting",
          "Proficiency in Microsoft Excel and financial modeling techniques",
          "Excellent analytical and problem-solving skills"
        ],
        "salary": "$60,000 - $80,000 per year",
        "apply_link": "https://example.com/careers/financial-analyst"
      },
      {
        "job_title": "UX/UI Designer",
        "company": "Digital Innovations Ltd.",
        "location": "Seattle, WA",
        "posted_date": "2024-04-03",
        "description": "We are seeking a talented UX/UI Designer to join our design team. The ideal candidate will have experience in user research, wireframing, and prototyping. If you have a passion for creating intuitive and engaging user experiences, apply now!",
        "requirements": [
          "Bachelor's degree in Design, Human-Computer Interaction, or related field",
          "2+ years of experience in UX/UI design",
          "Proficiency in design tools such as Sketch, Figma, or Adobe XD",
          "Strong understanding of user-centered design principles"
        ],
        "salary": "$70,000 - $90,000 per year",
        "apply_link": "https://example.com/careers/ux-ui-designer"
      },
      {
        "job_title": "Sales Manager",
        "company": "SalesForce Solutions Inc.",
        "location": "Atlanta, GA",
        "posted_date": "2024-04-02",
        "description": "We are looking for an experienced Sales Manager to lead our sales team. The ideal candidate will have a proven track record in sales leadership, client relationship management, and achieving revenue targets. Apply now to drive our sales strategy!",
        "requirements": [
          "Bachelor's degree in Business Administration, Marketing, or related field",
          "5+ years of experience in sales management",
          "Demonstrated success in exceeding sales targets",
          "Excellent communication and negotiation skills"
        ],
        "salary": "$90,000 - $120,000 per year",
        "apply_link": "https://example.com/careers/sales-manager"
      },
      {
        "job_title": "Human Resources Specialist",
        "company": "PeopleFirst HR Solutions",
        "location": "Houston, TX",
        "posted_date": "2024-04-01",
        "description": "We are seeking a dedicated Human Resources Specialist to support our HR department. The ideal candidate will have experience in recruitment, employee relations, and HR policies. If you're passionate about fostering a positive work environment, apply now!",
        "requirements": [
          "Bachelor's degree in Human Resources Management, Business Administration, or related field",
          "2+ years of experience in human resources",
          "Knowledge of employment laws and regulations",
          "Strong interpersonal and communication skills"
        ],
        "salary": "$50,000 - $65,000 per year",
        "apply_link": "https://example.com/careers/hr-specialist"
      },
      {
        "job_title": "Product Manager",
        "company": "InnovateTech Solutions",
        "location": "Austin, TX",
        "posted_date": "2024-03-31",
        "description": "We are looking for a strategic and results-driven Product Manager to lead our product development efforts. The ideal candidate will have experience in product lifecycle management, market research, and cross-functional collaboration. Apply now to drive innovation!",
        "requirements": [
          "Bachelor's degree in Business, Engineering, or related field",
          "3+ years of experience in product management or related roles",
          "Strong project management skills",
          "Ability to prioritize and manage multiple tasks"
        ],
        "salary": "$80,000 - $110,000 per year",
        "apply_link": "https://example.com/careers/product-manager"
      }
    ]
  }
  return res.status(200).json(new apiResponse(200, "Jobs are here", data));  
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
  getAllJobs,
};
