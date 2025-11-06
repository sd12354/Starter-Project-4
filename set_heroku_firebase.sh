#!/bin/bash
# Script to set Firebase credentials on Heroku from serviceAccountKey.json

if [ ! -f "myboggle-app/serviceAccountKey.json" ]; then
    echo "❌ Error: serviceAccountKey.json not found in myboggle-app/"
    echo "Please ensure the file exists before running this script."
    exit 1
fi

echo "📖 Reading Firebase credentials from serviceAccountKey.json..."

# Extract values from JSON file
PROJECT_ID=$(python3 -c "import json; f=open('myboggle-app/serviceAccountKey.json'); data=json.load(f); print(data['project_id'])")
PRIVATE_KEY=$(python3 -c "import json; f=open('myboggle-app/serviceAccountKey.json'); data=json.load(f); print(data['private_key'])")
CLIENT_EMAIL=$(python3 -c "import json; f=open('myboggle-app/serviceAccountKey.json'); data=json.load(f); print(data['client_email'])")

if [ -z "$PROJECT_ID" ] || [ -z "$PRIVATE_KEY" ] || [ -z "$CLIENT_EMAIL" ]; then
    echo "❌ Error: Could not extract credentials from serviceAccountKey.json"
    exit 1
fi

echo "✅ Extracted credentials successfully"
echo "🔧 Setting Heroku config variables..."

# Set Heroku config vars
heroku config:set FIREBASE_PROJECT_ID="$PROJECT_ID"
heroku config:set FIREBASE_PRIVATE_KEY="$PRIVATE_KEY"
heroku config:set FIREBASE_CLIENT_EMAIL="$CLIENT_EMAIL"

echo "✅ Firebase credentials set on Heroku!"
echo ""
echo "📋 Verify with: heroku config"

