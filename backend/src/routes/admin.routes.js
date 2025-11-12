import express from "express";
import {
  register,
  login,
  update,
  createStudentExamAllocation,
  getStudentExamAllocations,
  createTeacherExamAllocation,
  getTeacherExamAllocations,
} from "../controllers/admin.contoller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.put("/update", verifyAdmin, update);
router.post("/allocate-students", verifyAdmin, createStudentExamAllocation);
router.get("/student-allocations", verifyAdmin, getStudentExamAllocations);
router.get("/student-allocations/:id", verifyAdmin, getStudentExamAllocations);
router.post("/allocate-teachers", verifyAdmin, createTeacherExamAllocation);
router.get("/teacher-allocations", verifyAdmin, getTeacherExamAllocations);
router.get("/teacher-allocations/:id", verifyAdmin, getTeacherExamAllocations);

export default router;
