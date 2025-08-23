import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuestionAdd = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    status: 'active',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...form.options]
    updatedOptions[index] = value
    setForm((prev) => ({ ...prev, options: updatedOptions }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!form.question.trim()) {
      return Swal.fire('Error', 'Question is required', 'error')
    }

    if (form.options.some((opt) => !opt.trim())) {
      return Swal.fire('Error', 'All options are required', 'error')
    }

    if (!form.answer.trim()) {
      return Swal.fire('Error', 'Correct answer is required', 'error')
    }

    if (!form.options.includes(form.answer)) {
      return Swal.fire('Error', 'Correct answer must match one of the options', 'error')
    }

    try {
      const res = await API.post('/questions', form)
      if (res.status === 201) {
        Swal.fire('Success', 'Question added successfully!', 'success').then(() =>
          navigate('/question-list'),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add question', 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Add Question</h5>
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

            <button type="submit" className="btn btn-primary">
              Add Question
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default QuestionAdd
