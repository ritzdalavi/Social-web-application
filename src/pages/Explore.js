import React from 'react';
import Navbar from '../components/Navbar';
import './Explore.css';

const Explore = () => {
  // Enhanced dummy data with more realistic content
  const explorePosts = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=500&auto=format&fit=crop', 
      likes: 1243,
      username: 'travel_enthusiast',
      userImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop', 
      likes: 892,
      username: 'food_lover',
      userImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    { 
      id: 3, 
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&auto=format&fit=crop', 
      likes: 1532,
      username: 'nature_photographer',
      userImage: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    { 
      id: 4, 
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format&fit=crop', 
      likes: 764,
      username: 'architecture_daily',
      userImage: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    { 
      id: 5, 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop', 
      likes: 987,
      username: 'fitness_coach',
      userImage: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
    { 
      id: 6, 
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500&auto=format&fit=crop', 
      likes: 543,
      username: 'art_gallery',
      userImage: 'https://randomuser.me/api/portraits/men/84.jpg'
    },
    { 
      id: 7, 
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop', 
      likes: 876,
      username: 'tech_geek',
      userImage: 'https://randomuser.me/api/portraits/women/25.jpg'
    },
    { 
      id: 8, 
      image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&auto=format&fit=crop', 
      likes: 1321,
      username: 'animal_lover',
      userImage: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    { 
      id: 9, 
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop', 
      likes: 654,
      username: 'fashion_icon',
      userImage: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    { 
      id: 10, 
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop', 
      likes: 2105,
      username: 'landscape_master',
      userImage: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    { 
      id: 11, 
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&auto=format&fit=crop', 
      likes: 876,
      username: 'urban_explorer',
      userImage: 'https://randomuser.me/api/portraits/women/51.jpg'
    },
    { 
      id: 12, 
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop', 
      likes: 1432,
      username: 'adventure_seeker',
      userImage: 'https://randomuser.me/api/portraits/men/36.jpg'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="explore-container">
        <h2 className="explore-title">Discover Amazing Content</h2>
        <div className="explore-grid">
          {explorePosts.map(post => (
            <div key={post.id} className="explore-post">
              <img 
                src={post.image} 
                alt={`Post by ${post.username}`} 
                className="explore-image"
                loading="lazy" // Lazy loading for better performance
              />
              <div className="post-overlay">
                <div className="post-user">
                  <img 
                    src={post.userImage} 
                    alt={post.username} 
                    className="user-avatar"
                  />
                  <span className="username">@{post.username}</span>
                </div>
                <div className="post-stats">
                  <span className="likes">❤️ {post.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;