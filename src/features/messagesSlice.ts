import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    selectedConversation: null, // La conversation actuellement sélectionnée
    conversations: {}, // Toutes les conversations chargées
  },
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const { setSelectedConversation, setConversations } = messagesSlice.actions;
export default messagesSlice.reducer;
