# Boggle Web App with Django REST API

A full-stack Boggle game application with React frontend and Django REST API backend, integrated with Firebase for authentication and Firestore for data storage.

## Features

✅ **Manual Firestore Population** - Django management command to populate Firestore with challenge grids  
✅ **Load Challenge** - Display and select from available challenges with high scores  
✅ **Leaderboard** - Automatic score submission for challenge games  
✅ **Google Sign-In** - Firebase Authentication integration  
✅ **Auto Score Saving** - Scores automatically saved when playing challenges  
✅ **Full Word List** - Uses complete dictionary for validation  

## Project Structure

```
Starter-Project-4/
├── boggle_backend/          # Django project
│   ├── settings.py
│   └── urls.py
├── api/                     # Django app
│   ├── views.py            # REST API endpoints
│   ├── firebase_service.py # Firestore integration
│   └── management/
│       └── commands/
│           └── populate_challenges.py  # Management command
├── myboggle-app/           # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js          # Django API client
│   │   ├── firebase.js     # Firebase Auth config
│   │   ├── Auth.js         # Authentication component
│   │   └── ChallengeLoader.js  # Challenge selection
│   └── public/
└── requirements.txt        # Python dependencies
```

## Setup Instructions

### 1. Backend Setup (Django)

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Set up Firebase service account
# Copy serviceAccountKey.json to project root or myboggle-app/
# Or set environment variables:
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_PRIVATE_KEY="your-private-key"
export FIREBASE_CLIENT_EMAIL="your-client-email"

# Run migrations
python manage.py migrate

# Populate Firestore with challenges
python manage.py populate_challenges

# Start Django server
python manage.py runserver
```

The Django API will be available at `http://localhost:8000/api/`

### 2. Frontend Setup (React)

```bash
cd myboggle-app

# Install dependencies (if not already installed)
npm install

# Update Firebase config in src/firebase.js if needed
# The config should already be set up

# Start React development server
npm start
```

The React app will be available at `http://localhost:3000`

### 3. Firebase Setup

1. **Enable Authentication:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Google" provider
   - Set project support email

2. **Configure Authorized Domains:**
   - Firebase Console → Authentication → Settings
   - Add `localhost` and `localhost:3000` to authorized domains
   - Google Cloud Console → APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Add `http://localhost:3000` to Authorized JavaScript origins

3. **Firestore Rules:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leaderboard/{document} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /challenges/{document} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```

## API Endpoints

### GET `/api/challenges/`
Get list of all challenges with high scores

### GET `/api/challenges/<challenge_id>/`
Get a specific challenge by ID

### POST `/api/scores/`
Submit a score to the leaderboard
```json
{
  "challengeId": "challenge-1",
  "challengeName": "Challenge 1: Classic Boggle",
  "userId": "user-uid",
  "userName": "User Name",
  "userEmail": "user@example.com",
  "userPhotoURL": "https://...",
  "score": 10,
  "foundWordsCount": 10,
  "totalWords": 50,
  "timeElapsed": 120.5
}
```

### GET `/api/leaderboard/<challenge_id>/`
Get leaderboard for a specific challenge

## Usage

1. **Start both servers:**
   - Django: `python manage.py runserver` (port 8000)
   - React: `npm start` (port 3000)

2. **Populate challenges:**
   ```bash
   python manage.py populate_challenges
   ```

3. **Use the app:**
   - Sign in with Google
   - Click "Load Challenge" to see available challenges
   - Select a challenge to play
   - Scores are automatically saved when you finish a challenge game

## Deployment

### Deploy React App to Firebase Hosting

```bash
cd myboggle-app

# Build the React app
npm run build

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting (if not already done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Deploy Django Backend

For production deployment, consider:
- Using a cloud service (AWS, Google Cloud, Heroku, etc.)
- Setting up environment variables
- Configuring CORS for your production domain
- Using a production WSGI server (gunicorn)

## Environment Variables

Create a `.env` file or set environment variables:

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=False  # Set to False in production

# Firebase (for Django)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# React (optional, or update firebase.js directly)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_API_URL=http://localhost:8000/api  # Django API URL
```

## Troubleshooting

### Django API not accessible
- Check Django server is running on port 8000
- Verify CORS settings in `boggle_backend/settings.py`
- Check browser console for CORS errors

### Firebase Authentication errors
- Verify Google sign-in is enabled in Firebase Console
- Check authorized domains include `localhost:3000`
- Check OAuth 2.0 Client ID settings in Google Cloud Console

### Firestore errors
- Verify `serviceAccountKey.json` is in the correct location
- Check Firestore rules allow reads/writes
- Verify Firebase Admin SDK is initialized correctly

## License

MIT

