import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  username: string | null;
  user_id: string | null;  // Ajout de l'ID de l'utilisateur
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  user_id: null,  // Initialisation de l'ID
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; username: string; user_id: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.user_id = action.payload.user_id;  // Ajouter l'ID utilisateur
      state.isAuthenticated = true;
      state.error = null;
    }
    ,
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
