#!/bin/bash
# Script to check Heroku app status and diagnose issues

echo "🔍 Checking Heroku App Status..."
echo ""

# Check if heroku CLI is available
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Install it first:"
    echo "   brew tap heroku/brew && brew install heroku"
    exit 1
fi

# Check if logged in
echo "1. Checking Heroku login status..."
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku"
    echo "   Run: heroku login"
    exit 1
fi
echo "✅ Logged in"

# Check app status
echo ""
echo "2. Checking app status..."
heroku ps

# Check config vars
echo ""
echo "3. Checking environment variables..."
echo "Required variables:"
echo "  - SECRET_KEY: $(heroku config:get SECRET_KEY 2>/dev/null | cut -c1-20)..."
echo "  - DEBUG: $(heroku config:get DEBUG 2>/dev/null || echo 'NOT SET')"
echo "  - FIREBASE_PROJECT_ID: $(heroku config:get FIREBASE_PROJECT_ID 2>/dev/null || echo 'NOT SET')"
echo "  - FIREBASE_CLIENT_EMAIL: $(heroku config:get FIREBASE_CLIENT_EMAIL 2>/dev/null || echo 'NOT SET')"
echo "  - FIREBASE_PRIVATE_KEY: $(heroku config:get FIREBASE_PRIVATE_KEY 2>/dev/null | cut -c1-20 || echo 'NOT SET')..."

# Check recent logs
echo ""
echo "4. Recent logs (last 20 lines):"
echo "---"
heroku logs --tail -n 20

echo ""
echo "5. Testing API endpoint..."
API_URL="https://boggle-api-1762398807-4ea3785e04c2.herokuapp.com/api/challenges/"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" 2>/dev/null)
echo "   HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ API is working!"
elif [ "$HTTP_CODE" = "502" ]; then
    echo "   ❌ 502 Bad Gateway - App is crashing"
    echo "   Run: heroku logs --tail to see errors"
else
    echo "   ⚠️  Unexpected status code: $HTTP_CODE"
fi

echo ""
echo "📋 Next steps:"
echo "   1. If config vars are missing, run: ./set_heroku_firebase.sh"
echo "   2. If app is crashed, check logs: heroku logs --tail"
echo "   3. Restart app: heroku restart"
echo "   4. Redeploy: git push heroku main"

