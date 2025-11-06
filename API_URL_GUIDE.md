# Django API URL Guide

## Default Django API URL

Your Django API URL is: **`http://localhost:8000/api`**

This is configured in `myboggle-app/src/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

## How to Check if Django is Running

### Method 1: Check the Terminal
When you run:
```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Django version X.X, using settings 'boggle_backend.settings'
Quit the server with CONTROL-C.
```

### Method 2: Test the API Endpoint
Open your browser or use curl:
```bash
# Test in browser
http://localhost:8000/api/challenges/

# Or use curl
curl http://localhost:8000/api/challenges/
```

If Django is running, you should see a JSON response with challenges.

### Method 3: Check Network Tab
1. Open React app in browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Click "Load Challenge" button
5. Look for requests to `http://localhost:8000/api/challenges/`

## API Endpoints

Your Django API has these endpoints:

- **`http://localhost:8000/api/challenges/`** - Get all challenges
- **`http://localhost:8000/api/challenges/<id>/`** - Get specific challenge
- **`http://localhost:8000/api/scores/`** - Submit score (POST)
- **`http://localhost:8000/api/leaderboard/<id>/`** - Get leaderboard

## Changing the API URL

### For Development
The default is already set to `http://localhost:8000/api`. No changes needed.

### For Production/Deployment

#### Option 1: Environment Variable (Recommended)
Create a `.env` file in `myboggle-app/`:
```bash
REACT_APP_API_URL=https://your-django-api-url.com/api
```

Then rebuild:
```bash
npm run build
```

#### Option 2: Update api.js Directly
Edit `myboggle-app/src/api.js`:
```javascript
const API_BASE_URL = 'https://your-django-api-url.com/api';
```

#### Option 3: Build-time Configuration
Set environment variable when building:
```bash
REACT_APP_API_URL=https://your-api.com/api npm run build
```

## Troubleshooting

### "Failed to fetch challenges"
- **Check Django is running**: `python manage.py runserver`
- **Check the URL**: Make sure it's `http://localhost:8000/api/challenges/`
- **Check CORS**: Verify CORS is configured in `boggle_backend/settings.py`
- **Check browser console**: Look for CORS errors

### "Network Error"
- Django server not running
- Wrong port (should be 8000)
- Firewall blocking the connection

### CORS Errors
Make sure `boggle_backend/settings.py` has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## Quick Test

Run this to test if your API is working:
```bash
# Start Django
python manage.py runserver

# In another terminal, test the endpoint
curl http://localhost:8000/api/challenges/
```

You should see JSON output with challenge data.

