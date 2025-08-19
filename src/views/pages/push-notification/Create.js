import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { CSpinner } from '@coreui/react'

const PlanEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({title:'', description:'', image:''})
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e, code) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true)
    const reader = new FileReader();
    reader.onloadend = () => {
      // setBase64Image(reader.result); // base64 string

      setForm({...form, image:reader.result})
      setLoading(false)
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post(`/send-notification`, form)
      if (res.status === 201) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Notification send successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload()
        })
        
      }
    } catch (err) {
      setLoading(false)
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
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Push Notification</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="my-2 col-md-4">
                <div className="form-group">
                  <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      minLength={3}
                      value={form.name}
                      onChange={(e) => setForm({...form, title:e.target.value}) }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      type="text"
                      name="description"
                      className="form-control"
                      onChange={(e) => setForm({...form, description:e.target.value})}
                      required
                      value={form.description}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                      <input
                        type="file"
                        className="form-control"

                        value={''}
                        onChange={(e) => {
                          handleImageUpload(e)
                        }}

                      />
                      {form.image && (
                        <img
                          src={form.image}
                          alt="Thumbnail"
                          className="mt-2"
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      )}
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary mt-3">
                      {loading ? <><CSpinner color="primary" size="sm" /></> : 'Save'}
                    </button>
                  </div>
              </div>
              <div className="my-2 col-md-12 w-25">
                
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PlanEdit
