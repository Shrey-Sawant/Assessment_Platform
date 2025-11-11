import express from "express";
import {
  createGeneratedExam,
  getAllGeneratedExams,
  updateGeneratedExam,
  deleteGeneratedExam,
} from "../controllers/generatedExams.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.post("/", verifyAdmin, createGeneratedExam);

router.get("/", verifyAdmin, getAllGeneratedExams);

router.put("/:id", verifyAdmin, updateGeneratedExam);

router.delete("/:id", verifyAdmin, deleteGeneratedExam);

export default router;
