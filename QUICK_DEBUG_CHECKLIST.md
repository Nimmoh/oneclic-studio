# Quick Debug Checklist

Use this checklist when troubleshooting issues with images or deployment.

## Before Deploying to Vercel

### Step 1: Test Backend API Locally
- [ ] Start backend: `npm run server-dev`
- [ ] Check MongoDB connection: Look for "✓ MongoDB connected" in terminal
- [ ] Visit http://localhost:5002/api/health in browser
- [ ] Should see: `{"status":"OK","message":"Server is running"}`

### Step 2: Test Frontend Locally
- [ ] Start frontend: `npm run dev`
- [ ] Open http://localhost:8000
- [ ] Open DevTools (F12) → Console tab
- [ ] Should see image loading messages (📡, ✓, ⚠️)

### Step 3: Test Admin Panel Locally
- [ ] Go to http://localhost:8000/admin.html
- [ ] Click "Login" and enter password: `admin`
- [ ] Upload a test image (Services or Banners tab)
- [ ] Check console for success message
- [ ] Go back to main site and refresh
- [ ] Image should appear

### Step 4: Check localStorage
- [ ] Open DevTools (F12) → Application/Storage tab
- [ ] Look for "oc_studio_data" key
- [ ] Should contain array of banners/portfolio/services with base64 images

### Step 5: Verify All API Endpoints
In browser console, run these commands:
```javascript
// Should return an array of banners
fetch('/api/banners').then(r => r.json()).then(d => console.log('Banners:', d))

// Should return an array of portfolio items
fetch('/api/portfolio').then(r => r.json()).then(d => console.log('Portfolio:', d))

// Should return an object with services
fetch('/api/services').then(r => r.json()).then(d => console.log('Services:', d))

// Should return {status: 'OK', message: 'Server is running'}
fetch('/api/health').then(r => r.json()).then(d => console.log('Health:', d))
```

---

## After Deploying to Vercel

### Step 1: Verify Deployment Completed
- [ ] Go to your Vercel project dashboard
- [ ] Check deployment status: Should show ✓ (green)
- [ ] Check deployment logs for errors
- [ ] Look for "Build complete" message

### Step 2: Test Main Site
- [ ] Open your Vercel URL
- [ ] Open DevTools (F12) → Console tab
- [ ] Refresh page (Ctrl+Shift+R for hard refresh)
- [ ] Look for console messages:
  - "📡 Loading banners from API"
  - "✓ Banners loaded: X"
  - "📡 Loading services from API"
  - "✓ Services loaded: 6"
  - "✓ Loaded image for: [service-name]"

### Step 3: Check API Endpoints on Production
In browser console on your Vercel site:
```javascript
// All these should return data (not 404)
fetch('/api/health').then(r => r.json()).then(d => console.log(d))
fetch('/api/banners').then(r => r.json()).then(d => console.log(d))
fetch('/api/services').then(r => r.json()).then(d => console.log(d))
fetch('/api/portfolio').then(r => r.json()).then(d => console.log(d))
```

### Step 4: Test Admin on Production
- [ ] Go to your-vercel-url.com/admin.html
- [ ] Login with password: `admin`
- [ ] Try uploading a new image
- [ ] Check console for success message
- [ ] Wait a few seconds
- [ ] Refresh main site
- [ ] New image should appear

### Step 5: Mobile Testing
- [ ] Open your Vercel URL on mobile/tablet
- [ ] Check that layout is responsive
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] Buttons are properly sized
- [ ] Images display correctly

---

## Console Log Guide

### Good Signs (Green ✓):
- `✓ Services loaded: 6`
- `✓ Banners loaded: X`
- `✓ Loaded image for: photography`
- `✓ MongoDB connected`
- `✓ Data synced from MongoDB`

### Warning Signs (Yellow ⚠️):
- `⚠️ API response not ok: 404`
- `⚠️ Could not fetch services from API`
- `⚠️ No image for service: branding`
- `📦 Using fallback services: 6`

### Error Signs (Red ✗):
- `✗ MongoDB connection error`
- `✗ Error copying assets`
- `Cannot GET /` on Vercel

---

## Environment Variables Checklist

### For Local Development (.env file):
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `PORT=5002`
- [ ] `NODE_ENV=development`

### For Vercel (Settings → Environment Variables):
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000` (optional, Vercel sets this)

### Verify in Vercel:
1. Go to Settings → Environment Variables
2. Add `MONGODB_URI` with your connection string
3. Redeploy the project
4. Check deployment logs for MongoDB connection

---

## File Permissions Checklist

- [ ] `build.js` - Executable (Node.js script)
- [ ] `api/index.js` - Readable by Vercel
- [ ] `.env` - Never commit to git
- [ ] `public/` - Build output (auto-generated)

---

## Common Error Messages & Fixes

### "Cannot GET /"
**Cause**: Static files not being served
**Fix**: 
1. Check build.js ran successfully
2. Verify public/index.html exists
3. Check vercel.json routes

### "Service returned 500"
**Cause**: MongoDB connection issue
**Fix**:
1. Verify MONGODB_URI is set in Vercel
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0)
3. Redeploy with environment variables

### "Images show gradient placeholder"
**Cause**: API returned no image data
**Fix**:
1. Upload image in admin again
2. Check /api/services endpoint returns images
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for error messages

### "Admin form won't submit"
**Cause**: MongoDB connection failed
**Fix**:
1. Check MongoDB connection locally first
2. Verify .env file has correct MONGODB_URI
3. Check image file size (keep under 2MB)
4. Try uploading 1 image at a time

---

## Performance Tips

- [ ] Images should be < 2MB
- [ ] Use JPEG for photos
- [ ] Use PNG for graphics with transparency
- [ ] Compress images before uploading
- [ ] Test with slow network (DevTools → Network → Slow 3G)

---

## Quick Commands Reference

```bash
# Local Development
npm run server-dev        # Start backend (Terminal 1)
npm run dev             # Start frontend (Terminal 2)

# Testing
npm run seed            # Populate MongoDB with test data

# Deployment
git add .
git commit -m "message"
git push origin main    # Triggers Vercel deployment

# Debugging
npm run server          # Run backend once (no nodemon)
npm run build           # Test build script locally
```

---

## 24-Hour Quick Fix

If something breaks right after deployment:

1. **Check Vercel logs**: `vercel logs`
2. **Verify MongoDB**: Test connection locally
3. **Clear cache**: Hard refresh in browser (Ctrl+Shift+R)
4. **Check environment**: Verify MONGODB_URI is set
5. **Redeploy**: `git push origin main`
6. **Wait 2-3 min**: Let deployment finish
7. **Test API**: Run health check command
8. **Read console**: Check F12 console for errors

---

## Still Stuck?

1. Open DEPLOYMENT_GUIDE.md for detailed troubleshooting
2. Check browser console (F12) for error messages
3. Run API health check: `fetch('/api/health').then(r=>r.json()).then(d=>console.log(d))`
4. Copy error messages and search for solutions
5. Check MongoDB Atlas dashboard for connection status
6. Verify Vercel deployment status and logs
