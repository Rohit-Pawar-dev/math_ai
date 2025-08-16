import React, { useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'

const AddUser = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    status: '',
    profilePicture: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
      status: form.status,
    }

    try {
      const response = await API.post('/users', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        Swal.fire('Success', 'User added successfully!', 'success')
        setForm({
          name: '',
          email: '',
          mobile: '',
          password: '',
          status: '',
          profilePicture: null,
        })
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error')
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Add User</h2>
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">General Information</h6>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">User Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setForm({ ...form, profilePicture: e.target.files[0] })}
                      />
                    </div>
                  </div> */}
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
                      Add User
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

export default AddUser
