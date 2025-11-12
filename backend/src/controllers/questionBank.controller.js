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
 * @desc Create a new Question Bank entry
 * @route POST /api/questionbank
 * @access Admin/Teacher
 */
const createQB = asyncHandler(async (req, res, next) => {
  let { Title, Questions } = req.body;

  if (!Title || !Questions) {
    return next(new ApiError(400, "Title and Questions are required"));
  }

  Title = Title.trim();
  Questions =
    typeof Questions === "object"
      ? JSON.stringify(Questions)
      : Questions.trim();

  const insertQuery = `
    INSERT INTO QuestionBank (Title, Questions)
    VALUES (?, ?)
  `;

  const result = await dbQuery(insertQuery, [Title, Questions]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to create Question Bank"));
  }

  const newQB = { Q_ID: result.insertId, Title, Questions };

  return res
    .status(201)
    .json(new ApiResponse(201, newQB, "Question Bank created successfully"));
});

/**
 * @desc Get all Question Banks or a single one by ID
 * @route GET /api/questionbank or /api/questionbank/:id
 * @access Admin/Teacher/Student
 */
const getQB = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let query, params;
  if (id) {
    query = "SELECT * FROM QuestionBank WHERE Q_ID = ?";
    params = [id];
  } else {
    query = "SELECT * FROM QuestionBank ORDER BY Q_ID DESC";
    params = [];
  }

  const results = await dbQuery(query, params);

  if (results.length === 0) {
    return next(
      new ApiError(
        404,
        id ? "Question Bank not found" : "No Question Banks found"
      )
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Question Bank fetched successfully"));
});

/**
 * @desc Update a Question Bank entry
 * @route PUT /api/questionbank/:id
 * @access Admin/Teacher
 */
const updateQB = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { Title, Questions } = req.body;

  if (!id) {
    return next(new ApiError(400, "Question Bank ID is required"));
  }

  if (!Title && !Questions) {
    return next(
      new ApiError(
        400,
        "At least one field (Title or Questions) is required for update"
      )
    );
  }

  const existingQB = await dbQuery(
    "SELECT * FROM QuestionBank WHERE Q_ID = ?",
    [id]
  );
  if (existingQB.length === 0) {
    return next(new ApiError(404, "Question Bank not found"));
  }

  const updatedTitle = Title ? Title.trim() : existingQB[0].Title;
  const updatedQuestions = Questions
    ? typeof Questions === "object"
      ? JSON.stringify(Questions)
      : Questions.trim()
    : existingQB[0].Questions;

  const updateQuery = `
    UPDATE QuestionBank
    SET Title = ?, Questions = ?
    WHERE Q_ID = ?
  `;

  const result = await dbQuery(updateQuery, [
    updatedTitle,
    updatedQuestions,
    id,
  ]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to update Question Bank"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id, Title: updatedTitle, Questions: updatedQuestions },
        "Question Bank updated successfully"
      )
    );
});

/**
 * @desc Delete a Question Bank entry
 * @route DELETE /api/questionbank/:id
 * @access Admin/Teacher
 */
const deleteQB = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError(400, "Question Bank ID is required"));
  }

  const existingQB = await dbQuery(
    "SELECT * FROM QuestionBank WHERE Q_ID = ?",
    [id]
  );
  if (existingQB.length === 0) {
    return next(new ApiError(404, "Question Bank not found"));
  }

  const deleteQuery = "DELETE FROM QuestionBank WHERE Q_ID = ?";
  const result = await dbQuery(deleteQuery, [id]);

  if (result.affectedRows === 0) {
    return next(new ApiError(500, "Failed to delete Question Bank"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { id }, "Question Bank deleted successfully"));
});

export { createQB, getQB, updateQB, deleteQB };
