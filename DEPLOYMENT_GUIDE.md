# Troubleshooting & Deployment Guide

## Mobile UI Issues - FIXED ✓

### What was fixed:
- **Navigation**: Now responsive with proper font sizing for mobile devices
- **Header**: Logo scales responsively (40-56px)
- **Buttons**: Optimized padding and font sizes for touch targets
- **Service Cards**: Full-width on mobile, 2-column on tablet, 3-column on desktop
- **Carousel**: Proper spacing and sizing for mobile viewing
- **Forms**: Better padding and font sizes for mobile input
- **Hero Section**: Optimized copy and button layout for mobile
- **Process Steps**: Stack vertically on mobile with proper spacing
- **Contact Section**: Full-width on mobile with readable form fields
- **Footer**: Responsive text sizing and proper spacing

### Mobile Breakpoints:
- **600px and below**: Full mobile optimization
- **380px and below**: Ultra-compact sizing for small phones
- **820px and below**: Tablet optimization
- **1024px and below**: Landscape tablet optimization

## Images Not Updating - ROOT CAUSES & FIXES ✓

### The Problem:
Images uploaded in the admin panel weren't showing on the main site in production (Vercel).

### Root Causes:
1. **API connectivity**: Main site couldn't fetch images from MongoDB API
2. **Fallback mechanism**: Images were only stored in localStorage, not synced properly
3. **API response handling**: Missing error logging and proper response validation
4. **Vercel serverless function**: Not properly exporting the Express app

### Fixes Applied:

#### 1. **Enhanced API/index.js** ✓
- Improved MongoDB connection handling with `connectDB()` function
- Better error messages and logging
- Proper async/await for all routes
- Fixed function export for Vercel serverless

#### 2. **Improved main.js Logging** ✓
- Added detailed console logging with emoji indicators (📡, ✓, ⚠️)
- Logs show:
  - API URL being called
  - Number of items loaded
  - Which images are successfully loaded
  - Why images might be failing
- Fallback to localStorage with detailed logging

#### 3. **Enhanced admin.js Sync** ✓
- Better error handling on page load
- Detailed sync logging
- Validates all API responses
- Stores to both localStorage AND MongoDB

#### 4. **Vercel Configuration** ✓
- Updated `package.json` to use proper build command
- Dependencies now in "dependencies" (not devDependencies) for production
- Build script (`build.js`) copies files to public/
- Routes properly configured in vercel.json

### How to Verify Images Are Working:

#### Local Testing (http://localhost:5002):
1. Open browser DevTools (F12)
2. Go to Console tab
3. Upload images in admin.html
4. Check console for messages like:
   - "Service updated with 2 image(s)!"
   - "✓ Services loaded: 6"
   - "✓ Loaded image for: photography"

#### Production Testing (Vercel):
1. Open your Vercel site URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Scroll through sections and watch for:
   - "📡 Loading services from API"
   - "✓ Services loaded: 6"
   - "✓ Loaded image for: [service-name]"
5. If you see warnings (⚠️), images are using localStorage fallback

### Debugging Steps if Images Still Don't Show:

#### Step 1: Check API Health
Open your browser console on the main site and paste:
```javascript
fetch('/api/health').then(r => r.json()).then(d => console.log('Health:', d))
```
You should see: `Health: {status: 'OK', message: 'Server is running'}`

#### Step 2: Check Services API
```javascript
fetch('/api/services').then(r => r.json()).then(d => console.log('Services:', d))
```
You should see all services with images as base64 strings (starts with "data:image/...")

#### Step 3: Check Banners API
```javascript
fetch('/api/banners').then(r => r.json()).then(d => console.log('Banners:', d))
```

#### Step 4: Check Portfolio API
```javascript
fetch('/api/portfolio').then(r => r.json()).then(d => console.log('Portfolio:', d))
```

## Environment Variables

### Required for Production (Set in Vercel):
```
MONGODB_URI=mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/
NODE_ENV=production
PORT=3000
```

### Local Development (.env):
```
MONGODB_URI=mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/
PORT=5002
NODE_ENV=development
```

## Running Locally

### Start Backend (in one terminal):
```bash
npm run server-dev
```
You'll see:
```
✓ MongoDB connected
✓ Server running on http://localhost:5002
```

### Start Frontend (in another terminal):
```bash
npm run dev
```
Then open: http://localhost:8000

### Admin Panel:
- URL: http://localhost:8000/admin.html
- Password: admin (click "Login")
- Upload images and test

## Deployment to Vercel

### 1. Ensure MongoDB credentials are set:
```bash
echo $MONGODB_URI  # Should show your connection string
```

### 2. Set environment variables in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add: `MONGODB_URI=mongodb+srv://...`
3. Deploy again

### 3. Check Deployment Logs:
```
vercel logs <project-url>
```

### 4. Verify on Production:
- Visit your Vercel URL
- Open DevTools Console
- Watch for image loading logs
- Upload new images in admin and refresh main site

## File Structure

```
oneclic-studio/
├── index.html              # Main site
├── admin.html              # Admin panel
├── server.js              # Express backend (local dev)
├── api/index.js           # Vercel serverless function
├── build.js               # Build script for Vercel
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
├── .env                   # Environment variables
├── assets/
│   ├── css/styles.css     # Responsive styles (UPDATED)
│   ├── js/
│   │   ├── main.js        # Main site logic (UPDATED with logging)
│   │   ├── admin.js       # Admin logic (UPDATED)
│   │   └── config.js      # Site config
│   └── img/               # Images
├── public/                # Build output (Vercel)
└── seed.js               # MongoDB seeding
```

## Common Issues & Solutions

### Issue: "Cannot GET /" on Vercel
**Solution:** 
- Ensure build.js is running
- Check that public/index.html exists
- Verify routes in vercel.json are correct

### Issue: Images still not showing
**Solution:**
1. Check MongoDB is connected: Open console and run health check
2. Force refresh (Ctrl+Shift+R) to clear cache
3. Check localStorage fallback is working
4. Verify images are base64 encoded (very long strings starting with "data:image")

### Issue: Admin form not submitting
**Solution:**
- Check MongoDB connection status
- Look for errors in browser console (F12)
- Verify localStorage is enabled
- Try uploading smaller images (test with 1-2MB files)

### Issue: Port 5002 already in use locally
**Solution:**
```bash
# Find process using port 5002
lsof -i :5002  # On Mac/Linux
netstat -ano | findstr :5002  # On Windows

# Kill the process
kill -9 <PID>  # On Mac/Linux
taskkill /PID <PID> /F  # On Windows
```

## Performance Notes

- Images stored as base64 in MongoDB (slower, but simpler)
- Recommended image size: 1-2MB per image
- Carousel auto-rotates every 6 seconds
- Responsive design using CSS Grid and Flexbox
- Mobile-first approach with progressive enhancement

## Next Steps

1. **Test locally first** - npm run server-dev + npm run dev
2. **Upload test images** in admin
3. **Verify on main site** - Refresh and check console logs
4. **Deploy to Vercel** - git push origin main
5. **Test on production** - Visit your Vercel URL and repeat steps 2-3

For additional help, check the browser console logs (F12 → Console tab) for detailed debugging information.
