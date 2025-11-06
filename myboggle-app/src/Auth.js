import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Button, Avatar, Typography, Box } from '@mui/material';
import './Auth.css';

function Auth({ user, onAuthChange }) {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthChange will be called automatically via auth state listener
    } catch (error) {
      console.error('Error signing in:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to sign in. ';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage += 'Sign-in popup was closed.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage += 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage += 'This domain is not authorized. Please check Firebase Console settings.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage += 'Google sign-in is not enabled. Please enable it in Firebase Console.';
      } else {
        errorMessage += `Error: ${error.message || error.code}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // onAuthChange will be called automatically via auth state listener
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  if (user) {
    return (
      <Box className="Auth-container" display="flex" alignItems="center" gap={2}>
        <Avatar 
          src={user.photoURL} 
          alt={user.displayName || 'User'}
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="body2" className="Auth-user-name">
          {user.displayName || user.email}
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Box className="Auth-container">
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleSignIn}
        startIcon={
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g fill="#000" fillRule="evenodd">
              <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
              <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.21 1.18-.84 2.18-1.79 2.91l2.78 2.15c1.9-1.75 2.69-4.33 2.69-7.56z" fill="#4285F4"/>
              <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"/>
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.78-2.15c-.76.53-1.78.9-3.18.9-2.38 0-4.4-1.57-5.12-3.74L.96 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"/>
            </g>
          </svg>
        }
      >
        Sign in with Google
      </Button>
    </Box>
  );
}

export default Auth;

