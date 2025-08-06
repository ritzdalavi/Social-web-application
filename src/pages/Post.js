import React from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Post.css';

const Post = ({ post }) => {
  const currentUser = auth.currentUser;
  const isLiked = post.likes?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) return;
    
    const postRef = doc(db, 'posts', post.id);
    
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
          likesCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
          likesCount: increment(1)
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <img 
            src={`https://randomuser.me/api/portraits/${post.userId === 'user1' ? 'women' : 'men'}/${post.userId === 'user1' ? 1 : 2}.jpg`} 
            alt={post.author}
            className="author-avatar"
          />
          <div>
            <strong>
              <Link to={`/profile/${post.userId}`} className="author-link">
                {post.author}
              </Link>
            </strong>
            <span className="post-location">New York, USA</span>
          </div>
        </div>
        <span className="timestamp">
          {post.createdAt.toLocaleString()}
        </span>
      </div>
      
      {post.image && (
        <div className="post-image">
          <img src={post.image} alt="Post content" />
        </div>
      )}
      
      <p className="post-content">{post.content}</p>
      
      <div className="post-actions">
        <button 
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          ❤️ {post.likesCount || 0}
        </button>
        <button className="comment-btn">
          💬 Comment
        </button>
        <button className="share-btn">
          ↗️ Share
        </button>
      </div>
      
      <div className="post-comments">
        <div className="comment">
          <span className="comment-author">user123</span>
          <span className="comment-text">Looks amazing! 😍</span>
        </div>
        <div className="comment">
          <span className="comment-author">another_user</span>
          <span className="comment-text">Where is this place?</span>
        </div>
      </div>
      
      <div className="add-comment">
        <input type="text" placeholder="Add a comment..." />
        <button>Post</button>
      </div>
    </div>
  );
};

// Firestore increment helper
const increment = (num) => ({
  incrementValue: num
});

export default Post;