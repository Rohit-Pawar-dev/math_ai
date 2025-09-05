import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../api'
import Swal from 'sweetalert2'

const Faq = () => {
  const [faqs, setFaqs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    API.get('/faq') // GET request to /api/faq
      .then((res) => {
        if (res.status === 200) {
          setFaqs(res.data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch FAQs:', err)
      })
  }, [])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action can't be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/faq/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire('Deleted!', 'The FAQ has been deleted.', 'success')
              setFaqs(faqs.filter((faq) => faq._id !== id)) // Update state
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete the FAQ', 'error')
          })
      }
    })
  }

  // Filter FAQs based on search term (case insensitive)
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="searchFeald">
              <div className="searchBox">
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-warning active" type="button">
                  Search
                </button>
              </div>
              <div className="searchBtn">
                {/* <button className="btn btn-outline-secondary" type="button">
                  Export
                </button> */}
                <NavLink to="/admin/add-faq">
                  <button className="btn btn-outline-warning active" type="button">
                    Add FAQ
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="container-fliud">
              <h2>Frequently Asked Questions</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Question</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaqs.length === 0 ? (
                      <tr>
                        <td colSpan="4">No FAQs found.</td>
                      </tr>
                    ) : (
                      filteredFaqs.map((faq, index) => (
                        <tr key={faq._id}>
                          <td>{index + 1}</td>
                          <td>{faq.title}</td>
                          <td>{faq.content}</td>
                          <td>
                            <div className="actionTable">
                              <NavLink to={`/admin/edit-faq/${faq._id}`}>
                                <CIcon icon={cilPencil} custom className="nav-icon" />
                              </NavLink>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(faq._id)}
                                title="Delete FAQ"
                              >
                                <CIcon icon={cilTrash} custom className="nav-icon" />
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

export default Faq
