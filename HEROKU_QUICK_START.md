# Deploy to Heroku - Quick Start

## Step 1: Install Heroku CLI

### macOS (using Homebrew):
```bash
brew tap heroku/brew && brew install heroku
```

### Or download from:
https://devcenter.heroku.com/articles/heroku-cli

### Verify installation:
```bash
heroku --version
```

## Step 2: Login to Heroku

```bash
heroku login
```

This will open a browser window for authentication.

## Step 3: Create Heroku App

```bash
cd /Users/sameerdhanda/Starter-Project-4

# Create app (choose a unique name)
heroku create boggle-api-$(date +%s)

# Or use a custom name
# heroku create your-custom-name
```

**Important**: Save the app URL that Heroku gives you (e.g., `https://boggle-api-123456.herokuapp.com`)

## Step 4: Set Environment Variables

```bash
# Generate and set secret key
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set debug to False
heroku config:set DEBUG=False

# Set Firebase credentials using the helper script
./set_heroku_firebase.sh
```

If the script doesn't work, set manually:
```bash
# Read values from serviceAccountKey.json and set them
heroku config:set FIREBASE_PROJECT_ID="boggle-app-c0d1c"
heroku config:set FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
heroku config:set FIREBASE_CLIENT_EMAIL="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["client_email"])')"
```

## Step 5: Deploy

```bash
# Add all files (make sure .gitignore is correct)
git add .

# Commit (if needed)
git commit -m "Prepare for Heroku deployment"

# Deploy to Heroku
git push heroku main
```

If you get an error about branch name, try:
```bash
git push heroku HEAD:main
```

## Step 6: Setup Database & Populate Challenges

```bash
# Run migrations
heroku run python manage.py migrate

# Populate Firestore with challenges
heroku run python manage.py populate_challenges
```

## Step 7: Test Your API

```bash
# Get your app name
heroku apps:info

# Test the API
curl https://your-app-name.herokuapp.com/api/challenges/
```

## Step 8: Update React App

1. Get your Heroku app URL (from Step 3)
2. Update `myboggle-app/src/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.herokuapp.com/api';
   ```
3. Rebuild and redeploy:
   ```bash
   cd myboggle-app
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

## That's It! 🎉

Your Django API is now live at: `https://your-app-name.herokuapp.com/api/`

## Troubleshooting

### "No app specified"
```bash
# Check current app
heroku apps

# Set app
heroku git:remote -a your-app-name
```

### Build fails
- Check `requirements.txt` includes `gunicorn` and `whitenoise`
- Check `Procfile` exists
- Check `runtime.txt` exists

### Firebase errors
- Verify credentials: `heroku config`
- Check logs: `heroku logs --tail`
- Make sure serviceAccountKey.json has correct values

### API not accessible
- Check logs: `heroku logs --tail`
- Verify app is running: `heroku ps`
- Test endpoint: `curl https://your-app-name.herokuapp.com/api/challenges/`

