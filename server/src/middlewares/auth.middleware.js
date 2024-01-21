import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) throw new apiError(401, "Invalid authorization request!");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userid = decodedToken._id;

    const user = await User.findById(userid).select("-password -refreshToken");

    if (!user) throw new apiError(401, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(400, error?.message || "Invalid Access Token");
  }
});

export { verifyJWT };
