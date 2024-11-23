import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/joy';
import { Message } from '../model/common';

interface MessageListProps {
  messages: Message[] | undefined;
}

export function MessageList({ messages }: MessageListProps) {
  // Récupère l'ID de l'utilisateur connecté
  const loggedUserId = sessionStorage.getItem('user_id');
  const scrollRef = useRef<HTMLDivElement>(null); // Référence pour l'auto-scroll

  // Auto-scroll à la fin des messages lorsqu'ils changent
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                {/* Affiche l'émetteur */}
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginBottom: '0.3rem',
                  }}
                >
                  {isSentByLoggedUser ? 'You' : message.sender_name}
                </Typography>

                {/* Contenu du message */}
                <Typography>{message.content}</Typography>

                {/* Timestamp du message */}
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: isSentByLoggedUser ? 'neutral.300' : 'neutral.600',
                    marginTop: '0.3rem',
                    textAlign: 'right',
                  }}
                >
                  {message.created_at}
                </Typography>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center', color: 'neutral.500' }}>
          No messages yet.
        </Typography>
      )}
      {/* Élément caché pour auto-scroll */}
      <div ref={scrollRef} />
    </Box>
  );
}
