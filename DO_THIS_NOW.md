# DO THIS NOW: Fix 502 Error

## Step 1: Open Terminal and Check Logs

```bash
cd /Users/sameerdhanda/Starter-Project-4
heroku logs --tail -n 50
```

**Look for errors like:**
- "Firebase service account key not found"
- "ValueError: Firebase service account key not found"
- "Module not found"
- Import errors

## Step 2: Most Likely Fix - Set Firebase Credentials

If you see "Firebase service account key not found" in the logs:

```bash
# Run the helper script
./set_heroku_firebase.sh

# Restart the app
heroku restart

# Check logs again
heroku logs --tail
```

## Step 3: Set Missing Environment Variables

```bash
# Check what's set
heroku config

# Set SECRET_KEY if missing
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set DEBUG
heroku config:set DEBUG=False

# Verify Firebase credentials are set
heroku config:get FIREBASE_PROJECT_ID
heroku config:get FIREBASE_CLIENT_EMAIL
```

## Step 4: If Firebase Credentials Are Missing

```bash
# Make sure serviceAccountKey.json exists
ls -la myboggle-app/serviceAccountKey.json

# If it exists, set credentials
./set_heroku_firebase.sh

# If script doesn't work, set manually:
heroku config:set FIREBASE_PROJECT_ID="boggle-app-c0d1c"
heroku config:set FIREBASE_CLIENT_EMAIL="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["client_email"])')"
heroku config:set FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
```

## Step 5: Check App Status

```bash
heroku ps
```

Should show `web.1: up for Xm`. If it shows `crashed`, continue to Step 6.

## Step 6: Redeploy (If Still Not Working)

```bash
# Commit all changes
git add .
git commit -m "Fix Heroku deployment"

# Deploy
git push heroku main

# Watch the build
heroku logs --tail
```

## Step 7: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Restart
heroku restart

# Test
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

## Quick Test

After fixing, test the API:

```bash
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

Should return JSON array, not 502 error.

## Common Error Messages & Fixes

### "Firebase service account key not found"
**Fix:** Run `./set_heroku_firebase.sh`

### "Application error" or startup crash
**Fix:** Check logs for specific error, then fix it

### "Module not found"
**Fix:** Check `requirements.txt` has all packages, then redeploy

### App shows "crashed" in `heroku ps`
**Fix:** Check logs, fix the error, then restart

## After Fixing

1. Rebuild React app:
   ```bash
   cd myboggle-app
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

2. Test in browser - challenges should load now!

