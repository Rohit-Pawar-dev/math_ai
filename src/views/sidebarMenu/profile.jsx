import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../../api'
import { updateProfile } from '../../features/auth/authSlice'
import Swal from 'sweetalert2'
import MEDIA_URL from '../../media'

const Profile = () => {
  const dispatch = useDispatch()
  const { admin } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: admin?.name || '',
    mobile: admin?.mobile || '',
    email: admin?.email || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirm_password: '',
  })

  const handleProfileUpdate = async () => {
    try {
      const res = await API.put(`/admins/${admin._id}`, form)
      if (res.status === 200) {
        Swal.fire('Profile', 'Profile updated successfully', 'success').then(() => {
          dispatch(updateProfile(res.data.data))
        })
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong'
      Swal.fire('Something went wrong', message, 'error')
    }
  }

  const handleProfilePasswordUpdate = async () => {
    if (passwordForm.password.length < 6) {
      return Swal.fire('Update Password', 'Password must be at least 6 characters', 'error')
    }
    if (passwordForm.password.length > 15) {
      return Swal.fire('Update Password', 'Password must not exceed 15 characters', 'error')
    }
    if (passwordForm.password !== passwordForm.confirm_password) {
      return Swal.fire('Update Password', 'Password and Confirm Password must match', 'error')
    }

    try {
      const res = await API.put(`/admins/${admin._id}`, {
        ...form,
        password: passwordForm.password,
      })
      if (res.status === 200) {
        Swal.fire('Profile', 'Password updated successfully', 'success').then(() => {
          dispatch(updateProfile(res.data.data))
        })
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong'
      Swal.fire('Something went wrong', message, 'error')
    }
  }

  const handleProfileImageUpdate = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('adminId', admin._id)
    formData.append('profilePicture', file)

    try {
      const res = await API.post('/admins/upload-profile', formData)
      if (res.status === 200) {
        Swal.fire('Profile', 'Profile image updated successfully', 'success').then(() => {
          dispatch(updateProfile(res.data.data))
        })
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error')
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Profile Management</h2>
        <div className="mainContent">
          {/* General Info */}
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">General Information</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group mb-4">
                    <div className="profilePiv text-center">
                      <img
                        src={
                          admin?.profilePicture
                            ? MEDIA_URL + admin.profilePicture
                            : '/default-avatar.png'
                        }
                        alt="Profile"
                        className="rounded-circle mb-2"
                        width={120}
                        height={120}
                      />
                      <label className="mb-2 d-block">Upload your Profile Picture</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleProfileImageUpdate}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="mb-2">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="mb-2">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    />
                  </div>
                </div>

                <div className="formSubmitDiv">
                  <button
                    className="btn btn-outline-warning active"
                    type="button"
                    onClick={handleProfileUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Password Update */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="mb-4">Update Password</h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="mb-2">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, password: e.target.value })
                      }
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="mb-2">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="formSubmitDiv">
                  <button
                    className="btn btn-outline-warning active"
                    type="button"
                    onClick={handleProfilePasswordUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
