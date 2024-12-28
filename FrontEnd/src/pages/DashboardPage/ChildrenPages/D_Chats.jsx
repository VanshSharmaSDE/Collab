// pages/DashboardPage/ChildrenPages/D_Chats.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './D_chats.css';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const socket = io(`${API_URL}`);

function D_Chats() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const notifyA = (e) => toast.success(e,
    {
      style: {
        borderRadius: '10px',
        background: '#21262d',
        color: '#fff',
      },
    }
  );
  const notifyB = (e) => toast.error(e, {
    style: {
      borderRadius: '10px',
      background: '#21262d',
      color: '#fff',
    },
  })
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('user_connected', currentUser.id);

    socket.on('receive_message', ({ chatId, message, chat }) => {
      // Update the chats list
      setChats(prevChats => {
        return prevChats.map(prevChat => {
          if (prevChat._id === chatId) {
            // Return the updated chat with the new message
            return {
              ...prevChat,
              messages: [...prevChat.messages, message]
            };
          }
          return prevChat;
        });
      });

      // Update the selected chat if it's the current chat
      if (selectedChat?._id === chatId) {
        setSelectedChat(chat); // Use the full updated chat from the server
      }
    });

    loadChats();

    return () => {
      socket.off('receive_message');
    };
  }, [currentUser.id, selectedChat?._id ]);

  const loadChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/${currentUser.id}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const searchUsers = async (query) => {
    if (query.trim()) {
      try {
        const response = await axios.get(`${API_URL}/api/chat/search/${currentUser.id}?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const startChat = async (otherUser) => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/${currentUser.id}/${otherUser._id}`);
      setSelectedChat(response.data);
      setSearchQuery('');
      setSearchResults([]);
      loadChats();
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const sendMessage = async () => {
    if (message.trim() && selectedChat) {
      const receiverId = selectedChat.participants.find(p => p._id !== currentUser.id)._id;

      // Create a temporary message object for optimistic UI update
      const tempMessage = {
        sender: {
          _id: currentUser.id,
          fullName: currentUser.fullName,
          profileImage: currentUser.profileImage
        },
        content: message.trim(),
        timestamp: new Date()
      };

      // Optimistically update the UI
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage]
      }));

      // Update the chats list optimistically
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              messages: [...chat.messages, tempMessage]
            };
          }
          return chat;
        });
      });

      notifyA('sent !');

      // Send the message through socket
      socket.emit('send_message', {
        chatId: selectedChat._id,
        message: message.trim(),
        senderId: currentUser.id,
        receiverId
      });

      setMessage('');
    }
  };

  // Add scroll to bottom effect
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={
              (e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);

              }}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div
                  key={user._id}
                  className="search-result-item"
                  onClick={() => startChat(user)}
                >
                  <img src={user.profileImage || "https://via.placeholder.com/40"} alt={user.fullName} />
                  <span>{user.fullName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat._id}
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img
                src={chat.participants.find(p => p._id !== currentUser.id).profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
              />
              <div className="chat-item-info">
                <h4>{chat.participants.find(p => p._id !== currentUser.id).fullName}</h4>
                <p>{chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <img
                src={selectedChat.participants.find(p => p._id !== currentUser.id).profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
              />
              <h3>{selectedChat.participants.find(p => p._id !== currentUser.id).fullName}</h3>
            </div>
            <div className="chat-messages" ref={messagesEndRef}>
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender._id === currentUser.id ? 'sent' : 'received'}`}
                >
                  <p>{msg.content}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat or search for users to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default D_Chats;
