import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'

const AddChapter = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    // description: '',
    status: 'active',
    icon: null, // will store File object here
  })

  const [preview, setPreview] = useState(defaultImage)

  // handle text input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // handle file input
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, icon: file })
      setPreview(URL.createObjectURL(file)) // just for preview
    }
  }

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      // formDataToSend.append('description', formData.description)
      formDataToSend.append('status', formData.status)

      if (formData.icon) {
        formDataToSend.append('icon', formData.icon) // actual file
      }

      const res = await API.post('/chapter', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data.status) {
        Swal.fire('Success', 'Chapter added successfully!', 'success')
        navigate('/admin/chapter-list')
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Add New Chapter</h2>
          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div> */}

            {/* Icon Upload */}
            <div className="mb-3">
              <label className="form-label">Icon</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div style={{ marginTop: '10px' }}>
                <img src={preview} alt="Preview" width="100px" />
              </div>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-warning">
              Save Chapter
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AddChapter
