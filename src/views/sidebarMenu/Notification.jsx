import React from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass, cilPencil, cilTrash } from '@coreui/icons'

const Notification = () => {
  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox">
                <input type="text" placeholder="Search here" />
                <button class="btn btn-outline-warning active" aria-current="page" type="button">
                  Search
                </button>
              </div>
              <div className="searchBtn">
                <button class="btn btn-outline-secondary" type="button">
                  Export
                </button>
                <button class="btn btn-outline-warning active" aria-current="page" type="button">
                  Add User
                </button>
              </div>
            </div>
            <div className="container-fliud">
              <h2>All Notifications</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Notification count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>Booking Confirm</td>
                      <td>You booked succesfully</td>
                      <td>Image</td>
                      <td>01</td>
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
                      <td>02</td>
                      <td>Booking Confirm</td>
                      <td>You booked succesfully</td>
                      <td>Image</td>
                      <td>05</td>
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

export default Notification
