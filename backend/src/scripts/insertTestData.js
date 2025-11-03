import db from "../db/index.js";

const insertTestData = async () => {
  try {
    console.log("🧱 Inserting test data...");

    const [admin] = await db
      .promise()
      .query(
        "INSERT INTO Admins (FName, MName, LName, Email, Phone) VALUES (?, ?, ?, ?, ?)",
        ["Shrey", "A", "Sawant", "admin@example.com", "9999999999"]
      );
    const adminId = admin.insertId;
    console.log("✅ Admin inserted:", adminId);

    const [teacher] = await db
      .promise()
      .query(
        "INSERT INTO Teachers (FName, MName, LName, Email, Phone) VALUES (?, ?, ?, ?, ?)",
        ["Rahul", "K", "Patil", "teacher@example.com", "8888888888"]
      );
    const teacherId = teacher.insertId;
    console.log("✅ Teacher inserted:", teacherId);

    const [student] = await db
      .promise()
      .query(
        "INSERT INTO Students (FName, MName, LName, Email, Phone, DOB) VALUES (?, ?, ?, ?, ?, ?)",
        ["Neha", "R", "Kadam", "student@example.com", "7777777777", "2003-04-12"]
      );
    const studentId = student.insertId;
    console.log("✅ Student inserted:", studentId);

    const questions = JSON.stringify([
      { q: "2 + 2 = ?", options: ["3", "4", "5"], ans: "4" },
      { q: "Capital of India?", options: ["Mumbai", "Delhi"], ans: "Delhi" },
    ]);
    const [qb] = await db
      .promise()
      .query("INSERT INTO QuestionBank (Title, Questions) VALUES (?, ?)", [
        "Basic Quiz",
        questions,
      ]);
    const qbId = qb.insertId;
    console.log("✅ QuestionBank inserted:", qbId);

    const [exam] = await db
      .promise()
      .query(
        "INSERT INTO Exams (Title, Duration, Marks, Questions, CreatedByAdmin) VALUES (?, ?, ?, ?, ?)",
        ["Midterm Test", 60, 100, questions, adminId]
      );
    const examId = exam.insertId;
    console.log("✅ Exam inserted:", examId);

    const [generatedExam] = await db
      .promise()
      .query(
        "INSERT INTO GeneratedExams (Title, Code, SourceExamID, CreatedByAdmin, Duration, TotalMarks, ScheduledDateTime, CalculatorAllowed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "Midterm Test - Batch A",
          "EXAM123",
          examId,
          adminId,
          60,
          100,
          "2025-11-03 10:00:00",
          true,
        ]
      );
    const generatedExamId = generatedExam.insertId;
    console.log("✅ GeneratedExam inserted:", generatedExamId);

    const allocatedStudents = JSON.stringify([studentId]);
    const [allocation] = await db
      .promise()
      .query(
        "INSERT INTO TeacherExamAllocations (teacher_id, exam_id, AllocatedByAdmin, AllocatedStudentIDs) VALUES (?, ?, ?, ?)",
        [teacherId, examId, adminId, allocatedStudents]
      );
    const allocationId = allocation.insertId;
    console.log("✅ TeacherExamAllocation inserted:", allocationId);

    const responses = JSON.stringify([
      { q: "2 + 2 = ?", ans: "4" },
      { q: "Capital of India?", ans: "Delhi" },
    ]);
    const [response] = await db
      .promise()
      .query(
        "INSERT INTO StudentResponses (GeneratedExamID, student_id, Responses, Score, IsReviewed, ReviewedByTeacher) VALUES (?, ?, ?, ?, ?, ?)",
        [generatedExamId, studentId, responses, 100, true, teacherId]
      );
    const responseId = response.insertId;
    console.log("✅ StudentResponse inserted:", responseId);

    console.log("\n🎉 All test data inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Insert failed:", err);
    process.exit(1);
  }
};

insertTestData();
