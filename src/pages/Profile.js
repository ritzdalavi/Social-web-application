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
  const [, setUploadProgress] = useState(0); // uploadProgress not used
  const [editableUser, setEditableUser] = useState({});
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const currentUser = auth.currentUser;

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

    if (currentUser?.uid === userId) {
      setIsFollowing(false);
    }

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
  }, [userId]);

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
        const storageRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        setUser(prev => ({ ...prev, avatar: downloadURL }));
        setEditableUser(prev => ({ ...prev, avatar: downloadURL }));

        // To update Firestore in real app
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

      if (newPost.image && typeof newPost.image !== 'string') {
        const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}`);
        const uploadTask = uploadBytes(storageRef, newPost.image);

        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }

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

      setNewPost({ content: '', image: null });
      setShowPostModal(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const saveProfileChanges = async () => {
    try {
      // In real app, update Firestore here
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
        {/* Modals and UI code stays as is (unchanged) */}
        {/* You can keep your JSX below this point as you had it */}
      </div>
    </>
  );
};

export default Profile;
