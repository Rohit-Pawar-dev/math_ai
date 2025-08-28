
const Quiz = require('../../models/Quiz');
const MEDIA_URL = process.env.MEDIA_URL;
const QuizAttempt = require('../../models/QuizAttempt');
const QuizResult = require('../../models/QuizResult');
const crypto = require('crypto');

function generateUniqueCode(length = 6) {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

exports.createQuiz = async (req, res) => {
  let uniqueCode;
  let isUnique = false;
  while (!isUnique) {
    uniqueCode = "QUIZ-" + generateUniqueCode(6);
    const existing = await Quiz.findOne({ uniqueCode });
    if (!existing) isUnique = true;
  }

  try {
    const { title, description, is_paid, amount, teacher_id, status, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      is_paid: is_paid || false,
      amount: amount || '0',
      teacher_id: teacher_id || null,
      status: status || 'active',
      questions: questions || [],
      image: req.file ? `/uploads/quizzes/${req.file.filename}` : '',
      uniqueCode
    });

    res.status(201).json({
      status: true,
      message: 'Quiz created successfully',
      data: quiz,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
exports.getQuizzes = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' };
    }

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('questions')
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 });

    const data = quizzes.map((quiz) => ({
      ...quiz.toObject(),
      image: quiz.image ? `${MEDIA_URL}${quiz.image}` : null,
    }));

    res.json({
      status: true,
      message: 'Quizzes fetched successfully',
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) {
      return res.status(404).json({ status: false, message: 'Quiz not found' });
    }

    const data = {
      ...quiz.toObject(),
      image: quiz.image ? `${MEDIA_URL}${quiz.image}` : null,
    };

    res.json({
      status: true,
      message: 'Quiz fetched successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, is_paid, amount, status, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ status: false, message: 'Quiz not found' });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.is_paid = is_paid ?? quiz.is_paid;
    quiz.amount = amount || quiz.amount;
    quiz.status = status || quiz.status;

    if (questions) {
      quiz.questions = questions;
    }

    if (req.file) {
      quiz.image = `/uploads/quizzes/${req.file.filename}`;
    }

    await quiz.save();

    res.json({
      status: true,
      message: 'Quiz updated successfully',
      data: quiz,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ status: false, message: 'Quiz not found' });
    }

    res.json({ status: true, message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

exports.addQuestionsToQuiz = async (req, res) => {
  try {
    const { questions } = req.body; // should be array of questionIds
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ status: false, message: 'Quiz not found' });
    }

    // Convert existing question ids to string for comparison
    const existingQuestionIds = quiz.questions.map(q => q.toString());

    // Filter only new questionIds that are not already in quiz
    const newQuestions = questions.filter(
      qId => !existingQuestionIds.includes(qId.toString())
    );

    if (newQuestions.length === 0) {
      return res.json({
        status: true,
        message: 'No new questions to add',
        data: quiz,
      });
    }
    quiz.questions.push(...newQuestions);
    await quiz.save();

    res.json({
      status: true,
      message: 'Questions added to quiz successfully',
      data: quiz,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.setQuestionsForQuiz = async (req, res) => {
  try {
    const { questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ status: false, message: "Quiz not found" });
    }

    quiz.questions = questions;
    await quiz.save();

    res.json({
      status: true,
      message: "Quiz questions updated successfully",
      data: quiz,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error: err.message });
  }
};


// exports.getQuizAttempts = async (req, res) => {
//   try {
//     const { quizId } = req.params;

//     const attempts = await QuizAttempt.find({ quiz: quizId })
//       .populate('user', 'name email')
//       .populate('quiz', 'title');

//     res.status(200).json(attempts);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
exports.getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Build query
    const query = { quiz: quizId };

    // If searching by user name or email
    if (searchText) {
      query['$expr'] = {
        $regexMatch: {
          input: { $concat: ['$user.name', ' ', '$user.email'] },
          regex: searchText,
          options: 'i'
        }
      };
    }

    // Total count before pagination
    const total = await QuizAttempt.countDocuments({ quiz: quizId });

    // Fetch attempts
    const attempts = await QuizAttempt.find({ quiz: quizId })
      .populate('user', 'name email') // Populate user name & email
      .populate('quiz', 'title') // Populate quiz title
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 });

    // Map attempts to include QuizResult info
    const enrichedData = await Promise.all(
      attempts.map(async (attempt) => {
        const result = await QuizResult.findOne({ attempt: attempt._id });

        return {
          ...attempt.toObject(),
          user: attempt.user,
          quiz: attempt.quiz,
          score: result?.score ?? null,
          correctAnswers: result?.correctAnswers ?? null,
          totalQuestions: result?.totalQuestions ?? null,
          percentage: result?.percentage ?? null,
          passed: result?.passed ?? null,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: 'Quiz attempts fetched successfully',
      data: enrichedData,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

// 5. Get Full Result for an Attempt
exports.getFullResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const result = await QuizResult.findOne({ attempt: attemptId })
      .populate('quiz')
      .populate('user', 'name email')
      .populate({
        path: 'attempt',
        populate: {
          path: 'answers.question',
          model: 'Question'
        }
      });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




