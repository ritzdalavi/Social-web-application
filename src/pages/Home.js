import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import './Home.css';

const Home = () => {
  const [postContent, setPostContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        title: 'Senior Product Manager at TechCorp',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      content: 'Just launched our new product! So excited to share this with all of you after months of hard work with an amazing team.',
      image: 'https://source.unsplash.com/random/800x400?tech',
      likes: 124,
      comments: 28,
      shares: 12,
      time: '2h ago',
    },
    {
      id: 2,
      user: {
        name: 'Michael Chen',
        title: 'Data Scientist | AI Researcher',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      content: 'Interesting findings from our latest research on neural networks...',
      likes: 89,
      comments: 15,
      shares: 7,
      time: '5h ago',
    },
  ]);

  const [suggestions] = useState([
    {
      id: 1,
      name: 'Tech Innovations Conference',
      followers: '12,345 followers',
      avatar: 'https://source.unsplash.com/random/100x100?conference',
    },
    {
      id: 2,
      name: 'Artificial Intelligence Group',
      followers: '45,678 members',
      avatar: 'https://source.unsplash.com/random/100x100?ai',
    },
    {
      id: 3,
      name: 'Startup Founders Network',
      followers: '23,456 members',
      avatar: 'https://source.unsplash.com/random/100x100?startup',
    },
  ]);

  const [connections] = useState([
    {
      id: 1,
      name: 'David Wilson',
      title: 'UX Designer at CreativeMinds',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
    {
      id: 2,
      name: 'Emma Rodriguez',
      title: 'Marketing Director at BrandCo',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    {
      id: 3,
      name: 'James Peterson',
      title: 'Software Engineer at DevSolutions',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          displayName: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg',
          // You can add more user details here from your database if needed
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost = {
      id: posts.length + 1,
      user: {
        name: currentUser?.displayName || 'You',
        title: 'Your current position', // You can replace this with actual user data
        avatar: currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      content: postContent,
      likes: 0,
      comments: 0,
      shares: 0,
      time: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  if (!currentUser) {
    return <div className="home">Loading user data...</div>;
  }

  return (
    <div className="home">
      <div className="home-body">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="profile-banner"></div>
            <div className="profile-info">
              <img src={currentUser.photoURL} alt="Profile" className="profile-pic" />
              <h3>{currentUser.displayName}</h3>
              <p>{currentUser.email}</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span>Who viewed your profile</span>
                <strong>45</strong>
              </div>
              <div className="stat">
                <span>Connections</span>
                <strong>312</strong>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Recent</h3>
            <ul>
              <li><i className="fas fa-hashtag"></i> #webdevelopment</li>
              <li><i className="fas fa-hashtag"></i> #reactjs</li>
              <li><i className="fas fa-hashtag"></i> #careergrowth</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Create Post */}
          <div className="create-post">
            <form onSubmit={handlePostSubmit}>
              <div className="post-input">
                <img src={currentUser.photoURL} alt="User" />
                <input
                  type="text"
                  placeholder="Start a post"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
              <div className="post-options">
                <button type="button"><i className="fas fa-image"></i> Photo</button>
                <button type="button"><i className="fas fa-video"></i> Video</button>
                <button type="button"><i className="fas fa-calendar-alt"></i> Event</button>
                <button type="button"><i className="fas fa-newspaper"></i> Write article</button>
              </div>
              <button type="submit" className="post-button" disabled={!postContent.trim()}>
                Post
              </button>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            {posts.map((post) => (
              <div className="post" key={post.id}>
                <div className="post-header">
                  <img src={post.user.avatar} alt={post.user.name} />
                  <div className="post-user-info">
                    <h4>{post.user.name}</h4>
                    <p>{post.user.title}</p>
                    <span>{post.time}</span>
                  </div>
                  <button className="post-options">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post content" />}
                </div>
                <div className="post-stats">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
                <div className="post-actions">
                  <button><i className="far fa-thumbs-up"></i> Like</button>
                  <button><i className="far fa-comment"></i> Comment</button>
                  <button><i className="fas fa-share"></i> Share</button>
                  <button><i className="far fa-paper-plane"></i> Send</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-section">
            <h3>Add to your feed</h3>
            {suggestions.map((item) => (
              <div className="feed-suggestion" key={item.id}>
                <img src={item.avatar} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.followers}</p>
                  <button>+ Follow</button>
                </div>
              </div>
            ))}
            <button className="see-all">See all</button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-header">
              <h3>People you may know</h3>
              <button>See all</button>
            </div>
            {connections.map((connection) => (
              <div className="connection" key={connection.id}>
                <img src={connection.avatar} alt={connection.name} />
                <div>
                  <h4>{connection.name}</h4>
                  <p>{connection.title}</p>
                  <button>+ Connect</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;