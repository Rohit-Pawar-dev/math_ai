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
 const token = localStorage.getItem("teacher_token")?.replace(/^"|"$/g, "");

  const limit = 10

  const fetchQuizzes = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/teacher/quizzes?limit=${limit}&offset=${offset}&search=${searchText}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const [questionsRes, quizRes] = await Promise.all([
        API.get(`/questions?status=active`),
        API.get(`/quizzes/${quizId}`),
      ])

      if (questionsRes.data.status && quizRes.data.status) {
        setActiveQuestions(questionsRes.data.data)
        setSelectedQuestions(quizRes.data.data.questions.map((q) => q._id)) // pre-select
        setShowModal(true)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const handleCheckboxChange = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== id))
    } else {
      setSelectedQuestions([...selectedQuestions, id])
    }
  }

  const handleSaveQuestions = async () => {
    if (!selectedQuizId) return
    try {
      const res = await API.put(`/quizzes/${selectedQuizId}/set-questions`, {
        questions: selectedQuestions,
      })
      if (res.data.status) {
        Swal.fire('Success', 'Questions updated for quiz!', 'success')
        setShowModal(false)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }
    useEffect(() => {
      if (showModal) {
        // Wait for DOM to update, then re-typeset
        setTimeout(() => {
          if (window.MathJax) {
            window.MathJax.typesetPromise && window.MathJax.typesetPromise()
          }
        }, 0)
      }
    }, [showModal, activeQuestions, selectedQuestions])


  return (
    <section className="">
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
            <NavLink to="/teacher/quiz-add">
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
                          <NavLink to={`/teacher/quiz-view/${quiz._id}`} className="btn btn-sm btn-info text-white">
                            View
                          </NavLink>
                          <NavLink to={`/teacher/quiz-edit/${quiz._id}`} className="btn btn-sm btn-primary">
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
       {showModal && (
        <div className="modal-backdrop d-flex align-items-center justify-content-center">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>Select Questions</h4>
              <div className="question-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {activeQuestions.map((q) => (
                  <div key={q._id} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`q-${q._id}`}
                      checked={selectedQuestions.includes(q._id)}
                      onChange={() => handleCheckboxChange(q._id)}
                    />
                    <label className="form-check-label" htmlFor={`q-${q._id}`}>
                      <span dangerouslySetInnerHTML={{ __html: q.question }} />
                    </label>
                  </div>
                ))}
              </div>
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
