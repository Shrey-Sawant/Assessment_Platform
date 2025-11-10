import express from "express";
import {
  register,
  login,
  update,
  createStudentResponse,
  getStudentResponses,
} from "../controllers/studentController.js";
import { verifyStudentToken } from "../middlewares/studentAuth.middleware.js"; 

const router = express.Router();

/**
 * @route POST /api/students/register
 * @desc Register a new student
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/students/login
 * @desc Login student
 * @access Public
 */
router.post("/login", login);

/**
 * @route PUT /api/students/update
 * @desc Update student details
 * @access Private (Student)
 */
router.put("/update", verifyStudentToken, update);

/**
 * @route POST /api/students/responses
 * @desc Submit a student's exam response
 * @access Private (Student)
 */
router.post("/responses", verifyStudentToken, createStudentResponse);

/**
 * @route GET /api/students/responses
 * @desc Get student responses (by student_id or exam_id)
 * @access Private (Teacher/Admin/Student)
 */
router.get("/responses", verifyStudentToken, getStudentResponses);

/**
 * @route GET /api/students/responses/:id
 * @desc Get a specific student response by ID
 * @access Private (Teacher/Admin/Student)
 */
router.get("/responses/:id", verifyStudentToken, getStudentResponses);

export default router;
