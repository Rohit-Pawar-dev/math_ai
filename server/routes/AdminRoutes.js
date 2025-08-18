const express = require("express");
const router = express.Router();

// Controllers
const classController = require("../controllers/AdminsController/classController");

// ----------------- Class Routes -----------------
router.post("/classes", classController.createOrUpdateClass);  
router.get("/classes", classController.getAllClasses);         
router.get("/classes/:id", classController.getClassById);      
router.delete("/classes/:id", classController.deleteClass);     

module.exports = router;
