import db from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc Create a new Generated Exam
 * @route POST /api/generated-exams
 * @access Private (Admin)
 */
export const createGeneratedExam = asyncHandler(async (req, res, next) => {
  const {
    Title,
    Code,
    SourceExamID,
    CreatedByAdmin,
    Duration,
    TotalMarks,
    ScheduledDateTime,
    CalculatorAllowed,
  } = req.body;

  if (!Title || !Code || !SourceExamID || !Duration || !TotalMarks) {
    throw new ApiError(400, "Required fields are missing.");
  }

  const [result] = await db.execute(
    `INSERT INTO GeneratedExams 
     (Title, Code, SourceExamID, CreatedByAdmin, Duration, TotalMarks, ScheduledDateTime, CalculatorAllowed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Title,
      Code,
      SourceExamID,
      CreatedByAdmin || null,
      Duration,
      TotalMarks,
      ScheduledDateTime || null,
      CalculatorAllowed || false,
    ]
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { GeneratedExamID: result.insertId },
        "Generated exam created successfully."
      )
    );
});

/**
 * @desc Get all Generated Exams
 * @route GET /api/generated-exams
 * @access Private (Admin)
 */
export const getAllGeneratedExams = asyncHandler(async (req, res, next) => {
  const [rows] = await db.execute(`
    SELECT ge.*, e.Title AS SourceExamTitle, a.Name AS CreatedBy
    FROM GeneratedExams ge
    LEFT JOIN Exams e ON ge.SourceExamID = e.exam_id
    LEFT JOIN Admins a ON ge.CreatedByAdmin = a.admin_id
    ORDER BY ge.GeneratedExamID DESC
  `);

  return res
    .status(200)
    .json(new ApiResponse(200, rows, "Generated exams fetched successfully."));
});

/**
 * @desc Update a Generated Exam by ID
 * @route PUT /api/generated-exams/:id
 * @access Private (Admin)
 */
export const updateGeneratedExam = asyncHandler(async (req, res, next) => {
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

  const [result] = await db.execute(
    `UPDATE GeneratedExams 
     SET Title = ?, Code = ?, SourceExamID = ?, Duration = ?, 
         TotalMarks = ?, ScheduledDateTime = ?, CalculatorAllowed = ?
     WHERE GeneratedExamID = ?`,
    [
      Title,
      Code,
      SourceExamID,
      Duration,
      TotalMarks,
      ScheduledDateTime || null,
      CalculatorAllowed || false,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Generated exam not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Generated exam updated successfully."));
});
