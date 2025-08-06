import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from '../components/Navbar';
import './EditProfile.css';

const EditProfile = () => {
  const currentUser = auth.currentUser;
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    website: '',
    email: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.displayName || '',
        fullName: '',
        bio: '',
        website: '',
        email: currentUser.email || ''
      });
      setAvatarPreview(currentUser.photoURL || 'https://randomuser.me/api/portraits/men/5.jpg');
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      let avatarUrl = currentUser.photoURL;
      
      // Upload new avatar if selected
      if (avatar) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        const snapshot = await uploadBytes(storageRef, avatar);
        avatarUrl = await getDownloadURL(snapshot.ref);
      }
      
      // Update user profile in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        website: formData.website,
        avatar: avatarUrl,
        updatedAt: new Date()
      });
      
      // Update auth profile
      await currentUser.updateProfile({
        displayName: formData.username,
        photoURL: avatarUrl
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="avatar-upload">
            <div className="avatar-preview">
              <img src={avatarPreview} alt="Profile" />
            </div>
            <label htmlFor="avatar-input">
              Change Profile Photo
              <input 
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength="150"
              rows="3"
            />
            <span className="char-count">{formData.bio.length}/150</span>
          </div>
          
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;