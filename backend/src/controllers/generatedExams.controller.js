import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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

/**
 * @desc Create a new Generated Exam
 * @route POST /api/generated-exams
 * @access Private (Admin)
 */
const createGeneratedExam = asyncHandler(async (req, res, next) => {
  let {
    Title,
    Code,
    SourceExamID,
    CreatedByAdmin,
    Duration,
    TotalMarks,
    ScheduledDateTime,
    CalculatorAllowed,
  } = req.body;
  const admin = req.admin;

  if (!Title || !Code || !SourceExamID || !Duration || !TotalMarks) {
    return next(new ApiError(400, "All fields are required"));
  }

  Title = Title.trim();
  Code = Code.trim();

  const existingExam = await dbQuery(
    "SELECT * FROM GeneratedExams WHERE Code = ?",
    [Code]
  );
  if (existingExam.length > 0) {
    return next(new ApiError(400, "Exam code already exists"));
  }

  const sourceExam = await dbQuery(
    "SELECT exam_id FROM Exams WHERE exam_id = ?",
    [SourceExamID]
  );
  if (sourceExam.length === 0) {
    return next(new ApiError(400, "Invalid SourceExamID"));
  }

  const insertQuery = `
    INSERT INTO GeneratedExams 
    (Title, Code, SourceExamID, CreatedByAdmin, Duration, TotalMarks, ScheduledDateTime, CalculatorAllowed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await dbQuery(insertQuery, [
    Title,
    Code,
    SourceExamID,
    admin.admin_id || null,
    Duration,
    TotalMarks,
    ScheduledDateTime || null,
    CalculatorAllowed || false,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to create generated exam"));
  }

  const newGeneratedExam = {
    GeneratedExamID: result.insertId,
    Title,
    Code,
    SourceExamID,
    CreatedByAdmin,
    Duration,
    TotalMarks,
    ScheduledDateTime,
    CalculatorAllowed,
  };

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newGeneratedExam,
        "Generated exam created successfully"
      )
    );
});

/**
 * @desc Get all Generated Exams
 * @route GET /api/generated-exams
 * @access Private (Admin)
 */
const getAllGeneratedExams = asyncHandler(async (req, res, next) => {
  try {
    const admin = req.admin;

    if (!admin || !admin.admin_id) {
      return next(new ApiError(401, "Unauthorized: Admin not found"));
    }

    const [rows] = await db.promise().query(
      `
      SELECT 
        ge.GeneratedExamID,
        ge.Title,
        ge.Code,
        ge.SourceExamID,
        e.Title AS SourceExamTitle,
        ge.CreatedByAdmin,
        CONCAT(a.FName, ' ', COALESCE(a.MName, ''), ' ', a.LName) AS CreatedBy,
        ge.Duration,
        ge.TotalMarks,
        ge.ScheduledDateTime,
        ge.CalculatorAllowed
      FROM GeneratedExams ge
      LEFT JOIN Exams e ON ge.SourceExamID = e.exam_id
      LEFT JOIN Admins a ON ge.CreatedByAdmin = a.admin_id
      WHERE ge.CreatedByAdmin = ?
      ORDER BY ge.GeneratedExamID DESC
    `,
      [admin.admin_id]
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          rows,
          "Generated exams fetched for this admin successfully."
        )
      );
  } catch (error) {
    console.error("Database Error:", error);
    return next(new ApiError(500, "Database Error"));
  }
});

/**
 * @desc Update a Generated Exam by ID
 * @route PUT /api/generated-exams/:id
 * @access Private (Admin)
 */
const updateGeneratedExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    Title,
    Code,
    SourceExamID,
    Duration,
    TotalMarks,
    ScheduledDateTime,
    CalculatorAllowed,
  } = req.body;

  if (!id || isNaN(id)) {
    throw new ApiError(400, "Invalid or missing exam ID parameter.");
  }

  const trimmedTitle = Title?.trim();
  const trimmedCode = Code?.trim();

  if (Code) {
    const [existing] = await db
      .promise()
      .query(
        "SELECT Code FROM GeneratedExams WHERE Code = ? AND GeneratedExamID != ?",
        [trimmedCode, id]
      );
    if (existing.length > 0) {
      throw new ApiError(409, "Exam code already exists.");
    }
  }

  if (SourceExamID) {
    const [exam] = await db
      .promise()
      .query("SELECT exam_id FROM Exams WHERE exam_id = ?", [SourceExamID]);
    if (exam.length === 0) {
      throw new ApiError(400, "Invalid SourceExamID provided.");
    }
  }

  const fields = [];
  const values = [];

  if (trimmedTitle) {
    fields.push("Title = ?");
    values.push(trimmedTitle);
  }
  if (trimmedCode) {
    fields.push("Code = ?");
    values.push(trimmedCode);
  }
  if (SourceExamID) {
    fields.push("SourceExamID = ?");
    values.push(SourceExamID);
  }
  if (Duration) {
    fields.push("Duration = ?");
    values.push(Duration);
  }
  if (TotalMarks) {
    fields.push("TotalMarks = ?");
    values.push(TotalMarks);
  }
  if (ScheduledDateTime) {
    fields.push("ScheduledDateTime = ?");
    values.push(ScheduledDateTime);
  }
  if (CalculatorAllowed !== undefined) {
    fields.push("CalculatorAllowed = ?");
    values.push(CalculatorAllowed);
  }

  if (fields.length === 0) {
    throw new ApiError(400, "No fields provided for update.");
  }

  const query = `
    UPDATE GeneratedExams
    SET ${fields.join(", ")}
    WHERE GeneratedExamID = ?
  `;

  values.push(id);

  const [result] = await db.promise().query(query, values);

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Generated exam not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Generated exam updated successfully."));
});

/**
 * @desc Delete a Generated Exam by ID
 * @route DELETE /api/generated-exams/:id
 * @access Private (Admin)
 */
const deleteGeneratedExam = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  const admin = req?.admin;

  const [rows] = await db.promise().query(
    `
      SELECT 
        ge.GeneratedExamID,
        ge.Title,
        ge.Code,
        ge.SourceExamID,
        e.Title AS SourceExamTitle,
        ge.CreatedByAdmin,
        CONCAT(a.FName, ' ', COALESCE(a.MName, ''), ' ', a.LName) AS CreatedBy,
        ge.Duration,
        ge.TotalMarks,
        ge.ScheduledDateTime,
        ge.CalculatorAllowed
      FROM GeneratedExams ge
      LEFT JOIN Exams e ON ge.SourceExamID = e.exam_id
      LEFT JOIN Admins a ON ge.CreatedByAdmin = a.admin_id
      WHERE ge.CreatedByAdmin = ?
      ORDER BY ge.GeneratedExamID DESC
    `,
    [admin.admin_id]
  );

  if (rows.affectedRows === 0) {
    throw new ApiError(404, "Generated exam not found.");
  }

  const result = await dbQuery(
    "DELETE FROM GeneratedExams WHERE GeneratedExamID = ? AND CreatedByAdmin = ?",
    [id, admin.admin_id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Generated exam not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Generated exam deleted successfully."));
});

export {
  createGeneratedExam,
  getAllGeneratedExams,
  updateGeneratedExam,
  deleteGeneratedExam,
};
