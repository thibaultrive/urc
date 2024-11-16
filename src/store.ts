import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import usersReducer from './features/usersSlice'; // Import du reducer des utilisateurs



const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,  // Liste des utilisateurs et conversation sélectionnée
    
  },
});


export type RootState = ReturnType<typeof store.getState>;

export default store;
