import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilLowVision } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const PlanList = () => {
  const [plans, setPlan] = useState([])

  useEffect(function () {
    API.get('/plan') // Replace with actual API route
      .then((res) => {
        // console.log('res ---------------- ', res, res.status)
        if (res.status == 200) {
          setPlan(res.data)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  // console.log('lists -------- ', plans)

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
                window.location.reload()
              })
            }
          })
          .catch((err) => {
            // console.error(err)
            Swal.fire('Error', 'Failed to delete the plan', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status == 1 ? 0 : 1

    try {
      const response = await API.put(`/plan/${item._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'item status updated successfully!', 'success')

        setPlan((prev) =>
          prev.map((b) => (b._id === item._id ? { ...b, status: updatedStatus } : b)),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error')
    }
  }

  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox">
                <input type="text" placeholder="Search here" />
                <button
                  className="btn btn-outline-warning active"
                  aria-current="page"
                  type="button"
                >
                  Search
                </button>
              </div>
              <div className="searchBtn">
                {/* <button className="btn btn-outline-secondary" type="button">
                  Export
                </button> */}
                <NavLink to={'/plan-add'}>
                  <button
                    className="btn btn-outline-warning active"
                    aria-current="page"
                    type="button"
                  >
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
                      <th>Benefit</th>
                      <th>Amount</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length == 0 ? (
                      <tr>
                        <td colSpan="6">Loading plans...</td>
                      </tr>
                    ) : (
                      plans.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.description}</td>
                          <td>
                            <span className="badge bg-primary">{item.coins} Coins</span>
                          </td>
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
                                id="toggleCheckbox"
                                onChange={() => handleStatusToggle(item)}
                                checked={item.status == 1}
                              />

                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>
                            <div className="actionTable">
                              <NavLink to={'/plan-edit/' + item._id}>
                                <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                              </NavLink>
                              <NavLink to={'/plan-view/' + item._id}>
                               <img src={eyeIcon} className='eyeIconClass' alt=""/>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PlanList
