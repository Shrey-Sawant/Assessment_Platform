import db from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const dbQuery = async (query, params = []) => {
  try {
    const [results] = await db.promise().query(query, params);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new ApiError(500, "Database Error");
  }
};

/**
 * @desc Create a new Exam
 * @route POST /api/exams
 * @access Admin
 */
const createExam = asyncHandler(async (req, res, next) => {
  let { Title, Duration, Marks, Questions, CreatedByAdmin } = req.body;

  if (!Title || !Duration || !Marks || !Questions || !CreatedByAdmin) {
    return next(new ApiError(400, "All fields are required"));
  }

  Title = Title.trim();
  Questions =
    typeof Questions === "object" ? JSON.stringify(Questions) : Questions.trim();

  const insertQuery = `
    INSERT INTO Exams (Title, Duration, Marks, Questions, CreatedByAdmin)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await dbQuery(insertQuery, [
    Title,
    Duration,
    Marks,
    Questions,
    CreatedByAdmin,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to create Exam"));
  }

  const newExam = {
    exam_id: result.insertId,
    Title,
    Duration,
    Marks,
    Questions,
    CreatedByAdmin,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, newExam, "Exam created successfully"));
});

/**
 * @desc Get all Exams or a single Exam by ID
 * @route GET /api/exams or /api/exams/:id
 * @access Admin/Teacher/Student
 */
const getExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let query, params;
  if (id) {
    query = "SELECT * FROM Exams WHERE exam_id = ?";
    params = [id];
  } else {
    query = "SELECT * FROM Exams ORDER BY exam_id DESC";
    params = [];
  }

  const exams = await dbQuery(query, params);

  if (exams.length === 0) {
    return next(new ApiError(404, id ? "Exam not found" : "No exams found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, exams, "Exams fetched successfully"));
});

/**
 * @desc Update an existing Exam
 * @route PUT /api/exams/:id
 * @access Admin
 */
const updateExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { Title, Duration, Marks, Questions } = req.body;

  if (!id) {
    return next(new ApiError(400, "Exam ID is required"));
  }

  const existingExam = await dbQuery("SELECT * FROM Exams WHERE exam_id = ?", [id]);
  if (existingExam.length === 0) {
    return next(new ApiError(404, "Exam not found"));
  }

  const updatedTitle = Title ? Title.trim() : existingExam[0].Title;
  const updatedDuration = Duration ?? existingExam[0].Duration;
  const updatedMarks = Marks ?? existingExam[0].Marks;
  const updatedQuestions = Questions
    ? typeof Questions === "object"
      ? JSON.stringify(Questions)
      : Questions.trim()
    : existingExam[0].Questions;

  const updateQuery = `
    UPDATE Exams
    SET Title = ?, Duration = ?, Marks = ?, Questions = ?
    WHERE exam_id = ?
  `;

  const result = await dbQuery(updateQuery, [
    updatedTitle,
    updatedDuration,
    updatedMarks,
    updatedQuestions,
    id,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to update Exam"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id, Title: updatedTitle, Duration: updatedDuration, Marks: updatedMarks },
        "Exam updated successfully"
      )
    );
});

/**
 * @desc Delete an Exam
 * @route DELETE /api/exams/:id
 * @access Admin
 */
const deleteExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError(400, "Exam ID is required"));
  }

  const result = await dbQuery("DELETE FROM Exams WHERE exam_id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new ApiError(404, "Exam not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Exam deleted successfully"));
});

export { createExam, getExam, updateExam, deleteExam };
