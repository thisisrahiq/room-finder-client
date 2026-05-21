import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user details to backend
  const syncUserToBackend = async (firebaseUser, nameValue = null, photoURLValue = null) => {
    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'https://room-finder-server-tan.vercel.app';

      const payload = {
        uid: firebaseUser.uid,
        name: nameValue || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        photoURL: photoURLValue || firebaseUser.photoURL || '',
        provider: firebaseUser.providerData?.[0]?.providerId || 'email'
      };

      await axios.post(`${apiUrl}/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error syncing user with backend:', err);
    }
  };

  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile in Firebase
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
      });
      // Sync with MongoDB
      await syncUserToBackend(userCredential.user, name, photoURL);
      return userCredential.user;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToBackend(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    });
    // Trigger sync
    await syncUserToBackend(auth.currentUser, name, photoURL);
    // Force user update in state
    setCurrentUser({ ...auth.currentUser });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserToBackend(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    createUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
