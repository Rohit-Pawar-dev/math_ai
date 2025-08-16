import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilList, cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'

const List = () => {
  const [series, setSeries] = useState([])
  useEffect(function () {
    API.get('/contents') // Replace with actual API route
      .then((res) => {
        if (res.status == 200) {
          setSeries(res.data)
          console.log('series data -------- ', res.data);
          
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
        API.delete(`/contents/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The contents has been deleted.', 'success').then(() => {
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

  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox"><input placeholder="Search here" type="text"/><button className="btn btn-outline-warning active" type="button">Search</button></div>
              <div className="searchBtn">
                <NavLink to={'/add-series'}>
                  <button
                    className="btn btn-outline-warning active"
                    aria-current="page"
                    type="button"
                  >
                    Add Series
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="container-fliud">
              <h2>Series</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Total Episodes</th>
                      <th>Views</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.length == 0 ? (
                      <tr>
                        <td colSpan="6">No Record Found...</td>
                      </tr>
                    ) : (
                      series.map((item, index) => (
                        <tr key={ item._id }>
                          <td>{ index + 1 }</td>
                          <td><img src={ item.thumbnailUrl.en } width="50px" /></td>
                          <td>{ item.title.en }</td>
                          <td>{ item.episodes.length }</td>
                          <td>{ item.views }</td>
                          <td>
                            <div className="actionTable">
                              <NavLink to={'/edit-series/' + item._id}>
                                <CIcon icon={cilPencil} custom="true" className="nav-icon" title="Episodes"/>
                              </NavLink>
                              <NavLink to={'/series-episodes/' + item._id} title="Episodes">
                                <CIcon icon={cilList} custom="true" className="nav-icon" />
                              </NavLink>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(item._id)}
                                title="Delete Language"
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

export default List
