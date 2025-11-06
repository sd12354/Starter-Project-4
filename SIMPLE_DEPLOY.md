# Deploy to Heroku - Simple Steps

## The Problem
You're seeing "Welcome to your new app" because **the Django code hasn't been deployed yet**.

## Quick Fix (Copy & Paste)

Run this single command:

```bash
cd /Users/sameerdhanda/Starter-Project-4 && ./DEPLOY_COMMANDS.sh
```

Or do it step by step:

## Step-by-Step Deployment

### Step 1: Set Environment Variables

```bash
# Set SECRET_KEY
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set DEBUG
heroku config:set DEBUG=False

# Set Firebase credentials
./set_heroku_firebase.sh
```

### Step 2: Commit and Deploy

```bash
# Add all files
git add .

# Commit
git commit -m "Deploy Django app to Heroku"

# Push to Heroku
git push heroku main
```

**Watch the build output!** You should see Django installing.

### Step 3: Setup Database

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges
heroku run python manage.py populate_challenges
```

### Step 4: Test

```bash
# Test the API
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should return JSON array, not "Welcome" page
```

## After Deployment

1. **Rebuild React app:**
   ```bash
   cd myboggle-app
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

2. **Test in browser** - challenges should load now!

## Troubleshooting

### If `git push heroku main` fails:
- Check you're on main branch: `git branch`
- Try: `git push heroku HEAD:main`

### If you see build errors:
- Check `requirements.txt` has all packages
- Check `Procfile` exists and is correct
- View logs: `heroku logs --tail`

### If API still shows "Welcome" page:
- Check app is running: `heroku ps`
- Check logs: `heroku logs --tail`
- Restart: `heroku restart`

