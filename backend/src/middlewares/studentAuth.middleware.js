import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyStudentToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.authToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Authentication token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
