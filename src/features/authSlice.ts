import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state: AuthState, action: PayloadAction<{ token: string; username: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure(state: AuthState, action: PayloadAction<{ message: string }>) {
      state.error = action.payload.message;
      state.isAuthenticated = false;
    },
    logout(state: AuthState) {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});


export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
