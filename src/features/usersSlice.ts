// src/features/usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState, Room } from "../model/common";

const initialState: UsersState = {
  users: [],
  rooms: [],
  selectedUser: null,
  selectedRoom: null,
  selectedUserRomm: null  // Add this to the initial state
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
      if (action.payload) {
        state.selectedRoom = null; // Clear selected room when a user is selected
    }
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      console.log('Selected Room:', action.payload);
      state.selectedRoom = action.payload;
      if (action.payload) {
        state.selectedUser = null; // Clear selected user when a room is selected
    }
  },
    setSelectedUserRomm: (state, action: PayloadAction<boolean | null>) => {
      state.selectedUserRomm = action.payload;

  },
  
    
  },
});

export const { setUsers, setRooms, setSelectedUser, setSelectedRoom, setSelectedUserRomm } = usersSlice.actions;
export default usersSlice.reducer;
