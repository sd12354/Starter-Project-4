/**
 * API service for communicating with Django backend
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/';

export const api = {
  // Get all challenges with high scores
  async getChallenges() {
    const response = await fetch(`${API_BASE_URL}/challenges/`);
    if (!response.ok) {
      throw new Error('Failed to fetch challenges');
    }
    return response.json();
  },

  // Get a specific challenge by ID
  async getChallenge(challengeId) {
    const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch challenge');
    }
    return response.json();
  },

  // Submit a score to the leaderboard
  async submitScore(scoreData) {
    const response = await fetch(`${API_BASE_URL}/scores/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit score');
    }
    return response.json();
  },

  // Get leaderboard for a challenge
  async getLeaderboard(challengeId) {
    const response = await fetch(`${API_BASE_URL}/leaderboard/${challengeId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    return response.json();
  },
};

