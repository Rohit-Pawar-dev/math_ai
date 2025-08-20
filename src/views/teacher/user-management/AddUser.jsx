import React, { useState, useEffect } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AddUser = () => {
  const { teacher } = useSelector((state) => state.auth) 

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    classStandard: '',
  })

  const navigate = useNavigate()
  const [profilePicture, setProfilePicture] = useState(null)
  const [passwordError, setPasswordError] = useState('')
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await API.get('/classes')
        if (response.data?.status) {
          setClasses(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    fetchClasses()
  }, [])

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
      formData.append('password', form.password)
      formData.append('status', form.status)
      formData.append('classStandard', form.classStandard)

      if (profilePicture) {
        formData.append('profilePicture', profilePicture)
      }

      // ✅ Attach teacher_id
      formData.append('teacher_id', teacher?._id)

      const response = await API.post('teacher/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 201) {
        Swal.fire('Success', 'Student added successfully!', 'success')

        setForm({
          name: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          status: 'active',
          classStandard: '',
        })

        setProfilePicture(null)

        navigate('/users') // still navigate to student listing (users page)
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || err.message
      Swal.fire('Error', errorMsg, 'error')
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Add Student</h2> {/* ✅ updated */}
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">General Information</h6>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* --- Name --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* --- Email --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* --- Phone --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.mobile}
                        onChange={(e) =>
                          setForm({ ...form, mobile: e.target.value })
                        }
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* --- Password --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* --- Confirm Password --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        required
                      />
                      {passwordError && (
                        <small className="text-danger">{passwordError}</small>
                      )}
                    </div>
                  </div>

                  {/* --- Profile Picture --- */}
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
                              : defaultImage
                          }
                          alt="Preview"
                          width={100}
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Class Dropdown --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Class</label>
                      <select
                        className="form-control"
                        value={form.classStandard}
                        onChange={(e) =>
                          setForm({ ...form, classStandard: e.target.value })
                        }
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

                  {/* --- Status --- */}
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Status</label>
                      <select
                        className="form-control"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="formSubmitDiv">
                    <button className="btn btn-outline-success active" type="submit">
                      Add Student {/* ✅ updated */}
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
