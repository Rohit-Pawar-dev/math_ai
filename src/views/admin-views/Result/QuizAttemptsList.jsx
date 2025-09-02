import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const QuizAttemptsList = () => {
  const { quizId } = useParams()
  const [attempts, setAttempts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  const fetchAttempts = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/quiz/${quizId}/attempts?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.status === 200) {
        const { data, totalPages } = res.data
        setAttempts(data)
        setTotalPages(totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchAttempts(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchAttempts(1, search)
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          <div className="searchFeald mb-3">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by user name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="btn btn-outline-warning active"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="container-fluid">
            <h2>Quiz Attempts</h2>
            <div className="mainContent">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Passed</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center' }}>
                        No attempts found
                      </td>
                    </tr>
                  ) : (
                    attempts.map((attempt, index) => (
                      <tr key={attempt._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{attempt.user?.name || '-'}</td>
                        <td>{attempt.user?.email || '-'}</td>
                        <td>{attempt.quiz?.title || '-'}</td>
                        <td>{attempt.score} / {attempt.totalQuestions}</td>
                        <td>{attempt.percentage?.toFixed(2)}%</td>
                        <td>
                          <span className={`badge ${attempt.passed ? 'bg-success' : 'bg-danger'}`}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td>{new Date(attempt.completedAt || attempt.created_at).toLocaleString()}</td>
                        <td>
                          <NavLink to={`/admin/quiz-result/${attempt._id}`}>
                            {/* <img src={eyeIcon} alt="View Result" width="20" /> */}
                              <i className="fa fa-eye"></i>
                          </NavLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="paginationControls mt-3">
                <button
                  className="btn btn-outline-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1
                  return (
                    <button
                      key={pageNumber}
                      className={`btn ${
                        page === pageNumber ? 'btn-warning' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setPage(pageNumber)}
                      style={{ margin: '0 5px' }}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                <button
                  className="btn btn-outline-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizAttemptsList
