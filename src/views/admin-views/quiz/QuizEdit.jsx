// import React, { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import API from '../../../api'
// import Swal from 'sweetalert2'

// const QuestionEdit = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [question, setQuestion] = useState('')
//   const [optionType, setOptionType] = useState('text')
//   const [options, setOptions] = useState(['', '', '', ''])
//   const [optionFiles, setOptionFiles] = useState([])
//   const [optionPreviews, setOptionPreviews] = useState([])
//   const [answer, setAnswer] = useState(0)
//   const [explanationType, setExplanationType] = useState('text')
//   const [explanation, setExplanation] = useState('')
//   const [explanationFile, setExplanationFile] = useState(null)
//   const [explanationPreview, setExplanationPreview] = useState(null)
//   const [status, setStatus] = useState('active')
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const res = await API.get(`/quizzes/${id}`)
//         if (res.data.status) {
//           const data = res.data.data
//           setQuestion(data.question)
//           setOptionType(data.optionType)
//           setOptions(data.optionType === 'text' ? data.options : Array(data.options.length).fill(''))
//           setOptionPreviews(data.optionType === 'image' ? data.options : [])
//           setAnswer(data.answer)
//           setExplanationType(data.explanationType)
//           setExplanation(data.explanationType === 'text' ? data.explanation : '')
//           setExplanationPreview(data.explanationType === 'image' ? data.explanation : null)
//           setStatus(data.status)
//         } else {
//           Swal.fire('Error', 'Failed to fetch question', 'error')
//           navigate('/questions')
//         }
//       } catch (err) {
//         Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//         navigate('/questions')
//       }
//     }
//     fetchQuestion()
//   }, [id, navigate])

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options]
//     newOptions[index] = value
//     setOptions(newOptions)
//   }

//   const handleOptionFileChange = (e) => {
//     const files = Array.from(e.target.files).slice(0, 4)
//     setOptionFiles(files)
//     const previews = files.map((file) => URL.createObjectURL(file))
//     setOptionPreviews(previews)
//   }

//   const handleExplanationFileChange = (e) => {
//     const file = e.target.files[0]
//     setExplanationFile(file)
//     setExplanationPreview(file ? URL.createObjectURL(file) : null)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const formData = new FormData()
//       formData.append('question', question)
//       formData.append('optionType', optionType)
//       formData.append('answer', answer)
//       formData.append('explanationType', explanationType)
//       formData.append('status', status)

//       // Append options
//       if (optionType === 'text') {
//         formData.append('options', JSON.stringify(options))
//       } else {
//         optionFiles.forEach((file) => formData.append('options', file))
//       }

//       // Append explanation
//       if (explanationType === 'text') {
//         formData.append('explanation', explanation)
//       } else if (explanationFile) {
//         formData.append('explanation', explanationFile)
//       }

//       const res = await API.put(`/questions/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })

//       if (res.data.status || res.status === 200) {
//         Swal.fire('Success', 'Question updated successfully', 'success')
//         navigate('/questions')
//       }
//     } catch (err) {
//       console.error(err)
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="card">
//       <div className="card-body">
//         <h2>Edit Question</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Question */}
//           <div className="form-group">
//             <label>Question</label>
//             <input
//               type="text"
//               className="form-control"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               required
//             />
//           </div>

//           {/* Option Type */}
//           <div className="form-group">
//             <label>Option Type</label>
//             <select
//               className="form-control"
//               value={optionType}
//               onChange={(e) => setOptionType(e.target.value)}
//             >
//               <option value="text">Text</option>
//               <option value="image">Image</option>
//             </select>
//           </div>

//           {/* Options */}
//           {optionType === 'text' ? (
//             options.map((opt, idx) => (
//               <div className="form-group" key={idx}>
//                 <label>Option {idx + 1}</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={opt}
//                   onChange={(e) => handleOptionChange(idx, e.target.value)}
//                   required
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="form-group">
//               <label>Upload Options (Images, max 4)</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 multiple
//                 accept="image/*"
//                 onChange={handleOptionFileChange}
//               />
//               {optionPreviews.length > 0 && (
//                 <div
//                   className="option-image-grid"
//                   style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     gap: '10px',
//                     marginTop: '10px',
//                   }}
//                 >
//                   {optionPreviews.map((src, idx) => (
//                     <div key={idx} style={{ position: 'relative' }}>
//                       <img
//                         src={src}
//                         alt={`Option ${idx + 1}`}
//                         style={{
//                           width: '100%',
//                           height: '120px',
//                           objectFit: 'cover',
//                           borderRadius: '5px',
//                         }}
//                       />
//                       <span
//                         style={{
//                           position: 'absolute',
//                           top: '5px',
//                           left: '5px',
//                           background: '#fff',
//                           padding: '2px 5px',
//                           borderRadius: '3px',
//                           fontSize: '12px',
//                         }}
//                       >
//                         {idx + 1}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Answer */}
//           <div className="form-group">
//             <label>Answer (Index)</label>
//             <input
//               type="number"
//               className="form-control"
//               min="0"
//               max={optionType === 'text' ? options.length - 1 : optionPreviews.length - 1}
//               value={answer}
//               onChange={(e) => setAnswer(parseInt(e.target.value))}
//               required
//             />
//           </div>

//           {/* Explanation Type */}
//           <div className="form-group">
//             <label>Explanation Type</label>
//             <select
//               className="form-control"
//               value={explanationType}
//               onChange={(e) => setExplanationType(e.target.value)}
//             >
//               <option value="text">Text</option>
//               <option value="image">Image</option>
//             </select>
//           </div>

//           {/* Explanation */}
//           {explanationType === 'text' ? (
//             <div className="form-group">
//               <label>Explanation</label>
//               <textarea
//                 className="form-control"
//                 value={explanation}
//                 onChange={(e) => setExplanation(e.target.value)}
//               />
//             </div>
//           ) : (
//             <div className="form-group">
//               <label>Upload Explanation Image</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 accept="image/*"
//                 onChange={handleExplanationFileChange}
//               />
//               {explanationPreview && (
//                 <img
//                   src={explanationPreview}
//                   alt="Explanation"
//                   style={{
//                     width: '200px',
//                     marginTop: '10px',
//                     borderRadius: '5px',
//                     objectFit: 'cover',
//                   }}
//                 />
//               )}
//             </div>
//           )}

//           {/* Status */}
//           <div className="form-group">
//             <label>Status</label>
//             <select
//               className="form-control"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//           <button type="submit" className="btn btn-warning" disabled={loading}>
//             {loading ? 'Updating...' : 'Update Question'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default QuestionEdit
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuizEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active')
  const [questions, setQuestions] = useState([]) // all available questions
  const [selectedQuestions, setSelectedQuestions] = useState([]) // quiz questions
  const [loading, setLoading] = useState(false)

  // fetch quiz + questions
  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        // get quiz
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

  // toggle question select/unselect
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
          {/* <div className="form-group mb-3">
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
                  <label className="form-check-label" htmlFor={`q-${q._id}`}>
                    {q.question}
                  </label>
                </div>
              ))}
            </div>
          </div> */}
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
                  <label
                    className="form-check-label"
                    htmlFor={`q-${q._id}`}
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />
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
  )
}

export default QuizEdit
