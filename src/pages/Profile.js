import React, { useEffect, useState, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiImage, FiX, FiHeart, FiMessageSquare, FiMoreHorizontal, FiEdit2, FiUserPlus } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ setUploadProgress] = useState(0);
  const [editableUser, setEditableUser] = useState({});
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const currentUser = auth.currentUser;

  // Dummy user data
  const dummyUsers = {
    user1: {
      id: 'user1',
      username: 'travel_lover',
      fullName: 'Sarah Johnson',
      bio: 'Exploring the world one country at a time ✈️',
      followers: 1420,
      following: 563,
      isVerified: true,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      website: 'www.sarah-travels.com',
      email: 'sarah@example.com'
    },
    user2: {
      id: 'user2',
      username: 'foodie_adventures',
      fullName: 'Michael Chen',
      bio: 'Food is life 🍜 Sharing my culinary journey',
      followers: 892,
      following: 342,
      isVerified: false,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      website: 'www.foodie-adventures.com',
      email: 'michael@example.com'
    }
  };

  useEffect(() => {
    // Set user data (in a real app, fetch from Firestore)
    const userData = dummyUsers[userId] || {
      id: 'not_found',
      username: 'user_not_found',
      fullName: 'User Not Found',
      bio: '',
      followers: 0,
      following: 0,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      website: '',
      email: ''
    };
    
    setUser(userData);
    setEditableUser(userData);

    // Check if current user is following this profile
    if (currentUser?.uid === userId) {
      setIsFollowing(false); // Can't follow yourself
    }

    // Fetch user's posts
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setPosts(postList);
    });

    return () => unsubscribe();
  },);

  const handleFollow = async () => {
    if (!currentUser) return;
    
    setIsFollowing(!isFollowing);
    setUser(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPost(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload to storage
        const storageRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update user data
        setUser(prev => ({ ...prev, avatar: downloadURL }));
        setEditableUser(prev => ({ ...prev, avatar: downloadURL }));
        
        // In a real app, you would update Firestore here
        // await updateDoc(doc(db, 'users', currentUser.uid), { avatar: downloadURL });
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const removeImage = () => {
    setNewPost(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim() && !newPost.image) return;

    try {
      let imageUrl = null;
      
      // Upload image if exists
      if (newPost.image && typeof newPost.image !== 'string') {
        const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}`);
        const uploadTask = uploadBytes(storageRef, newPost.image);
        
        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create post in Firestore
      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        user: {
          username: currentUser.displayName || user.username,
          avatar: currentUser.photoURL || user.avatar
        },
        content: newPost.content,
        image: imageUrl || (typeof newPost.image === 'string' ? newPost.image : null),
        likes: 0,
        comments: [],
        createdAt: serverTimestamp()
      });

      // Reset form
      setNewPost({ content: '', image: null });
      setShowPostModal(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const saveProfileChanges = async () => {
    try {
      // In a real app, update Firestore here
      // await updateDoc(doc(db, 'users', currentUser.uid), editableUser);
      setUser(editableUser);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Create Post Modal */}
        {showPostModal && (
          <div className="post-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create new post</h3>
                <button onClick={() => setShowPostModal(false)} className="close-btn">
                  <FiX />
                </button>
              </div>
              
              <div className="post-creator">
                {!newPost.image ? (
                  <div className="upload-area">
                    <FiImage size={48} />
                    <p>Upload photos and videos here</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="select-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Select from computer
                    </button>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={typeof newPost.image === 'string' ? newPost.image : URL.createObjectURL(newPost.image)} alt="Preview" />
                    <button onClick={removeImage} className="remove-image">
                      <FiX />
                    </button>
                  </div>
                )}
                
                <div className="post-caption">
                  <div className="user-info">
                    <img 
                      src={currentUser?.photoURL || user?.avatar} 
                      alt={currentUser?.displayName || user?.username} 
                    />
                    <span>{currentUser?.displayName || user?.username}</span>
                  </div>
                  <textarea
                    placeholder="Write a caption..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                  <div className="char-count">{newPost.content.length}/2,200</div>
                  
                  <button 
                    onClick={createPost}
                    disabled={!newPost.content.trim() && !newPost.image}
                    className="share-btn"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="edit-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="close-btn">
                  <FiX />
                </button>
              </div>
              
              <div className="edit-form">
                <div className="avatar-upload">
                  <img src={editableUser.avatar} alt="Profile" />
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      ref={avatarInputRef}
                      style={{ display: 'none' }}
                    />
                    <button 
                      onClick={() => avatarInputRef.current.click()}
                      className="change-avatar-btn"
                    >
                      Change Profile Photo
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editableUser.username || ''}
                    onChange={(e) => setEditableUser({...editableUser, username: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editableUser.fullName || ''}
                    onChange={(e) => setEditableUser({...editableUser, fullName: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editableUser.bio || ''}
                    onChange={(e) => setEditableUser({...editableUser, bio: e.target.value})}
                    maxLength="150"
                  />
                  <div className="char-count">{editableUser.bio?.length || 0}/150</div>
                </div>
                
                <div className="form-group">
                  <label>Website</label>
                  <input 
                    type="url" 
                    value={editableUser.website || ''}
                    onChange={(e) => setEditableUser({...editableUser, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editableUser.email || ''}
                    onChange={(e) => setEditableUser({...editableUser, email: e.target.value})}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProfileChanges}
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img src={user?.avatar} alt={user?.username} className="profile-avatar" />
            {currentUser?.uid === userId && (
              <button 
                className="edit-avatar-btn"
                onClick={() => avatarInputRef.current.click()}
              >
                <FiEdit2 size={16} />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              ref={avatarInputRef}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="profile-info">
            <div className="profile-name">
              <h2>{user?.username}</h2>
              {user?.isVerified && <span className="verified-badge">✓</span>}
              
              {currentUser?.uid === userId ? (
                <>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="edit-profile-btn"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="create-post-btn"
                  >
                    Create Post
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleFollow}
                    className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="message-btn">Message</button>
                  <button className="add-user-btn">
                    <FiUserPlus size={18} />
                  </button>
                </>
              )}
              <button className="options-btn">
                <FiMoreHorizontal />
              </button>
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <strong>{formatNumber(posts.length)}</strong>
                <span>posts</span>
              </div>
              <div className="stat">
                <strong>{formatNumber(user?.followers)}</strong>
                <span>followers</span>
              </div>
              <div className="stat">
                <strong>{formatNumber(user?.following)}</strong>
                <span>following</span>
              </div>
            </div>
            
            <div className="profile-bio">
              <h3>{user?.fullName}</h3>
              <p>{user?.bio}</p>
              {user?.website && (
                <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="website-link">
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button className="tab active">
            <span className="tab-icon">📷</span>
            <span>Posts</span>
          </button>
          <button className="tab">
            <span className="tab-icon">🎥</span>
            <span>Reels</span>
          </button>
          <button className="tab">
            <span className="tab-icon">🔖</span>
            <span>Saved</span>
          </button>
          <button className="tab">
            <span className="tab-icon">🏷️</span>
            <span>Tagged</span>
          </button>
        </div>
        
        {/* Posts Grid */}
        <div className="profile-posts">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post.id} className="post-thumbnail">
                  {post.image ? (
                    <img src={post.image} alt="Post" />
                  ) : (
                    <div className="text-post">
                      <p>{post.content}</p>
                    </div>
                  )}
                  <div className="post-overlay">
                    <span><FiHeart /> {post.likes || 0}</span>
                    <span><FiMessageSquare /> {post.comments?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">📷</div>
              <h3>No Posts Yet</h3>
              <p>When {user?.username} shares photos and videos, they'll appear here.</p>
              {currentUser?.uid === userId && (
                <button 
                  onClick={() => setShowPostModal(true)}
                  className="create-post-btn"
                >
                  Share your first photo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;