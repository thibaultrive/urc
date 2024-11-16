// src/features/usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState, Room} from "../model/common";


const initialState: UsersState = {
    users: [],
    rooms: [],
    selectedUser: null,
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
      },
    },
  });
  
  export const { setUsers, setRooms, setSelectedUser } = usersSlice.actions;
  export default usersSlice.reducer;
