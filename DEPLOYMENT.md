# Deployment Guide

## Deploy React App to Firebase Hosting

### Step 1: Build the React App

```bash
cd myboggle-app
npm run build
```

This creates a `build/` directory with production-ready files.

### Step 2: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### Step 3: Login to Firebase

```bash
firebase login
```

### Step 4: Initialize Firebase Hosting (if not already done)

```bash
firebase init hosting
```

When prompted:
- Select existing project: `boggle-app-c0d1c`
- Public directory: `myboggle-app/build`
- Configure as single-page app: Yes
- Set up automatic builds: No (or Yes if using GitHub Actions)

### Step 5: Update API URL for Production

Before deploying, update the API URL in `myboggle-app/src/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-django-api-url.com/api';
```

Or set environment variable:
```bash
export REACT_APP_API_URL=https://your-django-api-url.com/api
npm run build
```

### Step 6: Deploy

```bash
firebase deploy --only hosting
```

Your app will be available at: `https://boggle-app-c0d1c.web.app`

## Update Firebase Authorized Domains

After deployment, add your production domain to Firebase:

1. Go to Firebase Console → Authentication → Settings
2. Add authorized domain: `boggle-app-c0d1c.web.app` (or your custom domain)
3. Go to Google Cloud Console → APIs & Services → Credentials
4. Edit OAuth 2.0 Client ID
5. Add `https://boggle-app-c0d1c.web.app` to Authorized JavaScript origins

## Deploy Django Backend

### Option 1: Heroku

```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn boggle_backend.wsgi --log-file -" > Procfile

# Create runtime.txt
echo "python-3.13.2" > runtime.txt

# Deploy
heroku create your-app-name
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"
heroku config:set FIREBASE_CLIENT_EMAIL=your-client-email
git push heroku main
```

### Option 2: Google Cloud Run

```bash
# Create Dockerfile
# Build and deploy
gcloud builds submit --tag gcr.io/boggle-app-c0d1c/boggle-api
gcloud run deploy boggle-api --image gcr.io/boggle-app-c0d1c/boggle-api
```

### Option 3: AWS Elastic Beanstalk

Follow AWS Elastic Beanstalk Django deployment guide.

## Update CORS Settings

After deploying Django backend, update `boggle_backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://boggle-app-c0d1c.web.app",
    "https://boggle-app-c0d1c.firebaseapp.com",
]
```

## Environment Variables for Production

Set these in your deployment platform:

```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=boggle-app-c0d1c.web.app,your-api-domain.com
FIREBASE_PROJECT_ID=boggle-app-c0d1c
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## Verify Deployment

1. Check React app loads: `https://boggle-app-c0d1c.web.app`
2. Check API is accessible: `https://your-api-url.com/api/challenges/`
3. Test Google sign-in
4. Test challenge loading
5. Test score submission

## Troubleshooting

### Build fails
- Check for console errors
- Verify all dependencies are installed
- Check environment variables

### API calls fail after deployment
- Verify CORS settings include production domain
- Check API URL is correct
- Verify Django backend is accessible

### Authentication fails
- Check authorized domains in Firebase Console
- Verify OAuth 2.0 Client ID settings
- Check browser console for errors

