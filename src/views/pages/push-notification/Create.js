import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { CSpinner } from '@coreui/react'

const Notification = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)

    // preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      if (imageFile) {
        formData.append('image', imageFile) // send file instead of base64
      }

      const res = await API.post(`/send-notification`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.status === 201) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Notification sent successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate('/notification-list')
          window.location.reload()
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to send notification',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Push Notification</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column (Title + Description) */}
              <div className="col-md-6 my-2">
                <div className="form-group mb-3">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    minLength={3}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={5}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    value={form.description}
                  ></textarea>
                </div>
              </div>

              {/* Right Column (Image + Preview + Save Button) */}
              <div className="col-md-6 my-2">
                <div className="form-group mb-3">
                  <label>Image</label>
                  <input type="file" className="form-control" onChange={handleImageUpload} />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-3 border rounded shadow-sm"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </div>

              </div>
                <div className="form-group mt-4">
                  <button type="submit" className="btn btn-primary">
                    {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
                  </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Notification
