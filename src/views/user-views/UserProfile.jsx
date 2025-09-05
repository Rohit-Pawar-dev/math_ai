// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import API from '../../api'
// import { updateUserProfile } from '../../features/auth/authSlice'
// import Swal from 'sweetalert2'
// import MEDIA_URL from '../../media'

// const UserProfile = () => {
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)

//   const [form, setForm] = useState({
//     name: user?.name || '',
//     mobile: user?.mobile || '',
//     email: user?.email || '',
//   })

//   const [selectedImage, setSelectedImage] = useState(null)
//   const [previewImage, setPreviewImage] = useState(
//     user?.profilePicture ? MEDIA_URL + user.profilePicture : '/default-avatar.png'
//   )

//   const [passwordForm, setPasswordForm] = useState({
//     password: '',
//     confirm_password: '',
//   })

//   // Show preview when image file changes
//   useEffect(() => {
//     if (!selectedImage) {
//       setPreviewImage(user?.profilePicture ? MEDIA_URL + user.profilePicture : '/default-avatar.png')
//       return
//     }

//     const objectUrl = URL.createObjectURL(selectedImage)
//     setPreviewImage(objectUrl)

//     // Clean up memory when component unmounts or image changes
//     return () => URL.revokeObjectURL(objectUrl)
//   }, [selectedImage, user])

//   const handleProfileUpdate = async () => {
//     try {
//       const formData = new FormData()
//       formData.append('name', form.name)
//       formData.append('mobile', form.mobile)
//       formData.append('email', form.email)
//       if (selectedImage) {
//         formData.append('profilePicture', selectedImage)
//       }

//       const res = await API.put(`/users/${user._id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })

//       if (res.status === 200) {
//         Swal.fire('Profile', 'Profile updated successfully', 'success').then(() => {
//           dispatch(updateUserProfile(res.data.data))
//           setSelectedImage(null) // reset selected image after success
//         })
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || err.message || 'Something went wrong'
//       Swal.fire('Something went wrong', message, 'error')
//     }
//   }


//   return (
//     <section className="tableSection">
//       <div className="container-fluid">
//         <div className="mainContent">
//           {/* General Info */}
//           <div className="card">
//             <div className="card-body">
//               <h6 className="mb-4">User Profile</h6>
//               <div className="row">
//                 <div className="col-md-12 text-center mb-4">
//                   <img
//                     src={previewImage}
//                     alt="Profile Preview"
//                     className="rounded-circle"
//                     width={120}
//                     height={120}
//                   />
//                   <label className="mb-2 d-block mt-3">Upload your Profile Picture</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept="image/*"
//                     onChange={(e) => {
//                       if (e.target.files && e.target.files.length > 0) {
//                         setSelectedImage(e.target.files[0])
//                       }
//                     }}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <div className="form-group mb-4">
//                     <label className="mb-2">Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={form.name}
//                       onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="form-group mb-4">
//                     <label className="mb-2">Email</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       value={form.email}
//                       onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="form-group mb-4">
//                     <label className="mb-2">Phone</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={form.mobile}
//                       onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="formSubmitDiv">
//                   <button
//                     className="btn btn-outline-primary"
//                     type="button"
//                     onClick={handleProfileUpdate}
//                   >
//                     Update Profile
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../../api'
import Swal from 'sweetalert2'
import { updateUserProfile } from '../../features/auth/authSlice'
import MEDIA_URL from '../../media'

const UserProfile = () => {
  const dispatch = useDispatch()
  const { user: authUser } = useSelector((state) => state.auth)
  const userId = authUser?._id

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    classStandard: '',
  })

  const [classes, setClasses] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState('/default-avatar.png')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Fetch user + classes on mount
  useEffect(() => {
    if (!userId) return

    const fetchUserAndClasses = async () => {
      try {
        const [userRes, classesRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get('/classes'),
        ])

        const user = userRes.data
        setForm({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          classStandard: user.classStandard?._id || '',
        })

        setPreviewImage(user.profilePicture ?  user.profilePicture : '/default-avatar.png')

        if (classesRes.data?.status) {
          setClasses(classesRes.data.data)
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to fetch user or class data.', 'error')
      }
    }

    fetchUserAndClasses()
  }, [userId])

  // Update image preview
  useEffect(() => {
    if (!selectedImage) return

    const objectUrl = URL.createObjectURL(selectedImage)
    setPreviewImage(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required'
    if (!form.classStandard) errs.classStandard = 'Class is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      return Swal.fire('Validation Error', 'Please fix the form errors', 'error')
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('mobile', form.mobile)
      formData.append('classStandard', form.classStandard)
      if (selectedImage) {
        formData.append('profilePicture', selectedImage)
      }

      const res = await API.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.status === 200) {
        Swal.fire('Success', 'Profile updated successfully!', 'success')
        dispatch(updateUserProfile(res.data.data)) // Update Redux store
        setSelectedImage(null)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      Swal.fire('Error', msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="tableSection">
      <div className="container-fluid">
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">User Profile</h6>
              <div className="row">
                <div className="col-md-12 text-center mb-4">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="rounded-circle"
                    width={120}
                    height={120}
                  />
                  <label className="d-block mt-3">Upload your Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </div>

                {/* Name */}
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={form.email}
                      readOnly
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                {/* Mobile */}
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Mobile</label>
                    <input
                      type="text"
                      className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>
                </div>

                {/* Class Selection */}
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Class</label>
                    <select
                      className={`form-control ${errors.classStandard ? 'is-invalid' : ''}`}
                      value={form.classStandard}
                      onChange={(e) => setForm({ ...form, classStandard: e.target.value })}
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    {errors.classStandard && (
                      <div className="invalid-feedback">{errors.classStandard}</div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="formSubmitDiv">
                  <button
                    type="button"
                    className={`btn btn-outline-primary ${loading ? 'disabled' : ''}`}
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
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

export default UserProfile
