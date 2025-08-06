import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    { 
      id: 1,
      type: 'like',
      user: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      userTitle: 'Product Manager at TechCorp',
      postImage: 'https://source.unsplash.com/random/300x300/?tech',
      time: '2 hours ago',
      read: false
    },
    { 
      id: 2,
      type: 'comment',
      user: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      userTitle: 'Data Scientist | AI Researcher',
      text: 'Great insights! We should discuss this further.',
      time: '5 hours ago',
      read: false
    },
    { 
      id: 3,
      type: 'connection',
      user: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      userTitle: 'UX Designer at CreativeMinds',
      time: '1 day ago',
      read: true
    },
    { 
      id: 4,
      type: 'mention',
      user: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      userTitle: 'Marketing Director at BrandCo',
      text: 'Check out this campaign we worked on!',
      time: '2 days ago',
      read: true
    },
    { 
      id: 5,
      type: 'reaction',
      user: 'James Peterson',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      userTitle: 'Software Engineer at DevSolutions',
      reaction: 'celebrate',
      time: '3 days ago',
      read: true
    },
    { 
      id: 6,
      type: 'job',
      company: 'InnovateTech',
      companyLogo: 'https://logo.clearbit.com/innovatetech.com',
      position: 'Senior Frontend Developer',
      time: '1 week ago',
      read: true
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like':
        return '👍';
      case 'comment':
        return '💬';
      case 'connection':
        return '🤝';
      case 'mention':
        return '@';
      case 'reaction':
        return '🎉';
      case 'job':
        return '💼';
      default:
        return '🔔';
    }
  };

  return (
    <>
      <Navbar />
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <button 
            className="mark-all-read"
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            Mark all as read
          </button>
        </div>

        <div className="notifications-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button 
            className={`tab ${activeTab === 'connection' ? 'active' : ''}`}
            onClick={() => setActiveTab('connection')}
          >
            Connections
          </button>
          <button 
            className={`tab ${activeTab === 'mention' ? 'active' : ''}`}
            onClick={() => setActiveTab('mention')}
          >
            Mentions
          </button>
        </div>

        <div className="notifications-container">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    {notification.type === 'job' ? (
                      <>
                        <div className="notification-header">
                          <img 
                            src={notification.companyLogo} 
                            alt={notification.company} 
                            className="company-logo"
                          />
                          <div>
                            <h3>{notification.company}</h3>
                            <p>{notification.position}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="notification-header">
                          <img 
                            src={notification.avatar} 
                            alt={notification.user} 
                            className="user-avatar"
                          />
                          <div>
                            <h3>{notification.user}</h3>
                            <p>{notification.userTitle}</p>
                          </div>
                        </div>
                        
                        {notification.text && (
                          <p className="notification-text">{notification.text}</p>
                        )}
                      </>
                    )}
                    
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  
                  {notification.postImage && (
                    <img 
                      src={notification.postImage} 
                      alt="Post" 
                      className="notification-post" 
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notifications">
              <p>No {activeTab === 'unread' ? 'unread' : activeTab} notifications</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;