import express from "express";
import {
  createQB,
  deleteQB,
  getQB,
  updateQB,
} from "../controllers/questionBank.controller.js";
import { verifyTeacherToken } from "../middlewares/teacherAuth.middleware.js";

const router = express.Router();

router.get("/", verifyTeacherToken, getQB);
router.get("/:id", verifyTeacherToken, getQB);
router.post("/", verifyTeacherToken, createQB);
router.put("/:id", verifyTeacherToken, updateQB);
router.delete("/:id", verifyTeacherToken, deleteQB);

export default router;
