import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

  const processDescription = (desc) => {
  if (!desc) return "";

  // If the whole input already looks like LaTeX, wrap it once.
  const looksLikeFullLatex = /^[^a-zA-Z0-9]*x\^.*\\left|\\right|\\mathrm|\\quad/.test(desc);
  if (looksLikeFullLatex) {
    return `$${desc}$`;
  }

  // Otherwise, only wrap inline math pieces with ^ or _
  let processed = desc.replace(/([^\s]*[\^_][^\s]*)/g, (match) => {
    if (/^\$.*\$$/.test(match)) return match;
    return `$${match}$`;
  });

  // Replace newlines with LaTeX line breaks
  processed = processed.replace(/\n/g, " \\\\ ");
  return processed;
};


const mathjaxConfig = {
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
}

const QuestionView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [questionData, setQuestionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await API.get(`/questions/${id}`)
        if (res.data.status) {
          setQuestionData(res.data.data)
        } else {
          Swal.fire('Error', res.data.message || 'Failed to fetch question', 'error')
          navigate('/questions')
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
        navigate('/questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id, navigate])

  if (loading) return <p>Loading...</p>
  if (!questionData) return null

  const { question, optionType, options, answer, explanationType, explanation, status } = questionData

  return (
    <MathJaxContext config={mathjaxConfig}>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary">Question Preview</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/question-list')}>
            ← Back
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {/* Question */}
            <p><strong>Question:</strong></p>
            {/* <MathPreview text={question} /> */}
            <MathJax dynamic>{processDescription(question)}</MathJax>

            {/* Options */}
            <div className="mb-3 mt-3">
              <strong>Options:</strong>
              {optionType === 'text' ? (
                <ul className="mt-2">
                  {options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={`mb-1 ${idx === answer ? 'fw-bold text-success' : ''}`}
                    >
                      {/* <MathPreview text={opt} />{' '} */}
                      <MathJax dynamic>{processDescription(opt)}</MathJax>

                      {idx === answer && <span className="badge bg-success ms-2">Answer</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="row mt-2">
                  {options.map((src, idx) => (
                    <div className="col-6 col-md-3 mb-3" key={idx}>
                      <div
                        className={`border p-2 rounded text-center ${idx === answer ? 'border-success' : 'border-secondary'
                          }`}
                      >
                        <img
                          src={src}
                          alt={`Option ${idx + 1}`}
                          className="img-fluid rounded"
                          style={{ height: '120px', objectFit: 'contain' }}
                        />
                        {idx === answer && (
                          <div className="text-success fw-bold mt-1">Answer</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Explanation */}
            <div className="mb-3">
              <strong>Explanation:</strong>
              <div className="mt-2">
                {explanationType === 'text' ? (
                  // <MathPreview text={explanation} />
                  <MathJax dynamic>{processDescription(explanation)}</MathJax>
                ) : (
                  <img
                    src={explanation}
                    alt="Explanation"
                    className="img-thumbnail"
                    style={{ maxWidth: '300px', objectFit: 'cover' }}
                  />
                )}
              </div>
            </div>
            {/* Status */}
            <p>
              <strong>Status:</strong>{' '}
              <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                {status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default QuestionView
