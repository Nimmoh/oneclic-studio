# Quick Start - MongoDB Images Setup

## What Changed
All images on your OneClic Studio site now save to MongoDB instead of just localStorage. This means:
- Images persist in your database
- Changes sync automatically between admin panel and main website
- No data loss if browser cache is cleared
- Ready for production deployment

## Setup (5 minutes)

### 1. Update .env with MongoDB Credentials
Open `.env` and replace `<db_password>` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://nimmohndabari_db_user:YOUR_ACTUAL_PASSWORD@cluster0.soskpxp.mongodb.net/oneclic-studio?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 2. Start Backend Server (Terminal 1)
```bash
npm run server-dev
```
You should see: `✓ MongoDB connected`

### 3. Start Frontend Server (Terminal 2)
```bash
npm run dev
```

### 4. Test It
- Go to admin panel: `http://localhost:8000/admin.html`
- Add a banner/portfolio/service with an image
- Refresh the main page - image should appear
- Restart the backend - image should still be there (proves it's in MongoDB!)

## How It Works

```
Admin Panel                    Main Website
     ↓                              ↓
   Form                        Page Load
     ↓                              ↓
Save to localStorage ----→ Fallback
   &                       
Save to MongoDB API        Fetch from MongoDB API
     ↓                              ↓
MongoDB Database ←────────── Sync
```

## API Endpoints

All running on `http://localhost:5000/api`:

- `GET /api/banners` - List all banners
- `POST /api/banners` - Add banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

Same pattern for `/api/portfolio` and `/api/services`

Test: `http://localhost:5000/api/health`

## Troubleshooting

### Error: "MongoDB connection error"
Check your .env file - make sure password is correct and doesn't have special characters that need URL encoding.

### Images not showing up
- Refresh with Ctrl+F5 (hard refresh)
- Check F12 console for errors
- Verify backend is running

### Port 5000 already in use
Change PORT in .env to 5001 or close the app using 5000.

## Files Modified
- `server.js` - Backend API server
- `.env` - Configuration
- `admin.js` - Now syncs with MongoDB
- `main.js` - Now loads from MongoDB
- `MONGODB_SETUP.md` - Detailed documentation

All changes are backward compatible - still works offline with localStorage!
