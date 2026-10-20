# MongoDB Setup Guide for OneClic Studio

## Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier available)
- npm installed

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster
4. In the cluster, click "Connect"
5. Choose "Drivers" and select "Node.js"
6. Copy your connection string - it will look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/oneclic-studio?retryWrites=true&w=majority
   ```

## Step 2: Configure .env File

Update `.env` with your MongoDB credentials:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.soskpxp.mongodb.net/oneclic-studio?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Important:** Replace `your_username` and `your_password` with your actual MongoDB credentials.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Backend Server (Terminal 1)

For development with auto-restart:
```bash
npm run server-dev
```

Or for production:
```bash
npm run server
```

The server will start on `http://localhost:5000`

## Step 5: Run the HTTP Server (Terminal 2)

In a new terminal window:
```bash
npm run dev
```

Now visit:
- Main website: `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin.html`

## How MongoDB Integration Works

### When Adding/Editing Content:
1. Data is saved to **localStorage** (immediate backup)
2. Data is sent to **MongoDB** via API (persistent storage)
3. If MongoDB fails, content still saves locally

### When Loading the Site:
1. Main site fetches from MongoDB API (`http://localhost:5000/api/banners`, `/api/portfolio`, `/api/services`)
2. If MongoDB is unavailable, falls back to localStorage
3. Images load from Base64 stored in database

### Image Storage:
- All images are converted to Base64 format
- Stored directly in MongoDB documents (no separate file storage needed)
- Automatically synced between admin panel and main website

## Troubleshooting

**Error: "Cannot connect to MongoDB"**
- Check your .env file has correct MONGODB_URI
- Verify your MongoDB Atlas username/password are correct
- Make sure your IP address is whitelisted in MongoDB Atlas (Add Current IP in Network Access)
- Test connection string by copying it into MongoDB Compass

**Images not updating on main site**
- Refresh the page (Ctrl+F5 for hard refresh)
- Check browser console (F12 → Console tab) for errors
- Verify backend server is running on port 5000
- Check network tab to see if API calls to `localhost:5000/api/*` are successful

**Server won't start on port 5000**
- Check if another app is using port 5000
- If in use, either close that app or change PORT in .env to 5001

**Admin panel shows empty sections**
- MongoDB might not be connected - check server console logs
- Try adding a new banner/portfolio item - it should work even if offline
- Page will sync once MongoDB connection is restored

## API Endpoints

The backend provides REST API endpoints:

**Banners:**
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create new banner
- `PUT /api/banners/:id` - Update existing banner
- `DELETE /api/banners/:id` - Delete banner

**Portfolio:**
- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio` - Create portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

**Services:**
- `GET /api/services` - Get all services with images
- `POST /api/services` - Create/update service with image

## Deployment

To deploy this app to production:

1. **Choose a hosting platform:**
   - Railway.app (recommended, simple)
   - Heroku
   - AWS/Google Cloud

2. **Set environment variables on host:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Server port (usually 5000 or 3000)
   - `NODE_ENV` - Set to "production"

3. **Update API_URL in admin.js:**
   - Change `http://localhost:5000/api` to your production server URL
   - Example: `https://myapp.railway.app/api`

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## Testing MongoDB Connection

You can test if MongoDB is working by:

1. Opening browser console (F12)
2. Making a test request:
   ```javascript
   fetch('http://localhost:5000/api/health').then(r => r.json()).then(console.log)
   ```
3. You should see: `{status: "OK", message: "Server is running"}`

Or visit `http://localhost:5000/api/health` directly in your browser.
