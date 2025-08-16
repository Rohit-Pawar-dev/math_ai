import React, { useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const AddFaq = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const Navigate = useNavigate()
  const handleSubmit = () => {
    if (!title || !content) {
      Swal.fire('Validation Error', 'Please fill in all fields.', 'warning')
      return
    }

    API.post('/faq', { title, content })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Swal.fire('Success', 'FAQ added successfully.', 'success').then(() => {
            Navigate('/faq') 
          })
        }
      })
      .catch((err) => {
        // console.error('Add FAQ error:', err)
        Swal.fire('Error', 'Failed to add FAQ.', 'error')
      })
  }

  const handleReset = () => {
    setTitle('')
    setContent('')
  }

  return (
    <>
      <section className="tableSection">
        <div className="container-fliud">
          <h2>Add FAQ</h2>
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
                        aria-current="page"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Add FAQ
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

export default AddFaq
