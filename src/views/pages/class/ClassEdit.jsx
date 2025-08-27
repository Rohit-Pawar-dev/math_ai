import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const ClassEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    if (id) {
      API.get(`/classes/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setForm(res.data)
          }
        })
        .catch(() => Swal.fire('Error', 'Failed to load class data', 'error'))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = { ...form, _id: id }

    API.post('/classes', payload)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('Success', res.data.message || 'Class Updated successfully', 'success').then(() =>
            navigate('/class-list'),
          )
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          Swal.fire('Error', err.response.data.message || 'Class name already exists', 'error')
        } else {
          Swal.fire('Error', 'Failed to save class', 'error')
        }
      })
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>{id ? 'Edit Class' : 'Add Class'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Class Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
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
             <div className="savediv">
            <button type="submit" className="btn btn-success savebtndiv">
              Save Class
            </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ClassEdit
