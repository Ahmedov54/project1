import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Home from './pages/Home';
import AddEvent from './pages/AddEvent';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { auth, db } from '../firebaseConfig';
import Navbar from './components/Navbar';
import { UserProvider } from './UserContext';

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth listener with user doc retrieval
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          const userData = {
            email: user.email,
            name: user.displayName || 'Anonim',
            role: 'user'
          };
          await setDoc(userDocRef, userData);
          setUserInfo(userData);
        }
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;