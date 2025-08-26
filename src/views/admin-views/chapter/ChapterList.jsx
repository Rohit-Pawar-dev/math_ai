import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'
import defaultImage from '../../../assets/images/default.png'
import MEDIA_URL from '../../../media'

const ChapterList = () => {
  const [chapters, setChapters] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchChapters = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/chapter?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setChapters(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  // Debounce helper
  const debounce = (func, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  // debounce fetchChapters
  const debouncedSearch = useCallback(debounce((searchText) => {
    setPage(1)
    fetchChapters(1, searchText)
  }, 500), []) // 500ms delay

  useEffect(() => {
    fetchChapters(page, search)
  }, [page])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This chapter will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/chapter/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The chapter has been deleted.', 'success').then(() => {
                setChapters((prev) => prev.filter((c) => c._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the chapter', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (chapter) => {
    const updatedStatus = chapter.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.put(`/chapter/${chapter._id}`, { status: updatedStatus })
      if (response.status === 200) {
        Swal.fire('Success', 'Chapter status updated successfully!', 'success')
        setChapters((prev) =>
          prev.map((c) => (c._id === chapter._id ? { ...c, status: updatedStatus } : c)),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error')
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          <div className="searchFeald">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="searchBtn">
              <NavLink to={'/chapter-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Chapter
                </button>
              </NavLink>
            </div>
          </div>
          <div className="container-fliud">
            <h2>All Chapters</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        No chapters found
                      </td>
                    </tr>
                  ) : (
                    chapters.map((chapter, index) => (
                      <tr key={chapter._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>
                          <img
                            src={chapter.icon ? `${MEDIA_URL}/${chapter.icon}` : defaultImage}
                            alt="Chapter Icon"
                            width="60px"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = defaultImage
                            }}
                          />
                        </td>
                        <td>{chapter.title}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(chapter)}
                              checked={chapter.status === 'active'}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/chapter-view/${chapter._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="view" />
                            </NavLink>
                            <NavLink to={`/chapter-edit/${chapter._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(chapter._id)}
                              title="Delete Chapter"
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

              {/* Pagination Numbers */}
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
  )
}

export default ChapterList

