// src/features/usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState, Room } from "../model/common";

const initialState: UsersState = {
  users: [],
  rooms: [],
  selectedUser: null,
  selectedRoom: null, // Add this to the initial state
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      state.selectedRoom = null; // Clear selected room when a user is selected
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
      state.selectedUser = null; // Clear selected user when a room is selected
    },
  },
});

export const { setUsers, setRooms, setSelectedUser, setSelectedRoom } = usersSlice.actions;
export default usersSlice.reducer;
