import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import './assets/Global.css'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const TeacherLogin = React.lazy(() => import('./views/teacher/auth/TeacherLogin'))
const TeacherRegister = React.lazy(() => import('./views/teacher/auth/TeacherRegister'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/ForgotPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode('dark')
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode('dark')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (

      <AuthProvider>
        <HashRouter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <Routes>
              <Route exact path="/teacher/login" name="Teacher Login" element={<TeacherLogin />} />
              <Route exact path="/teacher/register" name="Teacher Register" element={<TeacherRegister />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/forgot-password" name="Forgot Password" element={<ForgotPassword />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route path="*" name="Home" element={<PrivateRoute><DefaultLayout /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
  )
}

export default App;
