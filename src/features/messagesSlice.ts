import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Message, Room } from "../model/common";

interface MessagesState {
  messages: Message[];
  selectedUser: User | null;
  selectedRoom: Room | null;
}

const initialState: MessagesState = {
  messages: [],
  selectedUser: null,
  selectedRoom: null, // Added selectedRoom to the state
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

// Exporting all actions, including setSelectedRoom
export const { setSelectedUser, setSelectedRoom, setMessages, addMessage } = messagesSlice.actions;

// Exporting the reducer
export default messagesSlice.reducer;
