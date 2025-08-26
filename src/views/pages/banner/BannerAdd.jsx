import React, { useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const BannerAdd = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    status: 'active',
  })
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    setImageFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('status', form.status)
      if (imageFile) formData.append('image', imageFile)

      const res = await API.post('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.status === 201) {
        Swal.fire('Success', 'Banner added successfully', 'success').then(() =>
          navigate('/banner-list'),
        )
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Failed to add banner', 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Add Banner</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Image</label>
              <input
                type="file"
                className="form-control mt-2"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                required
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-2"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              )}
            </div>

            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Add Banner
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default BannerAdd
