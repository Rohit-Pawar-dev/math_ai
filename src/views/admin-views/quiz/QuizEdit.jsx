import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

const processDescription = (desc) => {
  let processed = desc.replace(/([^\s]*[\^_][^\s]*)/g, (match) => {
    if (/^\$.*\$$/.test(match)) return match;
    return `$${match}$`;
  });
  processed = processed.replace(/\n/g, " \\\\ ");
  return processed;
};

const mathjaxConfig = {
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
}


const QuizEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active')
  const [questions, setQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizRes = await API.get(`/quizzes/${id}`)
        if (quizRes.data.status) {
          const data = quizRes.data.data
          setTitle(data.title)
          setDescription(data.description)
          setStatus(data.status)
          setSelectedQuestions(data.questions.map(q => q._id?.toString() || q.toString()))
        } else {
          Swal.fire('Error', 'Quiz not found', 'error')
          navigate('/quizzes')
          return
        }

        // get all questions
        const qRes = await API.get('/questions')
        if (qRes.data.status) {
          setQuestions(qRes.data.data)
        }
      } catch (err) {
        console.error(err)
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
        navigate('/quizzes')
      }
    }

    fetchQuizAndQuestions()
  }, [id, navigate])

  const handleQuestionToggle = (qid) => {
    setSelectedQuestions((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
    )
  }

  useEffect(() => {
    if (questions.length && window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [questions]);

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title,
        description,
        status,
        questions: selectedQuestions
      }

      const res = await API.put(`/quizzes/${id}`, payload)

      if (res.data.status || res.status === 200) {
        Swal.fire('Success', 'Quiz updated successfully', 'success')
        navigate('/quiz-list')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MathJaxContext config={mathjaxConfig}>
      <div className="card">
        <div className="card-body">
          <h2>Edit Quiz</h2>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group mb-3">
              <label>Quiz Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group mb-3">
              <label>Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Questions */}
            <div className="form-group mb-3">
              <label>Select Questions</label>
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                {questions.map((q) => (
                  <div key={q._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`q-${q._id}`}
                      checked={selectedQuestions.includes(q._id)}
                      onChange={() => handleQuestionToggle(q._id)}
                    />
                    {/* <label
                    className="form-check-label"
                    htmlFor={`q-${q._id}`}
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  /> */}
                    <label className="form-check-label" htmlFor={`q-${q._id}`}>
                      <MathJax dynamic>{processDescription(q.question)}</MathJax>
                    </label>


                  </div>
                ))}
              </div>
            </div>


            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Updating...' : 'Update Quiz'}
            </button>
          </form>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default QuizEdit
