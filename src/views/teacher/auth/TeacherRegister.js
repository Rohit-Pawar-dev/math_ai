import React, { useState } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import { useNavigate } from 'react-router-dom'

const TeacherRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    status: 'active',
  })

  const navigate = useNavigate()
  const [profilePicture, setProfilePicture] = useState(null)
  const [passwordError, setPasswordError] = useState('')

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
      formData.append('role', 'teacher') 

      if (profilePicture) {
        formData.append('profilePicture', profilePicture)
      }

      const response = await API.post('/teacher/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 201) {
        Swal.fire('Success', 'Teacher registered successfully!', 'success')
        setForm({
          name: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          status: 'active',
        })
        setProfilePicture(null)
        navigate('/teacher/login')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
      Swal.fire('Error', errorMsg, 'error')
    }
  }

  return (
    <section className="teacher-section">
      <div className="teacher-section__container">
        <h2 className="teacher-section__title">Teacher Registration</h2>
        <div className="teacher-section__content">
          <div className="teacher-section__card">
            <div className="teacher-section__card-body">
              <form onSubmit={handleSubmit} className="teacher-section__form">
                <div className="teacher-section__row">
                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Name</label>
                      <input
                        type="text"
                        className="teacher-section__input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Email</label>
                      <input
                        type="email"
                        className="teacher-section__input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Phone</label>
                      <input
                        type="text"
                        className="teacher-section__input"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Password</label>
                      <input
                        type="password"
                        className="teacher-section__input"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Confirm Password</label>
                      <input
                        type="password"
                        className="teacher-section__input"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                      />
                      {passwordError && <small className="teacher-section__error">{passwordError}</small>}
                    </div>
                  </div>

                  <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Profile Picture</label>
                      <input
                        type="file"
                        className="teacher-section__input"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                      <div className="teacher-section__preview">
                        <img
                          src={profilePicture ? URL.createObjectURL(profilePicture) : defaultImage}
                          alt="Preview"
                          className="teacher-section__image"
                          width={100}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="teacher-section__col">
                    <div className="teacher-section__form-group">
                      <label className="teacher-section__label">Status</label>
                      <select
                        className="teacher-section__input"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div> */}

                  <div className="teacher-section__form-submit">
                    <button className="teacher-section__button" type="submit">
                      Register Teacher
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

export default TeacherRegister
