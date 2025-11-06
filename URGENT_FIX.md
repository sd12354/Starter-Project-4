# URGENT: Fix Heroku 502 Error

## Your Heroku app is crashing (502 Bad Gateway)

The app needs to be fixed and redeployed. Here's what to do:

## Step 1: Check What's Wrong

```bash
heroku logs --tail -n 100
```

This will show you the error. Common issues:
- Firebase credentials not set
- Missing SECRET_KEY
- Import errors

## Step 2: Fix Environment Variables

```bash
# Check what's set
heroku config

# Set missing ones
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False

# Set Firebase credentials
./set_heroku_firebase.sh
```

## Step 3: Redeploy

```bash
# Make sure all files are committed
git add .
git commit -m "Fix CORS and URL issues"

# Deploy to Heroku
git push heroku main
```

## Step 4: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges (if not done)
heroku run python manage.py populate_challenges

# Restart app
heroku restart
```

## Step 5: Test

```bash
# Test the API
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

Should return JSON, not 502.

## Step 6: Rebuild React App

After Heroku is fixed:

```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Quick Diagnostic Commands

```bash
# Check app status
heroku ps

# View recent logs
heroku logs --tail

# Check config
heroku config

# Restart if needed
heroku restart
```

