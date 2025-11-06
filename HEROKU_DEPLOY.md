# Deploy Django API to Heroku - Easy Guide

## Step 1: Install Heroku CLI

If you don't have Heroku CLI installed:
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

## Step 2: Login to Heroku

```bash
heroku login
```

## Step 3: Create Heroku App

```bash
cd /Users/sameerdhanda/Starter-Project-4
heroku create your-app-name
# Example: heroku create boggle-api-12345
```

This will create an app and give you a URL like: `https://your-app-name.herokuapp.com`

## Step 4: Set Environment Variables

You need to set Firebase credentials as environment variables:

```bash
# Get your Firebase service account key
# If you have serviceAccountKey.json, extract these values:

# Set secret key (generate a new one for production)
heroku config:set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set debug to False
heroku config:set DEBUG=False

# Set Firebase credentials
# Option 1: If you have serviceAccountKey.json, read the values:
# cat myboggle-app/serviceAccountKey.json

# Then set them:
heroku config:set FIREBASE_PROJECT_ID="boggle-app-c0d1c"
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key-here"
heroku config:set FIREBASE_CLIENT_EMAIL="your-client-email@project-id.iam.gserviceaccount.com"
```

**Important**: For FIREBASE_PRIVATE_KEY, you need to escape newlines. Use:
```bash
# Read the private key from serviceAccountKey.json and replace \n with actual newlines
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your-key-here
-----END PRIVATE KEY-----"
```

Or use a script to set it properly (see below).

## Step 5: Create a Script to Set Firebase Credentials

Create a helper script to set Firebase credentials:

```bash
# Create a temporary script
cat > set_heroku_config.sh << 'EOF'
#!/bin/bash
# Read serviceAccountKey.json and set Heroku config vars
if [ -f "myboggle-app/serviceAccountKey.json" ]; then
  PROJECT_ID=$(cat myboggle-app/serviceAccountKey.json | grep -o '"project_id": "[^"]*' | cut -d'"' -f4)
  PRIVATE_KEY=$(cat myboggle-app/serviceAccountKey.json | grep -o '"private_key": "[^"]*' | sed 's/"private_key": "//' | sed 's/"$//' | sed 's/\\n/\n/g')
  CLIENT_EMAIL=$(cat myboggle-app/serviceAccountKey.json | grep -o '"client_email": "[^"]*' | cut -d'"' -f4)
  
  heroku config:set FIREBASE_PROJECT_ID="$PROJECT_ID"
  heroku config:set FIREBASE_PRIVATE_KEY="$PRIVATE_KEY"
  heroku config:set FIREBASE_CLIENT_EMAIL="$CLIENT_EMAIL"
  echo "✅ Firebase credentials set!"
else
  echo "❌ serviceAccountKey.json not found in myboggle-app/"
fi
EOF

chmod +x set_heroku_config.sh
./set_heroku_config.sh
```

## Step 6: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

## Step 7: Deploy to Heroku

```bash
# Add Heroku remote (if not already added)
heroku git:remote -a your-app-name

# Deploy
git push heroku main
# Or if you're on master branch:
# git push heroku master
```

## Step 8: Run Migrations

```bash
heroku run python manage.py migrate
```

## Step 9: Populate Firestore (if not already done)

```bash
heroku run python manage.py populate_challenges
```

## Step 10: Test Your API

```bash
# Get your app URL
heroku open

# Or test the API endpoint
curl https://your-app-name.herokuapp.com/api/challenges/
```

## Step 11: Update React App with Production API URL

Update `myboggle-app/src/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.herokuapp.com/api';
```

Then rebuild and redeploy:
```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Quick Commands

```bash
# View logs
heroku logs --tail

# Open app
heroku open

# Run Django shell
heroku run python manage.py shell

# Check config vars
heroku config

# Restart app
heroku restart
```

## Troubleshooting

### Build fails
- Check `requirements.txt` is correct
- Check `Procfile` exists
- Check `runtime.txt` exists

### App crashes
- Check logs: `heroku logs --tail`
- Verify environment variables are set: `heroku config`
- Check Firebase credentials are correct

### CORS errors
- Verify CORS settings in `boggle_backend/settings.py`
- Check Firebase hosting URL is in `CORS_ALLOWED_ORIGINS`

### Firebase errors
- Verify Firebase credentials are set correctly
- Check private key has proper newlines
- Verify service account has Firestore permissions

## Your API URL

After deployment, your API will be at:
- **https://your-app-name.herokuapp.com/api/**

Update your React app to use this URL!

