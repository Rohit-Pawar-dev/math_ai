import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilLowVision } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'

const List = () => {
  const [languages, setLanguage] = useState([])
  useEffect(function () {
    API.get('/languages') // Replace with actual API route
      .then((res) => {
        if (res.status == 200) {
          setLanguage(res.data)
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
        API.delete(`/languages/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The language has been deleted.', 'success').then(() => {
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
              <div className="searchBtn">
                <NavLink to={'/add-languages'}>
                  <button
                    className="btn btn-outline-warning active"
                    aria-current="page"
                    type="button"
                  >
                    Add Language
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="container-fliud">
              <h2>App Language</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Name</th>
                      <th>Display Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {languages.length == 0 ? (
                      <tr>
                        <td colSpan="6">No Record Found...</td>
                      </tr>
                    ) : (
                      languages.map((item, index) => (
                        <tr key={ item._id }>
                          <td>{ index + 1 }</td>
                          <td>{ item.name }</td>
                          <td>{ item.display_name }</td>
                          <td>
                            <div className="actionTable">
                              <NavLink to={'/edit-languages/' + item._id}>
                                <CIcon icon={cilPencil} custom="true" className="nav-icon" />
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
