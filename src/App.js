import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import './assets/Global.css'
import './scss/examples.scss'
import './assets/website.css'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import TeacherPrivateRoute from './components/TeacherPrivateRoute'
import UserPrivateRoute from './components/UserPrivateRoutes'

// Layouts
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout')) 
const TeacherLayout = React.lazy(() => import('./layout/TeacherLayout'))
const UserLayout = React.lazy(() => import('./layout/UserLayout'))

// --------------------- TEACHER ROUTES ---------------------
const TeacherLogin = React.lazy(() => import('./views/teacher/auth/TeacherLogin'))
const TeacherRegister = React.lazy(() => import('./views/teacher/auth/TeacherRegister'))

// --------------------- USER ROUTES ---------------------
const UserLogin = React.lazy(() => import('./views/user-views/auth/UserLogin'))
const UserRegister = React.lazy(() => import('./views/user-views/auth/UserRegister'))

// --------------------- ADMIN ROUTES ---------------------
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/ForgotPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// --------------------- APP COMPONENT ---------------------
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode('light')
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode('light')
  }, [])

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

            {/* ---------- TEACHER ROUTES ---------- */}
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            <Route path="/teacher/*" element={<TeacherPrivateRoute><TeacherLayout /></TeacherPrivateRoute>} />

            {/* ---------- USER ROUTES (BASE URL) ---------- */}
            <Route path="/*" element={<UserPrivateRoute><UserLayout /></UserPrivateRoute>} />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/404" element={<Page404 />} />
            <Route path="/admin/500" element={<Page500 />} />
            <Route path="/admin/*"  element={<PrivateRoute><DefaultLayout /></PrivateRoute>} />

          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  )
}

export default App


