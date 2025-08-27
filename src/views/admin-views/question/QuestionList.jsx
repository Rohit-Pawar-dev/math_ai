import React, { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'
import { MathJax, MathJaxContext } from "better-react-mathjax"


const processDescription = (desc) => {
  let processed = desc.replace(/([^\s]*[\^_][^\s]*)/g, (match) => {
    if (/^\$.*\$$/.test(match)) return match;
    return `$${match}$`;
  });
  processed = processed.replace(/\n/g, " \\\\ ");
  return processed;
};

const mathjaxConfig = {
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
}
const QuestionList = () => {
  const [questions, setQuestions] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchQuestions = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/questions?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setQuestions(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchQuestions(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchQuestions(1, search)
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/questions/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The question has been deleted.', 'success').then(() => {
                setQuestions((prev) => prev.filter((q) => q._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the question', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (question) => {
    const updatedStatus = question.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.put(`/questions/${question._id}`, { status: updatedStatus })
      if (response.status === 200) {
        Swal.fire('Success', 'Question status updated successfully!', 'success')
        setQuestions((prev) =>
          prev.map((q) => (q._id === question._id ? { ...q, status: updatedStatus } : q)),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <MathJaxContext config={mathjaxConfig}>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox">
                <input
                  type="text"
                  placeholder="Search question"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-warning active" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <div className="searchBtn">
                <NavLink to="/question-add">
                  <button className="btn btn-outline-warning active">Add Question</button>
                </NavLink>
              </div>
            </div>

            <div className="container-fluid">
              <h2>All Questions</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Question</th>
                      <th>Answer option</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          No questions found
                        </td>
                      </tr>
                    ) : (
                      questions.map((question, index) => (
                        <tr key={question._id}>
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>
                            <MathJax dynamic>{processDescription(question.question)}</MathJax>
                          </td>
                          <td>{question.answer + 1}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={() => handleStatusToggle(question)}
                                checked={question.status === 'active'}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>
                            <div className="actionTable">
                              <NavLink to={`/question-view/${question._id}`}>
                                <img src={eyeIcon} className="eyeIconClass" alt="view" />
                              </NavLink>
                              <NavLink to={`/question-edit/${question._id}`}>
                                <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                              </NavLink>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(question._id)}
                                title="Delete Question"
                              >
                                <CIcon icon={cilTrash} custom="true" className="nav-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="paginationControls">
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
                        className={`btn ${page === pageNumber ? 'btn-warning' : 'btn-outline-secondary'}`}
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
    </MathJaxContext>
  )
}

export default QuestionList
