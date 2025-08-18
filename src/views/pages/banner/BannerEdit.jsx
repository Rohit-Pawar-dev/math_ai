import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const BannerEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    image: '', 
    status: 'active',
  })

  const [preview, setPreview] = useState('') 

  useEffect(() => {
    API.get(`/banners/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data.data)
          setPreview(res.data.data.image) 
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to load banner data', 'error'))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file)) 
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('status', form.status)
    if (form.image instanceof File) {
      formData.append('image', form.image) 
    }

    API.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('Success', 'Banner updated successfully', 'success').then(() =>
            navigate('/banner-list'),
          )
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to update banner', 'error'))
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Edit Banner</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
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
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
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
              Update Banner
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default BannerEdit
