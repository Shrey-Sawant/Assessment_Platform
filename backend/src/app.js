import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials:true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.set("trust proxy",1);

import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import examRoutes from "./routes/exam.routes.js";
import questionBankRoutes from "./routes/questionBank.routes.js";
import generatedExamRoutes from "./routes/generatedExam.routes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/question-bank", questionBankRoutes);
app.use("/api/generated-exam", generatedExamRoutes);

export { app }