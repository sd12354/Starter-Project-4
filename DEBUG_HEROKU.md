# Debug Heroku 502 Error

## Problem: Heroku app returning 502 Bad Gateway

The Heroku app is not running. Here's how to fix it:

## Step 1: Check Heroku Logs

```bash
heroku logs --tail -n 200
```

Look for:
- Startup errors
- Firebase initialization failures
- Missing environment variables
- Import errors

## Step 2: Check App Status

```bash
heroku ps
```

Should show:
```
web.1: up for Xm
```

If it shows `crashed`, the app isn't starting.

## Step 3: Verify Environment Variables

```bash
heroku config
```

Must have ALL of these:
- `SECRET_KEY`
- `DEBUG` (set to `False` for production)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

## Step 4: Set Missing Variables

If Firebase credentials are missing:

```bash
# Use the helper script
./set_heroku_firebase.sh

# Or set manually
heroku config:set FIREBASE_PROJECT_ID="boggle-app-c0d1c"
heroku config:set FIREBASE_CLIENT_EMAIL="your-email@project.iam.gserviceaccount.com"
heroku config:set FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
```

## Step 5: Test Locally First

Before deploying to Heroku, test locally:

```bash
# Set environment variables locally
export FIREBASE_PROJECT_ID="boggle-app-c0d1c"
export FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
export FIREBASE_CLIENT_EMAIL="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["client_email"])')"
export DEBUG=False

# Run locally
python manage.py runserver

# Test in another terminal
curl http://localhost:8000/api/challenges/
```

If this works, then deploy to Heroku.

## Step 6: Redeploy

```bash
# Make sure all changes are committed
git add .
git commit -m "Fix Heroku deployment"

# Deploy
git push heroku main

# Watch the build logs
heroku logs --tail
```

## Step 7: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges (if needed)
heroku run python manage.py populate_challenges

# Restart
heroku restart
```

## Step 8: Verify It Works

```bash
# Test the API
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should return JSON array, not HTML error page
```

## Common Errors

### Error: "Firebase service account key not found"
**Fix**: Set Firebase environment variables on Heroku

### Error: "Module not found"
**Fix**: Check `requirements.txt` has all dependencies

### Error: "Application error"
**Fix**: Check logs for specific error message

### Error: "H10 - App crashed"
**Fix**: Check that gunicorn is in requirements.txt and Procfile is correct

## Quick Fix Commands

```bash
# 1. Check status
heroku ps

# 2. View logs
heroku logs --tail

# 3. Check config
heroku config

# 4. Restart
heroku restart

# 5. Scale up (if needed)
heroku ps:scale web=1
```

