// import React, { useEffect, useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import CIcon from '@coreui/icons-react'
// import { cilPencil, cilTrash } from '@coreui/icons'
// import API from '../../../api'
// import Swal from 'sweetalert2'

// const QuizList = () => {
//   const [quizzes, setQuizzes] = useState([])
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const [activeQuestions, setActiveQuestions] = useState([]) // all active questions
//   const [selectedQuestions, setSelectedQuestions] = useState([]) // user selected
//   const [selectedQuizId, setSelectedQuizId] = useState(null) // quiz being updated
//   const [showModal, setShowModal] = useState(false)

//   const limit = 10

//   const fetchQuizzes = async (pageNo = 1, searchText = '') => {
//     try {
//       const offset = (pageNo - 1) * limit
//       const res = await API.get(`/quizzes?limit=${limit}&offset=${offset}&search=${searchText}`)
//       if (res.data.status) {
//         setQuizzes(res.data.data)
//         setTotalPages(res.data.totalPages)
//       }
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//     }
//   }

//   useEffect(() => {
//     fetchQuizzes(page, search)
//   }, [page])

//   const handleSearch = () => {
//     setPage(1)
//     fetchQuizzes(1, search)
//   }

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "This action cannot be undone!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         API.delete(`/quizzes/${id}`)
//           .then(() => {
//             Swal.fire('Deleted!', 'The quiz has been deleted.', 'success')
//             setQuizzes((prev) => prev.filter((q) => q._id !== id))
//           })
//           .catch(() => {
//             Swal.fire('Error', 'Failed to delete the quiz', 'error')
//           })
//       }
//     })
//   }

//   const handleStatusToggle = async (quiz) => {
//     const updatedStatus = quiz.status === 'active' ? 'inactive' : 'active'
//     try {
//       await API.put(`/quizzes/${quiz._id}`, { status: updatedStatus })
//       setQuizzes((prev) =>
//         prev.map((q) => (q._id === quiz._id ? { ...q, status: updatedStatus } : q)),
//       )
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//     }
//   }

//   const handleAddQuestionClick = async (quizId) => {
//     setSelectedQuizId(quizId)
//     setSelectedQuestions([])

//     try {
//       const res = await API.get(`/questions?status=active`)
//       if (res.data.status) {
//         setActiveQuestions(res.data.data)
//         setShowModal(true)
//       }
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//     }
//   }

//   const handleSaveQuestions = async () => {
//     if (!selectedQuizId) return
//     try {
//       const res = await API.put(`/quizzes/${selectedQuizId}/add-questions`, {
//         questions: selectedQuestions,
//       })
//       if (res.data.status) {
//         Swal.fire('Success', 'Questions added to quiz!', 'success')
//         setShowModal(false)
//       }
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || err.message, 'error')
//     }
//   }

//   return (
//     <section className="tableSection">
//       <div className="card">
//         <div className="card-body">
//           {/* Search + Add Quiz */}
//           <div className="searchFeald">
//             <div className="searchBox">
//               <input
//                 type="text"
//                 placeholder="Search quiz"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <button className="btn btn-outline-warning active" onClick={handleSearch}>
//                 Search
//               </button>
//             </div>
//             <div className="searchBtn">
//               <NavLink to="/quiz-add">
//                 <button className="btn btn-outline-warning active">Add Quiz</button>
//               </NavLink>
//             </div>
//           </div>

//           {/* Quiz Table */}
//           <div className="container-fluid">
//             <h2>All Quizzes</h2>
//             <div className="mainContent">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>SL</th>
//                     <th>Title</th>
//                     <th>Description</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quizzes.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} style={{ textAlign: 'center' }}>
//                         No quizzes found
//                       </td>
//                     </tr>
//                   ) : (
//                     quizzes.map((quiz, index) => (
//                       <tr key={quiz._id}>
//                         <td>{(page - 1) * limit + index + 1}</td>
//                         <td>{quiz.title}</td>
//                         <td>{quiz.description}</td>
//                         <td>
//                           <label className="switch">
//                             <input
//                               type="checkbox"
//                               onChange={() => handleStatusToggle(quiz)}
//                               checked={quiz.status === 'active'}
//                             />
//                             <span className="slider"></span>
//                           </label>
//                         </td>
//                         <td>
//                           <div className="actionTable">
//                             <NavLink to={`/quiz-edit/${quiz._id}`}>
//                               <CIcon icon={cilPencil} className="nav-icon" />
//                             </NavLink>
//                             <button
//                               className="btn btn-sm btn-danger"
//                               onClick={() => handleDelete(quiz._id)}
//                             >
//                               <CIcon icon={cilTrash} className="nav-icon" />
//                             </button>
//                             <button
//                               className="btn btn-sm btn-warning"
//                               onClick={() => handleAddQuestionClick(quiz._id)}
//                             >
//                               Add Question
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>

//               {/* Pagination */}
//               <div className="paginationControls">
//                 <button
//                   className="btn btn-outline-secondary"
//                   disabled={page === 1}
//                   onClick={() => setPage(page - 1)}
//                 >
//                   Prev
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i + 1}
//                     className={`btn ${page === i + 1 ? 'btn-warning' : 'btn-outline-secondary'}`}
//                     onClick={() => setPage(i + 1)}
//                     style={{ margin: '0 5px' }}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   className="btn btn-outline-secondary"
//                   disabled={page === totalPages}
//                   onClick={() => setPage(page + 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal-dialog">
//             <div className="modal-content p-3">
//               <h4>Select Questions</h4>
//               <select
//                 multiple
//                 className="form-control"
//                 value={selectedQuestions}
//                 onChange={(e) =>
//                   setSelectedQuestions([...e.target.selectedOptions].map((o) => o.value))
//                 }
//                 style={{ height: '250px' }}
//               >
//                 {activeQuestions.map((q) => (
//                   <option key={q._id} value={q._id}>
//                     {q.question}
//                   </option>
//                 ))}
//               </select>
//               <div className="mt-3 text-end">
//                 <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-success" onClick={handleSaveQuestions}>
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }

// export default QuizList
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [activeQuestions, setActiveQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [selectedQuizId, setSelectedQuizId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const limit = 10

  const fetchQuizzes = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/quizzes?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setQuizzes(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchQuizzes(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchQuizzes(1, search)
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/quizzes/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'The quiz has been deleted.', 'success')
            setQuizzes((prev) => prev.filter((q) => q._id !== id))
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the quiz', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (quiz) => {
    const updatedStatus = quiz.status === 'active' ? 'inactive' : 'active'
    try {
      await API.put(`/quizzes/${quiz._id}`, { status: updatedStatus })
      setQuizzes((prev) =>
        prev.map((q) => (q._id === quiz._id ? { ...q, status: updatedStatus } : q)),
      )
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const handleAddQuestionClick = async (quizId) => {
    setSelectedQuizId(quizId)
    setSelectedQuestions([])

    try {
      const res = await API.get(`/questions?status=active`)
      if (res.data.status) {
        setActiveQuestions(res.data.data)
        setShowModal(true)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const handleSaveQuestions = async () => {
    if (!selectedQuizId) return
    try {
      const res = await API.put(`/quizzes/${selectedQuizId}/add-questions`, {
        questions: selectedQuestions,
      })
      if (res.data.status) {
        Swal.fire('Success', 'Questions added to quiz!', 'success')
        setShowModal(false)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <section className="container mt-4">
      <div className="card">
        <div className="card-body">

          {/* Search and Add */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search quiz"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-warning" onClick={handleSearch}>
                Search
              </button>
            </div>
            <NavLink to="/quiz-add">
              <button className="btn btn-warning">Add Quiz</button>
            </NavLink>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <h4>All Quizzes</h4>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>SL</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No quizzes found
                    </td>
                  </tr>
                ) : (
                  quizzes.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{quiz.title}</td>
                      <td>{quiz.description}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={() => handleStatusToggle(quiz)}
                            checked={quiz.status === 'active'}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <NavLink to={`/quiz-view/${quiz._id}`} className="btn btn-sm btn-info text-white">
                            View
                          </NavLink>
                          <NavLink to={`/quiz-edit/${quiz._id}`} className="btn btn-sm btn-primary">
                            <CIcon icon={cilPencil} />
                          </NavLink>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(quiz._id)}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                          <button
                            className="btn btn-sm btn-warning text-white"
                            onClick={() => handleAddQuestionClick(quiz._id)}
                          >
                            Add Question
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-secondary me-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`btn ${page === i + 1 ? 'btn-warning' : 'btn-outline-secondary'} mx-1`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding questions */}
      {showModal && (
        <div className="modal-backdrop d-flex align-items-center justify-content-center">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>Select Questions</h4>
              <select
                multiple
                className="form-control"
                value={selectedQuestions}
                onChange={(e) =>
                  setSelectedQuestions([...e.target.selectedOptions].map((o) => o.value))
                }
                style={{ height: '250px' }}
              >
                {activeQuestions.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.question}
                  </option>
                ))}
              </select>
              <div className="mt-3 text-end">
                <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSaveQuestions}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default QuizList
