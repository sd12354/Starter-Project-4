# Fix CORS Error - Deploy Updated Settings

## The Problem
Your API is working, but CORS headers aren't being sent. The settings are correct locally, but need to be deployed to Heroku.

## Quick Fix: Redeploy with CORS Settings

### Step 1: Commit and Push CORS Fix

```bash
cd /Users/sameerdhanda/Starter-Project-4

# Make sure CORS settings are saved
git add boggle_backend/settings.py
git commit -m "Fix CORS settings for Firebase hosting"

# Deploy to Heroku
git push heroku main
```

### Step 2: Restart Heroku App

```bash
heroku restart
```

### Step 3: Verify CORS Headers

```bash
curl -I -H "Origin: https://boggle-app-c0d1c.web.app" \
     https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/ \
     | grep -i "access-control"
```

Should show:
```
access-control-allow-origin: *
```

### Step 4: Test in Browser

After redeploy, refresh your React app and try loading challenges again.

## Verify Settings Are Correct

Check `boggle_backend/settings.py` has:

```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    ...
]
```

## If Still Not Working

1. Check Heroku logs: `heroku logs --tail`
2. Verify middleware order (CorsMiddleware must be before CommonMiddleware)
3. Check if DEBUG=False is causing issues (CORS should work regardless)

## Quick Deploy Commands

```bash
cd /Users/sameerdhanda/Starter-Project-4
git add boggle_backend/settings.py
git commit -m "Fix CORS"
git push heroku main
heroku restart
```

