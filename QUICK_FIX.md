# Quick Fix: Heroku 502 Error

## The Problem
Your Heroku app is returning 502 Bad Gateway, which means it's not running.

## Fastest Fix (5 minutes)

### Option 1: Check What's Wrong

```bash
./check_heroku.sh
```

This will show you:
- App status
- Missing environment variables
- Recent errors
- API status

### Option 2: Manual Check

```bash
# 1. Check app status
heroku ps

# 2. Check logs for errors
heroku logs --tail -n 50

# 3. Check config vars
heroku config

# 4. If Firebase vars are missing, set them:
./set_heroku_firebase.sh

# 5. Restart app
heroku restart

# 6. Check logs again
heroku logs --tail
```

## Most Common Issues

### Issue 1: Firebase Credentials Not Set
**Fix:**
```bash
./set_heroku_firebase.sh
heroku restart
```

### Issue 2: App Crashed on Startup
**Check logs:**
```bash
heroku logs --tail
```

Look for:
- "Firebase service account key not found"
- "Module not found"
- Import errors

### Issue 3: Need to Redeploy
**Fix:**
```bash
git add .
git commit -m "Fix deployment"
git push heroku main
```

## Test After Fix

```bash
# Should return JSON, not 502
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

## Still Not Working?

Run the diagnostic script:
```bash
./check_heroku.sh
```

Then share the output to get more specific help.

