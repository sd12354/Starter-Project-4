# Fix CORS Error on Heroku

## Issue
Getting CORS error: `Access to fetch at 'https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com//challenges/' from origin 'https://boggle-app-c0d1c.web.app' has been blocked by CORS policy`

## Solution

### Step 1: Update Heroku CORS Settings

The CORS settings are already in `boggle_backend/settings.py` but need to be deployed. Make sure `DEBUG=False` on Heroku:

```bash
heroku config:set DEBUG=False
```

### Step 2: Fix Double Slash Issue

I've already fixed the double slash issue in `api.js`. The URL was:
- `https://boggle-api-...herokuapp.com/` + `/challenges/` = `//challenges/` ❌

Now it's:
- `https://boggle-api-...herokuapp.com/api` + `/challenges/` = `/api/challenges/` ✅

### Step 3: Redeploy to Heroku

After updating CORS settings, redeploy:

```bash
git add .
git commit -m "Fix CORS and API URL"
git push heroku main
```

### Step 4: Rebuild and Redeploy React App

```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Verify CORS is Working

After redeploying, test:

```bash
# Test from command line
curl -H "Origin: https://boggle-app-c0d1c.web.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should see CORS headers in response
```

## Quick Fix Commands

```bash
# 1. Set DEBUG=False (if not already set)
heroku config:set DEBUG=False

# 2. Verify CORS origins include Firebase domain
# Check boggle_backend/settings.py has:
# "https://boggle-app-c0d1c.web.app"
# "https://boggle-app-c0d1c.firebaseapp.com"

# 3. Redeploy Django
git add .
git commit -m "Fix CORS"
git push heroku main

# 4. Rebuild and redeploy React
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Alternative: Allow All Origins (Temporary for Testing)

If you want to quickly test, temporarily allow all origins:

In `boggle_backend/settings.py`, change:
```python
CORS_ALLOW_ALL_ORIGINS = True  # Always True for now
```

Then redeploy. **Remember to restrict this later for security!**

