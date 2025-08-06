import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";

// Firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {currentUser && <Navbar />}
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={!currentUser ? <Navigate to="/login" /> : <Home />}
        />

        {/* Auth Routes */}
        <Route
          path="/register"
          element={!currentUser ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/profile/:userId"
          element={currentUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/explore"
          element={currentUser ? <Explore /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={currentUser ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={currentUser ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={currentUser ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={currentUser ? <EditProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={currentUser ? <Settings /> : <Navigate to="/login" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;