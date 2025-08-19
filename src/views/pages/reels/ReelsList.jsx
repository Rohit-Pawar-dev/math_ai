import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const ReelsList = () => {
  const [reels, setReels] = useState([])

  useEffect(() => {
    API.get('/reels')
      .then((res) => {
        if (res.status === 200) {
          setReels(res.data)
        }
      })
      .catch((err) => console.error(err))
  }, [])

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
        API.delete(`/reels/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The reel has been deleted.', 'success').then(() => {
                setReels((prev) => prev.filter((r) => r._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the reel', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (reel) => {
    const updatedStatus = reel.status === 'active' ? 'inactive' : 'active'

    try {
      const response = await API.put(`/reels/${reel._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'Reel status updated successfully!', 'success')

        setReels((prev) =>
          prev.map((b) => (b._id === reel._id ? { ...b, status: updatedStatus } : b)),
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
              <input type="text" placeholder="Search here" />
              <button className="btn btn-outline-warning active" type="button">
                Search
              </button>
            </div>
            <div className="searchBtn">
              <NavLink to={'/reels-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Reel
                </button>
              </NavLink>
            </div>
          </div>

          <div className="container-fluid">
            <h2>All Reels</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Title (EN)</th>
                    <th>Video Link</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reels.length === 0 ? (
                    <tr>
                      <td colSpan={6}>Loading reels...</td>
                    </tr>
                  ) : (
                    reels.map((reel, index) => (
                      <tr key={reel._id}>
                        <td>{index + 1}</td>
                        <td>{reel.title?.en || '-'}</td>
                        <td>
                          <a href={reel.video_link} target="_blank" rel="noopener noreferrer">
                            View Reel
                          </a>
                        </td>
                        <td>{reel.views}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              id="toggleCheckbox"
                              onChange={() => handleStatusToggle(reel)}
                              checked={reel.status === 'active'}
                            />

                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/reels-view/${reel._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="View" />
                            </NavLink>
                            <NavLink to={`/reels-edit/${reel._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(reel._id)}
                              title="Delete Reel"
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
  )
}

export default ReelsList
