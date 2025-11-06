# Check and Fix Heroku Issues

## Issue: 502 Bad Gateway

This means your Heroku app is either:
1. Not running
2. Crashing on startup
3. Not configured correctly

## Step 1: Check Heroku App Status

```bash
# Check if app is running
heroku ps

# View logs to see what's wrong
heroku logs --tail
```

## Step 2: Check Common Issues

### A. Missing Environment Variables
```bash
# Check config vars
heroku config

# Should have:
# - SECRET_KEY
# - DEBUG=False
# - FIREBASE_PROJECT_ID
# - FIREBASE_PRIVATE_KEY
# - FIREBASE_CLIENT_EMAIL
```

### B. Firebase Credentials Issue
```bash
# Check if Firebase credentials are set
heroku config:get FIREBASE_PROJECT_ID
heroku config:get FIREBASE_CLIENT_EMAIL

# If missing, run:
./set_heroku_firebase.sh
```

### C. App Crashes on Startup
Check logs for errors:
```bash
heroku logs --tail
```

Common issues:
- Firebase credentials not set
- Missing dependencies
- Import errors

## Step 3: Restart App

```bash
heroku restart
```

## Step 4: Test API Directly

```bash
# Test if API is accessible
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

If this fails, the app isn't running properly.

## Step 5: Redeploy

```bash
# Make sure all changes are committed
git add .
git commit -m "Fix CORS and API URL"

# Deploy
git push heroku main
```

## Quick Fix Commands

```bash
# 1. Check app status
heroku ps

# 2. View recent logs
heroku logs --tail -n 100

# 3. Restart app
heroku restart

# 4. Test endpoint
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

