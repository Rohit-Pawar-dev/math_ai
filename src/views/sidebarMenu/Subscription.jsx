import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilLowVision } from '@coreui/icons'
import API from '../../api'
import { useNavigate } from 'react-router-dom'
import eyeIcon from '../../assets/images/eyeIcon.svg'
import Swal from 'sweetalert2'

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/subscribers')
      .then((res) => {
        if (res.status === 200) {
          const filtered = res.data.filter((item) => item.user_id[0]?.role !== 'admin')
          setSubscriptions(filtered)
          setFilteredSubscriptions(filtered)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  // Automatically filter as searchQuery changes
  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const result = subscriptions.filter((item) => {
      const title = item.plan_id?.[0]?.title?.toLowerCase() || ''
      const userName = item.user_id?.[0]?.name?.toLowerCase() || ''
      return title.includes(query) || userName.includes(query)
    })
    setFilteredSubscriptions(result)
  }, [searchQuery, subscriptions])

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status == 1 ? 0 : 1

    try {
      const response = await API.put(`/subscribers/${item._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'status updated successfully!', 'success')

        setSubscriptions((prev) =>
          prev.map((b) => (b._id === item._id ? { ...b, status: updatedStatus } : b)),
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="searchBtn">
              <button className="btn btn-outline-secondary" type="button">
                Export
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="10">No subscriptions found...</td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((item, index) => {
                      const plan = item.plan_id?.[0]
                      const user = item.user_id?.[0]
                      return (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{plan?.title || 'N/A'}</td>
                          <td>₹ {plan?.amount || 'N/A'}</td>
                          <td>{user?.name || 'N/A'}</td>
                          <td>{item.transaction_id}</td>
                          <td>{item.payment_method}</td>
                          <td>{new Date(item.start_date).toLocaleDateString()}</td>
                          <td>{new Date(item.end_date).toLocaleDateString()}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                id="toggleCheckbox"
                                onChange={() => handleStatusToggle(item)}
                                checked={item.status == 1}
                              />

                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>
                            <div className="actionTable">
                              <img
                                src={eyeIcon}
                                style={{ cursor: 'pointer' }}
                                custom="true"
                                onClick={() =>
                                  navigate('/view-subscriber', {
                                    state: { subscription: item },
                                  })
                                }
                                className="eyeIconClass"
                                alt=""
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscription
