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
    console.log(error);
    throw new ApiError(500, "Database Error");
  }
};

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.admin_id, email: admin.Email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * @desc Register Admin
 */
const register = asyncHandler(async (req, res, next) => {
  let { FName, MName, LName, Email, Phone, password } = req.body;

  if (!FName || !LName || !Email || !Phone || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  FName = FName.trim();
  MName = MName.trim();
  LName = LName.trim();
  Email = Email.trim();
  Phone = Phone.trim();
  password = password.trim();

  if (Phone.length < 10 || isNaN(Phone)) {
    return next(new ApiError(400, "Invalid phone number"));
  }

  try {
    const existingAdmin = await dbQuery(
      "SELECT * FROM Admins WHERE Email = ?",
      [Email]
    );
    if (existingAdmin.length > 0) {
      return next(new ApiError(400, "Admin already exists with this email"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO Admins (FName, MName, LName, Email, Phone,Password)
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
      return next(new ApiError(500, "Admin registration failed"));
    }

    const admin = { id: result.insertId, FName, LName, Email, Phone };

    return res
      .status(200)
      .json(new ApiResponse(200, admin, "Admin registered successfully"));
  } catch (err) {
    console.error("Database error:", err);
    return next(new ApiError(500, "Database Error"));
  }
});

/**
 * @desc Login Admin
 */
const login = asyncHandler(async (req, res, next) => {
  const { Email, password } = req.body;

  try {
    const admin = await dbQuery("SELECT * FROM Admins WHERE Email = ?", [
      Email,
    ]);

    if (admin.length === 0) {
      return next(new ApiError(401, "Invalid credentials: Admin not found"));
    }

    const isMatch = await bcrypt.compare(password, admin[0].Password);

    if (!isMatch) {
      return next(new ApiError(401, "Invalid credentials: Incorrect password"));
    }

    const token = generateToken(admin[0]);

    res.cookie("authToken", token, options);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { ...admin[0], token }, "Successfully logged in")
      );
  } catch (err) {
    console.error("Login error:", err);
    return next(new ApiError(500, "An unexpected error occurred during login"));
  }
});

/**
 * @desc Update Admin details
 */
const update = asyncHandler(async (req, res, next) => {
  const { FName, MName, LName, Email, Phone, Password } = req.body;
  const admin = req?.admin;

  if (!admin) {
    return next(new ApiError(400, "Admin not authenticated"));
  }

  if (!FName || !LName || !Email || !Phone || !Password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(Email)) {
    return next(new ApiError(400, "Invalid email format"));
  }

  try {
    const [existingAdmin] = await db
      .promise()
      .query("SELECT * FROM Admins WHERE Email = ? AND admin_id != ?", [
        Email,
        admin.id,
      ]);

    if (existingAdmin.length > 0) {
      return next(new ApiError(400, "Email already in use"));
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const updateQuery = `
      UPDATE Admins
      SET FName = ?, MName = ?, LName = ?, Email = ?, Phone = ?, Password = ?
      WHERE admin_id = ?
    `;

    const [result] = await db
      .promise()
      .query(updateQuery, [
        FName,
        MName || "",
        LName,
        Email,
        Phone,
        hashedPassword,
        admin.admin_id,
      ]);

    if (result.affectedRows === 0) {
      return next(new ApiError(404, "Admin not found"));
    }

    const [updatedAdmin] = await db
      .promise()
      .query(
        "SELECT admin_id, FName, MName, LName, Email, Phone FROM Admins WHERE admin_id = ?",
        [admin.id]
      );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedAdmin[0], "Admin updated successfully")
      );
  } catch (error) {
    console.error("Update error:", error);
    return next(new ApiError(500, "Server error during update"));
  }
});

/**
 * @desc Create a new teacher exam allocation
 * @route POST /api/teacherExamAllocations
 * @access Admin
 */
const createTeacherExamAllocation = asyncHandler(async (req, res) => {
  const { teacher_id, exam_id, AllocatedByAdmin, AllocatedStudentIDs } =
    req.body;

  if (!teacher_id || !exam_id || !AllocatedByAdmin) {
    throw new ApiError(
      400,
      "teacher_id, exam_id, and AllocatedByAdmin are required fields."
    );
  }

  const result = await dbQuery(
    `INSERT INTO TeacherExamAllocations 
     (teacher_id, exam_id, AllocatedByAdmin, AllocatedStudentIDs)
     VALUES (?, ?, ?, ?)`,
    [teacher_id, exam_id, AllocatedByAdmin, AllocatedStudentIDs || null]
  );

  if (!result.insertId) {
    throw new ApiError(500, "Failed to create teacher exam allocation.");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { AllocationID: result.insertId },
        "Teacher exam allocation created successfully"
      )
    );
});

/**
 * @desc Get all teacher exam allocations (optionally filtered by teacher_id or exam_id)
 * @route GET /api/teacherExamAllocations
 * @access Admin/Teacher
 */
const getTeacherExamAllocations = asyncHandler(async (req, res) => {
  const { teacher_id, exam_id } = req.query;

  let query = `SELECT * FROM TeacherExamAllocations`;
  const params = [];

  if (teacher_id || exam_id) {
    query += " WHERE";
    if (teacher_id) {
      query += " teacher_id = ?";
      params.push(teacher_id);
    }
    if (exam_id) {
      if (params.length) query += " AND";
      query += " exam_id = ?";
      params.push(exam_id);
    }
  }

  const rows = await dbQuery(query, params); // ✅ use our helper

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rows,
        "Teacher exam allocations retrieved successfully"
      )
    );
});

/**
 * @desc Allocate an exam to a student
 * @route POST /api/studentExamAllocations
 * @access Admin
 */
const createStudentExamAllocation = asyncHandler(async (req, res) => {
  const { student_id, exam_id, AllocatedByAdmin } = req.body;

  if (!student_id || !exam_id || !AllocatedByAdmin) {
    throw new ApiError(
      400,
      "student_id, exam_id, and AllocatedByAdmin are required fields."
    );
  }

  // Check if allocation already exists
  const existing = await dbQuery(
    `SELECT * FROM StudentExamAllocations WHERE student_id = ? AND exam_id = ?`,
    [student_id, exam_id]
  );

  if (existing.length > 0) {
    throw new ApiError(
      400,
      "This student has already been allocated to the exam."
    );
  }

  const result = await dbQuery(
    `INSERT INTO StudentExamAllocations (student_id, exam_id, AllocatedByAdmin)
     VALUES (?, ?, ?)`,
    [student_id, exam_id, AllocatedByAdmin]
  );

  if (!result.insertId) {
    throw new ApiError(500, "Failed to create student exam allocation.");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { AllocationID: result.insertId },
        "Student exam allocation created successfully."
      )
    );
});

/**
 * @desc Get all student exam allocations (optionally filter by student_id or exam_id)
 * @route GET /api/studentExamAllocations
 * @access Admin/Teacher
 */
const getStudentExamAllocations = asyncHandler(async (req, res) => {
  const { student_id, exam_id } = req.query;

  let query = `SELECT * FROM StudentExamAllocations`;
  const params = [];

  if (student_id || exam_id) {
    query += " WHERE";
    if (student_id) {
      query += " student_id = ?";
      params.push(student_id);
    }
    if (exam_id) {
      if (params.length) query += " AND";
      query += " exam_id = ?";
      params.push(exam_id);
    }
  }

  const rows = await dbQuery(query, params); // ✅ safe promise-based helper

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rows,
        "Student exam allocations retrieved successfully."
      )
    );
});

export {
  register,
  login,
  update,
  createTeacherExamAllocation,
  getTeacherExamAllocations,
  createStudentExamAllocation,
  getStudentExamAllocations,
};
