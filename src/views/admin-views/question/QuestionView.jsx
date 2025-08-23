import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuestionView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)

  useEffect(() => {
    API.get(`/questions/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setQuestion(res.data.data)
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load question details', 'error')
      })
  }, [id])

  if (!question) return <div className="p-4">Loading...</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Question Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Question */}
            <Detail label="Question" value={question.question} />

            {/* Status */}
            <Detail label="Status" value={question.status} />

            {/* Answer */}
            <Detail label="Answer" value={question.answer} />

            {/* Explanation */}
            <Detail label="Explanation" value={question.explanation} />

            {/* Options */}
            <div className="col-md-12 mb-3">
              <label className="form-label">
                <strong>Options</strong>
              </label>
              <ul className="list-group">
                {question.options.map((option, idx) => (
                  <li key={idx} className="list-group-item">
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label">
      <strong>{label}</strong>
    </label>
    <p className="form-control-plaintext">{value}</p>
  </div>
)

export default QuestionView
