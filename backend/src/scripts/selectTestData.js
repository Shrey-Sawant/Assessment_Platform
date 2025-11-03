import db from "../db/index.js";

const selectTestData = async () => {
  try {
    console.log("🔍 Fetching all table data...");

    const tables = [
      "Admins",
      "Teachers",
      "Students",
      "QuestionBank",
      "Exams",
      "GeneratedExams",
      "StudentResponses",
      "TeacherExamAllocations",
    ];

    for (const table of tables) {
      const [rows] = await db.promise().query(`SELECT * FROM ${table}`);
      console.log(`\n📋 ${table}:`);
      console.table(rows);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Select failed:", err);
    process.exit(1);
  }
};

selectTestData();
