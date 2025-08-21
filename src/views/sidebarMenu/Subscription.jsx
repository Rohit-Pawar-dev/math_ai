import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilLowVision } from '@coreui/icons'
import API from '../../api'
import { useNavigate } from 'react-router-dom'
import eyeIcon from '../../assets/images/eyeIcon.svg'
import Swal from 'sweetalert2'

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const limit = 10

  const fetchSubscriptions = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/subscribers?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        // filter out admin users here
        const filtered = res.data.data.filter((item) => item.user_id?.role !== 'admin')
        setSubscriptions(filtered)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchSubscriptions(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchSubscriptions(1, search)
  }

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status === 1 ? 0 : 1
    try {
      const response = await API.put(`/subscribers/${item._id}`, { status: updatedStatus })
      if (response.status === 200) {
        Swal.fire('Success', 'Status updated successfully!', 'success')
        setSubscriptions((prev) =>
          prev.map((s) => (s._id === item._id ? { ...s, status: updatedStatus } : s)),
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
                placeholder="Search by title or user name"
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

          <div className="container-fliud">
            <h2>All Subscriptions</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Plan Title</th>
                    <th>Plan Amount</th>
                    <th>User Name</th>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center' }}>
                        No subscriptions found...
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((item, index) => {
                      const plan = item.plan
                      const user = item.user
                      return (
                        <tr key={item._id}>
                          <td>{(page - 1) * limit + (index + 1)}</td>
                          <td>{plan?.title || 'N/A'}</td>
                          
                          <td>₹ {item?.amount || 'N/A'}</td>
                          <td>{user?.name || 'N/A'}</td>
                          <td>{item.transaction_id}</td>
                          <td>{item.payment_method}</td>
                          <td>{new Date(item.start_date).toLocaleDateString()}</td>
                          <td>{new Date(item.end_date).toLocaleDateString()}</td>
                          {/* <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={() => handleStatusToggle(item)}
                                checked={item.status === 1}
                              />
                              <span className="slider"></span>
                            </label>
                          </td> */}
                          <td>
                            <div className="actionTable">
                              <img
                                src={eyeIcon}
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  navigate('/view-subscriber', {
                                    state: { subscription: item },
                                  })
                                }
                                className="eyeIconClass"
                                alt="view"
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })
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

export default Subscription
