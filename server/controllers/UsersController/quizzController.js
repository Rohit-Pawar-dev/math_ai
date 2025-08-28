const Quiz = require("../../models/Quiz");
const QuizAttempt = require("../../models/QuizAttempt");
const Question = require("../../models/Question");
const QuizResult = require("../../models/QuizResult");


exports.getQuizByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const quiz = await Quiz.findOne({ uniqueCode: code }).populate('questions');
        if (!quiz) {
            return res.status(404).json({ status: false, message: 'Quiz not found' });
        }
        res.status(200).json({ status: true, data: quiz });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.startAttempt = async (req, res) => {
    try {
        const { quizId } = req.body;
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const existingAttempt = await QuizAttempt.findOne({
            quiz: quizId,
            user: req.user.id,
            status: 'in_progress'
        });
        if (existingAttempt) {
            return res.status(400).json({ message: 'You already have an active attempt for this quiz.' });
        }
        const attempt = await QuizAttempt.create({
            quiz: quizId,
            user: req.user.id,
            status: 'in_progress'
        });
        res.status(201).json(attempt);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.submitAttempt = async (req, res) => {
    try {
        const { attemptId, answers } = req.body;
        const attempt = await QuizAttempt.findById(attemptId).populate('quiz');
        if (!attempt || !attempt.user || attempt.user.toString() !== req.user.id.toString()) {
            return res.status(404).json({ message: 'Attempt not found or unauthorized' });
        }
        if (attempt.status === 'completed') {
            return res.status(400).json({ message: 'This attempt has already been completed.' });
        }
        let correctAnswers = 0;
        const answeredQuestions = [];
        // Evaluate answers
        for (let answer of answers) {
            const question = await Question.findById(answer.question);
            if (!question) continue;
            const isCorrect = question.answer === answer.selectedOption;
            if (isCorrect) correctAnswers++;
            answeredQuestions.push({
                question: question._id,
                selectedOption: answer.selectedOption,
                isCorrect
            });
        }
        // Update the attempt
        attempt.answers = answeredQuestions;
        attempt.status = 'completed';
        attempt.completedAt = new Date();
        await attempt.save();
        const score = correctAnswers;
        const totalQuestions = answeredQuestions.length;
        const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;
        const passed = percentage >= 50;
        const result = await QuizResult.create({
            quiz: attempt.quiz._id,
            user: req.user.id,
            attempt: attempt._id,
            score,
            totalQuestions,
            correctAnswers,
            percentage,
            passed
        });
        res.status(200).json({ message: 'Quiz submitted', result });
    } catch (err) {
        console.error('Error submitting quiz attempt:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user.id })
      .populate('quiz')
      .sort({ created_at: -1 });
    res.status(200).json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyResults = async (req, res) => {
    try {
        const results = await QuizResult.find({ user: req.user.id })
            .populate('quiz')
            .sort({ created_at: -1 });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getResultByAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const result = await QuizResult.findOne({
            attempt: attemptId,
            user: req.user.id
        }).populate('quiz');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};