import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'
import defaultImage from '../../../assets/images/default.png'

const BannerList = () => {
  const [banners, setBanners] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 10

  const fetchBanners = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(`/banners?limit=${limit}&offset=${offset}&search=${searchText}`)
      if (res.data.status) {
        setBanners(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchBanners(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchBanners(1, search)
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
    const updatedStatus = banner.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.put(`/banners/${banner._id}`, { status: updatedStatus })
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
              <NavLink to={'/admin/banner-add'}>
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
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        No banners found
                      </td>
                    </tr>
                  ) : (
                    banners.map((banner, index) => (
                      <tr key={banner._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>
                          <img
                            src={banner.image || defaultImage}
                            alt="Banner"
                            width="100px"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = defaultImage
                            }}
                          />
                        </td>

                        <td>{banner.title}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(banner)}
                              checked={banner.status === 'active'}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/admin/banner-view/${banner._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="view" />
                            </NavLink>
                            <NavLink to={`/admin/banner-edit/${banner._id}`}>
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

              {/* Pagination Numbers */}
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

export default BannerList;