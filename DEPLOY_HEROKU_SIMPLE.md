# Deploy Django API to Heroku - Simple Steps

Follow these steps in order:

## Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`

## Step 1: Create Heroku App

```bash
cd /Users/sameerdhanda/Starter-Project-4
heroku create your-app-name
# Example: heroku create boggle-api-123
```

**Note your app URL**: `https://your-app-name.herokuapp.com`

## Step 2: Set Environment Variables

```bash
# Generate a secret key
heroku config:set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set debug to False
heroku config:set DEBUG=False

# Set Firebase credentials (use the helper script)
./set_heroku_firebase.sh
```

## Step 3: Initialize Git (if needed)

```bash
git init
git add .
git commit -m "Prepare for Heroku deployment"
```

## Step 4: Deploy

```bash
git push heroku main
# Or if you're on master: git push heroku master
```

## Step 5: Run Migrations & Populate Challenges

```bash
heroku run python manage.py migrate
heroku run python manage.py populate_challenges
```

## Step 6: Test Your API

```bash
# Open your API
heroku open

# Or test the endpoint
curl https://your-app-name.herokuapp.com/api/challenges/
```

## Step 7: Update React App with Production URL

Update `myboggle-app/src/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.herokuapp.com/api';
```

Then rebuild and redeploy React:
```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Done! 🎉

Your API is now at: `https://your-app-name.herokuapp.com/api/`

## Useful Commands

```bash
# View logs
heroku logs --tail

# Check config
heroku config

# Restart app
heroku restart

# Run Django commands
heroku run python manage.py <command>
```

