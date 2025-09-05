import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'
import defaultImage from '../../../assets/images/default.png'
import MEDIA_URL from '../../../media'

const SectionList = () => {
  const [sections, setSections] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Fetch sections with pagination and search
  const fetchSections = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/section?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setSections(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  // Debounce helper
  const debounce = (func, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => func.apply(this, args), delay)
    }
  }

  const debouncedSearch = useCallback(
    debounce((searchText) => {
      setPage(1)
      fetchSections(1, searchText)
    }, 500),
    []
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    fetchSections(page, search)
  }, [page])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This section will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/section/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Section has been deleted.', 'success')
            setSections(prev => prev.filter(s => s._id !== id))
          })
          .catch(() => Swal.fire('Error', 'Failed to delete section', 'error'))
      }
    })
  }

  const handleStatusToggle = async (section) => {
    const updatedStatus = section.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.put(`/section/${section._id}`, { status: updatedStatus })
      if (response.status === 200) {
        Swal.fire('Success', 'Section status updated successfully!', 'success')
        setSections(prev =>
          prev.map(s => (s._id === section._id ? { ...s, status: updatedStatus } : s))
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
                placeholder="Search sections..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="searchBtn">
              <NavLink to="/admin/section-add">
                <button className="btn btn-outline-warning active" type="button">
                  Add Section
                </button>
              </NavLink>
            </div>
          </div>

          <h2>All Sections</h2>
          <div className="mainContent">
            <table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Title</th>
                  <th>Topic</th>
                  <th>Chapter</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No sections found</td>
                  </tr>
                ) : (
                  sections.map((section, index) => (
                    <tr key={section._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{section.title}</td>
                      <td>{section.topicId?.title}</td>
                      <td>{section.chapterId?.title}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={section.status === 'active'}
                            onChange={() => handleStatusToggle(section)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td>
                        <div className="actionTable">
                          <NavLink to={`/admin/section-view/${section._id}`}>
                            <img src={eyeIcon} className="eyeIconClass" alt="view" />
                          </NavLink>
                          <NavLink to={`/admin/section-edit/${section._id}`}>
                            <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                          </NavLink>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(section._id)}
                            title="Delete Section"
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
    </section>
  )
}

export default SectionList
