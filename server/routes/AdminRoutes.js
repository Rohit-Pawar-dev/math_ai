const express = require("express");
const router = express.Router();

// Controllers
const classController = require("../controllers/AdminsController/classController");
const userController = require('../controllers/AdminsController/userController');
const bannerController = require('../controllers/AdminsController/bannerController');
const feedbackController = require("../controllers/AdminsController/feedbackController");

// ----------------- Class Routes -----------------
router.post("/classes", classController.createOrUpdateClass);
router.get("/classes", classController.getAllClasses);
router.get("/classes/:id", classController.getClassById);
router.delete("/classes/:id", classController.deleteClass);

// ----------------- User Routes -----------------
router.post('/users', userController.uploadUserImage, userController.createUser);      
router.get("/users", userController.getUsers);      
router.get("/users/:id", userController.getUserById);  
router.put("/users/:id", userController.uploadUserImage, userController.updateUser);    
router.delete("/users/:id", userController.deleteUser); 


// ----------------- Banner Routes -----------------
router.post('/banners', bannerController.uploadBannerImage, bannerController.createBanner);
router.get('/banners', bannerController.getBanners);
router.get('/banners/:id', bannerController.getBannerById);
router.put('/banners/:id', bannerController.uploadBannerImage, bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);

// ----------------- Feedback Routes -----------------
router.get("/feedbacks", feedbackController.getAllFeedbacks);
router.get("/feedbacks/:id", feedbackController.getFeedbackById);
router.put("/feedbacks/respond/:id", feedbackController.respondFeedback);
router.delete("/feedbacks/:id", feedbackController.deleteFeedback);

module.exports = router;
