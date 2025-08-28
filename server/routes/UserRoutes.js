const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/UsersController/feedbackController");
const planController = require("../controllers/UsersController/planController");
const quizController = require("../controllers/UsersController/quizzController");

// ----------------- feedback routes --------------------
router.get("/feedbacks", auth, feedbackController.getUserFeedbacks);
router.post("/feedbacks", auth, feedbackController.createFeedback);
router.get("/feedbacks/:id", auth, feedbackController.getUserFeedbackById);
router.put("/feedbacks/:id", auth, feedbackController.updateUserFeedback);
router.delete("/feedbacks/:id", auth, feedbackController.deleteUserFeedback);

// ----------------- Plan Routes  -----------------------
router.get("/plans-list", planController.getPlans);
router.post("/plans/purchase", auth, planController.purchasePlan);

//Quizz Controller
router.get("/quizzes/code/:code", quizController.getQuizByCode);
router.post('/attempt/start', auth, quizController.startAttempt);
router.post('/attempt/submit', auth, quizController.submitAttempt);
router.get('/attempts', auth, quizController.getMyAttempts);
router.get('/results', auth, quizController.getMyResults);
router.get('/results/:attemptId', auth, quizController.getResultByAttempt);

module.exports = router;
