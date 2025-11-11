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

router.get("/", getExam);
router.get("/:id", getExam);

router.post("/createExam", verifyTeacherToken , createExam);
router.put("/:id", verifyTeacherToken, updateExam);
router.delete("/:id", verifyTeacherToken, deleteExam);

export default router;
