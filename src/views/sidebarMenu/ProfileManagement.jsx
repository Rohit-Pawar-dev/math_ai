import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import Swal from 'sweetalert2'
import eyeIcon from '../../assets/images/eyeIcon.svg'
import API from '../../api'
import defaultImage from '../../assets/images/default.png' // ✅ added default image

const ProfileManagement = () => {
  const [lists, setList] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const limit = 10

  // Fetch users
  const fetchUsers = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/users?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setList(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchUsers(page, search)
  }, [page])

  const handleStatusToggle = async (user) => {
    const updatedStatus = user.status === 'active' ? 'inactive' : 'active'

    try {
      const response = await API.put(`/users/${user._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'User status updated successfully!', 'success')
        setList((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: updatedStatus } : u)),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error')
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchUsers(1, search)
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
        API.delete(`/users/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'User has been deleted.', 'success').then(() => {
                setList((prev) => prev.filter((u) => u._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the user', 'error')
          })
      }
    })
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          <div className="searchFeald">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search here"
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
              <NavLink to={'/user-add'}>
                <button
                  className="btn btn-outline-warning active"
                  aria-current="page"
                  type="button"
                >
                  Add User
                </button>
              </NavLink>
            </div>
          </div>
          <div className="container-fliud">
            <h2>All User list</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Image</th> 
                    <th>User Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lists && lists.length > 0 ? (
                    lists
                      .filter((user) => user.role !== 'admin')
                      .map((user, ind) => (
                        <tr key={user._id}>
                          <td>{(page - 1) * limit + (ind + 1)}</td>
                          <td>
                            <img
                              src={user.profilePicture || defaultImage}
                              alt="User"
                              width="100px"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = defaultImage
                              }}
                            />
                          </td>
                          <td>{user.name}</td>
                          <td>{user.mobile}</td>
                          <td>{user.email}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                id="toggleCheckbox"
                                onChange={() => handleStatusToggle(user)}
                                checked={user.status === 'active'}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>
                            <div className="actionTable">
                              <NavLink
                                onClick={(e) => {
                                  e.preventDefault()
                                  navigate('/users/' + user._id)
                                }}
                              >
                                <CIcon icon={cilPencil} className="nav-icon" />
                              </NavLink>
                              <NavLink to={'/view-user/' + user._id}>
                                <img src={eyeIcon} className="eyeIconClass" alt="view" />
                              </NavLink>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(user._id)}
                                title="Delete User"
                                style={{ marginLeft: '10px' }}
                              >
                                <CIcon icon={cilTrash} className="nav-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="paginationControls">
                <button
                  className="btn btn-outline-secondary"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default ProfileManagement
