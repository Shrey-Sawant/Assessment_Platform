import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
  maxAge: process.env.JWT_EXPIRATION,
};

const dbQuery = async (query, params) => {
  try {
    const [results] = await db.promise().query(query, params);
    return results;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Database Error");
  }
};

const generateToken = (teacher) => {
  return jwt.sign(
    { id: teacher.teacher_id, email: teacher.Email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * @desc Register Teacher
 */
const register = asyncHandler(async (req, res, next) => {
  let { FName, MName, LName, Email, Phone, password } = req.body;

  if (!FName || !LName || !Email || !Phone || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  FName = FName.trim();
  MName = MName?.trim() || "";
  LName = LName.trim();
  Email = Email.trim();
  Phone = Phone.trim();
  password = password.trim();

  if (Phone.length < 10 || isNaN(Phone)) {
    return next(new ApiError(400, "Invalid phone number"));
  }

  const existingTeacher = await dbQuery(
    "SELECT * FROM Teachers WHERE Email = ?",
    [Email]
  );
  if (existingTeacher.length > 0) {
    return next(new ApiError(400, "Teacher already exists with this email"));
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO Teachers (FName, MName, LName, Email, Phone, Password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const result = await dbQuery(insertQuery, [
    FName,
    MName,
    LName,
    Email,
    Phone,
    hashPassword,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Teacher registration failed"));
  }

  const teacher = { id: result.insertId, FName, LName, Email, Phone };
  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "Teacher registered successfully"));
});

/**
 * @desc Login Teacher
 */
const login = asyncHandler(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  const teacher = await dbQuery("SELECT * FROM Teachers WHERE Email = ?", [
    Email,
  ]);

  if (teacher.length === 0) {
    return next(new ApiError(401, "Invalid credentials: Teacher not found"));
  }

  const isMatch = await bcrypt.compare(password, teacher[0].Password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials: Incorrect password"));
  }

  const token = generateToken(teacher[0]);
  res.cookie("authToken", token, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...teacher[0], token }, "Successfully logged in")
    );
});

/**
 * @desc Update Teacher details
 */
const update = asyncHandler(async (req, res, next) => {
  const { FName, MName, LName, Email, Phone, Password } = req.body;
  const teacher = req?.user;
  if (!teacher) {
    return next(new ApiError(400, "Teacher not authenticated"));
  }

  if (!FName || !LName || !Email || !Phone || !Password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(Email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  const existingTeacher = await dbQuery(
    "SELECT * FROM Teachers WHERE Email = ? AND teacher_id != ?",
    [Email, teacher.id]
  );
  if (existingTeacher.length > 0) {
    return next(new ApiError(400, "Email already in use"));
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const updateQuery = `
    UPDATE Teachers
    SET FName = ?, MName = ?, LName = ?, Email = ?, Phone = ?, Password = ?
    WHERE teacher_id = ?
  `;

  const result = await dbQuery(updateQuery, [
    FName,
    MName,
    LName,
    Email,
    Phone,
    hashedPassword,
    teacher.id,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(404, "Teacher not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Teacher updated successfully"));
});

/**
 * @desc Create a reviewed response entry
 * @route POST /api/reviewedResponses
 * @access Teacher
 */
const createReviewedResponse = asyncHandler(async (req, res) => {
  const { ResponseID, ReviewedByTeacher, Comments, FinalScore } = req.body;

  if (!ResponseID || !ReviewedByTeacher) {
    throw new ApiError(400, "ResponseID and ReviewedByTeacher are required.");
  }

  // Validate the response exists
  const [responseCheck] = await db.query(
    `SELECT * FROM StudentResponses WHERE ResponseID = ?`,
    [ResponseID]
  );

  if (responseCheck.length === 0) {
    throw new ApiError(404, "Student response not found.");
  }

  // Update main StudentResponses table to mark as reviewed
  await db.query(
    `UPDATE StudentResponses
     SET IsReviewed = TRUE, ReviewedByTeacher = ?, Score = ?
     WHERE ResponseID = ?`,
    [ReviewedByTeacher, FinalScore || responseCheck[0].Score, ResponseID]
  );

  res.status(201).json(
    new ApiResponse(
      201,
      {
        ReviewID: result.insertId,
        ResponseID,
        ReviewedByTeacher,
        Comments,
        FinalScore,
      },
      "Student response reviewed successfully."
    )
  );
});

/**
 * @desc Get all reviewed responses (optionally filtered by teacher or student)
 * @route GET /api/reviewedResponses
 * @access Admin/Teacher
 */
const getReviewedResponses = asyncHandler(async (req, res) => {
  const { teacher_id, student_id } = req.query;

  let query = `
    SELECT rr.*, sr.student_id, sr.GeneratedExamID, sr.Score AS OriginalScore
    FROM ReviewedResponses rr
    JOIN StudentResponses sr ON rr.ResponseID = sr.ResponseID
  `;
  const params = [];

  if (teacher_id || student_id) {
    query += " WHERE";
    if (teacher_id) {
      query += " rr.ReviewedByTeacher = ?";
      params.push(teacher_id);
    }
    if (student_id) {
      if (params.length) query += " AND";
      query += " sr.student_id = ?";
      params.push(student_id);
    }
  }

  const [rows] = await db.query(query, params);

  res
    .status(200)
    .json(
      new ApiResponse(200, rows, "Reviewed responses retrieved successfully.")
    );
});

export {
  register,
  login,
  update,
  createReviewedResponse,
  getReviewedResponses,
};
