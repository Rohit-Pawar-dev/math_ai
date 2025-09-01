import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  useColorModes,
  CTabs,
  CTab,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilPhone } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext'
import Swal from 'sweetalert2'

const UserLogin = () => {
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  useEffect(() => {
    setColorMode('dark')
  }, [setColorMode])

  const [loader, setLoader] = useState(false)
  const [useOtp, setUseOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', mobile: '', otp: '' })

  const { userLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      navigate('/user/dashboard')
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
        navigate('/def')
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
      navigate('/def')
    }
  }

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <section className="loginSection" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <CContainer fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <CRow className="shadow-lg" style={{ maxWidth: '900px', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
          {/* Left image panel */}
          <CCol md={6} className="p-0 d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: '#e9ecef' }}>
            <img
              src="/assets/images/login-vector.png"
              alt="Login Illustration"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </CCol>

          {/* Right login panel */}
          <CCol md={6} className="p-4 d-flex flex-column">
            <div className="text-center mb-4">
              <img
                src="/assets/images/login-etrymartlogo.png"
                alt="Logo"
                style={{ maxWidth: '150px', marginBottom: '10px' }}
              />
              <h4 className="primaryTitleColor mb-0">User Login</h4>
            </div>

            {/* Tabs to toggle login mode */}
            <div className="mb-3">
              <ul className="nav nav-tabs" role="tablist" style={{ cursor: 'pointer' }}>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${useOtp ? '' : 'active'}`}
                    onClick={() => {
                      setUseOtp(false)
                      setOtpSent(false)
                      setForm({ email: '', password: '', mobile: '', otp: '' })
                    }}
                    type="button"
                    role="tab"
                  >
                    Email/Password Login
                  </button>
                </li>
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
              </ul>
            </div>

            <CForm onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column justify-content-between">
              {useOtp ? (
                <>
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

              <CRow className="mt-auto">
                <CCol xs={6}>
                  <CButton type="submit" color="primary" className="px-4" disabled={loader}>
                    {loader ? <CSpinner color="primary" size="sm" /> : 'Login'}
                  </CButton>
                </CCol>
                <CCol xs={6} className="text-end">
                  <CButton
                    color="link"
                    className="px-0"
                    onClick={() => navigate('/forgot-password')}
                    disabled={loader}
                  >
                    Forgot password?
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            <div className="text-center mt-3">
              <small>Don't have an account?</small>{' '}
              <Link to="/user/register" className="fw-semibold primaryTitleColor text-decoration-none ms-2">
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
