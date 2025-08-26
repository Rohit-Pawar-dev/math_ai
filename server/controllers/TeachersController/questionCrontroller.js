const Question = require('../../models/Question');
const getCustomMulter = require('../../utils/customMulter');
const MEDIA_URL = process.env.MEDIA_URL;


exports.getQuestions = async (req, res) => {
  try {
    const searchText = req.query.search || ''
    const status = req.query.status
    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const query = {}

    if (searchText) query.question = { $regex: searchText, $options: 'i' }
    if (status === 'active' || status === 'inactive') query.status = status

    const total = await Question.countDocuments(query)
    let questions = await Question.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Prepend MEDIA_URL only for image type options/explanation
    questions = questions.map((q) => {
      const formatted = q.toObject()

      if (formatted.optionType === 'image') {
        formatted.options = formatted.options.map((opt) => `${process.env.MEDIA_URL}/${opt.replace(/\\/g, '/')}`)
      }

      if (formatted.explanationType === 'image' && formatted.explanation) {
        formatted.explanation = `${process.env.MEDIA_URL}/${formatted.explanation.replace(/\\/g, '/')}`
      }

      return formatted
    })

    res.json({
      status: true,
      message: 'Questions fetched successfully',
      data: questions,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error('Error fetching questions:', err) // 🔹 log the error
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}


// Get Single Question
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ status: false, message: 'Question not found' });
    }

    // Format options
    const formattedOptions =
      question.optionType === 'image'
        ? question.options.map((opt) => `${MEDIA_URL}/${opt.replace(/\\/g, '/')}`)
        : question.options; // text options remain as is

    // Format explanation
    const formattedExplanation =
      question.explanationType === 'image'
        ? `${MEDIA_URL}/${question.explanation.replace(/\\/g, '/')}`
        : question.explanation;

    res.json({
      status: true,
      message: 'Question fetched successfully',
      data: {
        _id: question._id,
        question: question.question,
        optionType: question.optionType,
        options: formattedOptions,
        answer: question.answer,
        explanationType: question.explanationType,
        explanation: formattedExplanation,
        status: question.status,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

