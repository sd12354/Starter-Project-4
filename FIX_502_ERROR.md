# Fix 502 Bad Gateway Error on Heroku

## The Problem
Your Heroku app is returning 502 Bad Gateway, which means it's crashing or not starting properly.

## Quick Fix Steps

### Step 1: Check Heroku Logs

```bash
heroku logs --tail -n 100
```

Look for:
- Firebase initialization errors
- Missing environment variables
- Import errors
- Startup crashes

### Step 2: Check App Status

```bash
heroku ps
```

Should show `web.1` is running. If it shows `crashed`, the app isn't starting.

### Step 3: Verify Environment Variables

```bash
heroku config
```

Must have:
- `SECRET_KEY`
- `DEBUG=False` (or `True` for testing)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

### Step 4: Set Missing Config Vars

If Firebase credentials are missing:
```bash
./set_heroku_firebase.sh
```

Or set manually:
```bash
heroku config:set FIREBASE_PROJECT_ID="boggle-app-c0d1c"
heroku config:set FIREBASE_CLIENT_EMAIL="your-email@project.iam.gserviceaccount.com"
heroku config:set FIREBASE_PRIVATE_KEY="$(cat myboggle-app/serviceAccountKey.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["private_key"])')"
```

### Step 5: Redeploy with Fixes

```bash
# Make sure CORS fix is in settings.py
git add .
git commit -m "Fix CORS and API URL"
git push heroku main
```

### Step 6: Restart App

```bash
heroku restart
```

### Step 7: Check Logs Again

```bash
heroku logs --tail
```

Should see successful startup messages.

## Common Issues

### Issue 1: Firebase Credentials Not Set
**Symptom**: Logs show "Firebase service account key not found"
**Fix**: Run `./set_heroku_firebase.sh` or set config vars manually

### Issue 2: Private Key Format Wrong
**Symptom**: Firebase initialization fails
**Fix**: The private key needs to have actual newlines, not `\n` strings

### Issue 3: Missing Dependencies
**Symptom**: Import errors in logs
**Fix**: Check `requirements.txt` has all packages

### Issue 4: Database Migration Issues
**Symptom**: Database errors
**Fix**: Run `heroku run python manage.py migrate`

## Test After Fix

```bash
# Test API endpoint
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should return JSON with challenges, not 502 error
```

## If Still Not Working

1. Check full logs: `heroku logs --tail -n 200`
2. Check app status: `heroku ps`
3. Try scaling up: `heroku ps:scale web=1`
4. Check build logs: `heroku builds:info`

