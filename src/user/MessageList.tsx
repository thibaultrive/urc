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
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, backgroundColor: '#f5f5f5' }}>
      {messages && messages.length > 0 ? (
        messages.map((message) => {
          const isSentByLoggedUser = String(message.sender_id) === String(loggedUserId);

          return (
            <Box
              key={message.message_id}
              sx={{
                display: 'flex',
                justifyContent: isSentByLoggedUser ? 'flex-end' : 'flex-start',
                marginBottom: 3,
              }}
            >
              <Box
                sx={{
                  padding: 2,
                  borderRadius: '20px',
                  backgroundColor: isSentByLoggedUser ? '#007bff' : '#e0e0e0',
                  color: isSentByLoggedUser ? 'white' : 'black',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {/* Affiche l'émetteur avec un petit avatar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginBottom: '0.3rem',
                      color: isSentByLoggedUser ? 'white' : 'black',
                    }}
                  >
                    {isSentByLoggedUser ? 'You' : message.sender_name}
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isSentByLoggedUser ? 'green' : '#888',
                    }}
                  />
                </Box>

                {/* Contenu du message */}
                <Typography sx={{ fontSize: '1rem' }}>{message.content}</Typography>

                {/* Timestamp du message */}
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: isSentByLoggedUser ? '#cccccc' : '#777777',
                    marginTop: '0.5rem',
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
        <Typography sx={{ textAlign: 'center', color: '#888' }}>
          No messages yet.
        </Typography>
      )}
      {/* Élément caché pour auto-scroll */}
      <div ref={scrollRef} />
    </Box>
  );
}
