import React, { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setUsers, setRooms, setSelectedUser, setSelectedRoom } from '../features/usersSlice';
import { User, Room } from '../model/common';

// Define the props interface
export interface SidebarProps {
  onUserSelect: (user: User | null) => void;
  onRoomSelect: (room: Room | null) => void;
}

export default function Sidebar({ onUserSelect, onRoomSelect }: SidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, rooms } = useSelector((state: RootState) => state.users);
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // Fetch users
    fetch('/api/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredUsers = data.filter((user: User) => user.user_id.toString() !== loggedUserId);
          dispatch(setUsers(filteredUsers));
        } else {
          console.error('Invalid users data structure', data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch rooms
    fetch('/api/rooms', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          dispatch(setRooms(data));
        } else {
          console.error('Invalid rooms data structure', data);
        }
      })
      .catch((error) => console.error('Error fetching rooms:', error));
  }, [dispatch, loggedUserId, token]);

  const handleUserClick = (user: User) => {
    dispatch(setSelectedUser(user));
    dispatch(setSelectedRoom(null)); // Deselect room
    onUserSelect(user); // Call the prop function
    //navigate(`/messaging/user/${user.user_id}`);
  };

  const handleRoomClick = (room: Room) => {
    dispatch(setSelectedRoom(room));
    dispatch(setSelectedUser(null)); // Deselect user
    onRoomSelect(room); // Call the prop function
   // navigate(`/messaging/room/${room.room_id}`);
  };

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #ddd',
        bgcolor: 'background.level1',
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.500',
          color: 'white',
          borderBottom: '1px solid #ddd',
        }}
      >
        <Typography component="h5">Chat Web</Typography>
      </Box>

      {/* Users Section */}
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <Typography component="h6" sx={{ mb: 2 }}>
          Users
        </Typography>
        {users.length > 0 ? (
          users.map((user) => (
            <Box
              key={user.user_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                cursor: 'pointer',
                p: 1,
                borderRadius: 'md',
                '&:hover': { bgcolor: 'neutral.softBg' },
              }}
              onClick={() => handleUserClick(user)}
            >
              <Box
                component="img"
                src={`https://placehold.co/200x200?text=${user.username.charAt(0)}`}
                alt={user.username}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'neutral.400',
                  mr: 2,
                }}
              />
              <Box>
                <Typography>{user.username}</Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  {user.last_login || 'No recent message'}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography component="span" sx={{ color: 'neutral.500' }}>
            No users available or loading...
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Rooms Section */}
        <Typography component="h6" sx={{ mb: 2 }}>
          Rooms
        </Typography>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Box
              key={room.room_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                cursor: 'pointer',
                p: 1,
                borderRadius: 'md',
                '&:hover': { bgcolor: 'neutral.softBg' },
              }}
              onClick={() => handleRoomClick(room)}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'neutral.400',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#007bff',
                }}
              >
                {room.name.charAt(0)}
              </Box>
              <Box>
                <Typography>{room.name}</Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  {room.created_on || 'No description'}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography component="span" sx={{ color: 'neutral.500' }}>
            No rooms available or loading...
          </Typography>
        )}
      </Box>
    </Box>
  );
}
