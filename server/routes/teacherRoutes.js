const express = require("express");
const router = express.Router();

// Controller
const teacherController = require("../controllers/TeachersController/teacherController");

// ----------------- Teacher Profile Routes -----------------
router.get("/teacher/:id", teacherController.getTeacherById);
router.put("/teacher/:id", teacherController.updateTeacher);

router.post(
  "/teacher/upload-profile",
  teacherController.uploadTeacherImage,  
  teacherController.uploadProfile        
);

module.exports = router;
