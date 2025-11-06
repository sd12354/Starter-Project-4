# Deploy to Firebase Hosting - Quick Steps

## Step 1: Verify Build is Ready ✅
Your React app has been built successfully! The build directory contains:
- `index.html`
- `static/` folder with JS and CSS files
- All assets

## Step 2: Login to Firebase (if not already)

```bash
firebase login
```

## Step 3: Deploy to Firebase Hosting

```bash
cd /Users/sameerdhanda/Starter-Project-4
firebase deploy --only hosting
```

## Step 4: Access Your App

After deployment, your app will be available at:
- **https://boggle-app-c0d1c.web.app**
- **https://boggle-app-c0d1c.firebaseapp.com**

## If You See "Firebase hosting setup but no UI"

This usually means:
1. ✅ Build is complete (just verified)
2. ✅ Firebase config is correct (firebase.json looks good)
3. ⚠️ Need to deploy: Run `firebase deploy --only hosting`

## Troubleshooting

### If deployment fails:
```bash
# Check if you're logged in
firebase login

# Check current project
firebase use

# Set project if needed
firebase use boggle-app-c0d1c

# Deploy
firebase deploy --only hosting
```

### If UI doesn't load after deployment:
1. Clear browser cache
2. Check browser console for errors
3. Verify build files are in `myboggle-app/build/`
4. Check Firebase Console → Hosting to see deployed files

### If you see a blank page:
- Check browser console (F12) for JavaScript errors
- Verify API URL is set correctly (should use production URL for deployed app)
- Check Network tab for failed requests

## Update API URL for Production

Before deploying, update `myboggle-app/src/api.js` or set environment variable:

```bash
# Option 1: Set environment variable before building
REACT_APP_API_URL=https://your-django-api-url.com/api npm run build

# Option 2: Update api.js directly before building
# Change: const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
# To your production Django API URL
```

Then rebuild and redeploy:
```bash
cd myboggle-app
npm run build
cd ..
firebase deploy --only hosting
```

