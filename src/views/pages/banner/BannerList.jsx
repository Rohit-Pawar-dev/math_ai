import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const BannerList = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    API.get('/banners')
      .then((res) => {
        if (res.status === 200) {
          setBanners(res.data)
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
        API.delete(`/banners/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The banner has been deleted.', 'success').then(() => {
                setBanners((prev) => prev.filter((b) => b._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the banner', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (banner) => {
    const updatedStatus = banner.status == 1 ? 0 : 1

    try {
      const response = await API.put(`/banners/${banner._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'Banner status updated successfully!', 'success')
        setBanners((prev) =>
          prev.map((b) => (b._id === banner._id ? { ...b, status: updatedStatus } : b)),
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
              <NavLink to={'/banner-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Banner
                </button>
              </NavLink>
            </div>
          </div>
          <div className="container-fliud">
            <h2>All Banners</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.length === 0 ? (
                    <tr>
                      <td colSpan={5}>Loading banners...</td>
                    </tr>
                  ) : (
                    banners.map((banner, index) => (
                      <tr key={banner._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={banner.image?.en} alt="Banner" width="100px" />
                        </td>
                        <td>{banner.title?.en || '-'}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(banner)}
                              checked={banner.status == 1}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/banner-view/${banner._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="" />
                            </NavLink>
                            <NavLink to={`/banner-edit/${banner._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(banner._id)}
                              title="Delete Banner"
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

export default BannerList
