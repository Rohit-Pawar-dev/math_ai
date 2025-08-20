const express = require("express");
const router = express.Router();

// Controllers
const classController = require("../controllers/AdminsController/classController");
const userController = require('../controllers/AdminsController/userController');
const bannerController = require('../controllers/AdminsController/bannerController');
const feedbackController = require("../controllers/AdminsController/feedbackController");
const planController = require("../controllers/AdminsController/planController");
const subscriberController = require('../controllers/AdminsController/subscriberController');
const transactionController = require('../controllers/AdminsController/transactionController');
const pageController = require("../controllers/AdminsController/pageController");
const settingController = require("../controllers/AdminsController/settingController");
const adminController = require("../controllers/AdminsController/adminController");

// ----------------- Admin Profile Routes -----------------
router.get("/admins/:id", adminController.getAdminById)
router.put("/admins/:id", adminController.updateAdmin)
router.post(
  "/admins/upload-profile",
  adminController.uploadAdminImage,
  adminController.uploadProfile      
)

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

router.get("/teachers", userController.getTeachers);
router.get("/teachers/:id", userController.getUserById);

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

// ----------------- Plan Routes -----------------
router.post("/plan", planController.createPlan);
router.get("/plan", planController.getPlans);
router.get("/plan/:id", planController.getPlan);
router.put("/plan/:id", planController.updatePlan);
router.delete("/plan/:id", planController.deletePlan);

// ----------------- Subscriber Routes -----------------
router.post("/subscribers", subscriberController.createSubscriber);
router.get("/subscribers", subscriberController.getSubscribers);
router.get("/subscribers/:id", subscriberController.getSubscriberById);
router.put("/subscribers/:id", subscriberController.updateSubscriber);
router.delete("/subscribers/:id", subscriberController.deleteSubscriber);

// ----------------- Transaction Routes -----------------
router.get("/transactions", transactionController.getTransactions);

// ----------------- Page Routes -----------------
router.post("/page", pageController.createPage);
router.get("/page", pageController.getAllPages);
router.get("/page/slug/:slug", pageController.getPageBySlug); 
router.get("/page/:id", pageController.getPageById);
router.put("/page/:id", pageController.updatePage);
router.delete("/page/:id", pageController.deletePage);

// ----------------- Setting Routes -----------------
router.post("/settings", settingController.createSetting);
router.get("/settings", settingController.getAllSettings);
router.get("/settings/:id", settingController.getSettingById);
router.put("/settings/:id", settingController.uploadLogoImage, settingController.updateSetting);
router.delete("/settings/:id", settingController.deleteSetting);

module.exports = router;
