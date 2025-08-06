import React, { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import './CreatePost.css';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const currentUser = auth.currentUser;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    
    setIsUploading(true);
    
    try {
      // Upload image to storage
      const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      // Create post in Firestore
      await addDoc(collection(db, 'posts'), {
        content: caption,
        author: currentUser.displayName || 'Anonymous',
        userId: currentUser.uid,
        image: imageUrl,
        likes: [],
        likesCount: 0,
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setCaption('');
      setImage(null);
      setPreview(null);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-post-container">
        <h2>Create New Post</h2>
        
        <div className="create-post-content">
          {preview ? (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          ) : (
            <div className="upload-area">
              <label htmlFor="post-image">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="3"></circle>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <p>Upload a photo</p>
              </label>
              <input 
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
          
          <div className="caption-area">
            <div className="user-info">
              <img 
                src={currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/5.jpg'} 
                alt="User" 
              />
              <span>{currentUser?.displayName || 'User'}</span>
            </div>
            
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="5"
            />
            
            <button 
              onClick={handleSubmit}
              disabled={!image || isUploading}
              className={`share-btn ${(!image || isUploading) ? 'disabled' : ''}`}
            >
              {isUploading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;