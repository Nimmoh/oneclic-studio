# Setting Up Environment Variables in Vercel

## Why This Is Needed

Your site can't load images because MongoDB isn't connected on Vercel. The `.env` file only works locally - Vercel needs environment variables set in the dashboard.

## How to Fix (5 Minutes)

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com
2. Log in with your account
3. Click on your project: **oneclic-studio**

### Step 2: Open Settings
1. Click on **Settings** tab (top menu)
2. Click on **Environment Variables** in left sidebar

### Step 3: Add MongoDB Connection String
1. Click **+ Add New**
2. Fill in:
   - **Name**: `MONGODB_URI`
   - **Value**: Copy the entire string below:
   ```
   mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
   ```
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**

### Step 4: Redeploy Your Site
1. Go back to **Deployments** tab
2. Find your latest deployment
3. Click the **3 dots** (more options)
4. Click **Redeploy**
5. Click **Redeploy** again in the confirmation

### Step 5: Wait for Deployment
- Wait 2-3 minutes for deployment to complete
- You'll see a green checkmark when done
- Refresh your phone browser

## What Should Happen

After redeployment, when you visit your site:
1. Images should load from MongoDB
2. Browser console (F12) should show: `✓ Services loaded: 6`
3. Service cards will show actual images instead of gradients

## If It Still Doesn't Work

### Check MongoDB Atlas Whitelist
MongoDB Atlas blocks unknown IP addresses. You need to allow Vercel's IPs:

1. Go to https://cloud.mongodb.com
2. Log in with your account
3. Click on **Cluster0**
4. Click **Network Access** in left sidebar
5. Click **Add IP Address**
6. Select **Allow Access from Anywhere** (for Vercel)
   - Value: `0.0.0.0/0`
   - Click **Confirm**

### Verify Connection Worked
After redeploy, check your site:
1. Open your Vercel URL on desktop or mobile
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this command:
```javascript
fetch('/api/health').then(r => r.json()).then(d => console.log('Health Check:', d))
```
5. Should see: `Health Check: {status: 'OK', message: 'Server is running'}`

Then try:
```javascript
fetch('/api/services').then(r => r.json()).then(d => console.log('Services:', d))
```
5. Should show all 6 services with image data

## Environment Variables Summary

### What You Just Set:
```
MONGODB_URI = mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
```

### What This Does:
- Tells your Vercel backend where MongoDB is
- Includes database name: `oneclic-studio`
- Includes retry and write settings for reliability

### Local Development:
- Your `.env` file has this same setting
- Used when you run `npm run server-dev`
- Vercel doesn't read `.env` - it uses the dashboard settings

## Quick Checklist

- [ ] Logged into Vercel dashboard
- [ ] Went to Environment Variables
- [ ] Added `MONGODB_URI` with the connection string
- [ ] Selected all environments
- [ ] Clicked Save
- [ ] Went to Deployments
- [ ] Redeployed the site
- [ ] Waited 2-3 minutes
- [ ] Refreshed browser
- [ ] Images now showing on service cards

## Still Having Issues?

If images still don't load after this:

1. **Hard refresh browser**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Check deployment logs**: Click deployment → View logs
3. **Look for errors**: Search for "MongoDB" in logs
4. **Verify IP whitelist**: Make sure 0.0.0.0/0 is added to MongoDB Atlas
5. **Try uploading new image**: Go to admin and upload, then refresh main site

## Phone Testing

Once images load on desktop:

1. Go to your Vercel URL on phone
2. Open Chrome menu (3 dots) → DevTools
3. Go to Console tab
4. Scroll and watch for image loading messages
5. Service cards should show images, not gradients
6. Scroll down to see Portfolio and Banners with images

---

**That's it!** Your images should now load on mobile and desktop. If not, follow the "Still Having Issues" section above.
