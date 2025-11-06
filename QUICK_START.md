# Quick Start Guide

Get your Boggle app running in 5 minutes!

## Prerequisites

- Python 3.8+
- Node.js 14+
- Firebase project set up
- Service account key file

## Step-by-Step Setup

### 1. Backend Setup (2 minutes)

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Make sure serviceAccountKey.json is in myboggle-app/ or project root
# Then populate Firestore
python manage.py populate_challenges

# Start Django server
python manage.py runserver
```

✅ Django API should be running on `http://localhost:8000`

### 2. Frontend Setup (2 minutes)

```bash
# In a new terminal
cd myboggle-app

# Install dependencies (if needed)
npm install

# Start React app
npm start
```

✅ React app should be running on `http://localhost:3000`

### 3. Firebase Setup (1 minute)

1. **Enable Google Authentication:**
   - Go to: https://console.firebase.google.com/project/boggle-app-c0d1c/authentication
   - Click "Sign-in method" → Enable "Google"

2. **Add Authorized Domains:**
   - Firebase Console → Authentication → Settings
   - Add `localhost` (should already be there)
   - Google Cloud Console → APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Add `http://localhost:3000` to Authorized JavaScript origins

### 4. Test It!

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Click "Load Challenge"
4. Select a challenge
5. Play and finish the game
6. Score should be saved automatically!

## Verify Everything Works

### Check Django API:
```bash
curl http://localhost:8000/api/challenges/
```

Should return a JSON array of challenges.

### Check React App:
- Open http://localhost:3000
- Should see "Boggle Solver" title
- Should see "Sign in with Google" button

### Check Firebase:
- Go to Firebase Console → Firestore Database
- Should see `challenges` collection with 10 documents
- After playing a challenge, should see scores in `leaderboard` collection

## Troubleshooting

**Django errors:**
- Check serviceAccountKey.json is in the right place
- Verify Firestore is enabled in Firebase Console
- Check Django server is running

**React errors:**
- Check Django API is running
- Verify CORS is configured correctly
- Check browser console for errors

**Firebase Auth errors:**
- Verify Google sign-in is enabled
- Check authorized domains
- Check OAuth 2.0 Client ID settings

## Next Steps

- Customize challenges
- Add more features
- Deploy to production (see DEPLOYMENT.md)

