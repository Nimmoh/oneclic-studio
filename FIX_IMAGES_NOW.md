# 🔧 FIX: Images Not Loading on Phone - STEP BY STEP

## The Problem
Your service cards, banners, and portfolio items are showing gradient placeholders instead of images on your Vercel site (especially on mobile).

## The Root Cause
**MongoDB is not connected on Vercel because the environment variable is missing.**

When you visit your site on production:
- ❌ Backend can't connect to MongoDB
- ❌ Images aren't fetched from database
- ❌ Falls back to localStorage (which is empty if first time visiting)
- ❌ Shows gradient placeholders instead

## The Solution (3 Steps - 5 Minutes)

### ✅ STEP 1: Update Local .env File (Already Done ✓)
Your `.env` file now has the correct database name:
```
MONGODB_URI=mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
```

### ✅ STEP 2: Set Environment Variable in Vercel Dashboard (DO THIS NOW!)

**How to do it:**

1. **Open Vercel Dashboard**
   - Go to https://vercel.com
   - Log in with your account
   - Click your project: **oneclic-studio**

2. **Go to Settings**
   - Click **Settings** tab (top of page)
   - Click **Environment Variables** (left sidebar)

3. **Add the MongoDB Connection String**
   - Click **+ Add New**
   - **Name:** `MONGODB_URI` (exactly this)
   - **Value:** Copy this entire string:
   ```
   mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
   ```
   - **Environments:** Select **All** (Production, Preview, Development)
   - Click **Save**

4. **Important: Allow MongoDB Connection**
   - Go to https://cloud.mongodb.com
   - Click your cluster: **Cluster0**
   - Click **Network Access** (left sidebar)
   - Click **Add IP Address**
   - Select **Allow Access from Anywhere**
     - IP Address: `0.0.0.0/0`
     - Click **Confirm**

### ✅ STEP 3: Redeploy Your Site (DO THIS NOW!)

1. **Go back to Vercel**
   - Click **Deployments** tab
   - Find your latest deployment (usually at top)

2. **Redeploy**
   - Click the **three dots** (...) next to the deployment
   - Click **Redeploy**
   - Click **Redeploy** again to confirm

3. **Wait for Deployment**
   - Wait 2-3 minutes
   - You'll see a green checkmark when complete
   - Status will change from "Building..." to "Ready"

## 🎉 That's It!

After redeployment (2-3 minutes), your images should load.

## Test It

### On Desktop:
1. Go to your Vercel URL
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this:
```javascript
fetch('/api/services').then(r => r.json()).then(d => console.log('Services:', Object.keys(d)))
```
5. Should show: `Services: ['photography', 'web-design', 'graphic-design', 'branding', 'digital-marketing', 'social-media']`

### On Mobile:
1. Visit your Vercel URL
2. Scroll down to "What we do" section
3. You should see images on service cards (not gradients)
4. Try uploading a new image in admin and refreshing

## If Images Still Don't Load

### Check 1: Verify Environment Variable Was Set
1. Go back to Vercel Settings → Environment Variables
2. Confirm `MONGODB_URI` is there
3. Verify value has `/oneclic-studio` at the end
4. Check that all environments are selected

### Check 2: MongoDB IP Whitelist
1. Go to https://cloud.mongodb.com
2. Click **Cluster0** → **Network Access**
3. Verify **0.0.0.0/0** is in the list (Allow from Anywhere)
4. If not, add it

### Check 3: Hard Refresh Browser
- Desktop: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- Mobile: Close app, clear cache, reopen

### Check 4: Verify API is Working
In browser console:
```javascript
fetch('/api/health').then(r => r.json()).then(d => console.log(d))
```
Should see: `{status: 'OK', message: 'Server is running'}`

If you see 404 or error, MongoDB isn't connected yet.

### Check 5: Check Deployment Logs
1. In Vercel, click on your latest deployment
2. Scroll down to **Deployments** section
3. Click **View Logs**
4. Look for "✓ MongoDB connected" message
5. If you see "✗ MongoDB connection error", check:
   - MONGODB_URI is set correctly in Env Variables
   - MongoDB Atlas IP whitelist includes 0.0.0.0/0
   - Connection string hasn't expired

## Common Issues

### Issue: "Cannot connect to MongoDB" error
**Solution:**
- Go to MongoDB Atlas
- Add **0.0.0.0/0** to Network Access
- Redeploy your Vercel site

### Issue: "Database not found" error
**Solution:**
- Check MONGODB_URI ends with `/oneclic-studio`
- Verify it includes `?retryWrites=true&w=majority`
- The full URL should be:
  ```
  mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
  ```

### Issue: Still showing gradients on mobile
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Wait 30 seconds
3. Check console for error messages
4. Verify deployment is complete (green checkmark)
5. Check MongoDB connection using health check command

## Quick Reference

| Issue | Solution |
|-------|----------|
| Gradients showing | Set MONGODB_URI in Vercel |
| API returning 404 | Add 0.0.0.0/0 to MongoDB Atlas |
| Still not working | Redeploy Vercel site |
| Images on desktop but not mobile | Hard refresh (Ctrl+Shift+R) |
| "Connection refused" error | Check MongoDB Atlas is running |

## Summary

✅ **What you did:**
1. Updated .env with correct database name
2. Updated MongoDB connection code for better reliability

⏳ **What you need to do NOW (5 minutes):**
1. Add MONGODB_URI to Vercel Environment Variables
2. Allow 0.0.0.0/0 in MongoDB Atlas Network Access
3. Redeploy your Vercel site
4. Wait 2-3 minutes
5. Refresh browser

🎯 **Result:**
- Images load from MongoDB ✓
- Service cards show real images ✓
- Portfolio and banners work ✓
- Mobile displays images correctly ✓

**Go set up the environment variable in Vercel now! It takes 2 minutes.**

---

**Still stuck?** Check the DEPLOYMENT_GUIDE.md or QUICK_DEBUG_CHECKLIST.md files for more detailed help.
