import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginbg from "../../../assets/images/login-vector.jpg"
import API from '../../../api'
import MEDIA_URL from '../../../media'
import defaultWebsiteLogo from "../../../assets/images/sorry_teacher.png"
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
  useColorModes,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import Swal from 'sweetalert2'

const UserLogin = () => {
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  const [loader, setLoader] = useState(false)
  const [useOtp, setUseOtp] = useState(true)
  const [otpSent, setOtpSent] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', mobile: '', otp: '' })
  const [logo, setLogo] = useState(null)

  const { userLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoader(true)

    if (useOtp) {
      if (!form.mobile) {
        Swal.fire('Please enter your mobile number.', '', 'warning')
        setLoader(false)
        return
      }

      if (!otpSent) {
        const result = await userLogin({ mobile: form.mobile })
        if (result === 'otp-sent') {
          setOtpSent(true)
          Swal.fire('OTP sent! Please enter the OTP.', '', 'success')
        } else {
          Swal.fire('Failed to send OTP. Try again.', '', 'error')
        }
        setLoader(false)
        return
      }

      if (!form.otp) {
        Swal.fire('Please enter the OTP.', '', 'warning')
        setLoader(false)
        return
      }

      const success = await userLogin({ mobile: form.mobile, otp: form.otp })
      setLoader(false)
      if (success) {
        navigate('/home')
      }
      return
    }


    if (!form.email || !form.password) {
      Swal.fire('Please enter email and password.', '', 'warning')
      setLoader(false)
      return
    }

    const success = await userLogin({ email: form.email, password: form.password })
    setLoader(false)
    if (success) {
      navigate('/home')
    }
  }

  useEffect(() => {
    API.get('/settings')
      .then((res) => {
        if (res.status === 200 && res.data[0]?.app_logo) {
          setLogo(res.data[0].app_logo)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch logo:', err)
      })
  }, [])

  const getLogoUrl = (path) => `${MEDIA_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    // <section className="user-login" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    //   <CContainer fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
    //     <CRow className="shadow-lg" style={{ maxWidth: '850px', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff' }}>
    //       <CCol md={6} className="p-0 d-none d-md-flex align-items-center justify-content-center bg-light">
    //         <img
    //           src={loginbg}
    //           alt="Login Illustration"
    //           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    //         />
    //       </CCol>
    //       <CCol md={6} className="p-5 d-flex flex-column">
    //         <div className="text-center mb-4">
    //           <img
    //             src={
    //               logo
    //                 ? getLogoUrl(logo)
    //                 : defaultWebsiteLogo
    //             }
    //             alt="Sorry Teacher"
    //             style={{ maxWidth: '140px', marginBottom: '12px' }}
    //           />
    //           <h4 className="fw-bold mb-1">Welcome Back</h4>
    //           <p className="text-muted small">Login to continue</p>
    //         </div>

    //         <div className="mb-4">
    //           <ul className="nav nav-tabs justify-content-center" role="tablist" style={{ cursor: 'pointer' }}>
    //             <li className="nav-item" role="presentation">
    //               <button
    //                 className={`nav-link ${useOtp ? 'active' : ''}`}
    //                 onClick={() => {
    //                   setUseOtp(true)
    //                   setOtpSent(false)
    //                   setForm({ email: '', password: '', mobile: '', otp: '' })
    //                 }}
    //                 type="button"
    //                 role="tab"
    //               >
    //                 OTP Login
    //               </button>
    //             </li>
    //             <li className="nav-item" role="presentation">
    //               <button
    //                 className={`nav-link ${useOtp ? '' : 'active'}`}
    //                 onClick={() => {
    //                   setUseOtp(false)
    //                   setForm({ email: '', password: '', mobile: '', otp: '' })
    //                 }}
    //                 type="button"
    //                 role="tab"
    //               >
    //                 Email/Password
    //               </button>
    //             </li>
    //           </ul>
    //         </div>

    //         <CForm onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column justify-content-between">
    //           {useOtp ? (
    //             <>
    //               {/* Mobile input */}
    //               <div className="mb-3">
    //                 <label htmlFor="mobile" className="form-label fw-semibold">Mobile Number</label>
    //                 <CFormInput
    //                   id="mobile"
    //                   type="tel"
    //                   maxLength={10}
    //                   placeholder="Enter 10-digit mobile number"
    //                   value={form.mobile}
    //                   onChange={(e) => handleInputChange('mobile', e.target.value)}
    //                   disabled={otpSent}
    //                   autoComplete="tel"
    //                   className={form.mobile === '' ? '' : !/^\d{10}$/.test(form.mobile) ? 'is-invalid' : ''}
    //                 />
    //                 {form.mobile !== '' && !/^\d{10}$/.test(form.mobile) && (
    //                   <div className="invalid-feedback">Enter a valid 10-digit number.</div>
    //                 )}
    //               </div>

    //               {/* OTP input */}
    //               {otpSent && (
    //                 <div className="mb-3">
    //                   <label htmlFor="otp" className="form-label fw-semibold">Enter OTP</label>
    //                   <CFormInput
    //                     id="otp"
    //                     type="text"
    //                     maxLength={4}
    //                     placeholder="Enter 4-digit OTP"
    //                     value={form.otp}
    //                     onChange={(e) => handleInputChange('otp', e.target.value)}
    //                     autoComplete="off"
    //                     className={form.otp === '' ? '' : !/^\d{4}$/.test(form.otp) ? 'is-invalid' : ''}
    //                   />
    //                   {form.otp !== '' && !/^\d{4}$/.test(form.otp) && (
    //                     <div className="invalid-feedback">Enter a valid 4-digit OTP.</div>
    //                   )}
    //                 </div>
    //               )}
    //             </>
    //           ) : (
    //             <>
    //               {/* Email */}
    //               <div className="mb-3">
    //                 <label htmlFor="email" className="form-label fw-semibold">Email</label>
    //                 <CFormInput
    //                   id="email"
    //                   type="email"
    //                   placeholder="Enter your email"
    //                   value={form.email}
    //                   onChange={(e) => handleInputChange('email', e.target.value)}
    //                   autoComplete="username"
    //                   className={form.email === '' ? '' : !/\S+@\S+\.\S+/.test(form.email) ? 'is-invalid' : ''}
    //                 />
    //                 {form.email !== '' && !/\S+@\S+\.\S+/.test(form.email) && (
    //                   <div className="invalid-feedback">Enter a valid email address.</div>
    //                 )}
    //               </div>

    //               {/* Password */}
    //               <div className="mb-4">
    //                 <label htmlFor="password" className="form-label fw-semibold">Password</label>
    //                 <CFormInput
    //                   id="password"
    //                   type="password"
    //                   placeholder="Enter your password"
    //                   value={form.password}
    //                   onChange={(e) => handleInputChange('password', e.target.value)}
    //                   autoComplete="current-password"
    //                   className={form.password === '' ? '' : form.password.length < 6 ? 'is-invalid' : ''}
    //                 />
    //                 {form.password !== '' && form.password.length < 6 && (
    //                   <div className="invalid-feedback">Password must be at least 6 characters.</div>
    //                 )}
    //               </div>
    //             </>
    //           )}

    //           {/* Actions */}
    //           <CRow className="mt-auto">
    //             <CCol xs={6}>
    //               <CButton type="submit" color="primary" className="px-4 w-100" disabled={loader}>
    //                 {loader ? <CSpinner color="light" size="sm" /> : 'Login'}
    //               </CButton>
    //             </CCol>
    //             <CCol xs={6} className="text-end">
    //               {!useOtp && (
    //                 <CButton
    //                   color="link"
    //                   className="px-0"
    //                   onClick={() => navigate('/forgot-password')}
    //                   disabled={loader}
    //                 >
    //                   Forgot password?
    //                 </CButton>
    //               )}
    //             </CCol>
    //           </CRow>
    //         </CForm>
    //         <div className="text-center mt-4">
    //           <small className="text-muted">Don't have an account?</small>{' '}
    //           <Link to="/register" className="fw-semibold text-decoration-none ms-2 text-primary">
    //             Register
    //           </Link>
    //         </div>
    //       </CCol>
    //     </CRow>
    //   </CContainer>
    // </section>
    <section className="user-login" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <CContainer fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <CRow
          className="shadow-lg"
          style={{
            maxWidth: '850px',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {/* Left Image Panel */}
          <CCol md={6} className="p-0 d-none d-md-flex align-items-center justify-content-center bg-light">
            <img
              src={loginbg}
              alt="Login Illustration"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </CCol>

          {/* Right Form Panel */}
          <CCol md={6} className="p-5 d-flex flex-column">
            {/* Logo & Welcome */}
            <div className="text-center mb-4">
              <img
                src={logo ? getLogoUrl(logo) : defaultWebsiteLogo}
                alt="Sorry Teacher"
                style={{ maxWidth: '140px', marginBottom: '12px' }}
              />
              <h4 className="fw-bold mb-1">Welcome Back</h4>
              <p className="text-muted small">Login to continue</p>
            </div>

            {/* Login Method Tabs */}
            <div className="mb-4">
              <ul
                className="nav nav-tabs justify-content-center"
                role="tablist"
                style={{ cursor: 'pointer' }}
              >
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${useOtp ? 'active' : ''}`}
                    onClick={() => {
                      setUseOtp(true)
                      setOtpSent(false)
                      setForm({ email: '', password: '', mobile: '', otp: '' })
                    }}
                    type="button"
                    role="tab"
                  >
                    OTP Login
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${useOtp ? '' : 'active'}`}
                    onClick={() => {
                      setUseOtp(false)
                      setForm({ email: '', password: '', mobile: '', otp: '' })
                    }}
                    type="button"
                    role="tab"
                  >
                    Email/Password
                  </button>
                </li>
              </ul>
            </div>

            {/* Form */}
            <CForm onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column justify-content-between">
              {useOtp ? (
                <>
                  {/* Mobile input */}
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label fw-semibold">
                      Mobile Number
                    </label>
                    <CFormInput
                      id="mobile"
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      disabled={otpSent}
                      autoComplete="tel"
                      className={form.mobile === '' ? '' : !/^\d{10}$/.test(form.mobile) ? 'is-invalid' : ''}
                    />
                    {form.mobile !== '' && !/^\d{10}$/.test(form.mobile) && (
                      <div className="invalid-feedback">Enter a valid 10-digit number.</div>
                    )}
                  </div>

                  {/* OTP input (only after OTP sent) */}
                  {otpSent && (
                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label fw-semibold">
                        Enter OTP
                      </label>
                      <CFormInput
                        id="otp"
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-digit OTP"
                        value={form.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        autoComplete="off"
                        className={form.otp === '' ? '' : !/^\d{4}$/.test(form.otp) ? 'is-invalid' : ''}
                      />
                      {form.otp !== '' && !/^\d{4}$/.test(form.otp) && (
                        <div className="invalid-feedback">Enter a valid 4-digit OTP.</div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <CFormInput
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      autoComplete="username"
                      className={form.email === '' ? '' : !/\S+@\S+\.\S+/.test(form.email) ? 'is-invalid' : ''}
                    />
                    {form.email !== '' && !/\S+@\S+\.\S+/.test(form.email) && (
                      <div className="invalid-feedback">Enter a valid email address.</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <CFormInput
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      autoComplete="current-password"
                      className={form.password === '' ? '' : form.password.length < 6 ? 'is-invalid' : ''}
                    />
                    {form.password !== '' && form.password.length < 6 && (
                      <div className="invalid-feedback">Password must be at least 6 characters.</div>
                    )}
                  </div>
                </>
              )}

              {/* Actions */}
              <CRow className="mt-auto">
                <CCol xs={6}>
                  <CButton type="submit" color="primary" className="px-4 w-100" disabled={loader}>
                    {loader ? <CSpinner color="light" size="sm" /> : 'Login'}
                  </CButton>
                </CCol>
                <CCol xs={6} className="text-end">
                  {!useOtp && (
                    <CButton
                      color="link"
                      className="px-0"
                      onClick={() => navigate('/forgot-password')}
                      disabled={loader}
                      type="button"
                    >
                      Forgot password?
                    </CButton>
                  )}
                </CCol>
              </CRow>
            </CForm>

            {/* Register Link */}
            <div className="text-center mt-4">
              <small className="text-muted">Don't have an account?</small>{' '}
              <Link to="/register" className="fw-semibold text-decoration-none ms-2 text-primary">
                Register
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </section>
  )
}

export default UserLogin
