import React, { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setUsers, setRooms, setSelectedUser, setSelectedRoom, setSelectedUserRomm } from '../features/usersSlice';
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
  const user_id = sessionStorage.getItem('user_id');

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
          console.log(loggedUserId);
          const filteredUsers = data.filter((user: User) => user.user_id.toString() !== user_id);
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
    dispatch(setSelectedRoom(null)); // Clear selected room
    dispatch(setSelectedUserRomm(true)); // Conversation utilisateur
    onUserSelect(user); // Callback optionnel
  };
  
  const handleRoomClick = (room: Room) => {
    dispatch(setSelectedRoom(room));
    dispatch(setSelectedUser(null)); // Clear selected user
    dispatch(setSelectedUserRomm(false)); // Conversation salon
    onRoomSelect(room); // Callback optionnel
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
{/* Users Section */}
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <Typography component="h6" sx={{ mb: 3, fontSize: '1.25rem', fontWeight: '600' }}>
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
                p: 2,
                borderRadius: 'lg',
                boxShadow: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 4,
                  bgcolor: 'neutral.softBg',
                },
              }}
              onClick={() => handleUserClick(user)}
            >
              <Box
                component="img"
                src={`https://placehold.co/200x200?text=${user.username.charAt(0)}`}
                alt={user.username}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: 'neutral.400',
                  mr: 2,
                  objectFit: 'cover',
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 500 }}>{user.username}</Typography>
                <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
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
        <Typography component="h6" sx={{ mb: 3, fontSize: '1.25rem', fontWeight: '600' }}>
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
                p: 2,
                borderRadius: 'lg',
                boxShadow: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 4,
                  bgcolor: 'neutral.softBg',
                },
              }}
              onClick={() => handleRoomClick(room)}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: 'neutral.400',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#007bff',
                  fontSize: '1.25rem',
                }}
              >
                {room.name.charAt(0)}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 500 }}>{room.name}</Typography>
                <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
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
