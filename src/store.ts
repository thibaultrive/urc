import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import usersReducer from './features/usersSlice'; // Import du reducer des utilisateurs
import messagesReducer from './features/messagesSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    messages: messagesReducer,  // Liste des utilisateurs et conversation sélectionnée
    
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
