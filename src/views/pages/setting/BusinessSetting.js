import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import Select from 'react-select'
import MEDIA_URL from '../../../media'

const PlanEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedSubjects, setSelectedSubjects] = useState([])

  // For Logo
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
  ]

  // Fetch settings
  useEffect(() => {
    API.get(`/settings`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data[0])
          setSelectedSubjects(res.data[0].app_languages)

          // if logo exists show preview
          if (res.data[0].app_logo) {
            setLogoPreview(res.data[0].app_logo)
          }
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('Error', 'Failed to fetch plan data', 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Handle app languages
  const handleChange = (selected) => {
    setSelectedSubjects(selected)
    setForm({ ...form, app_languages: selected })
  }

  // Handle logo select
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)

    if (file) {
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  // Submit form with file upload
  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      for (let key in form) {
        if (key !== 'app_languages') {
          formData.append(key, form[key])
        }
      }
      formData.append('app_languages', JSON.stringify(selectedSubjects))
      if (logoFile) {
        formData.append('app_logo', logoFile)
      }

      if(form._id) {
        var res = await API.put(`/settings/${form._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        var res = await API.post(`/settings`, form, {
          // headers: { 'Content-Type': 'multipart/form-data' },
        })
      }


      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Settings updated successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload()
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update setting',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Setting</div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">App Name</label>
                <input
                  type="text"
                  value={form?.app_name}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, app_name: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">App Detail</label>
                <input
                  type="text"
                  value={form?.app_detail}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, app_detail: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Support Mobile</label>
                <input
                  type="text"
                  value={form?.app_mobile}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, app_mobile: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Support Email</label>
                <input
                  type="text"
                  value={form?.app_email}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, app_email: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label htmlFor="">Free Episodes</label>
                <input
                  type="text"
                  value={form?.free_episodes}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, free_episodes: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label htmlFor="">Coins/Episode Charges</label>
                <input
                  type="text"
                  value={form?.coins_per_episode}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, coins_per_episode: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label htmlFor="">Refer n earn reward coins</label>
                <input
                  type="text"
                  value={form?.refer_n_earn_coins}
                  className="form-control"
                  onChange={(e) => {
                    setForm({ ...form, refer_n_earn_coins: e.target.value })
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="form-group">
                <label htmlFor="">App Languages</label>
                <Select
                  options={languages}
                  value={selectedSubjects}
                  onChange={handleChange}
                  placeholder="Select subjects..."
                  closeMenuOnSelect={false}
                  isSearchable
                  isMulti
                />
              </div>
            </div>
            {/* Website Logo Upload */}
            <div className="col-lg-4">
              <div className="form-group">
                <label>Website Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={
                        logoPreview.startsWith('blob')
                          ? logoPreview
                          : `${MEDIA_URL.replace(/\/$/, '')}/${logoPreview.replace(/^\//, '')}`
                      }
                      alt="Logo Preview"
                      style={{
                        maxWidth: '150px',
                        border: '1px solid #ddd',
                        padding: '5px',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-12 mt-4">
              <button type="button" onClick={handleSubmit} className="btn btn-primary btn-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlanEdit
