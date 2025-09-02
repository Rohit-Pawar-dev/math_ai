import React, { useState, useEffect } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
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
      formData.append('classStandard', form.classStandard)

      if (profilePicture) {
        formData.append('profilePicture', profilePicture)
      }

      const response = await API.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status === 201) {
        Swal.fire('Success', 'Registration successful! Please login.', 'success')

        setForm({
          name: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          classStandard: '',
        })

        setProfilePicture(null)
        navigate('/login')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
      Swal.fire('Error', errorMsg, 'error')
    }
  }

  return (
    <section className="registerSection">
      <div className="container">
        <h2>User Registration</h2>
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control mb-3"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control mb-3"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control mb-3"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                    />
                    {passwordError && <small className="text-danger">{passwordError}</small>}
                  </div>

                  <div className="col-md-6">
                    <label>Profile Picture</label>
                    <input
                      type="file"
                      className="form-control mb-3"
                      accept="image/*"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                    <div className="mt-2">
                      <img
                        src={profilePicture ? URL.createObjectURL(profilePicture) : defaultImage}
                        alt="Preview"
                        width={100}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label>Class</label>
                    <select
                      className="form-control mb-3"
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

                  <div className="formSubmitDiv">
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </div>
                </div>
              </form>
              <p className="mt-3">
                Already have an account?{' '}
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => navigate('/login')}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserRegister
