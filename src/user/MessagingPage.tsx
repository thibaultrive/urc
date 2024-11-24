import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { addMessage, setMessages, setSelectedUser, setSelectedRoom } from '../features/messagesSlice';
import { setSelectedUserRomm } from '../features/usersSlice';
import Sidebar from './Sidebar';
import { MessageList } from './MessageList';
import { Message, User, Room } from '../model/common';
import './page.css'
export default function MessagingPage() {
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, selectedRoom, messages } = useSelector((state: RootState) => state.messages);
  const { selectedUserRomm } = useSelector((state: RootState) => state.users);
  const { user_id: loggedUserId } = useSelector((state: RootState) => state.auth);
  const token = sessionStorage.getItem('token');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!selectedUser && !selectedRoom) {
      navigate('/messaging');
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const receiverId = selectedUserRomm ? selectedUser?.user_id : selectedRoom?.room_id;
        const receiverType = selectedUserRomm ? 'user' : 'room';

        if (!receiverId) {
          throw new Error('Receiver ID is not defined.');
        }

        const response = await fetch(`/api/message?receiver_id=${receiverId}&receiver_type=${receiverType}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.statusText}`);

        const data = await response.json();
        dispatch(setMessages(data.messages));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, selectedRoom, selectedUserRomm, token, dispatch, navigate]);

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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const { data } = await response.json();
      dispatch(addMessage(data));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="messaging-page">
      <div className="sidebar">
        <Sidebar
          onUserSelect={(user: User | null) => dispatch(setSelectedUser(user))}
          onRoomSelect={(room: Room | null) => dispatch(setSelectedRoom(room))}
        />
      </div>

      <div className="chat-area">
        <header>
          <h2>
            Chat with {selectedUserRomm ? selectedUser?.username : selectedRoom?.name}
          </h2>
        </header>

        {loadingMessages ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}

        <footer>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </div>
    </div>
  );
}
