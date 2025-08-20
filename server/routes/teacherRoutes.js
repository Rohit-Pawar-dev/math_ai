const express = require("express");
const router = express.Router();

// Controller
const teacherController = require("../controllers/TeachersController/teacherController");
const userController = require("../controllers/TeachersController/userController");

// ----------------- Teacher Profile Routes -----------------
router.get("/teacher/profile/:id", teacherController.getTeacherById);
router.put("/teacher/profile/:id", teacherController.updateTeacher);

router.post(
  "/teacher/upload-profile",
  teacherController.uploadTeacherImage,  
  teacherController.uploadProfile        
);

// ----------------- Teacher Dashboard Routes -----------------
router.get("/teacher/dashboard/:id", teacherController.getTeacherDashboard);

// ----------------- User Routes -----------------
router.post('/teacher/users', userController.uploadUserImage, userController.createUser);      
router.get("/teacher/users", userController.getUsers);
router.get("/teacher/users/:id", userController.getUserById);
router.put("/teacher/users/:id", userController.uploadUserImage, userController.updateUser);
router.delete("/teacher/users/:id", userController.deleteUser);

module.exports = router;
