import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; // ✅ Correct Firebase import
import Navbar from '../components/Navbar';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // ✅ Redirect to login after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings-container">
        <div className="settings-sidebar">
          <h3>Settings</h3>
          {['account', 'privacy', 'notifications', 'security'].map(tab => (
            <button
              key={tab}
              className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <div className="settings-option">
                <h4>Edit Profile</h4>
                <p>Change your profile information</p>
                <Link to="/edit-profile" className="settings-btn">Edit Profile</Link>
              </div>

              <div className="settings-option">
                <h4>Change Password</h4>
                <p>Update your account password</p>
                <button className="settings-btn">Change Password</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              <div className="settings-option">
                <h4>Private Account</h4>
                <p>Make your account private</p>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <h4>Activity Status</h4>
                <p>Show when you're active</p>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <div className="settings-option">
                <h4>Push Notifications</h4>
                <p>Receive push notifications</p>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <h4>Email Notifications</h4>
                <p>Receive email notifications</p>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="settings-option">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
                <button className="settings-btn">Enable 2FA</button>
              </div>

              <div className="settings-option">
                <h4>Login Activity</h4>
                <p>Review your account login history</p>
                <button className="settings-btn">View Activity</button>
              </div>
            </div>
          )}

          <div className="logout-section">
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
