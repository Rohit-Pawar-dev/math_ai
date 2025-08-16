import React, { useState } from 'react'
import profilePic from '../../assets/images/shortcut.png'
import { useDispatch, useSelector } from 'react-redux'
import API from '../../api'
import { updateProfile } from '../../features/auth/authSlice'
import Swal from 'sweetalert2'
import MEDIA_URL from '../../media'

const profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: user.name, mobile: user.mobile, email: user.email })
  const [passwordform, setPasswordForm] = useState({
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    password: '',
    confirm_password: '',
  })

  const handleProfileUpdate = async (e) => {
    await API.put('/users/' + user._id, form) // Replace with actual API route
      .then((res) => {
        console.log('----------------------- res ----------------------- ', res)
        if (res.status == 200) {
          Swal.fire('Profile', 'Profile updated successfully', 'success').then(function () {
            dispatch(updateProfile(res.data))
          })
        }
      })
      .catch((err) => {
        Swal.fire('Something went wrong', err.message, 'error').then(function () {})
        console.error(err, user._id)
      })
  }

  const handleProfilePasswordUpdate = async (e) => {
    if (passwordform.password.length < 6) {
      Swal.fire('Update Password', 'Password should be at least 6 characters long', 'error')
      return
    }
    if (passwordform.password.length > 15) {
      Swal.fire('Update Password', 'Password should not be more than 15 characters long', 'error')
      return
    }

    if (passwordform.password != '' && passwordform.password == passwordform.confirm_password) {
      await API.put('/users/' + user._id, passwordform) // Replace with actual API route
        .then((res) => {
          console.log('----------------------- res ----------------------- ', res)
          if (res.status == 200) {
            Swal.fire('Profile', 'Password updated successfully', 'success').then(function () {
              dispatch(updateProfile(res.data))
              window.location.reload()
            })
          }
        })
        .catch((err) => {
          Swal.fire('Something went wrong', err.message, 'error').then(function () {})
          console.error(err, user._id)
        })
    } else {
      if (passwordform.password != '' && passwordform.confirm_password != '') {
        Swal.fire('Update Password', 'Password and confirm password should be same', 'error').then(
          function () {},
        )
      } else if (passwordform.password == '' || passwordform.confirm_password == '') {
        Swal.fire(
          'Update Password',
          'Password and confirm password fields are required',
          'error',
        ).then(function () {})
      }
    }
  }

  const handleProfileImageUpdate = async (e) => {
    console.log('e ------- ', e.target.files, e.target.files[0])
    const formData = new FormData()
    formData.append('userId', user._id)
    formData.append('profile', e.target.files[0])

    await API.post('/users/upload-profile', formData) // Replace with actual API route
      .then((res) => {
        if (res.status == 200) {
          Swal.fire('Profile', 'Profile image successfully', 'success').then(async function () {
            await API.get('/users/' + user._id) // Replace with actual API route
              .then((res) => {
                if (res.status == 200) {
                  dispatch(updateProfile(res.data))
                  window.location.reload()
                }
              })
              .catch((err) => {
                Swal.fire('Something went wrong', err.message, 'error').then(function () {})
                console.error(err, user._id)
              })
          })
        }
      })
      .catch((err) => {
        Swal.fire('Error', `${err.message}`, 'error').then(function () {
          // dispatch(updateProfile(res.data))
        })
        console.error(err, user._id)
      })
  }

  return (
    <>
      <section className="tableSection">
        <div className="container-fliud">
          <h2>Profile Management</h2>
          <div className="mainContent">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-4">General Information</h6>
                <form action="">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-4">
                        <div className="profilePiv">
                          <img src={MEDIA_URL + user.profilePicture} alt="" />
                          <label htmlFor="" className="mb-2">
                            Upload your Profile Picture
                          </label>
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
                        <label htmlFor="" className="mb-2">
                          Name
                        </label>
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
                        <label htmlFor="" className="mb-2">
                          Email
                        </label>
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
                        <label htmlFor="" className="mb-2">
                          Phone
                        </label>
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
                        aria-current="page"
                        type="button"
                        onClick={handleProfileUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-body">
                <h6 className="mb-4">Update Password</h6>
                <form action="">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="" className="mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordform.password || ''}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordform, password: e.target.value })
                          }
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label htmlFor="" className="mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordform.confirm_password || ''}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordform, confirm_password: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="formSubmitDiv">
                      <button
                        className="btn btn-outline-warning active"
                        aria-current="page"
                        type="button"
                        onClick={handleProfilePasswordUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default profile
