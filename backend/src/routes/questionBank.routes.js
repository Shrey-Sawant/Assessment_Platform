import express from "express";
import {
  createQB,
  getQB,
  updateQB,
} from "../controllers/questionBank.controller.js";
import { verifyTeacherToken } from "../middlewares/teacherAuth.middleware.js";

const router = express.Router();

router.post("/", verifyTeacherToken, createQB);
router.put("/:id", verifyTeacherToken, updateQB);

export default router;
