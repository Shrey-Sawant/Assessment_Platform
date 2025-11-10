import express from "express";
import {
  register,
  login,
  update,
  createReviewedResponse,
  getReviewedResponses,
} from "../controllers/teacherController.js";

import { verifyTeacherToken } from "../middlewares/teacherAuth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/teachers/register
 * @desc Register a new teacher
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/teachers/login
 * @desc Login existing teacher
 * @access Public
 */
router.post("/login", login);

/**
 * @route PUT /api/teachers/update
 * @desc Update teacher details
 * @access Private (Teacher)
 */
router.put("/update", verifyTeacherToken, update);

/**
 * @route POST /api/teachers/reviewedResponses
 * @desc Create a reviewed response entry
 * @access Private (Teacher)
 */
router.post("/reviewedResponses", verifyTeacherToken, createReviewedResponse);

/**
 * @route GET /api/teachers/reviewedResponses
 * @desc Get all reviewed responses (optionally filter by teacher_id or student_id)
 * @access Private (Admin/Teacher)
 */
router.get("/reviewedResponses", verifyTeacherToken, getReviewedResponses);

export default router;
