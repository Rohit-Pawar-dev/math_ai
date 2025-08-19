import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../assets/images/default.png'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    classStandard: '',
  })

  const [profilePicture, setProfilePicture] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [passwordError, setPasswordError] = useState('')
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, classRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get('/classes'),
        ])

        const user = userRes.data
        setForm({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          password: '',
          confirmPassword: '',
          status: user.status || 'active',
          classStandard: user.classStandard || '',
        })

        if (user.profilePicture) {
          setExistingImageUrl(user.profilePicture)
        }

        if (classRes.data?.status) {
          setClasses(classRes.data.data)
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to fetch user or class data.', 'error')
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordError('')

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('mobile', form.mobile)
      formData.append('status', form.status)
      formData.append('classStandard', form.classStandard) // 👈 added

      if (form.password) {
        formData.append('password', form.password)
      }

      if (profilePicture) {
        formData.append('profilePicture', profilePicture)
      }

      await API.put(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      Swal.fire('Success', 'User updated successfully!', 'success')
      navigate('/users')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
      Swal.fire('Error', errorMsg, 'error')
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Edit User</h2>
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">User Information</h6>
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
                        placeholder="Leave blank to keep unchanged"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Leave blank to keep unchanged"
                      />
                      {passwordError && <small className="text-danger">{passwordError}</small>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Profile Picture</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                      <div className="mt-2">
                        <img
                          src={
                            profilePicture
                              ? URL.createObjectURL(profilePicture)
                              : existingImageUrl || defaultImage
                          }
                          width={100}
                          alt="Preview"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Class</label>
                      <select
                        className="form-control"
                        value={form.classStandard}
                        onChange={(e) => setForm({ ...form, classStandard: e.target.value })}
                        required
                      >
                        <option value="">Select a class</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls._id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

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
                    <button className="btn btn-outline-primary" type="submit">
                      Update User
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

export default EditUser
