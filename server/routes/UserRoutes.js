const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/UsersController/feedbackController");
const planController = require("../controllers/UsersController/planController");

// ----------------- feedback routes --------------------
router.get("/feedbacks", auth, feedbackController.getUserFeedbacks);
router.post("/feedbacks", auth, feedbackController.createFeedback);
router.get("/feedbacks/:id", auth, feedbackController.getUserFeedbackById);
router.put("/feedbacks/:id", auth, feedbackController.updateUserFeedback);
router.delete("/feedbacks/:id", auth, feedbackController.deleteUserFeedback);

// ----------------- Plan Routes  -----------------------
router.get("/plans-list", planController.getPlans);
router.post("/plans/purchase", auth, planController.purchasePlan);

module.exports = router;
