import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

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
    <div className="card">
      <div className="card-body">
        <h2>Question Preview</h2>
        <p><strong>Question:</strong> {question}</p>

        <div>
          <strong>Options:</strong>
          {optionType === 'text' ? (
            <ul>
              {options.map((opt, idx) => (
                <li key={idx} style={{ fontWeight: idx === answer ? 'bold' : 'normal' }}>
                  {opt} {idx === answer && '(Answer)'}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {options.map((src, idx) => (
                <div
                  key={idx}
                  style={{
                    border: idx === answer ? '2px solid green' : '1px solid #ccc',
                    padding: '5px',
                    borderRadius: '5px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={src}
                    alt={`Option ${idx + 1}`}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  {idx === answer && <span style={{ color: 'green', fontWeight: 'bold' }}>Answer</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '15px' }}>
          <strong>Explanation:</strong>
          {explanationType === 'text' ? (
            <p>{explanation}</p>
          ) : (
            <img
              src={explanation}
              alt="Explanation"
              style={{ width: '300px', objectFit: 'cover', borderRadius: '5px' }}
            />
          )}
        </div>

        <p style={{ marginTop: '15px' }}>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  )
}

export default QuestionView
