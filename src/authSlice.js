// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
 name : 'authetif',
 initialState : {token : null},
 reducers : {
  setToken : (state, action) => {
      state.token = action.payload
  }
 }
});

export const {setToken} = authSlice.actions;
export default authSlice.reducer;










