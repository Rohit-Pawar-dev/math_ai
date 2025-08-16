import React, { useEffect, useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import customSelectStyles from '../../../assets/reactSelectStyles'

const ReelsAdd = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: {},
    description: {},
    video_link: '',
    status: 'active',
    series: [],
  })

  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('en')
  const [seriesList, setSeriesList] = useState([])

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

  const handleStatusChange = (e) => {
    setForm((prev) => ({ ...prev, status: e.target.value }))
  }

  const handleVideoUpload = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('type', 'reel') // Adjust if your backend expects a different type
    formData.append('file', file)

    try {
      const res = await API.post('/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.status === 200) {
        const fileUrl = res.data.file.replace(/\\/g, '/') // Normalize slashes
        setForm((prev) => ({ ...prev, video_link: fileUrl }))
        Swal.fire('Success', 'Video uploaded successfully', 'success')
      }
    } catch (error) {
      console.error('Video upload failed:', error)
      Swal.fire('Error', 'Failed to upload video', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/reels', form)
      if (res.status === 201 || res.status === 200) {
        Swal.fire('Success', 'Reel added successfully', 'success').then(() => {
          navigate('/reels-list')
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Failed to add reel', 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Add Reel</h5>
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

                {languages.map(
                  (lang) =>
                    activeTab === lang.code && (
                      <div key={lang.code}>
                        <div className="form-group mb-3">
                          <label>Title ({lang.code})</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.title?.[lang.code] || ''}
                            onChange={(e) => handleChange('title', lang.code, e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label>Description ({lang.code})</label>
                          <textarea
                            className="form-control"
                            value={form.description?.[lang.code] || ''}
                            onChange={(e) => handleChange('description', lang.code, e.target.value)}
                          />
                        </div>
                      </div>
                    ),
                )}
              </div>

              <div className="col-md-6 mt-5">
                <div>
                  <label for="series">Select Series</label>
                  <select
                    className="form-control"
                    name="series"
                    value={form.series || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        series: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">-- Select Series --</option>
                    {seriesList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.title[activeTab] || s.title.en || 'Untitled'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleStatusChange}
                    className="form-control"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>Upload Video</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files[0])}
                    required
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

            <button type="submit" className="btn btn-success">
              Add Reel
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ReelsAdd
