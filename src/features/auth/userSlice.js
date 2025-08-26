// src/features/auth/settingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const setting = JSON.parse(localStorage.getItem('setting'));

const initialState = {
  lists: true,
};

const userSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    updateUserLists: (state, action) => {
      state.lists = action.payload;
    },
  },
});

export const { updateUserLists } = userSlice.actions;
export default userSlice.reducer;
