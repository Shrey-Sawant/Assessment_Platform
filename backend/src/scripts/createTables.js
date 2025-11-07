import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";

const dbQuery = async (query, params = []) => {
  try {
    const [results] = await db.promise().query(query, params);
    console.log(" Executed:", query.split("(")[0].trim());
    return results;
  } catch (error) {
    console.error(" Error executing query:", error.message);
    throw new ApiError(500, "Database Error");
  }
};

const dropQueries = [
  "DROP TABLE IF EXISTS ExamQuestions",
  "DROP TABLE IF EXISTS StudentResponses",
  "DROP TABLE IF EXISTS StudentExamAllocations",
  "DROP TABLE IF EXISTS TeacherExamAllocations",
  "DROP TABLE IF EXISTS GeneratedExams",
  "DROP TABLE IF EXISTS Exams",
  "DROP TABLE IF EXISTS QuestionBank",
  "DROP TABLE IF EXISTS Students",
  "DROP TABLE IF EXISTS Teachers",
  "DROP TABLE IF EXISTS Admins",
];

const tableQueries = [
  `CREATE TABLE IF NOT EXISTS Admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    FName VARCHAR(100),
    MName VARCHAR(100),
    LName VARCHAR(100),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Password VARCHAR(255) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Teachers (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    FName VARCHAR(100),
    MName VARCHAR(100),
    LName VARCHAR(100),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Password VARCHAR(255) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Students (
    Uid INT PRIMARY KEY AUTO_INCREMENT,
    FName VARCHAR(100),
    MName VARCHAR(100),
    LName VARCHAR(100),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    DOB DATE,
    Age INT,
    Password VARCHAR(255) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS QuestionBank (
    Q_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Questions LONGTEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Exams (
    exam_id INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Duration INT NOT NULL,
    Marks INT NOT NULL,
    Questions LONGTEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedByAdmin INT,
    FOREIGN KEY (CreatedByAdmin) REFERENCES Admins(admin_id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS GeneratedExams (
    GeneratedExamID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Code VARCHAR(100) NOT NULL,
    SourceExamID INT NOT NULL,
    CreatedByAdmin INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Duration INT NOT NULL,
    TotalMarks INT NOT NULL,
    ScheduledDateTime DATETIME,
    CalculatorAllowed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (SourceExamID) REFERENCES Exams(exam_id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedByAdmin) REFERENCES Admins(admin_id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS TeacherExamAllocations (
    AllocationID INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    exam_id INT,
    AllocatedByAdmin INT,
    AllocatedStudentIDs LONGTEXT,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (AllocatedByAdmin) REFERENCES Admins(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS StudentExamAllocations (
    AllocationID INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    exam_id INT,
    AllocatedByAdmin INT,
    FOREIGN KEY (student_id) REFERENCES Students(Uid) ON DELETE CASCADE,
    FOREIGN KEY (AllocatedByAdmin) REFERENCES Admins(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS StudentResponses (
    ResponseID INT PRIMARY KEY AUTO_INCREMENT,
    GeneratedExamID INT,
    student_id INT,
    Responses LONGTEXT,
    Score INT,
    SubmittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsReviewed BOOLEAN DEFAULT FALSE,
    ReviewedByTeacher INT DEFAULT NULL,
    FOREIGN KEY (GeneratedExamID) REFERENCES GeneratedExams(GeneratedExamID) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(Uid) ON DELETE CASCADE,
    FOREIGN KEY (ReviewedByTeacher) REFERENCES Teachers(teacher_id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ExamQuestions (
    ExamID INT,
    Q_ID INT,
    PRIMARY KEY (ExamID, Q_ID),
    FOREIGN KEY (ExamID) REFERENCES Exams(exam_id) ON DELETE CASCADE,
    FOREIGN KEY (Q_ID) REFERENCES QuestionBank(Q_ID) ON DELETE CASCADE
  )`,
];

const setupDatabase = async () => {
  try {
    console.log("🧹 Dropping existing tables...");
    for (const query of dropQueries) {
      await dbQuery(query);
    }

    console.log("🚀 Creating new tables...");
    for (const query of tableQueries) {
      await dbQuery(query);
    }

    console.log(" All tables dropped and recreated successfully!");
    process.exit(0);
  } catch (error) {
    console.error(" Database setup failed:", error);
    process.exit(1);
  }
};

setupDatabase();
