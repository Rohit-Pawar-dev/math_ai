import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilLowVision } from '@coreui/icons'
import Swal from 'sweetalert2'
import eyeIcon from '../../assets/images/eyeIcon.svg'

import API from '../../api'

const ProfileManagement = () => {
  const [lists, setList] = useState([])
  const navigate = useNavigate()
  // console.log('lists -- ', lists);

  useEffect(() => {
    API.get('/users')
      .then((res) => {
        if (res.status == 200) {
          setList(res.data)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const handleStatusToggle = async (user) => {
    const updatedStatus = user.status == 1 ? 0 : 1

    try {
      const response = await API.put(`/plan/${user._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'user status updated successfully!', 'success')

        setList((prev) =>
          prev.map((b) => (b._id === user._id ? { ...b, status: updatedStatus } : b)),
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
                      <th>User Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lists
                      .filter((user) => user.role !== 'admin')
                      .map((user, ind) => (
                        <tr key={ind}>
                          <td>{ind + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.mobile}</td>
                          <td>{user.email}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                id="toggleCheckbox"
                                onChange={() => handleStatusToggle(user)}
                                checked={user.status == 1}
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
                                <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                              </NavLink>
                              <NavLink to={'/view-user/' + user._id}>
                               <img src={eyeIcon} className='eyeIconClass' alt=""/>
                              </NavLink>
                            </div>
                          </td>
                        </tr>
                      ))}
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

export default ProfileManagement
