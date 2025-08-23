const Question = require('../../models/Question');

// Create Question
exports.createQuestion = async (req, res) => {
  try {
    const { question, options, answer, explanation, status } = req.body;

    const newQuestion = await Question.create({
      question,
      options,
      answer,
      explanation,
      status,
    });

    res.status(201).json({
      status: true,
      message: 'Question created successfully',
      data: newQuestion,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Get All Questions (with search, pagination)
exports.getQuestions = async (req, res) => {
  try {
    const searchText = req.query.search || '';
    const status = req.query.status; 
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const query = {};

    // Search filter
    if (searchText) {
      query.question = { $regex: searchText, $options: 'i' };
    }

    // Status filter
    if (status === 'active' || status === 'inactive') {
      query.status = status;
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: 'Questions fetched successfully',
      data: questions,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


// Get Single Question
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ status: false, message: 'Question not found' });
    }

    res.json({
      status: true,
      message: 'Question fetched successfully',
      data: question,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, answer, explanation, status } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        question,
        options,
        answer,
        explanation,
        status,
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ status: false, message: 'Question not found' });
    }

    res.json({
      status: true,
      message: 'Question updated successfully',
      data: updatedQuestion,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Question not found' });
    }

    res.json({ status: true, message: 'Question deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
