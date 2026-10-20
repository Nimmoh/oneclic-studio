# Vercel Deployment Guide

## What You Need

1. Vercel account (free at vercel.com)
2. GitHub/GitLab/Bitbucket account with your code pushed
3. MongoDB Atlas connection string (already in .env)

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select your GitHub repository
4. Click "Import"

## Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
MONGODB_URI = your_mongodb_connection_string
NODE_ENV = production
```

The MongoDB URI should be:
```
mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/oneclic-studio?retryWrites=true&w=majority
```

## Step 4: Update Admin Panel API URL

After deployment, update your admin panel to use the production API:

In `assets/js/admin.js`, change:
```javascript
const API_URL = 'https://your-project.vercel.app/api';
```

Or it will auto-detect and use `/api` when on production domain.

## Step 5: Verify Deployment

1. Visit your production URL: `https://your-project.vercel.app`
2. Check admin panel: `https://your-project.vercel.app/admin.html`
3. Test API endpoint: `https://your-project.vercel.app/api/health`

Should return: `{"status":"OK","message":"Server is running"}`

## How It Works

- **Static files** (HTML, CSS, JS, images) are served directly from Vercel CDN
- **API routes** (`/api/*`) are routed to `api/index.js` serverless function
- **MongoDB** connects automatically when API calls are made
- **Auto-scaling** - handles traffic automatically

## Local Development (Still Works)

```bash
# Terminal 1 - Backend API
npm run server-dev

# Terminal 2 - Frontend
npm run dev

# Visit http://localhost:8000
```

## Troubleshooting

**API calls failing on production:**
- Check MongoDB URI is correct in Vercel environment variables
- Make sure MongoDB Atlas allows Vercel IPs (allow all IPs: 0.0.0.0/0)
- Check browser console for CORS errors

**Blank page:**
- Check browser console (F12) for errors
- Verify API URLs are correct
- Check Vercel function logs: Dashboard → Project → Deployments → Logs

**MongoDB connection timeout:**
- Increase connection timeout in `api/index.js` if needed
- Add MongoDB Atlas IP whitelist

## Production Checklist

- ✅ Environment variables set in Vercel
- ✅ MongoDB connection string verified
- ✅ API URLs updated for production
- ✅ Images stored in MongoDB (not local)
- ✅ Admin panel accessible and working
- ✅ Custom domain configured (optional)

## Custom Domain (Optional)

1. In Vercel Project Settings → Domains
2. Add your domain (e.g., oneclicstudio.com)
3. Update DNS records according to Vercel instructions

Your site is now live and scalable! 🚀

