import React from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const ContentUpload = () => {
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
              <h2>Content Upload</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Show Name</th>
                      <th>Episode</th>
                      <th>Duration</th>
                      <th>Genre</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>Dexter</td>
                      <td>05</td>
                      <td>2h 50min</td>
                      <td>Crime</td>
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
                      <td>Dexter</td>
                      <td>05</td>
                      <td>2h 50min</td>
                      <td>Crime</td>
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

export default ContentUpload
