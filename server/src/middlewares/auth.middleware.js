import { refreshAccessToken } from "../controller/user.controller.js";
import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {

  try {
    let token;
    if (req?.cookies?.accessToken) {
      token = req?.cookies?.accessToken;
    } else if (req?.cookies?.refreshToken) {
      token = req?.cookies?.refreshToken;
      const { accessToken, refreshToken } = await refreshAccessToken(req, res);
      token = accessToken;
    }

    if (!token) return res.status(400).json(new apiError(400, "Invalid authorization request!"));

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decodedToken);

    const userid = decodedToken._id;

    const user = await User.findById(userid).select("-password -refreshToken");

    if (!user) return res.status(400).json(new apiError(401, "Invalid access token"));

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json(new apiError(400, "Problem in verify"));
  }
});

export { verifyJWT };
