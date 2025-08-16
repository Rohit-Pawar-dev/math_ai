import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import Select from 'react-select'
import customSelectStyles from '../../../assets/reactSelectStyles'

const BannerEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: {},
    image: {},
    status: 'active',
    series: [],
    type: 'custom',
  })

  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('en')
  const [seriesList, setSeriesList] = useState([])

  useEffect(() => {
    API.get(`/banners/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to load banner data', 'error'))

    API.get('/languages')
      .then((res) => {
        if (res.status === 200) {
          setLanguages(res.data)
          setActiveTab(res.data[0]?.code || 'en')
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to load languages', 'error'))

    API.get('/contents')
      .then((res) => {
        if (res.status === 200) {
          const filtered = res.data.filter((item) => item.type === 'series')
          setSeriesList(filtered)
        }
      })
      .catch(() => Swal.fire('Error', 'Failed to load series', 'error'))
  }, [id])

  const handleTitleChange = (lang, value) => {
    setForm((prev) => ({
      ...prev,
      title: { ...prev.title, [lang]: value },
    }))
  }

  const handleImageUpload = async (lang, file) => {
    if (!file) return
    const formData = new FormData()
    formData.append('type', 'banner')
    formData.append('file', file)

    try {
      const res = await API.post('/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === 200) {
        const uploadedUrl = res.data.file.replace(/\\/g, '/')
        setForm((prev) => ({
          ...prev,
          image: { ...prev.image, [lang]: uploadedUrl },
        }))
        Swal.fire('Success', 'Image uploaded successfully', 'success')
      }
    } catch {
      Swal.fire('Error', 'Image upload failed', 'error')
    }
  }

  const handleStatusChange = (e) => {
    setForm((prev) => ({ ...prev, status: e.target.value }))
  }

  const handleSelectionTypeChange = (e) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      type: value,
      series: value === 'custom' ? prev.series : [],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    API.put(`/banners/${id}`, form)
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
            <div className="row">
              {/* Left column: language-specific fields */}
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
                            onChange={(e) => handleTitleChange(lang.code, e.target.value)}
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label>Image ({lang.code})</label>
                          <input
                            type="file"
                            className="form-control mt-2"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(lang.code, e.target.files?.[0])
                            }
                          />
                          {form.image?.[lang.code] && (
                            <img
                              src={form.image[lang.code]}
                              alt="Preview"
                              className="mt-2"
                              style={{ maxWidth: '200px', height: 'auto' }}
                            />
                          )}
                        </div>
                      </div>
                    ),
                )}
              </div>

              {/* Right column: settings */}
              <div className="col-md-6 mt-5">
                <div className="form-group mb-4">
                  <label>Select Type</label>
                  <select
                    className="form-control"
                    value={form.type}
                    onChange={handleSelectionTypeChange}
                  >
                    <option value="latest">Latest</option>
                    <option value="featured">Featured</option>
                    <option value="most_views">Most-Views</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {form.type === 'custom' && (
                  <div className="form-group mb-3">
                    <label>Select Series</label>
                    <Select
                      isMulti
                      options={seriesList.map((s) => ({
                        value: s._id,
                        label: s.title?.[activeTab] || s.title?.en || 'Untitled',
                      }))}
                      value={seriesList
                        .filter((s) => form.series.includes(s._id))
                        .map((s) => ({
                          value: s._id,
                          label: s.title?.[activeTab] || s.title?.en || 'Untitled',
                        }))}
                      onChange={(selectedOptions) =>
                        setForm((prev) => ({
                          ...prev,
                          series: selectedOptions.map((opt) => opt.value),
                        }))
                      }
                      classNamePrefix="react-select"
                      styles={customSelectStyles}
                    />
                  </div>
                )}

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
              </div>
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
