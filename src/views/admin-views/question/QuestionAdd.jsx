import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuestionAdd = () => {
  const [question, setQuestion] = useState('')
  const [optionType, setOptionType] = useState('text')
  const [options, setOptions] = useState(['', '', '', ''])
  const [optionFiles, setOptionFiles] = useState([null, null, null, null])
  const [optionPreviews, setOptionPreviews] = useState([null, null, null, null])
  const [answer, setAnswer] = useState(0)
  const [explanationType, setExplanationType] = useState('text')
  const [explanation, setExplanation] = useState('')
  const [explanationFile, setExplanationFile] = useState(null)
  const [explanationPreview, setExplanationPreview] = useState(null)
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Text options change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  // Image options change
  const handleOptionFileChange = (index, file) => {
    const newFiles = [...optionFiles]
    const newPreviews = [...optionPreviews]
    newFiles[index] = file
    newPreviews[index] = file ? URL.createObjectURL(file) : null
    setOptionFiles(newFiles)
    setOptionPreviews(newPreviews)
  }

  // Explanation image change
  const handleExplanationFileChange = (e) => {
    const file = e.target.files[0]
    setExplanationFile(file)
    setExplanationPreview(file ? URL.createObjectURL(file) : null)
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)

  //   try {
  //     const formData = new FormData()
  //     formData.append('question', question)
  //     formData.append('optionType', optionType)
  //     formData.append('answer', answer)
  //     formData.append('explanationType', explanationType)
  //     formData.append('status', status)

  //     // Append options
  //     if (optionType === 'text') {
  //       formData.append('options', JSON.stringify(options))
  //     } else {
  //       optionFiles.forEach((file) => {
  //         if (file) formData.append('options', file)
  //       })
  //     }

  //     // Append explanation
  //     if (explanationType === 'text') {
  //       formData.append('explanation', explanation)
  //     } else if (explanationFile) {
  //       formData.append('explanation', explanationFile)
  //     }

  //     const res = await API.post('/questions', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     })

  //     if (res.data.status) {
  //       Swal.fire('Success', 'Question created successfully', 'success')
  //       navigate('/question-list')
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     Swal.fire('Error', err.response?.data?.message || err.message, 'error')
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('question', question)
      formData.append('optionType', optionType)
      formData.append('answer', answer)
      formData.append('explanationType', explanationType)
      formData.append('status', status)

      // Handle options
      if (optionType === 'text') {
        formData.append('options', JSON.stringify(options))
      } else {
        optionFiles.forEach((file, idx) => {
          if (file) {
            formData.append(`options[${idx}]`, file)
          }
        })
      }

      // Handle explanation
      if (explanationType === 'text') {
        formData.append('explanation', explanation)
      } else if (explanationFile) {
        formData.append('explanation', explanationFile)
      }

      const res = await API.post('/questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data.status) {
        Swal.fire('Success', 'Question created successfully', 'success')
        navigate('/question-list')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <div className="card" style={{ flex: 1 }}>
        <div className="card-body">
          <h2>Add New Question</h2>
          <form onSubmit={handleSubmit}>
            {/* Question */}
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                className="form-control"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            {/* Option Type */}
            <div className="form-group">
              <label>Option Type</label>
              <select
                className="form-control"
                value={optionType}
                onChange={(e) => setOptionType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Options */}
            {optionType === 'text'
              ? options.map((opt, idx) => (
                <div className="form-group" key={idx}>
                  <label>Option {idx + 1}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    required
                  />
                </div>
              ))
              : optionFiles.map((_, idx) => (
                <div className="form-group" key={idx}>
                  <label>Option {idx + 1}</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleOptionFileChange(idx, e.target.files[0])}
                  />
                  {optionPreviews[idx] && (
                    <img
                      src={optionPreviews[idx]}
                      alt={`Option ${idx + 1}`}
                      style={{ width: '100px', marginTop: '5px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  )}
                </div>
              ))}

            {/* Answer
            <div className="form-group">
              <label>Answer (Index)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max={optionType === 'text' ? options.length - 1 : optionFiles.length - 1}
                value={answer}
                onChange={(e) => setAnswer(parseInt(e.target.value))}
                required
              />
            </div> */}

            <div className="form-group">
              <label>Answer (Option Number: 1 to 4)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max={4}
                value={answer + 1} // display as 1-based
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val) && val >= 1 && val <= 4) {
                    setAnswer(val - 1) // store as 0-based
                  }
                }}
                required
              />
            </div>


            {/* Explanation Type */}
            <div className="form-group">
              <label>Explanation Type</label>
              <select
                className="form-control"
                value={explanationType}
                onChange={(e) => setExplanationType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Explanation */}
            {explanationType === 'text' ? (
              <div className="form-group">
                <label>Explanation</label>
                <textarea
                  className="form-control"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Upload Explanation Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleExplanationFileChange}
                />
                {explanationPreview && (
                  <img
                    src={explanationPreview}
                    alt="Explanation"
                    style={{ width: '200px', marginTop: '10px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                )}
              </div>
            )}

            {/* Status */}
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Question'}
            </button>
          </form>
        </div>
      </div>

      {/* Live Preview */}
      <div className="card" style={{ flex: 1, padding: '15px' }}>
        <h3>Preview</h3>
        <p><strong>Question:</strong> {question}</p>
        <div>
          <strong>Options:</strong>
          <ul>
            {optionType === 'text'
              ? options.map((opt, idx) => <li key={idx}>{opt}</li>)
              : optionPreviews.map((src, idx) => src && <li key={idx}><img src={src} alt={`Option ${idx}`} style={{ width: '100px', objectFit: 'cover', borderRadius: '5px', marginBottom: '5px' }} /></li>)}
          </ul>
        </div>
        <p>
          <strong>Answer Index:</strong> {answer}
        </p>
        <div>
          <strong>Explanation:</strong>
          {explanationType === 'text'
            ? <p>{explanation}</p>
            : explanationPreview && <img src={explanationPreview} alt="Explanation" style={{ width: '200px', objectFit: 'cover', borderRadius: '5px' }} />}
        </div>
        <p><strong>Status:</strong> {status}</p>
      </div>
    </div>
  )
}

export default QuestionAdd
