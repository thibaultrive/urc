import React, { useEffect } from 'react';
import { List, ListItem, Typography, Box, Divider } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setRooms, setSelectedUser } from '../features/usersSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, rooms } = useSelector((state: RootState) => state.users);
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // Fetch users
    fetch('/api/users', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredUsers = data.filter(user => user.user_id !== loggedUserId);
          dispatch(setUsers(filteredUsers));
        } else {
          console.error("Invalid data structure", data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch rooms
    fetch('/api/rooms', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          dispatch(setRooms(data));
        } else {
          console.error("Invalid rooms data structure", data);
        }
      })
      .catch((error) => console.error('Error fetching rooms:', error));
  }, [dispatch, loggedUserId, token]);

  const handleUserClick = (user: any) => {
    dispatch(setSelectedUser(user));
    navigate(`/messages/user/${user.user_id}`);
  };

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.level1', // Utilisation des tokens de Joy UI
      }}
    >
      <Typography component="h6" sx={{ mb: 2 }}>
        Users
      </Typography>
      <List>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <ListItem
              key={user.user_id}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'neutral.softBg' },
              }}
              onClick={() => handleUserClick(user)}
            >
              <Typography>{user.username}</Typography>
            </ListItem>
          ))
        ) : (
          <Typography component="span" sx={{ color: 'neutral.500' }}>
            No users available or loading...
          </Typography>
        )}
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography component="h6" sx={{ mb: 2 }}>
        Rooms
      </Typography>
      <List>
        {rooms.length === 0 ? (
          <Typography component="span" sx={{ color: 'neutral.500' }}>
            Loading rooms...
          </Typography>
        ) : (
          rooms.map((room) => (
            <ListItem
              key={room.room_id}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'neutral.softBg' },
              }}
            >
              <Typography>{room.name}</Typography>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
