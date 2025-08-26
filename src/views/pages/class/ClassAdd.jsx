import React, { useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const ClassAdd = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/classes', form)
      if (res.status === 200) {
        Swal.fire('Success', 'Class added successfully', 'success').then(() =>
          navigate('/class-list'),
        )
        setForm({ name: '', description: '', status: 'active' })
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'Failed to add class', 'error')
    }
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header">
          <h5>Add Class</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Name</label>
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
              ></textarea>
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

            <button type="submit" className="btn btn-success">
              Add Class
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ClassAdd
