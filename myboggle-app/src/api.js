/**
 * API service for communicating with Django backend
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api';

// Helper to ensure URL doesn't have double slashes
const buildUrl = (endpoint) => {
  // Clean base URL - remove trailing slashes
  let base = API_BASE_URL.replace(/\/+$/, '');
  // Ensure base ends with /api
  if (!base.endsWith('/api')) {
    base = base.endsWith('/') ? base + 'api' : base + '/api';
  }
  // Clean endpoint - remove leading slashes
  const path = endpoint.replace(/^\/+/, '');
  // Combine without double slashes
  return `${base}/${path}`;
};

export const api = {
  // Get all challenges with high scores
  async getChallenges() {
    const url = buildUrl('challenges/');
    console.log('Fetching challenges from:', url);
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch challenges: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Challenges loaded:', data.length);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Get a specific challenge by ID
  async getChallenge(challengeId) {
    const response = await fetch(buildUrl(`challenges/${challengeId}/`));
    if (!response.ok) {
      throw new Error('Failed to fetch challenge');
    }
    return response.json();
  },

  // Submit a score to the leaderboard
  async submitScore(scoreData) {
    const response = await fetch(buildUrl('scores/'), {
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
    const response = await fetch(buildUrl(`leaderboard/${challengeId}/`));
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    return response.json();
  },
};
