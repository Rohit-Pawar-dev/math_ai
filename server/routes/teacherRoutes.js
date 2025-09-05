const express = require("express");
const router = express.Router();

// Controller
const teacherController = require("../controllers/TeachersController/teacherController");
const userController = require("../controllers/TeachersController/userController");
const questionController = require("../controllers/TeachersController/questionCrontroller")
const quizController = require("../controllers/TeachersController/quizController")
const auth = require("../middleware/authMiddleware");

// ------------------ Teacher Auth Routes -----------------
router.post("/register", userController.uploadUserImage, userController.registerTeacher);

// ----------------- Teacher Profile Routes -----------------
router.get("/profile/:id", teacherController.getTeacherById);
router.put("/profile/:id", teacherController.updateTeacher);

router.post(
  "/profile/upload-profile",
  teacherController.uploadTeacherImage,
  teacherController.uploadProfile
);

// ----------------- Teacher Dashboard Routes -----------------
router.get("/dashboard/:id", teacherController.getTeacherDashboard);
router.get(
  "/dashboard/:teacherId/student-counts",
  teacherController.getStudentCountsByTime
);

// ----------------- User Routes -----------------
router.post('/users', userController.uploadUserImage, userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.uploadUserImage, userController.updateUser);
router.delete("/users/:id", userController.deleteUser);



//-----------------------Question Routes -----------------
router.get("/questions", questionController.getQuestions);
router.get("/questions/:id", questionController.getQuestionById);

//-----------------------Quiz Routes -----------------
router.post("/quizzes", auth, quizController.createQuiz);
router.get("/quizzes/:id", quizController.getQuizById);
router.put("/quizzes/:id", quizController.updateQuiz);
router.delete("/quizzes/:id", quizController.deleteQuiz);
router.put("/quizzes/:id/add-questions", quizController.addQuestionsToQuiz);
router.put("/quizzes/:id/set-questions", quizController.setQuestionsForQuiz);
router.get("/quizzes", auth, quizController.getQuizzesByTeacher);



module.exports = router;
