#!/bin/bash
# Quick deployment script for Heroku

echo "🚀 Deploying Django app to Heroku..."
echo ""

# Step 1: Set environment variables
echo "1. Setting environment variables..."
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False

# Step 2: Set Firebase credentials
echo "2. Setting Firebase credentials..."
./set_heroku_firebase.sh

# Step 3: Commit changes
echo "3. Committing changes..."
git add .
git commit -m "Deploy Django app to Heroku" || echo "No changes to commit"

# Step 4: Deploy
echo "4. Deploying to Heroku..."
git push heroku main

# Step 5: Run migrations
echo "5. Running migrations..."
heroku run python manage.py migrate

# Step 6: Populate challenges
echo "6. Populating challenges..."
heroku run python manage.py populate_challenges

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test the API:"
echo "curl https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/"

