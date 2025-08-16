import React from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const PaymentManagement = () => {
  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox">
                <input type="text" placeholder="Search here" />
                <button className="btn btn-outline-warning active" aria-current="page" type="button">
                  Search
                </button>
              </div>
              <div className="searchBtn">
                <button className="btn btn-outline-secondary" type="button">
                  Export
                </button>
                <button className="btn btn-outline-warning active" aria-current="page" type="button">
                  Add User
                </button>
              </div>
            </div>
            <div className="container-fliud">
              <h2>Payment Management</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>User Name</th>
                      <th>Payment Method</th>
                      <th>Payment Amount</th>
                      <th>Payment Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>Shub Jeet</td>
                      <td>Online</td>
                      <td>5000/-</td>
                      <td>14-05-2025</td>
                      <td>
                        <div className="actionTable">
                          <NavLink to="/notification-view">
                            <CIcon icon={cilPencil} custom className="nav-icon" />
                          </NavLink>
                          <NavLink>
                            <CIcon icon={cilTrash} custom className="nav-icon" />
                          </NavLink>
                        </div>
                      </td>
                    </tr>
                    <tr>
                    <td>01</td>
                      <td>Piyush</td>
                      <td>Online</td>
                      <td>5000/-</td>
                      <td>14-05-2025</td>
                      <td>
                        <div className="actionTable">
                          <NavLink to="/notification-view">
                            <CIcon icon={cilPencil} custom className="nav-icon" />
                          </NavLink>
                          <NavLink>
                            <CIcon icon={cilTrash} custom className="nav-icon" />
                          </NavLink>
                        </div>
                      </td>
                    </tr>
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

export default PaymentManagement
