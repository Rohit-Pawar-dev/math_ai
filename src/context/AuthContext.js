// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import API from '../api'
import { loginSuccess, teacherLoginSuccess } from '../features/auth/authSlice'
import { updateUserLists } from '../features/auth/userSlice'
import Swal from 'sweetalert2'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (savedAdmin) setAdmin(JSON.stringify(savedAdmin))
  }, [])

  const login = async (credentials) => {
    await API.post('/auth/login', credentials, {
      headers: {
        'x-client-type': 'admin', // tell backend to return legacy format if needed
      },
    })
      .then(async (res) => {
        if (res.status == 200) {
          const { user, token } = res.data.data

          if (user.role !== 'admin') {
            Swal.fire('', 'Access denied. Not an admin account.', 'error')
            return
          }

          localStorage.setItem('admin', JSON.stringify(res.data.data))
          localStorage.setItem('profile', JSON.stringify(user))
          localStorage.setItem('token', JSON.stringify(token))

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })

          dispatch(loginSuccess(res.data.data))

          await API.get('/users')
            .then((res) => {
              if (res.status == 200) {
                dispatch(updateUserLists(res.data))
              }
            })
            .catch((err) => console.error(err))

          setAdmin(token)
        } else {
          Swal.fire('', 'Something went wrong', 'error')
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('', `Invalid Email or Password`, 'error')
      })

    return admin == null ? false : true
  }

  const teacherLogin = async (credentials) => {
    await API.post('/auth/login', credentials, {
      headers: {
        'x-client-type': 'teacher',
      },
    })
      .then(async (res) => {
        if (res.status == 200) {
          const { user, token } = res.data.data

          if (user.role !== 'teacher') {
            Swal.fire('', 'Access denied. Not a teacher account.', 'error')
            return
          }

          localStorage.setItem('teacher', JSON.stringify(res.data.data))
          localStorage.setItem('profile', JSON.stringify(user))
          localStorage.setItem('token', JSON.stringify(token))

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })

          dispatch(teacherLoginSuccess(res.data.data))

          setTeacher(token)
        } else {
          Swal.fire('', 'Something went wrong', 'error')
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('', `Invalid Email or Password`, 'error')
      })
  }

  const logout = () => {
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  const teacherLogout = () => {
    localStorage.removeItem('teacher')
    localStorage.removeItem('profile')
    localStorage.removeItem('token')
    setTeacher(null)
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
//     // You’d call API here. This is a dummy check.
//     await API.post('/auth/login', credentials) // Replace with actual API route
//       .then(async (res) => {
//         if (res.status == 200) {
//           localStorage.setItem('admin', JSON.stringify(res.data))
//           localStorage.setItem('profile', JSON.stringify(res.data.user))
//           localStorage.setItem('token', JSON.stringify(res.data.token))

//           Swal.fire({
//             toast: true,
//             position: 'top-end',
//             icon: 'success',
//             title: 'Login Success',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//           })

//           dispatch(loginSuccess(res.data))
//           await API.get('/users') // Replace with actual API route
//             .then((res) => {
//               if (res.status == 200) {
//                 dispatch(updateUserLists(res.data))
//               }
//             })
//             .catch((err) => console.error(err))

//           setAdmin(res.data.token)
//         } else {
//           Swal.fire('', 'Something went wrong', 'error')
//           // alert(err.response?.data?.msg || 'Login failed');
//         }
//       })
//       .catch((err) => {
//         console.error(err)
//         Swal.fire('', `Invalid Email or Password`, 'error')
//       })

//     return admin == null ? false : true
//   }

//   const teacherLogin = async (credentials) => {
//     // You’d call API here. This is a dummy check.
//     await API.post('/auth/login', credentials) // Replace with actual API route
//       .then(async (res) => {
//         if (res.status == 200) {
//           localStorage.setItem('teacher', JSON.stringify(res.data))
//           localStorage.setItem('profile', JSON.stringify(res.data.user))
//           localStorage.setItem('token', JSON.stringify(res.data.token))

//           Swal.fire({
//             toast: true,
//             position: 'top-end',
//             icon: 'success',
//             title: 'Login Success',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//           })

//           dispatch(teacherLoginSuccess(res.data))
//           // await API.get('/users') // Replace with actual API route
//           //   .then(res => {
//           //     if(res.status == 200) {
//           //       // console.log('res.data ------------', res.data)
//           //       // dispatch(updateUserLists(res.data))
//           //     }
//           //   })
//           //   .catch(err => console.error(err));

//           setTeacher(res.data.token)
//         } else {
//           Swal.fire('', 'Something went wrong', 'error')
//           // alert(err.response?.data?.msg || 'Login failed');
//         }
//       })
//       .catch((err) => {
//         console.error(err)
//         Swal.fire('', `Invalid Email or Password`, 'error')
//       })

//     // return admin==null?false:true;
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
