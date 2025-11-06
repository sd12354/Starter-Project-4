# Fix Both Issues: Deploy Django + Fix CORS

## Current Status
1. ✅ Django code is ready locally
2. ❌ Django app NOT deployed to Heroku (still showing "Welcome" page)
3. ❌ CORS error (will be fixed after deployment)

## Step 1: Deploy Django to Heroku

Run these commands:

```bash
cd /Users/sameerdhanda/Starter-Project-4

# Set environment variables first
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False
./set_heroku_firebase.sh

# Commit and deploy
git add .
git commit -m "Deploy Django app with CORS fix"
git push heroku main

# Watch the build - you should see Django installing
```

## Step 2: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges
heroku run python manage.py populate_challenges

# Restart app
heroku restart
```

## Step 3: Verify Django is Running

```bash
# Should return JSON, not HTML
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/
```

Should see JSON array like:
```json
[{"id":"challenge-1","name":"Challenge 1: Classic Boggle",...}]
```

NOT HTML with "Welcome" page.

## Step 4: Verify CORS Headers

```bash
curl -I -H "Origin: https://boggle-app-c0d1c.web.app" \
     https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/ \
     | grep -i "access-control"
```

Should show:
```
access-control-allow-origin: *
```

## Step 5: Rebuild and Deploy React App

```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

## Step 6: Test in Browser

Refresh your Firebase app and try loading challenges. Both issues should be fixed!

## If Deployment Fails

1. **Check logs:** `heroku logs --tail`
2. **Check app status:** `heroku ps`
3. **Verify environment variables:** `heroku config`

## Quick All-in-One Command

```bash
cd /Users/sameerdhanda/Starter-Project-4 && \
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')" && \
heroku config:set DEBUG=False && \
./set_heroku_firebase.sh && \
git add . && \
git commit -m "Deploy Django app" && \
git push heroku main && \
heroku run python manage.py migrate && \
heroku run python manage.py populate_challenges && \
heroku restart
```

Then wait for deployment to complete, then test!

