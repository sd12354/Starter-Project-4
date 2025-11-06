# Fix 502 Error - Step by Step

## Your Heroku App is Down (502 Bad Gateway)

The error message confirms your Heroku app isn't running. Follow these steps:

## Step 1: Check Heroku Logs

Open a terminal and run:

```bash
cd /Users/sameerdhanda/Starter-Project-4
heroku logs --tail -n 100
```

This will show you what's wrong. Common errors:

### Error: "Firebase service account key not found"
**Solution:**
```bash
./set_heroku_firebase.sh
heroku restart
```

### Error: "Module not found" or Import errors
**Solution:**
```bash
# Check requirements.txt has all packages
cat requirements.txt

# Redeploy
git add .
git commit -m "Fix dependencies"
git push heroku main
```

### Error: "Application error" or startup crash
**Solution:**
```bash
# Check Procfile is correct
cat Procfile

# Should show: web: gunicorn boggle_backend.wsgi --log-file -
```

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
- ✅ `SECRET_KEY`
- ✅ `DEBUG` (should be `False` for production)
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_PRIVATE_KEY`
- ✅ `FIREBASE_CLIENT_EMAIL`

If any are missing:
```bash
# Set Firebase credentials
./set_heroku_firebase.sh

# Set SECRET_KEY if missing
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set DEBUG
heroku config:set DEBUG=False
```

## Step 4: Test Locally First

Before fixing Heroku, test your Django app locally:

```bash
# Set environment variables
export FIREBASE_PROJECT_ID="boggle-app-c0d1c"
export FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
export FIREBASE_CLIENT_EMAIL="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["client_email"])')"
export DEBUG=False

# Run locally
python manage.py runserver

# In another terminal, test:
curl http://localhost:8000/api/challenges/
```

If this works locally, the issue is with Heroku deployment.

## Step 5: Redeploy to Heroku

```bash
# Make sure all files are committed
git add .
git commit -m "Fix Heroku deployment"

# Deploy
git push heroku main

# Watch the build
heroku logs --tail
```

## Step 6: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges (if needed)
heroku run python manage.py populate_challenges

# Restart app
heroku restart
```

## Step 7: Verify It Works

```bash
# Test API endpoint
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should return JSON array, not HTML error page
```

## Quick Commands

```bash
# Check status
heroku ps

# View logs
heroku logs --tail

# Check config
heroku config

# Restart
heroku restart

# Scale up (if needed)
heroku ps:scale web=1
```

## Most Likely Fix

Run this sequence:

```bash
# 1. Set Firebase credentials
./set_heroku_firebase.sh

# 2. Set SECRET_KEY if missing
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# 3. Set DEBUG
heroku config:set DEBUG=False

# 4. Restart
heroku restart

# 5. Check logs
heroku logs --tail

# 6. Test
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

## If Still Not Working

Share the output of:
```bash
heroku logs --tail -n 50
```

This will show the exact error message.

