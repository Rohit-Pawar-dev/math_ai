import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuestionEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    status: 'active',
  })

  useEffect(() => {
    API.get(`/questions/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data.data)
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to load question data', 'error'))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...form.options]
    updatedOptions[index] = value
    setForm((prev) => ({ ...prev, options: updatedOptions }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { question, options, answer, explanation, status } = form

    API.put(`/questions/${id}`, {
      question,
      options,
      answer,
      explanation,
      status,
    })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('Success', 'Question updated successfully', 'success').then(() =>
            navigate('/question-list'),
          )
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to update question', 'error'))
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Edit Question</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Question */}
            <div className="form-group mb-3">
              <label>Question</label>
              <input
                type="text"
                name="question"
                className="form-control"
                value={form.question}
                onChange={handleChange}
                required
              />
            </div>

            {/* Options */}
            <div className="form-group mb-3">
              <label>Options</label>
              {form.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control mb-2"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>

            {/* Correct Answer */}
            <div className="form-group mb-3">
              <label>Correct Answer</label>
              <input
                type="text"
                name="answer"
                className="form-control"
                value={form.answer}
                onChange={handleChange}
                required
              />
            </div>

            {/* Explanation */}
            <div className="form-group mb-3">
              <label>Explanation</label>
              <textarea
                name="explanation"
                className="form-control"
                value={form.explanation}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {/* Status */}
            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Update Question
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default QuestionEdit
