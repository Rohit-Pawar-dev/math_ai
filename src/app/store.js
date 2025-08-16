// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import layoutReducer from '../features/auth/layoutSlice';
import userReducer from '../features/auth/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    users: userReducer,
  },
});