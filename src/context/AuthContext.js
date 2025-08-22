// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import API from '../api'
import {
  loginSuccess,
  teacherLoginSuccess,
  adminLogout,
  teacherLogout as reduxTeacherLogout,
} from '../features/auth/authSlice'
import { updateUserLists } from '../features/auth/userSlice'
import Swal from 'sweetalert2'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const savedAdminToken = localStorage.getItem('admin_token')
    if (savedAdminToken) setAdmin(JSON.parse(savedAdminToken))

    const savedTeacherToken = localStorage.getItem('teacher_token')
    if (savedTeacherToken) setTeacher(JSON.parse(savedTeacherToken))
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

  return (
    <AuthContext.Provider value={{ admin, login, logout, teacherLogin, teacherLogout, teacher }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)



// // src/context/AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import API from '../api'
// import { loginSuccess, teacherLoginSuccess } from '../features/auth/authSlice'
// import { updateUserLists } from '../features/auth/userSlice'
// import Swal from 'sweetalert2'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null)
//   const [teacher, setTeacher] = useState(null)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const savedAdmin = localStorage.getItem('admin')
//     if (savedAdmin) setAdmin(JSON.stringify(savedAdmin))
//   }, [])

//   const login = async (credentials) => {
//     await API.post('/auth/login', credentials, {
//       headers: {
//         'x-client-type': 'admin', // tell backend to return legacy format if needed
//       },
//     })
//       .then(async (res) => {
//         if (res.status == 200) {
//           const { user, token } = res.data.data

//           if (user.role !== 'admin') {
//             Swal.fire('', 'Access denied. Not an admin account.', 'error')
//             return
//           }

//           localStorage.setItem('admin', JSON.stringify(res.data.data))
//           localStorage.setItem('profile', JSON.stringify(user))
//           localStorage.setItem('token', JSON.stringify(token))

//           Swal.fire({
//             toast: true,
//             position: 'top-end',
//             icon: 'success',
//             title: 'Login Success',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//           })

//           dispatch(loginSuccess(res.data.data))

//           await API.get('/users')
//             .then((res) => {
//               if (res.status == 200) {
//                 dispatch(updateUserLists(res.data))
//               }
//             })
//             .catch((err) => console.error(err))

//           setAdmin(token)
//         } else {
//           Swal.fire('', 'Something went wrong', 'error')
//         }
//       })
//       .catch((err) => {
//         console.error(err)
//         Swal.fire('', `Invalid Email or Password`, 'error')
//       })

//     return admin == null ? false : true
//   }

//   const teacherLogin = async (credentials) => {
//     await API.post('/auth/login', credentials, {
//       headers: {
//         'x-client-type': 'teacher',
//       },
//     })
//       .then(async (res) => {
//         if (res.status == 200) {
//           const { user, token } = res.data.data

//           if (user.role !== 'teacher') {
//             Swal.fire('', 'Access denied. Not a teacher account.', 'error')
//             return
//           }

//           localStorage.setItem('teacher', JSON.stringify(res.data.data))
//           localStorage.setItem('profile', JSON.stringify(user))
//           localStorage.setItem('token', JSON.stringify(token))

//           Swal.fire({
//             toast: true,
//             position: 'top-end',
//             icon: 'success',
//             title: 'Login Success',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//           })

//           dispatch(teacherLoginSuccess(res.data.data))

//           setTeacher(token)
//         } else {
//           Swal.fire('', 'Something went wrong', 'error')
//         }
//       })
//       .catch((err) => {
//         console.error(err)
//         Swal.fire('', `Invalid Email or Password`, 'error')
//       })
//   }

//   const logout = () => {
//     localStorage.removeItem('admin')
//     setAdmin(null)
//   }

//   const teacherLogout = () => {
//     localStorage.removeItem('teacher')
//     localStorage.removeItem('profile')
//     localStorage.removeItem('token')
//     setTeacher(null)
//   }

//   return (
//     <AuthContext.Provider value={{ admin, login, logout, teacherLogin, teacherLogout, teacher }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

// // // src/context/AuthContext.js
// // import { createContext, useContext, useState, useEffect } from 'react'
// // import { useDispatch } from 'react-redux'
// // import API from '../api'
// // import { loginSuccess, teacherLoginSuccess } from '../features/auth/authSlice'
// // import { updateUserLists } from '../features/auth/userSlice'
// // import Swal from 'sweetalert2'

// // const AuthContext = createContext()

// // export const AuthProvider = ({ children }) => {
// //   const [admin, setAdmin] = useState(null)
// //   const [teacher, setTeacher] = useState(null)
// //   const dispatch = useDispatch()

// //   useEffect(() => {
// //     const savedAdmin = localStorage.getItem('admin')
// //     if (savedAdmin) setAdmin(JSON.stringify(savedAdmin))
// //   }, [])

// //   const login = async (credentials) => {
// //     // You’d call API here. This is a dummy check.
// //     await API.post('/auth/login', credentials) // Replace with actual API route
// //       .then(async (res) => {
// //         if (res.status == 200) {
// //           localStorage.setItem('admin', JSON.stringify(res.data))
// //           localStorage.setItem('profile', JSON.stringify(res.data.user))
// //           localStorage.setItem('token', JSON.stringify(res.data.token))

// //           Swal.fire({
// //             toast: true,
// //             position: 'top-end',
// //             icon: 'success',
// //             title: 'Login Success',
// //             showConfirmButton: false,
// //             timer: 3000,
// //             timerProgressBar: true,
// //           })

// //           dispatch(loginSuccess(res.data))
// //           await API.get('/users') // Replace with actual API route
// //             .then((res) => {
// //               if (res.status == 200) {
// //                 dispatch(updateUserLists(res.data))
// //               }
// //             })
// //             .catch((err) => console.error(err))

// //           setAdmin(res.data.token)
// //         } else {
// //           Swal.fire('', 'Something went wrong', 'error')
// //           // alert(err.response?.data?.msg || 'Login failed');
// //         }
// //       })
// //       .catch((err) => {
// //         console.error(err)
// //         Swal.fire('', `Invalid Email or Password`, 'error')
// //       })

// //     return admin == null ? false : true
// //   }

// //   const teacherLogin = async (credentials) => {
// //     // You’d call API here. This is a dummy check.
// //     await API.post('/auth/login', credentials) // Replace with actual API route
// //       .then(async (res) => {
// //         if (res.status == 200) {
// //           localStorage.setItem('teacher', JSON.stringify(res.data))
// //           localStorage.setItem('profile', JSON.stringify(res.data.user))
// //           localStorage.setItem('token', JSON.stringify(res.data.token))

// //           Swal.fire({
// //             toast: true,
// //             position: 'top-end',
// //             icon: 'success',
// //             title: 'Login Success',
// //             showConfirmButton: false,
// //             timer: 3000,
// //             timerProgressBar: true,
// //           })

// //           dispatch(teacherLoginSuccess(res.data))
// //           // await API.get('/users') // Replace with actual API route
// //           //   .then(res => {
// //           //     if(res.status == 200) {
// //           //       // console.log('res.data ------------', res.data)
// //           //       // dispatch(updateUserLists(res.data))
// //           //     }
// //           //   })
// //           //   .catch(err => console.error(err));

// //           setTeacher(res.data.token)
// //         } else {
// //           Swal.fire('', 'Something went wrong', 'error')
// //           // alert(err.response?.data?.msg || 'Login failed');
// //         }
// //       })
// //       .catch((err) => {
// //         console.error(err)
// //         Swal.fire('', `Invalid Email or Password`, 'error')
// //       })

// //     // return admin==null?false:true;
// //   }

// //   const logout = () => {
// //     localStorage.removeItem('admin')
// //     setAdmin(null)
// //   }

// //   const teacherLogout = () => {
// //     localStorage.removeItem('teacher')
// //     localStorage.removeItem('profile')
// //     localStorage.removeItem('token')
// //     setTeacher(null)
// //   }

// //   return (
// //     <AuthContext.Provider value={{ admin, login, logout, teacherLogin, teacherLogout, teacher }}>
// //       {children}
// //     </AuthContext.Provider>
// //   )
// // }

// // export const useAuth = () => useContext(AuthContext)
