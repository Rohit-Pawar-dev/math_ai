const Question = require('../../models/Question');
const getCustomMulter = require('../../utils/customMulter');
const MEDIA_URL = process.env.MEDIA_URL;

// const upload = getCustomMulter('questions').fields([
//   { name: 'options', maxCount: 10 },
//   { name: 'explanation', maxCount: 1 },
// ]);
const upload = getCustomMulter('questions').fields([
  { name: 'options[0]', maxCount: 1 },
  { name: 'options[1]', maxCount: 1 },
  { name: 'options[2]', maxCount: 1 },
  { name: 'options[3]', maxCount: 1 },
  { name: 'explanation', maxCount: 1 },
]);


// exports.createQuestion = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ status: false, message: err.message });
//     }

//     try {
//       const { question, answer, status, optionType, explanationType } = req.body;

//       if (!optionType) {
//         return res.status(400).json({ status: false, message: 'optionType is required' });
//       }

//       let options = [];

//       // Text options
//       if (optionType === 'text' && req.body.options) {
//         const bodyOptions = Array.isArray(req.body.options)
//           ? req.body.options
//           : JSON.parse(req.body.options);
//         options.push(...bodyOptions); // only strings
//       }

//       // Image options
//       if (optionType === 'image' && req.files && req.files.options) {
//         req.files.options.forEach((file) => {
//           options.push(file.path); // only string paths
//         });
//       }

//       // Explanation (text or image)
//       let explanation = '';
//       if (explanationType === 'text' && req.body.explanation) {
//         explanation = req.body.explanation;
//       } else if (explanationType === 'image' && req.files && req.files.explanation) {
//         explanation = req.files.explanation[0].path;
//       }

//       const newQuestion = await Question.create({
//         question,
//         optionType,
//         options,
//         answer,
//         explanationType,
//         explanation,
//         status: status || 'active',
//       });

//       res.status(201).json({
//         status: true,
//         message: 'Question created successfully',
//         data: newQuestion,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(400).json({ status: false, message: err.message });
//     }
//   });
// };

exports.createQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }

    try {
      const { question, answer, status, optionType, explanationType } = req.body;

      if (!optionType) {
        return res.status(400).json({ status: false, message: 'optionType is required' });
      }

      let options = [];

      // Handle text options
      if (optionType === 'text' && req.body.options) {
        const bodyOptions = Array.isArray(req.body.options)
          ? req.body.options
          : JSON.parse(req.body.options);
        options = [...bodyOptions];
      }

      // Handle image options using indexed fields like options[0], options[1], etc.
      if (optionType === 'image' && req.files) {
        const imageOptions = [];

        Object.keys(req.files).forEach((key) => {
          const match = key.match(/^options\[(\d+)\]$/);
          if (match) {
            const index = parseInt(match[1]);
            imageOptions[index] = req.files[key][0].path; // Put file at correct index
          }
        });

        options = imageOptions;
      }

      // Explanation (text or image)
      let explanation = '';
      if (explanationType === 'text' && req.body.explanation) {
        explanation = req.body.explanation;
      } else if (explanationType === 'image' && req.files && req.files.explanation) {
        explanation = req.files.explanation[0].path;
      }

      const newQuestion = await Question.create({
        question,
        optionType,
        options,
        answer,
        explanationType,
        explanation,
        status: status || 'active',
      });

      res.status(201).json({
        status: true,
        message: 'Question created successfully',
        data: newQuestion,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: err.message });
    }
  });
};


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


exports.updateQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }

    try {
      const { id } = req.params;
      const { question, answer, status, optionType, explanationType } = req.body;

      let q = await Question.findById(id);
      if (!q) {
        return res.status(404).json({ status: false, message: 'Question not found' });
      }

      q.question = question || q.question;
      q.answer = answer !== undefined ? answer : q.answer;
      q.optionType = optionType || q.optionType;
      q.explanationType = explanationType || q.explanationType;
      q.status = status || q.status;

      // --- Handle Options ---
      if (optionType === 'text') {
        if (req.body.options) {
          const bodyOptions = Array.isArray(req.body.options)
            ? req.body.options
            : JSON.parse(req.body.options);
          q.options = bodyOptions;
        }
      } else if (optionType === 'image') {
        let existingOptions = Array.isArray(q.options) ? q.options : [];
        if (req.files) {
          for (const fieldName in req.files) {
            if (fieldName.startsWith('options[')) {
              const match = fieldName.match(/options\[(\d+)\]/);
              if (match) {
                const index = parseInt(match[1]);
                const file = req.files[fieldName][0];
                existingOptions[index] = file.path;
              }
            }
          }
        } q.options = existingOptions;
      }

      // --- Handle Explanation ---
      if (explanationType === 'text') {
        if (req.body.explanation) q.explanation = req.body.explanation;
      } else if (explanationType === 'image') {
        if (req.files && req.files.explanation) {
          q.explanation = req.files.explanation[0].path;
        }
      }

      await q.save();

      res.json({
        status: true,
        message: 'Question updated successfully',
        data: q,
      });
    } catch (err) {
      console.error('Error updating question:', err);
      res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
    }
  });
};


exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Question not found' });
    }

    // TODO: (optional) if options/explanation have image files, delete them from /uploads

    res.json({ status: true, message: 'Question deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
