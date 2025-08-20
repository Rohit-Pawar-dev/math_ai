// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const teacher = JSON.parse(localStorage.getItem('teacher'));

const initialState = {
  token: user?.token || null,
  teacher: teacher ? teacher : null,
  user: user ? user : null,
  isAuthenticated: !!user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    teacherLoginSuccess: (state, action) => {
      state.teacher = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('teacher', JSON.stringify(action.payload.user));
    },
    updateProfile(state, action) {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('teacher');
      localStorage.removeItem('admin');
      localStorage.removeItem('profile');
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, logout, updateProfile, teacherLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
