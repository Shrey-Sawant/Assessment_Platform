import express from "express";
import { createQB, getQB, updateQB } from "../controllers/questionBank.controller.js";
import { verifyTeacher } from "../middlewares/teacherAuth.middleware.js";

const router = express.Router();

router.post("/", verifyTeacher, createQB);
router.put("/:id", verifyTeacher, updateQB);

export default router;
