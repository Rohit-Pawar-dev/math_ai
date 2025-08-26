
const Quiz = require('../../models/Quiz');
const MEDIA_URL = process.env.MEDIA_URL;

exports.createQuiz = async (req, res) => {
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

// exports.addQuestionsToQuiz = async (req, res) => {
//   try {
//     const { questions } = req.body;
//     const quiz = await Quiz.findById(req.params.id);

//     if (!quiz) {
//       return res.status(404).json({ status: false, message: 'Quiz not found' });
//     }

//     quiz.questions = [...new Set([...quiz.questions, ...questions])];
//     await quiz.save();

//     res.json({
//       status: true,
//       message: 'Questions added to quiz successfully',
//       data: quiz,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
//   }
// };
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

    // Add only non-existing questions
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

