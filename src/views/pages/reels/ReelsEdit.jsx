import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const ReelsEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: {},
    description: {},
    video_link: '',
    status: 'active',
    series: '',
  })

  const [seriesList, setSeriesList] = useState([])
  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('en')

  // Fetch reel data
  useEffect(() => {
    API.get(`/reels/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
        }
      })
      .catch((err) => console.error(err))
  }, [id])

  // Fetch languages and series
  useEffect(() => {
    API.get('/languages')
      .then((res) => {
        if (res.status === 200) {
          setLanguages(res.data)
          setActiveTab(res.data[0]?.code || 'en')
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch languages', 'error'))

    API.get('/contents')
      .then((res) => {
        if (res.status === 200) {
          const filtered = res.data.filter((item) => item.type === 'series')
          setSeriesList(filtered)
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to fetch series', 'error'))
  }, [])

  const handleChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleVideoUpload = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('type', 'reel')
    formData.append('file', file)

    try {
      const res = await API.post('/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.status === 200) {
        const fileUrl = res.data.file.replace(/\\/g, '/')
        setForm((prev) => ({ ...prev, video_link: fileUrl }))
        Swal.fire('Success', 'Video uploaded successfully', 'success')
      }
    } catch (err) {
      console.error('Video upload failed:', err)
      Swal.fire('Error', 'Failed to upload video', 'error')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    API.put(`/reels/${id}`, form)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('Success', 'Reel updated successfully', 'success').then(() => {
            navigate('/reels-list')
          })
        }
      })
      .catch((err) => {
        Swal.fire('Error', err.response?.data?.error || err.message, 'error')
      })
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Edit Reel</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="tab-buttons mb-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`btn btn-sm me-2 ${
                        activeTab === lang.code ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setActiveTab(lang.code)}
                    >
                      {lang.display_name}
                    </button>
                  ))}
                </div>

                {/* Title and Description based on active language */}
                <div className="form-group mb-3">
                  <label>Title ({activeTab})</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title?.[activeTab] || ''}
                    onChange={(e) => handleChange('title', activeTab, e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Description ({activeTab})</label>
                  <textarea
                    className="form-control"
                    value={form.description?.[activeTab] || ''}
                    onChange={(e) => handleChange('description', activeTab, e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 mt-5">
                <div className="form-group mb-3">
                  <label>Select Series</label>
                  <select
                    name="series"
                    value={form.series || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">-- Select Series --</option>
                    {seriesList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.title?.[activeTab] || s.title?.en || 'Untitled'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="form-group mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Video Upload */}
                <div className="form-group mb-3">
                  <label>Upload New Video (optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files[0])}
                  />
                  {form.video_link && (
                    <div className="mt-2">
                      <video
                        src={form.video_link}
                        controls
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-warning">
              Update Reel
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ReelsEdit
