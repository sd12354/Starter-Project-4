# Deploy Django App to Heroku - Fix "Welcome" Page

## Problem: You're seeing "Welcome to your new app"

This means **the Django app hasn't been deployed to Heroku yet**. You only created the Heroku app, but didn't push your code.

## Step 1: Initialize Git (if not done)

```bash
cd /Users/sameerdhanda/Starter-Project-4

# Check if git is initialized
git status

# If not, initialize it
git init
```

## Step 2: Add Heroku Remote

```bash
# Add Heroku as a remote
heroku git:remote -a boggle-api-1762398807-4ea3785e04c2

# Or if you know the app name, use:
# heroku git:remote -a your-app-name
```

## Step 3: Commit All Files

```bash
# Add all files
git add .

# Commit
git commit -m "Initial deployment to Heroku"
```

## Step 4: Set Environment Variables BEFORE Deploying

```bash
# Set SECRET_KEY
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# Set DEBUG
heroku config:set DEBUG=False

# Set Firebase credentials
./set_heroku_firebase.sh
```

## Step 5: Deploy to Heroku

```bash
# Push to Heroku main branch
git push heroku main

# If you get an error about branch name, try:
# git push heroku HEAD:main
```

**Watch the build output!** You should see:
- Installing dependencies
- Building the app
- Deploying

## Step 6: After Deployment

```bash
# Run migrations
heroku run python manage.py migrate

# Populate challenges
heroku run python manage.py populate_challenges

# Check app status
heroku ps

# View logs
heroku logs --tail
```

## Step 7: Test

```bash
# Test the API
curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/

# Should return JSON, not HTML
```

## Quick Deployment Commands

Copy and paste this entire block:

```bash
cd /Users/sameerdhanda/Starter-Project-4

# Set environment variables
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False
./set_heroku_firebase.sh

# Deploy
git add .
git commit -m "Deploy Django app to Heroku"
git push heroku main

# After deployment
heroku run python manage.py migrate
heroku run python manage.py populate_challenges
```

## If Git Push Fails

### Error: "No such remote 'heroku'"
```bash
heroku git:remote -a boggle-api-1762398807-4ea3785e04c2
```

### Error: "Branch main does not exist"
```bash
# Check current branch
git branch

# If you're on master, push that:
git push heroku master

# Or rename to main:
git branch -M main
git push heroku main
```

### Error: "Permission denied"
```bash
# Make sure you're logged in
heroku login
```

## After Successful Deployment

1. Test the API: `curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/`
2. Should return JSON array of challenges
3. Rebuild React app and deploy to Firebase

