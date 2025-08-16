// src/features/auth/settingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const setting = JSON.parse(localStorage.getItem('setting'));

const initialState = {
  sidebarShow: true,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.sidebarShow = action.payload.sidebarShow;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;
export default layoutSlice.reducer;
