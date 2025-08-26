import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const PlanEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({})

  useEffect(() => {
    API.get(`/content-languages/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('Error', 'Failed to fetch data', 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.put(`/content-languages/${id}`, form)
      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Language updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate('/languages')
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update language',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header">Edit Language</div>
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
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>

              <div className="my-2 col-md-6">
                <label>Display Name</label>
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  value={form.display_name}
                  onChange={(e) => setForm({...form, display_name: e.target.value})}
                  required
                />
              </div>
              <div className="my-2 col-md-6">
                <label>Code</label>
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  value={form.code}
                  onChange={(e) => setForm({...form, code: e.target.value})}
                  required
                />
              </div>

              <div className="my-2 col-md-6">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="my-2 col-md-12 w-25">
                <button type="submit" className="btn btn-primary mt-3">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PlanEdit
