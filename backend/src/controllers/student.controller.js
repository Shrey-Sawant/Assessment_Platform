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

const generateToken = (student) => {
  return jwt.sign(
    { id: student.Uid, email: student.Email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

/**
 * @desc Register Student
 */
const register = asyncHandler(async (req, res, next) => {
  let { FName, MName, LName, Email, Phone, DOB, Age, password } = req.body;

  if (!FName || !LName || !Email || !Phone || !DOB || !Age || !password) {
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

  const existingStudent = await dbQuery(
    "SELECT * FROM Students WHERE Email = ?",
    [Email]
  );
  if (existingStudent.length > 0) {
    return next(new ApiError(400, "Student already exists with this email"));
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO Students (FName, MName, LName, Email, Phone, DOB, Age, Password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await dbQuery(insertQuery, [
    FName,
    MName,
    LName,
    Email,
    Phone,
    DOB,
    Age,
    hashPassword,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Student registration failed"));
  }

  const student = { id: result.insertId, FName, LName, Email, Phone, DOB, Age };
  return res
    .status(200)
    .json(new ApiResponse(200, student, "Student registered successfully"));
});

/**
 * @desc Login Student
 */
const login = asyncHandler(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  const student = await dbQuery("SELECT * FROM Students WHERE Email = ?", [
    Email,
  ]);

  if (student.length === 0) {
    return next(new ApiError(401, "Invalid credentials: Student not found"));
  }

  const isMatch = await bcrypt.compare(password, student[0].Password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials: Incorrect password"));
  }

  const token = generateToken(student[0]);
  res.cookie("authToken", token, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...student[0], token }, "Successfully logged in")
    );
});

/**
 * @desc Update Student details
 */
const update = asyncHandler(async (req, res, next) => {
  const { FName, MName, LName, Email, Phone, DOB, Age, Password } = req.body;
  const student = req?.user;

  if (!student) {
    return next(new ApiError(400, "Student not authenticated"));
  }

  if (!FName || !LName || !Email || !Phone || !DOB || !Age || !Password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(Email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  const existingStudent = await dbQuery(
    "SELECT * FROM Students WHERE Email = ? AND Uid != ?",
    [Email, student.id]
  );
  if (existingStudent.length > 0) {
    return next(new ApiError(400, "Email already in use"));
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const updateQuery = `
    UPDATE Students
    SET FName = ?, MName = ?, LName = ?, Email = ?, Phone = ?, DOB = ?, Age = ?, Password = ?
    WHERE Uid = ?
  `;

  const result = await dbQuery(updateQuery, [
    FName,
    MName,
    LName,
    Email,
    Phone,
    DOB,
    Age,
    hashedPassword,
    student.id,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(404, "Student not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Student updated successfully"));
});

/**
 * @desc Submit a student's exam response
 * @route POST /api/student-responses
 * @access Student
 */
const createStudentResponse = asyncHandler(async (req, res, next) => {
  let { GeneratedExamID, student_id, Responses, Score } = req.body;

  if (!GeneratedExamID || !student_id || !Responses) {
    return next(
      new ApiError(
        400,
        "GeneratedExamID, student_id, and Responses are required"
      )
    );
  }

  // Validate that exam and student exist
  const [exam] = await dbQuery(
    "SELECT GeneratedExamID FROM GeneratedExams WHERE GeneratedExamID = ?",
    [GeneratedExamID]
  );
  if (!exam) return next(new ApiError(404, "Generated Exam not found"));

  const [student] = await dbQuery("SELECT Uid FROM Students WHERE Uid = ?", [
    student_id,
  ]);
  if (!student) return next(new ApiError(404, "Student not found"));

  // Convert object to JSON string if necessary
  const stringifiedResponses =
    typeof Responses === "object"
      ? JSON.stringify(Responses)
      : Responses.trim();

  // Insert new response
  const insertQuery = `
    INSERT INTO StudentResponses (GeneratedExamID, student_id, Responses, Score)
    VALUES (?, ?, ?, ?)
  `;
  const result = await dbQuery(insertQuery, [
    GeneratedExamID,
    student_id,
    stringifiedResponses,
    Score ?? null,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to save student response"));
  }

  const createdResponse = {
    ResponseID: result.insertId,
    GeneratedExamID,
    student_id,
    Responses,
    Score: Score ?? null,
  };

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdResponse, "Response submitted successfully")
    );
});

/**
 * @desc Get student responses
 * @route GET /api/student-responses or /api/student-responses/:id
 * @access Teacher/Admin/Student
 */
const getStudentResponses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { student_id, exam_id } = req.query;

  let query = `
    SELECT sr.*, s.FName AS StudentFName, s.LName AS StudentLName,
           g.Title AS ExamTitle, t.FName AS ReviewedByFName, t.LName AS ReviewedByLName
    FROM StudentResponses sr
    LEFT JOIN Students s ON sr.student_id = s.Uid
    LEFT JOIN GeneratedExams g ON sr.GeneratedExamID = g.GeneratedExamID
    LEFT JOIN Teachers t ON sr.ReviewedByTeacher = t.teacher_id
  `;
  const params = [];

  if (id) {
    query += " WHERE sr.ResponseID = ?";
    params.push(id);
  } else if (student_id) {
    query += " WHERE sr.student_id = ?";
    params.push(student_id);
  } else if (exam_id) {
    query += " WHERE sr.GeneratedExamID = ?";
    params.push(exam_id);
  }

  query += " ORDER BY sr.SubmittedAt DESC";

  const responses = await dbQuery(query, params);

  if (responses.length === 0) {
    return next(new ApiError(404, "No responses found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, responses, "Student responses fetched successfully")
    );
});

export { register, login, update, createStudentResponse, getStudentResponses };
