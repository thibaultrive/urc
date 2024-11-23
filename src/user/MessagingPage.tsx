import React, { useState, useEffect } from 'react';
import { Box, Sheet, CircularProgress } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { addMessage, setMessages, setSelectedUser } from '../features/messagesSlice';
import Sidebar from './Sidebar';
import { MessageList } from './MessageList';
import { Message, User } from '../model/common';
import { format, parse } from 'date-fns';

export default function MessagingPage() {
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, messages } = useSelector((state: RootState) => state.messages);
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);
  const token = sessionStorage.getItem('token');

  // Fetch messages
  useEffect(() => {
    if (!selectedUser) {
      navigate('/messaging'); // Redirige si aucun utilisateur n'est sélectionné
      return;
    }
  
    const fetchMessages = async () => {
      setLoadingMessages(true); // Active le loader
      try {
        const response = await fetch(
          `/api/message?receiver_id=${selectedUser.user_id}&receiver_type=user`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Fetched messages:", data);
  
        // Assurez-vous que les messages contiennent un timestamp bien formaté
        const formattedMessages = data.messages.map((message: Message) => {
          try {
            // Parse la chaîne `created_at` (format connu "dd/MM/yyyy HH:mm")
            const parsedDate = parse(message.created_at, 'dd/MM/yyyy HH:mm', new Date());
    
            // Si parsing réussi, formatte la date
            return {
              ...message,
              created_at: format(parsedDate, 'MMMM dd, yyyy HH:mm'), // Exemple: "November 22, 2024 20:31"
            };
          } catch (err) {
            console.error("Error parsing date:", err);
            return message; // Retourne le message tel quel si le parsing échoue
          }
        });
  
        dispatch(setMessages(formattedMessages));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false); // Désactive le loader
      }
    };
  
    fetchMessages();
  }, [selectedUser, token, dispatch, navigate]);
  

  // Send a new message
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) {
      console.error('Message content or recipient is missing.');
      return;
    }

    setSending(true);

    const payload = {
      sender_id: loggedUserId,
      receiver_id: selectedUser.user_id,
      receiver_type: 'user',
      content: newMessage.trim(),
    };

    try {
      const response = await fetch('/api/envoyerMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unknown error occurred');
      }

      const { data } = await response.json();
      console.log("Message sent:", data);
      dispatch(addMessage(data)); // Vérifie que `data` contient bien le message attendu
      setNewMessage('');  // Réinitialise le champ de message après envoi
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send the message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', paddingTop: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          {/* Sidebar */}
          <Sheet sx={{ flex: '0 0 25%', padding: 2 }}>
            <Sidebar
                onUserSelect={(user: User | null) => dispatch(setSelectedUser(user))}
                onRoomSelect={(room) => {
                  // Handle room selection if needed
                  console.log('Selected Room:', room);
                }}
              />          
          </Sheet>

          {/* Chat Section */}
          <Sheet
            sx={{
              flex: '1',
              paddingLeft: 2,
              backgroundColor: 'background.level1',
              borderRadius: '8px',
              boxShadow: 'sm',
              height: 'calc(100vh - 100px)',
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2>
                Chat with {selectedUser?.username || '...'}
              </h2>

              {/* Loading Spinner */}
              {loadingMessages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* Message List */}
                  <MessageList messages={messages} />

                  {/* Input Section */}
                  <Box
                    sx={{
                      display: 'flex',
                      mt: 'auto',
                      p: 2,
                      borderTop: '1px solid #ddd',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={{
                        flexGrow: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                  <button
                    onClick={sendMessage}
                    style={{
                      marginLeft: '8px',
                      padding: '8px 16px',
                      backgroundColor: sending ? '#aaa' : '#007bff',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>

                  </Box>
                </>
              )}
            </Box>
          </Sheet>
        </Box>
      </Box>
    </Box>
  );
}
