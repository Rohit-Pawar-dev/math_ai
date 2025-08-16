import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilLowVision } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const GenreList = () => {
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])

  useEffect(() => {
    API.get('/genre')
      .then((res) => {
        if (res.status === 200) {
          setGenres(res.data)

          // Extract all language codes dynamically
          const langs = new Set()
          res.data.forEach((genre) => {
            if (genre.title) {
              Object.keys(genre.title).forEach((lang) => langs.add(lang))
            }
          })
          setLanguages(Array.from(langs))
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
        API.delete(`/genre/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The genre has been deleted.', 'success').then(() => {
                setGenres((prev) => prev.filter((g) => g._id !== id))
              })
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the genre', 'error')
          })
      }
    })
  }

  const handleStatusToggle = async (genre) => {
    const updatedStatus = genre.status == 1 ? 0 : 1 // use == to avoid type issues

    try {
      const response = await API.put(`/genre/${genre._id}`, {
        status: updatedStatus,
      })

      if (response.status === 200) {
        Swal.fire('Success', 'genre status updated successfully!', 'success')

        setGenres((prev) =>
          prev.map((b) => (b._id === genre._id ? { ...b, status: updatedStatus } : b)),
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
              {/* <button className="btn btn-outline-secondary" type="button">
                Export
              </button> */}
              <NavLink to={'/genre-add'}>
                <button className="btn btn-outline-warning active" type="button">
                  Add Genre
                </button>
              </NavLink>
            </div>
          </div>
          <div className="container-fliud">
            <h2>All Genres</h2>
            <div className="mainContent">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Display Name</th>
                    {languages.map((lang) => (
                      <th key={lang}>Title ({lang.toUpperCase()})</th>
                    ))}
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.length === 0 ? (
                    <tr>
                      <td colSpan={4 + languages.length}>Loading genres...</td>
                    </tr>
                  ) : (
                    genres.map((genre, index) => (
                      <tr key={genre._id}>
                        <td>{index + 1}</td>
                        <td>{genre.display_name}</td>
                        {languages.map((lang) => (
                          <td key={lang}>{genre.title?.[lang] || '-'}</td>
                        ))}

                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              id="toggleCheckbox"
                              onChange={() => handleStatusToggle(genre)}
                              checked={genre.status == 1}
                            />

                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={`/genre-view/${genre._id}`}>
                              <img src={eyeIcon} className='eyeIconClass' alt=""/>
                            </NavLink>
                            <NavLink to={`/genre-edit/${genre._id}`}>
                              <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                            </NavLink>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(genre._id)}
                              title="Delete Genre"
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

export default GenreList
