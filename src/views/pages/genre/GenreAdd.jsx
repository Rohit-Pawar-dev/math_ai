import React, { useEffect, useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const GenreAdd = () => {
  const navigate = useNavigate()

  const [languages, setLanguages] = useState([])
  const [activeTab, setActiveTab] = useState('en')

  const [form, setForm] = useState({
    display_name: '',
    title: {}, // dynamic titles based on language code
    status: '',
  })

  useEffect(() => {
    API.get('/languages')
      .then((res) => {
        if (res.status === 200) {
          setLanguages(res.data)
          // Initialize title for each language code if not present
          const titles = {}
          res.data.forEach((lang) => {
            titles[lang.code] = ''
          })
          setForm((prev) => ({ ...prev, title: titles }))
          setActiveTab(res.data[0]?.code || 'en')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch languages', err)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      display_name: form.display_name,
      title: form.title,
      status: form.status,
    }

    try {
      const response = await API.post('/genre', payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 201) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Genre added successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate('/genre-list')
        })

        setForm({
          display_name: '',
          title: languages.reduce((acc, lang) => ({ ...acc, [lang.code]: '' }), {}),
          status: '',
        })
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.response?.data?.error || err.message,
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Add Genre</h2>
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">Genre Information</h6>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Display Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.display_name}
                        onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Dynamic Language Tabs */}
                  <div className="col-md-12">
                    <div className="tab-buttons mb-3">
                      {languages.map((lang) => (
                        <button
                          type="button"
                          key={lang.code}
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
                      <div className="col-md-6" key={lang.code}>
                        <div className="form-group mb-4">
                          <label className="mb-2">Title ({lang.display_name})</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.title[lang.code] || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                title: { ...form.title, [lang.code]: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    ) : null,
                  )}

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Status</label>
                      <select
                        className="form-control"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="formSubmitDiv">
                    <button className="btn btn-outline-success active" type="submit">
                      Add Genre
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenreAdd
