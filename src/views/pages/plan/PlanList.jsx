import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const PlanList = () => {
  const [plans, setPlans] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchPlans = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/plan?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setPlans(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchPlans(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchPlans(1, search)
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
        API.delete(`/plan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The plan has been deleted.', 'success').then(() => {
                setPlans((prev) => prev.filter((p) => p._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the plan', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status === 1 ? 0 : 1
    try {
      const response = await API.put(`/plan/${item._id}`, { status: updatedStatus })
      if (response.status === 200) {
        Swal.fire('Success', 'Plan status updated successfully!', 'success')
        setPlans((prev) =>
          prev.map((p) => (p._id === item._id ? { ...p, status: updatedStatus } : p)),
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
              <NavLink to={'/plan-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Plan
                </button>
              </NavLink>
            </div>
          </div>

          <div className="container-fliud">
            <h2>All Subscriptions</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No plans found
                      </td>
                    </tr>
                  ) : (
                    plans.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>
                          <span className="badge bg-warning">₹ {item.amount}</span>
                        </td>
                        <td>
                          <span className="badge bg-danger">
                            {item.validity_time} {item.validity_type}
                          </span>
                        </td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(item)}
                              checked={item.status === 1}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/plan-edit/${item._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <NavLink to={`/plan-view/${item._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="view" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item._id)}
                              title="Delete Plan"
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

              {/* Pagination Controls */}
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

export default PlanList
