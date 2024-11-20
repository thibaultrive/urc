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
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
      {/* Vérification des messages */}
      {messages && messages.length > 0 ? (
        messages.map((message) => {
          const isSentByLoggedUser = String(message.sender_id) === String(loggedUserId);

          return (
            <Box
              key={message.message_id}
              sx={{
                marginBottom: 2,
                padding: 1,
                borderRadius: '8px',
                backgroundColor: isSentByLoggedUser ? 'primary.200' : 'neutral.100',
                alignSelf: isSentByLoggedUser ? 'flex-end' : 'flex-start',
                maxWidth: '75%', // Limite la largeur des bulles de message
              }}
            >
              <Typography
                sx={{ wordWrap: 'break-word' }} // Permet de gérer les longs messages
                aria-label={isSentByLoggedUser ? 'Message sent' : 'Message received'}
              >
                {message.content}
              </Typography>
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
