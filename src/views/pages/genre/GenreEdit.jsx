import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const GenreEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('en')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    display_name: '',
    title: {}, // { en: '', hi: '', ... }
    status: 'active',
  })

  // Fetch genre data and language list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [langRes, genreRes] = await Promise.all([
          API.get('/languages'),
          API.get(`/genre/${id}`),
        ])

        if (langRes.status === 200) {
          setLanguages(langRes.data)
          const defaultLang = langRes.data[0]?.code || 'en'
          setActiveTab(defaultLang)
        }

        if (genreRes.status === 200) {
          const genre = genreRes.data

          // Make sure all language keys exist in the title object
          const completeTitle = {}
          langRes.data.forEach((lang) => {
            completeTitle[lang.code] = genre.title?.[lang.code] || ''
          })

          setFormData({
            display_name: genre.display_name,
            title: completeTitle,
            status: genre.status,
          })
        }
      } catch (err) {
        console.error(err)
        Swal.fire('Error', 'Failed to load genre data or languages', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('title.')) {
      const langCode = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        title: {
          ...prev.title,
          [langCode]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.put(`/genre/${id}`, formData)
      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Genre updated successfully!',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate('/genre-list')
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update genre',
        showConfirmButton: false,
        timer: 3000,
      })
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Edit Genre</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="my-2 col-md-6">
                <label>Display Name</label>
                <input
                  type="text"
                  name="display_name"
                  className="form-control"
                  minLength={2}
                  value={formData.display_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 my-3">
                <div className="tab-buttons">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`btn btn-sm mx-1 ${activeTab === lang.code ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab(lang.code)}
                    >
                      {lang.display_name}
                    </button>
                  ))}
                </div>
              </div>

              {languages.map((lang) =>
                activeTab === lang.code ? (
                  <div className="my-2 col-md-6" key={lang.code}>
                    <label>Title ({lang.display_name})</label>
                    <input
                      type="text"
                      name={`title.${lang.code}`}
                      className="form-control"
                      minLength={2}
                      value={formData.title[lang.code] || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : null
              )}

              <div className="my-2 col-md-6">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="my-2 col-md-12 w-25">
                <button type="submit" className="btn btn-primary mt-3">
                  Update Genre
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default GenreEdit
