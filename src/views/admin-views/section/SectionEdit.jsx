import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MEDIA_URL from '../../../media'
import API from '../../../api'
import Swal from 'sweetalert2'

const EditSection = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [formData, setFormData] = useState({
    topicId: '',
    title: '',
    status: '',
    video: null
  })
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await API.get('/topic?limit=100')
        if (res.data.status) setTopics(res.data.data)
      } catch (err) { console.error(err) }
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await API.get(`/section/${id}`)
        if (res.data.status) {
          const section = res.data.data
          setFormData({
            topicId: section.topicId._id,
            title: section.title,
            status: section.status,
            video: null
          })
          setPreview(`${MEDIA_URL}/${section.video}`)
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      }
    }
    fetchSection()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, video: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('topicId', formData.topicId)
      data.append('chapterId', topics.find(t => t._id === formData.topicId)?.chapterId?._id || '')
      data.append('title', formData.title)
      data.append('status', formData.status)
      if (formData.video) data.append('video', formData.video)

      const res = await API.put(`/section/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.status) {
        Swal.fire('Success', 'Section updated successfully!', 'success')
        navigate('/section-list')
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Edit Section</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Topic</label>
              <select
                name="topicId"
                value={formData.topicId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Topic</option>
                {topics.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({t.chapterId?.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Video</label>
              <input type="file" accept="video/*" onChange={handleFileChange} className="form-control" />
              {preview && <video width="200" controls src={preview} style={{ marginTop: '10px' }} />}
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-warning">Update Section</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EditSection
