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
const questionController = require("../controllers/AdminsController/questionController");
const quizController = require("../controllers/AdminsController/quizController");
const chapterController = require("../controllers/AdminsController/chapterController");
const topicController = require("../controllers/AdminsController/topicController");
const sectionController = require("../controllers/AdminsController/sectionController");
const subsectionController = require("../controllers/AdminsController/SubSectionController");
const auth = require("../middleware/authMiddleware");
const getCustomMulter = require('../utils/customMulter');

// Upload handler (store in `uploads/chapters`)
const uploadChapter = getCustomMulter('chapters');
const uploadSection = getCustomMulter('sections');



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

// ----------------- Notification Routes -----------------

router.get("/notifications", adminController.getNotifications);
router.post("/send-notification", adminController.uploadNotificationImage, adminController.sendNotification);
router.delete("/notifications/:id", adminController.deleteNotification);

//-----------------------Question Routes -----------------

router.post("/questions", questionController.createQuestion);
router.get("/questions", questionController.getQuestions);
router.get("/questions/:id", questionController.getQuestionById);
router.put("/questions/:id", questionController.updateQuestion);
router.delete("/questions/:id", questionController.deleteQuestion);

//-----------------------Quiz Routes -----------------

router.post("/quizzes", quizController.createQuiz);
router.get("/quizzes", quizController.getQuizzes);
router.get("/quizzes/:id", quizController.getQuizById);
router.put("/quizzes/:id", quizController.updateQuiz);
router.delete("/quizzes/:id", quizController.deleteQuiz);
router.put("/quizzes/:id/add-questions", quizController.addQuestionsToQuiz);
router.put("/quizzes/:id/set-questions", quizController.setQuestionsForQuiz);


//-----------------------chapter Routes -----------------

router.post('/chapter', uploadChapter.single('icon'), chapterController.createChapter);
router.get('/chapter', chapterController.getChapters);
router.get('/chapter/:id', chapterController.getChapterById);
router.put('/chapter/:id', uploadChapter.single('icon'), chapterController.updateChapter);
router.delete('/chapter/:id', chapterController.deleteChapter);

//-----------------------Topic Routes -----------------

router.post('/topic', topicController.createTopic);
router.get('/topic', topicController.getTopics);
router.get('/topic/:id', topicController.getTopicById);
router.put('/topic/:id', topicController.updateTopic);
router.delete('/topic/:id', topicController.deleteTopic);

//-------------------- Section Routes -----------------

router.post('/section', uploadSection.single('video'), sectionController.createSection);
router.get('/section', sectionController.getSections);
router.get('/section/:id', sectionController.getSectionById);
router.put('/section/:id', uploadSection.single('video'), sectionController.updateSection);
router.delete('/section/:id', sectionController.deleteSection);

//------------------Subsection Routes --------------------
router.post('/subsection', subsectionController.createSubsection);
router.get('/subsection', subsectionController.getSubsections);
router.get('/subsection/:id', subsectionController.getSubsectionById);
router.put('/subsection/:id', subsectionController.updateSubsection);
router.delete('/subsection/:id', subsectionController.deleteSubsection);

//----------------------Attempt Quiz -------------------
router.get('/quiz/:quizId/attempts', quizController.getQuizAttempts);
router.get('/result/:attemptId', quizController.getFullResult);



module.exports = router;
