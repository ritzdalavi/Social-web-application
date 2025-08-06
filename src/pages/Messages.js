import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { 
  FiSearch, 
  FiMoreVertical, 
  FiPaperclip, 
  FiSmile, 
  FiSend,
  FiVideo,
  FiPhone,
  FiUser,
  FiBellOff,
  FiTrash2,
  FiFlag
} from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import './Messages.css';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Initialize with sample data
  useEffect(() => {
    // Sample conversations with more data
    const initialConversations = [
      {
        id: 1,
        user: 'travel_lover',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        lastMessage: 'See you there!',
        time: '2 hours ago',
        unread: 3,
        status: 'online',
        isVerified: true,
        muted: false
      },
      {
        id: 2,
        user: 'foodie_adventures',
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        lastMessage: 'What do you think about this recipe?',
        time: '1 day ago',
        unread: 5,
        status: 'offline',
        isVerified: false,
        muted: true
      },
      {
        id: 3,
        user: 'tech_geek',
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        lastMessage: 'Check out this new gadget!',
        time: '3 days ago',
        unread: 0,
        status: 'online',
        isVerified: true,
        muted: false
      },
      {
        id: 4,
        user: 'fitness_coach',
        name: 'David Miller',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        lastMessage: 'How was your workout today?',
        time: '1 week ago',
        unread: 0,
        status: 'offline',
        isVerified: false,
        muted: false
      },
      {
        id: 5,
        user: 'bookworm',
        name: 'Olivia Parker',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        lastMessage: 'Just finished that book you recommended!',
        time: '2 weeks ago',
        unread: 2,
        status: 'online',
        isVerified: true,
        muted: false
      }
    ];

    // Sample messages with more variety
    const initialMessages = {
      1: [
        { id: 1, sender: 'travel_lover', text: 'Hey! Are you coming to the meetup tomorrow?', time: '2 hours ago', read: true },
        { id: 2, sender: 'me', text: 'Yes, I\'ll be there around 7pm', time: '1 hour ago', read: true },
        { id: 3, sender: 'travel_lover', text: 'Great! See you there!', time: '2 hours ago', read: true },
        { id: 4, sender: 'me', text: 'Bringing anyone with you?', time: '30 mins ago', read: false }
      ],
      2: [
        { id: 1, sender: 'foodie_adventures', text: 'I found this amazing pasta recipe', time: '1 day ago', read: true },
        { id: 2, sender: 'foodie_adventures', text: 'What do you think about this recipe?', time: '1 day ago', read: false },
        { id: 3, sender: 'foodie_adventures', text: 'It has fresh basil and cherry tomatoes', time: '1 day ago', read: false }
      ],
      3: [
        { id: 1, sender: 'tech_geek', text: 'Check out this new gadget!', time: '3 days ago', read: true },
        { id: 2, sender: 'tech_geek', text: 'It has a foldable screen and 5G support', time: '3 days ago', read: true }
      ],
      4: [
        { id: 1, sender: 'fitness_coach', text: 'How was your workout today?', time: '1 week ago', read: true },
        { id: 2, sender: 'me', text: 'Pretty good! Increased my squat weight', time: '6 days ago', read: true }
      ],
      5: [
        { id: 1, sender: 'bookworm', text: 'Just finished that book you recommended!', time: '2 weeks ago', read: false },
        { id: 2, sender: 'bookworm', text: 'The ending was mind-blowing!', time: '2 weeks ago', read: false }
      ]
    };

    setConversations(initialConversations);
    setMessages(initialMessages);
  }, []);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat, messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const newMsg = {
        id: messages[activeChat] ? messages[activeChat].length + 1 : 1,
        sender: 'me',
        text: newMessage,
        time: 'Just now',
        read: false
      };
      
      // Update messages
      const updatedMessages = {
        ...messages,
        [activeChat]: [...(messages[activeChat] || []), newMsg]
      };
      setMessages(updatedMessages);
      
      // Update conversation last message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeChat) {
          return {
            ...conv,
            lastMessage: newMessage,
            time: 'Just now',
            unread: 0
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      
      setNewMessage('');
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };

  const toggleMuteConversation = (id) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, muted: !conv.muted } : conv
    ));
    setShowOptions(null);
  };

  const deleteConversation = (id) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeChat === id) {
      setActiveChat(null);
    }
    setShowOptions(null);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startVideoCall = () => {
    alert(`Starting video call with ${conversations.find(c => c.id === activeChat).name}`);
  };

  const startVoiceCall = () => {
    alert(`Starting voice call with ${conversations.find(c => c.id === activeChat).name}`);
  };

  return (
    <>
      <Navbar />
      <div className="messages-container">
        <div className="conversations-list">
          <div className="messages-header">
            <h2>Messages</h2>
            <div className="search-conversations">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`conversation ${activeChat === conversation.id ? 'active' : ''} ${conversation.unread > 0 ? 'unread' : ''} ${conversation.muted ? 'muted' : ''}`}
                onClick={() => {
                  setActiveChat(conversation.id);
                  // Mark messages as read when opening conversation
                  if (conversation.unread > 0) {
                    const updatedConversations = conversations.map(conv => 
                      conv.id === conversation.id ? { ...conv, unread: 0 } : conv
                    );
                    setConversations(updatedConversations);
                  }
                }}
              >
                <div className="avatar-container">
                  <img src={conversation.avatar} alt={conversation.user} />
                  {conversation.status === 'online' && <span className="online-badge"></span>}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <strong>
                      {conversation.name}
                      {conversation.isVerified && <span className="verified-badge">✓</span>}
                    </strong>
                    <span className="conversation-time">{conversation.time}</span>
                  </div>
                  <p className="conversation-preview">
                    {conversation.lastMessage}
                    {conversation.muted && <span className="muted-icon">🔇</span>}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="unread-badge">{conversation.unread}</span>
                )}
              </div>
            ))
          ) : (
            <div className="no-conversations">
              <p>No conversations found</p>
            </div>
          )}
        </div>
        
        <div className="chat-container">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="avatar-container">
                    <img src={conversations.find(c => c.id === activeChat).avatar} alt="" />
                    {conversations.find(c => c.id === activeChat).status === 'online' && (
                      <span className="online-badge"></span>
                    )}
                  </div>
                  <div>
                    <strong>
                      {conversations.find(c => c.id === activeChat).name}
                      {conversations.find(c => c.id === activeChat).isVerified && (
                        <span className="verified-badge">✓</span>
                      )}
                    </strong>
                    <p className="user-status">
                      {conversations.find(c => c.id === activeChat).status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="call-btn" onClick={startVoiceCall}>
                    <FiPhone />
                  </button>
                  <button className="video-call-btn" onClick={startVideoCall}>
                    <FiVideo />
                  </button>
                  <div className="more-options-container">
                    <button 
                      className="more-options-btn"
                      onClick={() => toggleOptions(activeChat)}
                    >
                      <FiMoreVertical />
                    </button>
                    {showOptions === activeChat && (
                      <div className="options-dropdown">
                        <button onClick={() => toggleMuteConversation(activeChat)}>
                          <FiBellOff /> {conversations.find(c => c.id === activeChat).muted ? 'Unmute' : 'Mute'}
                        </button>
                        <button>
                          <FiUser /> View Profile
                        </button>
                        <button onClick={() => deleteConversation(activeChat)}>
                          <FiTrash2 /> Delete Chat
                        </button>
                        <button>
                          <FiFlag /> Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="messages-list">
                {messages[activeChat] ? (
                  <>
                    <div className="date-separator">
                      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {messages[activeChat].map(message => (
                      <div 
                        key={message.id} 
                        className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                      >
                        {message.sender !== 'me' && (
                          <img 
                            src={conversations.find(c => c.id === activeChat).avatar} 
                            alt={message.sender} 
                            className="message-avatar"
                          />
                        )}
                        <div className="message-content">
                          <p>{message.text}</p>
                          <div className="message-meta">
                            <span className="message-time">{message.time}</span>
                            {message.sender === 'me' && (
                              <IoCheckmarkDone className={`read-icon ${message.read ? 'read' : ''}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="no-messages">
                    <img src="https://cdn-icons-png.flaticon.com/512/3503/3503761.png" alt="No messages" />
                    <h3>No messages yet</h3>
                    <p>Start the conversation with {conversations.find(c => c.id === activeChat).name}</p>
                  </div>
                )}
              </div>
              
              <div className="message-input-container">
                <button className="attachment-btn">
                  <FiPaperclip />
                </button>
                <div className="emoji-picker-container" ref={emojiPickerRef}>
                  <button 
                    className="emoji-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <FiSmile />
                  </button>
                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder={`Message ${conversations.find(c => c.id === activeChat).name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <FiSend />
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <img src="https://cdn-icons-png.flaticon.com/512/3095/3095583.png" alt="Select conversation" />
              <h3>Select a conversation</h3>
              <p>Choose an existing conversation or start a new one</p>
              <button className="start-new-chat-btn">Start New Chat</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;