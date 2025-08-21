// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const admin = JSON.parse(localStorage.getItem('admin'))
const teacher = JSON.parse(localStorage.getItem('teacher'))
const adminToken = JSON.parse(localStorage.getItem('admin_token'))
const teacherToken = JSON.parse(localStorage.getItem('teacher_token'))

const initialState = {
  admin: admin || null,
  teacher: teacher || null,
  adminToken: adminToken || null,
  teacherToken: teacherToken || null,
  isAdminAuthenticated: !!adminToken,
  isTeacherAuthenticated: !!teacherToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.admin = action.payload.user
      state.adminToken = action.payload.token
      state.isAdminAuthenticated = true

      localStorage.setItem('admin', JSON.stringify(action.payload.user))
      localStorage.setItem('admin_token', JSON.stringify(action.payload.token))
      localStorage.setItem('admin_profile', JSON.stringify(action.payload.user)) // optional
    },

    teacherLoginSuccess: (state, action) => {
      state.teacher = action.payload.user
      state.teacherToken = action.payload.token
      state.isTeacherAuthenticated = true

      localStorage.setItem('teacher', JSON.stringify(action.payload.user))
      localStorage.setItem('teacher_token', JSON.stringify(action.payload.token))
      localStorage.setItem('teacher_profile', JSON.stringify(action.payload.user)) // optional
    },

    updateProfile: (state, action) => {
      state.admin = action.payload
      localStorage.setItem('admin', JSON.stringify(action.payload))
    },

    updateTeacherProfile: (state, action) => {
      state.teacher = action.payload
      localStorage.setItem('teacher', JSON.stringify(action.payload))
    },

    adminLogout: (state) => {
      state.admin = null
      state.adminToken = null
      state.isAdminAuthenticated = false

      localStorage.removeItem('admin')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_profile')
    },

    teacherLogout: (state) => {
      state.teacher = null
      state.teacherToken = null
      state.isTeacherAuthenticated = false

      localStorage.removeItem('teacher')
      localStorage.removeItem('teacher_token')
      localStorage.removeItem('teacher_profile')
    },
  },
})

export const {
  loginSuccess,
  teacherLoginSuccess,
  updateProfile,
  updateTeacherProfile,
  adminLogout,
  teacherLogout,
} = authSlice.actions

export default authSlice.reducer



// // src/features/auth/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const user = JSON.parse(localStorage.getItem('user'));
// const teacher = JSON.parse(localStorage.getItem('teacher'));

// const initialState = {
//   token: user?.token || null,
//   teacher: teacher ? teacher : null,
//   user: user ? user : null,
//   isAuthenticated: !!user,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       localStorage.setItem('user', JSON.stringify(action.payload.user));
//     },
//     teacherLoginSuccess: (state, action) => {
//       state.teacher = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       localStorage.setItem('teacher', JSON.stringify(action.payload.user));
//     },
//     updateProfile(state, action) {
//       state.user = action.payload
//       localStorage.setItem('user', JSON.stringify(action.payload));
//     },
//     updateTeacherProfile(state, action) {
//       state.user = action.payload
//       localStorage.setItem('teacher', JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('user');
//       localStorage.removeItem('teacher');
//       localStorage.removeItem('admin');
//       localStorage.removeItem('profile');
//       localStorage.removeItem('token');
//     }
//   }
// });

// export const { loginSuccess, logout, updateProfile, teacherLoginSuccess, updateTeacherProfile } = authSlice.actions;
// export default authSlice.reducer;
