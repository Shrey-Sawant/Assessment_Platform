import db from "../db/index.js";

const deleteTestData = async () => {
  try {
    console.log("🗑️ Deleting test data...");

    const tables = [
      "StudentResponses",
      "TeacherExamAllocations",
      "GeneratedExams",
      "Exams",
      "QuestionBank",
      "Students",
      "Teachers",
      "Admins",
    ];

    for (const table of tables) {
      await db.promise().query(`DELETE FROM ${table}`);
      console.log(`✅ Cleared: ${table}`);
    }

    console.log("🧹 All test data deleted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Delete failed:", err);
    process.exit(1);
  }
};

deleteTestData();
