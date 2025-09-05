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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext';

const ForgotPassword = () => {

  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <div class="text-center">
                      <div class="mb-5">
                        <h1 class="display-4 logitextdiv">
                          Forgot Password</h1>
                        <p class="text-body-secondary">Sign In to your account</p></div>
                    </div>
                    {/* <h1>Forgot Password</h1> */}
                    <label class="input-label" for="signinSrEmail">Your email</label>
                    <CInputGroup className="mb-3 mt-2">
                      {/* <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText> */}
                      <CFormInput placeholder="Email" autoComplete="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton type='submit' color="primary" className="px-4 forgetbtn w-100">
                          Send OTP
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
