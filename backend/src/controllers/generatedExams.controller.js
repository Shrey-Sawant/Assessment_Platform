import db from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc Create a new Generated Exam
 * @route POST /api/generated-exams
 * @access Private (Admin)
 */
const createGeneratedExam = asyncHandler(async (req, res, next) => {
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

  const trimmedTitle = Title.trim();
  const trimmedCode = Code.trim();

  const [existing] = await db.execute(
    "SELECT Code FROM GeneratedExams WHERE Code = ?",
    [trimmedCode]
  );
  if (existing.length > 0) {
    throw new ApiError(409, "Exam code already exists.");
  }

  const [exam] = await db.execute(
    "SELECT exam_id FROM Exams WHERE exam_id = ?",
    [SourceExamID]
  );
  if (exam.length === 0) {
    throw new ApiError(400, "Invalid SourceExamID provided.");
  }

  const [result] = await db.execute(
    `INSERT INTO GeneratedExams 
     (Title, Code, SourceExamID, CreatedByAdmin, Duration, TotalMarks, ScheduledDateTime, CalculatorAllowed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      trimmedTitle,
      trimmedCode,
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
const getAllGeneratedExams = asyncHandler(async (req, res, next) => {
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

  const trimmedTitle = Title?.trim();
  const trimmedCode = Code?.trim();

  if (Code) {
    const [existing] = await db.execute(
      "SELECT Code FROM GeneratedExams WHERE Code = ? AND GeneratedExamID != ?",
      [trimmedCode, id]
    );
    if (existing.length > 0) {
      throw new ApiError(409, "Exam code already exists.");
    }
  }

  if (SourceExamID) {
    const [exam] = await db.execute(
      "SELECT exam_id FROM Exams WHERE exam_id = ?",
      [SourceExamID]
    );
    if (exam.length === 0) {
      throw new ApiError(400, "Invalid SourceExamID provided.");
    }
  }

  const [result] = await db.execute(
    `UPDATE GeneratedExams 
     SET Title = ?, Code = ?, SourceExamID = ?, Duration = ?, 
         TotalMarks = ?, ScheduledDateTime = ?, CalculatorAllowed = ?, updated_at = NOW()
     WHERE GeneratedExamID = ?`,
    [
      trimmedTitle,
      trimmedCode,
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

/**
 * @desc Delete a Generated Exam by ID
 * @route DELETE /api/generated-exams/:id
 * @access Private (Admin)
 */

const deleteGeneratedExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await db.execute(
    "DELETE FROM GeneratedExams WHERE GeneratedExamID = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Generated exam not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Generated exam deleted successfully."));
});

export {
  createGeneratedExam,
  getAllGeneratedExams,
  updateGeneratedExam,
  deleteGeneratedExam,
};
