import React, { useState, useEffect } from 'react';
import { Box, Sheet, CircularProgress } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { addMessage, setMessages, setSelectedUser, setSelectedRoom } from '../features/messagesSlice';
import { setSelectedUserRomm} from '../features/usersSlice';
import Sidebar from './Sidebar';
import { MessageList } from './MessageList';
import { Message, User, Room } from '../model/common';
import { format, parse } from 'date-fns';
// import Navbar from './Navbar';


export default function MessagingPage() {
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, selectedRoom, messages } = useSelector((state: RootState) => state.messages);
  const {selectedUserRomm} = useSelector((state: RootState) => state.users);
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);
  const token = sessionStorage.getItem('token');

  // Fetch messages
  useEffect(() => {
    if (!selectedUser && !selectedRoom) {
      navigate('/messaging'); // Redirige si rien n'est sélectionné
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true); // Active le loader
    
      try {
        const isUserConversation = selectedUserRomm === true; // Vérifie si c'est une conversation utilisateur
        const receiverId = isUserConversation
          ? selectedUser?.user_id
          : selectedRoom?.room_id;
        const receiverType = isUserConversation ? 'user' : 'room';
    
        if (!receiverId) {
          throw new Error('Receiver ID is not defined.');
        }
    
        const endpoint = `/api/message?receiver_id=${receiverId}&receiver_type=${receiverType}`;
        console.log("Fetching messages for:", { receiverId, receiverType });
    
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Fetched messages:", data);
    
        const formattedMessages = data.messages.map((message: Message) => {
          try {
            const parsedDate = parse(message.created_at, 'dd/MM/yyyy HH:mm', new Date());
            return {
              ...message,
              created_at: format(parsedDate, 'MMMM dd, yyyy HH:mm'),
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
  }, [selectedUser, selectedRoom, selectedUserRomm, token, dispatch, navigate]);

  // Send a new message
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim() || (!selectedUser && !selectedRoom)) {
      console.error('Message content or recipient is missing.');
      return;
    }

    setSending(true);

    const payload = {
      sender_id: loggedUserId,
      receiver_id: selectedUserRomm ? selectedUser?.user_id : selectedRoom?.room_id,
      receiver_type: selectedUserRomm ? 'user' : 'room',
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
      dispatch(addMessage(data));
      setNewMessage(''); // Réinitialise le champ de message après envoi
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send the message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           {/*  <Navbar /> */}

      <Box sx={{ flexGrow: 1, display: 'flex', paddingTop: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          {/* Sidebar */}
          <Sheet sx={{ flex: '0 0 25%', padding: 2 }}>
            <Sidebar
              onUserSelect={(user: User | null) => dispatch(setSelectedUser(user))}
              onRoomSelect={(room: Room | null) => dispatch(setSelectedRoom(room))}
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
                Chat with {selectedUserRomm? selectedUser?.username : selectedRoom?.name }
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
