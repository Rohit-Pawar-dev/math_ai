import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext';

const Login = () => {

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    // const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    // if (theme) {
    //   setColorMode('dark')
    // }

    // if (isColorModeSet()) {
    //   return
    // }

    setColorMode('dark')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    const success = await login(form);
    if (success) {
      setLoader(false)
      navigate('/admin/dashboard');
      // alert('Login Success')
    } else {
      setLoader(false)
      // alert('Invalid credentials')
    }
  };

  const handleRedirection = () => {
    navigate('/admin/forgot-password');

  }

  setTimeout(() => {
    if (localStorage.getItem('admin') != null) {
      var loginDetails = JSON.parse(localStorage.getItem('admin'))
      navigate('/admin/dashboard');
    }
  }, 2000);



  return (
    <section className='loginSection'>
      <div className="overlayBg min-vh-100 d-flex flex-row align-items-center">
        <CContainer className="py-5 py-sm-7">
          {/* <a class="d-flex justify-content-center mb-5" href="javascript:">
              <img class="z-index-2" height="90"
                src="" alt="Logo">
          </a> */}
          <CRow className="justify-content-center">

            <CCol md={7} lg={5}>
              <CCardGroup>
                <CCard className="p-4 shadow-sm loginCard">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <div className="text-center">
                        <div className="mb-5">
                          <h1 className="display-4 logitextdiv">Login</h1>
                          <p className="text-body-secondary">Sign In to your account</p>
                        </div>
                      </div>
                      {/* <h1>Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p> */}
                         <label class="input-label" for="signinSrEmail">Your email</label>
                      <CInputGroup className="mb-3 mt-2">
                        {/* <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText> */}

                        <CFormInput placeholder="Username" autoComplete="username" onChange={(e) => setForm({ ...form, email: e.target.value })} className="inputdiv" />
                      </CInputGroup>
                       <label class="input-label" for="signinSrEmail">Your password</label>
                      <CInputGroup className="mb-3 mt-2">
                        {/* <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText> */}

                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="inputdiv"
                        />
                      </CInputGroup>

                      <CCol className="text-right">
                        <CButton color="link" className="px-0 pull-right" onClick={handleRedirection}>
                          Forgot password?
                        </CButton>
                      </CCol>
                      <CCol>
                        <CButton type='submit' color="primary" className="px-4 w-100 loginbtn">
                          {loader ? <><CSpinner color="primary" size="sm" /></> : 'Login'}
                        </CButton>
                      </CCol>

                    </CForm>
                  </CCardBody>
                </CCard>
                {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </section>
  )
}

export default Login
