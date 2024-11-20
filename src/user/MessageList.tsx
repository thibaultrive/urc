import React from 'react';
import { Box, Typography } from '@mui/joy';
import { Message } from '../model/common';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface MessageListProps {
  messages: Message[] | undefined;
}


export function MessageList({ messages }: MessageListProps) {
  // Récupère l'ID de l'utilisateur connecté
  
  const loggedUserId = sessionStorage.getItem('user_id');

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
      {messages && messages.length > 0 ? (
        messages.map((message) => {
          const isSentByLoggedUser = String(message.sender_id) === String(loggedUserId);

          return (
            <Box
              key={message.message_id}
              sx={{
                display: 'flex',
                justifyContent: isSentByLoggedUser ? 'flex-end' : 'flex-start',
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  padding: 1,
                  borderRadius: '12px',
                  backgroundColor: isSentByLoggedUser ? 'primary.500' : 'neutral.200',
                  color: isSentByLoggedUser ? 'white' : 'black',
                  maxWidth: '75%', // Limite la largeur des bulles de message
                  wordBreak: 'break-word',
                }}
              >
                <Typography>{message.content}</Typography>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center', color: 'neutral.500' }}>
          No messages yet.
        </Typography>
      )}
    </Box>
  );
}
