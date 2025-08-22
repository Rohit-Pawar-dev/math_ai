import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'

const NotificationList = () => {
  const [notifications, setNotifications] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchNotifications = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(
        `/notifications?limit=${limit}&offset=${offset}&search=${searchText}`,
      )
      if (res.data.status) {
        setNotifications(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchNotifications(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchNotifications(1, search)
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
        API.delete(`/notifications/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The notification has been deleted.', 'success').then(() => {
                setNotifications((prev) => prev.filter((n) => n._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the notification', 'error')
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
              <NavLink to={'/push-notification'}>
                <button className="btn btn-outline-warning active" type="button">
                  Push Notification
                </button>
              </NavLink>
            </div>
          </div>
          <div className="container-fliud">
            <h2>All Notifications</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }}>
                        No notifications found
                      </td>
                    </tr>
                  ) : (
                    notifications.map((notification, index) => (
                      <tr key={notification._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>
                          <img
                            src={notification.image || defaultImage}
                            alt="Notification"
                            width="100px"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = defaultImage
                            }}
                          />
                        </td>
                        <td>{notification.title}</td>
                        <td>{notification.description}</td>
                        <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="actionTable">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(notification._id)}
                              title="Delete Notification"
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

export default NotificationList
