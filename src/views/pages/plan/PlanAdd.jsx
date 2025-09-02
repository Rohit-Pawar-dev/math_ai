import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const PlanAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '0',
    discount: '0',
    discount_type: 'percent',
    validity_time: '5',
    validity_type: 'day',
    status: 'active',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/plan', formData)
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Plan created successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
        navigate('/admin/subscription')
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to create plan',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Add New Plan</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="my-2 col-md-6">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  minLength={3}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="my-2 col-md-6">
                <label>Amount (₹)</label>
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="my-2 col-md-6">
                <label>Discount</label>
                <input
                  type="text"
                  name="discount"
                  className="form-control"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="my-2 col-md-6">
                <label>Discount Type</label>
                <select
                  name="discount_type"
                  className="form-control"
                  value={formData.discount_type}
                  onChange={handleChange}
                  required
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Flat</option>
                </select>
              </div>
              <div className="my-2 col-md-6">
                <label>Validity Time</label>
                <input
                  type="text"
                  name="validity_time"
                  className="form-control"
                  value={formData.validity_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="my-2 col-md-6">
                <label>Validity Type</label>
                <select
                  name="validity_type"
                  className="form-control"
                  value={formData.validity_type}
                  onChange={handleChange}
                  required
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <div className="my-2 col-md-6">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="my-2 col-md-12">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="my-2 col-md-12 w-25">
                <button type="submit" className="btn btn-warning">
                  Create Plan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PlanAdd
