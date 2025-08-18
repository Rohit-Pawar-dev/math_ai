// import React, { useEffect, useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import CIcon from '@coreui/icons-react'
// import { cilPencil, cilTrash } from '@coreui/icons'
// import API from '../../../api'
// import Swal from 'sweetalert2'
// import eyeIcon from '../../../assets/images/eyeIcon.svg'

// const ClassList = () => {
//   const [classes, setClasses] = useState([])

//   useEffect(() => {
//     API.get('/classes')
//       .then((res) => {
//         if (res.status === 200) {
//           setClasses(res.data.data || []) // because your API returns {status, data, total...}
//         }
//       })
//       .catch((err) => console.error(err))
//   }, [])

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "This class will be deleted permanently!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         API.delete(`/classes/${id}`)
//           .then((res) => {
//             if (res.status === 200) {
//               Swal.fire('Deleted!', 'Class has been deleted.', 'success').then(() => {
//                 setClasses((prev) => prev.filter((c) => c._id !== id))
//               })
//             }
//           })
//           .catch(() => {
//             Swal.fire('Error', 'Failed to delete the class', 'error')
//           })
//       }
//     })
//   }

//   const handleStatusToggle = async (classItem) => {
//     const updatedStatus = classItem.status === 'active' ? 'inactive' : 'active'

//     try {
//       const response = await API.post('/classes', {
//         id: classItem._id,
//         status: updatedStatus,
//       })

//       if (response.status === 200) {
//         Swal.fire('Success', 'Class status updated successfully!', 'success')
//         setClasses((prev) =>
//           prev.map((c) =>
//             c._id === classItem._id ? { ...c, status: updatedStatus } : c,
//           ),
//         )
//       }
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.error || err.message, 'error')
//     }
//   }

//   return (
//     <section className="tableSection">
//       <div className="card">
//         <div className="card-body">
//           <div className="searchFeald">
//             <div className="searchBox">
//               <input type="text" placeholder="Search here" />
//               <button className="btn btn-outline-warning active" type="button">
//                 Search
//               </button>
//             </div>
//             <div className="searchBtn">
//               <NavLink to={'/class-add'}>
//                 <button className="btn btn-outline-warning active" type="button">
//                   Add Class
//                 </button>
//               </NavLink>
//             </div>
//           </div>
//           <div className="container-fliud">
//             <h2>All Classes</h2>
//             <div className="mainContent">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>SL</th>
//                     <th>Name</th>
//                     <th>Description</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {classes.length === 0 ? (
//                     <tr>
//                       <td colSpan={5}>No classes found...</td>
//                     </tr>
//                   ) : (
//                     classes.map((classItem, index) => (
//                       <tr key={classItem._id}>
//                         <td>{index + 1}</td>
//                         <td>{classItem.name}</td>
//                         <td>{classItem.description || '-'}</td>
//                         <td>
//                           <label className="switch">
//                             <input
//                               type="checkbox"
//                               onChange={() => handleStatusToggle(classItem)}
//                               checked={classItem.status === 'active'}
//                             />
//                             <span className="slider"></span>
//                           </label>
//                         </td>
//                         <td>
//                           <div className="actionTable">
//                             <NavLink to={`/class-view/${classItem._id}`}>
//                               <img src={eyeIcon} className="eyeIconClass" alt="" />
//                             </NavLink>
//                             <NavLink to={`/class-edit/${classItem._id}`}>
//                               <CIcon icon={cilPencil} custom="true" className="nav-icon" />
//                             </NavLink>
//                             <button
//                               className="btn btn-sm btn-danger"
//                               onClick={() => handleDelete(classItem._id)}
//                               title="Delete Class"
//                             >
//                               <CIcon icon={cilTrash} custom="true" className="nav-icon" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ClassList


import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const ClassList = () => {
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [limit] = useState(10) // fixed 10 per page
  const [offset, setOffset] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchClasses = () => {
    API.get(`/classes?search=${search}&limit=${limit}&offset=${offset}`)
      .then((res) => {
        if (res.status === 200) {
          setClasses(res.data.data || [])
          setTotalPages(res.data.totalPages || 0)
        }
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchClasses()
  }, [offset]) // refetch when page changes

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This class will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/classes/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'Class has been deleted.', 'success').then(() => {
                fetchClasses()
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the class', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (classItem) => {
    const updatedStatus = classItem.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await API.post('/classes', {
        _id: classItem._id, // ✅ fix to match backend
        name: classItem.name,
        description: classItem.description,
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'Class status updated successfully!', 'success')
        setClasses((prev) =>
          prev.map((c) =>
            c._id === classItem._id ? { ...c, status: updatedStatus } : c,
          ),
        )
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const handleSearch = () => {
    setOffset(0) // reset to first page
    fetchClasses()
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          <div className="searchFeald">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <NavLink to={'/class-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Class
                </button>
              </NavLink>
            </div>
          </div>

          <div className="container-fliud">
            <h2>All Classes</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No classes found...</td>
                    </tr>
                  ) : (
                    classes.map((classItem, index) => (
                      <tr key={classItem._id}>
                        <td>{offset + index + 1}</td>
                        <td>{classItem.name}</td>
                        <td>{classItem.description || '-'}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => handleStatusToggle(classItem)}
                              checked={classItem.status === 'active'}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/class-view/${classItem._id}`}>
                              <img src={eyeIcon} className="eyeIconClass" alt="" />
                            </NavLink>
                            <NavLink to={`/class-edit/${classItem._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(classItem._id)}
                              title="Delete Class"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                    disabled={offset === 0}
                  >
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {Math.floor(offset / limit) + 1} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setOffset((prev) =>
                        prev + limit < totalPages * limit ? prev + limit : prev,
                      )
                    }
                    disabled={offset + limit >= totalPages * limit}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClassList
