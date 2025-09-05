// // src/context/AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import API from '../api'
// import {
//   loginSuccess,
//   teacherLoginSuccess,
//   adminLogout,
//   teacherLogout as reduxTeacherLogout,
// } from '../features/auth/authSlice'
// import { updateUserLists } from '../features/auth/userSlice'
// import Swal from 'sweetalert2'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null)
//   const [teacher, setTeacher] = useState(null)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const savedAdminToken = localStorage.getItem('admin_token')
//     if (savedAdminToken) setAdmin(JSON.parse(savedAdminToken))

//     const savedTeacherToken = localStorage.getItem('teacher_token')
//     if (savedTeacherToken) setTeacher(JSON.parse(savedTeacherToken))
//   }, [])

//   const login = async (credentials) => {
//     try {
//       const res = await API.post('/auth/login', credentials, {
//         headers: { 'x-client-type': 'admin' },
//       })

//       if (res.status === 200) {
//         const { user, token } = res.data.data

//         if (user.role !== 'admin') {
//           Swal.fire('', 'Access denied. Not an admin account.', 'error')
//           return false
//         }

//         localStorage.setItem('admin', JSON.stringify(user))
//         localStorage.setItem('admin_token', JSON.stringify(token))
//         localStorage.setItem('admin_profile', JSON.stringify(user))

//         dispatch(loginSuccess({ user, token }))
//         setAdmin(token)

//         Swal.fire({
//           toast: true,
//           position: 'top-end',
//           icon: 'success',
//           title: 'Login Success',
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//         })

//         try {
//           const usersRes = await API.get('/users')
//           if (usersRes.status === 200) {
//             dispatch(updateUserLists(usersRes.data))
//           }
//         } catch (err) {
//           console.error('Failed to fetch users:', err)
//         }

//         return true
//       } else {
//         Swal.fire('', 'Something went wrong', 'error')
//         return false
//       }
//     } catch (err) {
//       console.error(err)
//       Swal.fire('', 'Invalid Email or Password', 'error')
//       return false
//     }
//   }

//   const teacherLogin = async (credentials) => {
//     try {
//       const res = await API.post('/auth/login', credentials, {
//         headers: { 'x-client-type': 'teacher' },
//       })

//       if (res.status === 200) {
//         const { user, token } = res.data.data

//         if (user.role !== 'teacher') {
//           Swal.fire('', 'Access denied. Not a teacher account.', 'error')
//           return false
//         }

//         localStorage.setItem('teacher', JSON.stringify(user))
//         localStorage.setItem('teacher_token', JSON.stringify(token))
//         localStorage.setItem('teacher_profile', JSON.stringify(user))

//         dispatch(teacherLoginSuccess({ user, token }))
//         setTeacher(token)

//         Swal.fire({
//           toast: true,
//           position: 'top-end',
//           icon: 'success',
//           title: 'Login Success',
//           showConfirmButton: false,
//           timer: 3000,
//           timerProgressBar: true,
//         })

//         return true
//       } else {
//         Swal.fire('', 'Something went wrong', 'error')
//         return false
//       }
//     } catch (err) {
//       console.error(err)
//       Swal.fire('', 'Invalid Email or Password', 'error')
//       return false
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem('admin')
//     localStorage.removeItem('admin_token')
//     localStorage.removeItem('admin_profile')
//     setAdmin(null)
//     dispatch(adminLogout())
//   }

//   const teacherLogout = () => {
//     localStorage.removeItem('teacher')
//     localStorage.removeItem('teacher_token')
//     localStorage.removeItem('teacher_profile')
//     setTeacher(null)
//     dispatch(reduxTeacherLogout())
//   }

//   return (
//     <AuthContext.Provider value={{ admin, login, logout, teacherLogin, teacherLogout, teacher }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)


// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import API from '../api'
import {
  loginSuccess,
  teacherLoginSuccess,
  userLoginSuccess,
  adminLogout,
  teacherLogout as reduxTeacherLogout,
  userLogout as reduxUserLogout,
} from '../features/auth/authSlice'
import { updateUserLists } from '../features/auth/userSlice'
import Swal from 'sweetalert2'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const savedAdminToken = localStorage.getItem('admin_token')
    if (savedAdminToken) setAdmin(JSON.parse(savedAdminToken))

    const savedTeacherToken = localStorage.getItem('teacher_token')
    if (savedTeacherToken) setTeacher(JSON.parse(savedTeacherToken))

    const savedUserToken = localStorage.getItem('user_token')
    if (savedUserToken) setUser(JSON.parse(savedUserToken))
  }, [])

  const login = async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials, {
        headers: { 'x-client-type': 'admin' },
      })

      if (res.status === 200) {
        const { user, token } = res.data.data

        if (user.role !== 'admin') {
          Swal.fire('', 'Access denied. Not an admin account.', 'error')
          return false
        }

        localStorage.setItem('admin', JSON.stringify(user))
        localStorage.setItem('admin_token', JSON.stringify(token))
        localStorage.setItem('admin_profile', JSON.stringify(user))

        dispatch(loginSuccess({ user, token }))
        setAdmin(token)

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Login Success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })

        try {
          const usersRes = await API.get('/users')
          if (usersRes.status === 200) {
            dispatch(updateUserLists(usersRes.data))
          }
        } catch (err) {
          console.error('Failed to fetch users:', err)
        }

        return true
      } else {
        Swal.fire('', 'Something went wrong', 'error')
        return false
      }
    } catch (err) {
      console.error(err)
      Swal.fire('', 'Invalid Email or Password', 'error')
      return false
    }
  }

  const teacherLogin = async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials, {
        headers: { 'x-client-type': 'teacher' },
      })

      if (res.status === 200) {
        const { user, token } = res.data.data

        if (user.role !== 'teacher') {
          Swal.fire('', 'Access denied. Not a teacher account.', 'error')
          return false
        }

        localStorage.setItem('teacher', JSON.stringify(user))
        localStorage.setItem('teacher_token', JSON.stringify(token))
        localStorage.setItem('teacher_profile', JSON.stringify(user))

        dispatch(teacherLoginSuccess({ user, token }))
        setTeacher(token)

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Login Success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })

        return true
      } else {
        Swal.fire('', 'Something went wrong', 'error')
        return false
      }
    } catch (err) {
      console.error(err)
      Swal.fire('', 'Invalid Email or Password', 'error')
      return false
    }
  }

  const userLogin = async (credentials) => {
    try {
      if (credentials.otp) {
        const verifyRes = await API.post('/auth/verify-otp', {
          mobile: credentials.mobile,
          otp: credentials.otp,
        }, {
          headers: { 'x-client-type': 'user' },
        })

        // console.log(verifyRes);
        if (verifyRes.status === 200) {
          const { user, token } = verifyRes.data

            // console.log(user, verifyRes.data.data+">>>>>>>>>>>>>>>>>");

          if (user.role !== 'user') {
            Swal.fire('', 'Access denied. Not a user account.', 'error')
            return false
          }

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('user_token', JSON.stringify(token))
          localStorage.setItem('user_profile', JSON.stringify(user))

          dispatch(userLoginSuccess({ user, token }))
          setUser(token)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })

          return true
        } else {
          Swal.fire('', 'Invalid OTP. Please try again.', 'error')
          return false
        }
      }
      if (credentials.email && credentials.password) {
        const res = await API.post('/auth/login', credentials, {
          headers: { 'x-client-type': 'user' },
        })

        if (res.status === 200) {
          const { user, token } = res.data.data
        

          if (user.role !== 'user') {
            Swal.fire('', 'Access denied. Not a user account.', 'error')
            return false
          }

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('user_token', JSON.stringify(token))
          localStorage.setItem('user_profile', JSON.stringify(user))

          dispatch(userLoginSuccess({ user, token }))
          setUser(token)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })

          return true
        } else {
          Swal.fire('', 'Something went wrong', 'error')
          return false
        }
      }
      if (credentials.mobile && !credentials.otp) {
        const sendOtpRes = await API.post('/auth/send-otp', { mobile: credentials.mobile,  type: 'login'  }, {
          headers: { 'x-client-type': 'user' },
        })

        if (sendOtpRes.status === 200) {
          Swal.fire('', 'OTP sent successfully to your mobile number.', 'success')
          return 'otp-sent'
        } else {
          Swal.fire('', 'Failed to send OTP. Please try again.', 'error')
          return false
        }
      }

      Swal.fire('', 'Please provide valid credentials.', 'error')
      return false
    } catch (err) {
      console.error(err)
      Swal.fire('', 'Invalid credentials or something went wrong.', 'error')
      return false
    }
  }


  const logout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_profile')
    setAdmin(null)
    dispatch(adminLogout())
  }

  const teacherLogout = () => {
    localStorage.removeItem('teacher')
    localStorage.removeItem('teacher_token')
    localStorage.removeItem('teacher_profile')
    setTeacher(null)
    dispatch(reduxTeacherLogout())
  }

  const userLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_profile')
    setUser(null)
    dispatch(reduxUserLogout())
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        teacherLogin,
        teacherLogout,
        teacher,
        userLogin,
        userLogout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)