import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const ClassList = () => {
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchClasses = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(
        `/classes?search=${searchText}&limit=${limit}&offset=${offset}`,
      )
      if (res.status === 200) {
        setClasses(res.data.data || [])
        setTotalPages(res.data.totalPages || 1)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchClasses(page, search)
  }, [page])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This class will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/classes/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'Class has been deleted.', 'success').then(() => {
                fetchClasses(page, search)
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the class', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (classItem) => {
    const updatedStatus = classItem.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.post('/classes', {
        _id: classItem._id, 
        name: classItem.name,
        description: classItem.description,
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'Class status updated successfully!', 'success')
        setClasses((prev) =>
          prev.map((c) =>
            c._id === classItem._id ? { ...c, status: updatedStatus } : c,
          ),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchClasses(1, search)
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          <div className="searchFeald">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by name"
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
            <div className="searchBtn">
              <NavLink to={'/admin/class-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Class
                </button>
              </NavLink>
            </div>
          </div>

          <div className="container-fliud">
            <h2>All Classes</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No classes found...</td>
                    </tr>
                  ) : (
                    classes.map((classItem, index) => (
                      <tr key={classItem._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{classItem.name}</td>
                        <td>{classItem.description || '-'}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(classItem)}
                              checked={classItem.status === 'active'}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/admin/class-view/${classItem._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="view" />
                            </NavLink>
                            <NavLink to={`/admin/class-edit/${classItem._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(classItem._id)}
                              title="Delete Class"
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

export default ClassList
