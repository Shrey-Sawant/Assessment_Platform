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

router.use(verifyAdmin);

router.put("/update", update);
router.post("/allocate-students", createStudentExamAllocation);
router.get("/student-allocations", getStudentExamAllocations);
router.post("/allocate-teachers", createTeacherExamAllocation);
router.get("/teacher-allocations", getTeacherExamAllocations);

export default router;
