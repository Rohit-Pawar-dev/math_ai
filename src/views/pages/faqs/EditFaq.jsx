import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const EditFaq = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/faq/${id}`)
      .then((res) => {
        if (res.status === 200) {
          const faq = res.data
          setTitle(faq.title || '')
          setContent(faq.content || '')
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch FAQ:', err)
        // Swal.fire('Error', 'Failed to load FAQ data.', 'error')
        setLoading(false)
      })
  }, [id])

  const handleSubmit = () => {
    if (!title || !content) {
      Swal.fire('Validation Error', 'Please fill in all fields.', 'warning')
      return
    }

    API.put(`/faq/${id}`, { title, content })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('Success', 'FAQ updated successfully.', 'success').then(() => {
            navigate('/faq') // Redirect to FAQ list or wherever you want
          })
        }
      })
      .catch((err) => {
        console.error('Update FAQ error:', err)
        Swal.fire('Error', 'Failed to update FAQ.', 'error')
      })
  }

  const handleReset = () => {
    // Reset to original fetched data or clear form
    API.get(`/faq/${id}`)
      .then((res) => {
        if (res.status === 200) {
          const faq = res.data
          setTitle(faq.title || '')
          setContent(faq.content || '')
        }
      })
  }

  if (loading) {
    return <p>Loading FAQ data...</p>
  }

  return (
    <>
      <section className="tableSection">
        <div className="container-fliud">
          <h2>Edit FAQ</h2>
          <div className="mainContent">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-4">General Information</h6>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="faq-title" className="mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="faq-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="faq-content" className="mb-2">
                          Content
                        </label>
                        <textarea
                          className="form-control"
                          id="faq-content"
                          rows="4"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="formSubmitDiv">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button
                        className="btn btn-outline-warning active"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EditFaq
