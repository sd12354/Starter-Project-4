import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { api } from './api';
import './ChallengeLoader.css';

function ChallengeLoader({ open, onClose, onSelectChallenge }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      loadChallenges();
    }
  }, [open]);

  const loadChallenges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading challenges...');
      const challengesList = await api.getChallenges();
      console.log('Challenges received:', challengesList);
      if (Array.isArray(challengesList)) {
        setChallenges(challengesList);
      } else {
        throw new Error('Invalid response format: expected array');
      }
    } catch (err) {
      console.error('Error loading challenges:', err);
      const errorMessage = err.message.includes('Failed to fetch') 
        ? 'Unable to connect to API server. The Heroku app may be down (502 error). Check Heroku logs: heroku logs --tail'
        : `Failed to load challenges: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeSelect = (challenge) => {
    onSelectChallenge(challenge);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Load Challenge</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : challenges.length === 0 ? (
          <Typography>No challenges available. Please run: python manage.py populate_challenges</Typography>
        ) : (
          <List>
            {challenges.map((challenge) => (
              <ListItem key={challenge.id} disablePadding>
                <ListItemButton onClick={() => handleChallengeSelect(challenge)}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">{challenge.name}</Typography>
                        <Chip 
                          label={challenge.difficulty} 
                          size="small" 
                          color={getDifficultyColor(challenge.difficulty)}
                        />
                        <Chip 
                          label={`${challenge.size}x${challenge.size}`} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {challenge.highScore !== null 
                          ? `High Score: ${challenge.highScore} by ${challenge.highScorePlayer || 'Unknown'}`
                          : 'No scores yet'}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChallengeLoader;

