import express from "express";
import {
  createExam,
  getExam,
  updateExam,
  deleteExam,
} from "../controllers/exam.controller.js";
import { verifyTeacherToken } from "../middlewares/teacherAuth.middleware.js";

const router = express.Router();

/**
 * @desc Routes for Exam management
 * @base /api/exams
 */

// ✅ Public/Authorized users (Admin/Teacher/Student) — can GET
router.get("/", getExam);
router.get("/:id", getExam);

// 🔒 Admin-only routes
router.post("/", verifyTeacherToken , createExam);
router.put("/:id", verifyTeacherToken, updateExam);
router.delete("/:id", verifyTeacherToken, deleteExam);

export default router;
