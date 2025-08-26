import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const EditTopic = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([])
  const [formData, setFormData] = useState({
    chapterId: '',
    title: '',
    description: '',
    status: 'active',
  })

  // fetch chapters for dropdown
  useEffect(() => {
    const fetchChapters = async () => {
      const res = await API.get('/chapter')
      if (res.data.status) setChapters(res.data.data)
    }
    fetchChapters()
  }, [])

  // fetch topic by id
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await API.get(`/topic/${id}`)
        if (res.data.status) {
          const data = res.data.data
          setFormData({
            chapterId: data.chapterId?._id || '',
            title: data.title,
            description: data.description || '',
            status: data.status,
          })
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      }
    }
    fetchTopic()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.put(`/topic/${id}`, formData)
      if (res.data.status) {
        Swal.fire('Updated!', 'Topic updated successfully', 'success')
        navigate('/topic-list')
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Edit Topic</h2>
          <form onSubmit={handleSubmit}>
            {/* Chapter */}
            <div className="mb-3">
              <label className="form-label">Chapter</label>
              <select
                className="form-select"
                name="chapterId"
                value={formData.chapterId}
                onChange={handleChange}
                required
              >
                <option value="">Select Chapter</option>
                {chapters.map((ch) => (
                  <option key={ch._id} value={ch._id}>{ch.title}</option>
                ))}
              </select>
            </div>

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

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
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

            <button type="submit" className="btn btn-warning">Update Topic</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EditTopic
