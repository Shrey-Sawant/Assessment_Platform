import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import db from "../db/index.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.authToken ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const [admin] = await db
      .promise()
      .query("SELECT * FROM Admins WHERE admin_id = ?", [decoded.id]);

    if (!admin || admin.length === 0) {
      return next(new ApiError(401, "Unauthorized: Admin not found"));
    }

    req.admin = admin[0];
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
});
