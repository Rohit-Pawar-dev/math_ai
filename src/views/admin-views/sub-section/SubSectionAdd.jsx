import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const SubsectionAdd = () => {
  const [form, setForm] = useState({
    title: '',
    sectionId: '',
    chapterId: '',
    topicId: '',
    content: '',
    status: 'active',
  })
  const [sections, setSections] = useState([])
  const navigate = useNavigate()

  // Fetch all sections
  useEffect(() => {
    API.get('/section?limit=100')
      .then((res) => {
        if (res.data.status) {
          setSections(res.data.data)
        }
      })
      .catch((err) =>
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      )
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSectionChange = (e) => {
    const sectionId = e.target.value
    const selectedSection = sections.find((s) => s._id === sectionId)

    if (selectedSection) {
      setForm({
        ...form,
        sectionId: sectionId,
        chapterId: selectedSection.chapterId?._id || '',
        topicId: selectedSection.topicId?._id || '',
      })
    } else {
      setForm({
        ...form,
        sectionId: '',
        chapterId: '',
        topicId: '',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/subsection', form)
      if (res.data.status) {
        Swal.fire('Success', 'Subsection added successfully!', 'success')
        navigate('/admin/subsection-list')
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2>Add Subsection</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Section Dropdown */}
          <div className="mb-3">
            <label>Section</label>
            <select
              name="sectionId"
              value={form.sectionId}
              onChange={handleSectionChange}
              className="form-select"
              required
            >
              <option value="">-- Select Section --</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="mb-3">
            <label>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Status */}
          <div className="mb-3">
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

          <button type="submit" className="btn btn-warning">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubsectionAdd

