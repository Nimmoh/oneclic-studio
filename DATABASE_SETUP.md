# Database Setup & Seeding Guide

## Overview
This guide explains how to connect MongoDB and seed your database with initial data for OneClic Studio.

## Prerequisites
- MongoDB URI in `.env` file (already configured)
- Node.js installed
- Backend server dependencies installed (`npm install`)

## Step 1: Verify MongoDB Connection

Your `.env` file already has the MongoDB connection string configured:
```env
MONGODB_URI=mongodb+srv://nimmohndabari_db_user:vP04zkibpJhM5dJp@cluster0.vcigvxy.mongodb.net/
PORT=5001
NODE_ENV=development
```

## Step 2: Seed the Database

To populate your database with initial sample data, run:

```bash
npm run seed
```

This will:
- Connect to your MongoDB database
- Clear any existing data
- Add 2 sample banners
- Add 3 sample portfolio items
- Add 6 services with placeholder images
- Display seeding status in console

### Expected Output:
```
✓ MongoDB connected for seeding
✓ Cleared existing data
✓ Seeded 2 banners
✓ Seeded 3 portfolio items
✓ Seeded 6 services

✓ Database seeded successfully!
You can now upload custom images from the admin panel.
Visit: http://localhost:8000/admin.html
```

## Step 3: Verify Data in Admin Panel

1. Start the backend server:
   ```bash
   npm run server-dev
   ```

2. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Visit the admin panel: `http://localhost:8000/admin.html`

4. Check the three tabs:
   - **Banner Management** - See 2 sample banners
   - **Portfolio Items** - See 3 portfolio projects
   - **Services** - See all 6 services

## Step 4: Upload Custom Images

Once seeded, you can:
1. Edit existing items with your own images
2. Add new banners with multiple images
3. Upload portfolio items with images
4. Update service images for each category

All changes are automatically saved to MongoDB and synced across the site.

## Database Schema

### Banners
```javascript
{
  id: Number,
  title: String,
  desc: String,
  image: String (Base64),
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolio
```javascript
{
  id: Number,
  title: String,
  category: String, // Photography, Web Design, Graphic Design, Branding, Digital Marketing
  desc: String,
  image: String (Base64),
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Services
```javascript
{
  key: String, // photography, web-design, graphic-design, branding, digital-marketing, social-media
  title: String,
  image: String (Base64),
  images: [String] // Multiple images array
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

All endpoints return data from MongoDB:

- `GET /api/banners` - Fetch all banners
- `POST /api/banners` - Create banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

- `GET /api/portfolio` - Fetch all portfolio items
- `POST /api/portfolio` - Create portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

- `GET /api/services` - Fetch all services
- `POST /api/services` - Create/update service

- `GET /api/health` - Health check

## Troubleshooting

**Error: "MongoDB connection error"**
- Verify `.env` has correct connection string
- Check MongoDB Atlas credentials are correct
- Ensure IP is whitelisted in MongoDB Atlas

**Images not showing**
- Clear browser cache (Ctrl+F5)
- Check MongoDB is connected (look for "✓ MongoDB connected" in server logs)
- Verify images are stored as Base64

**Seeding failed**
- Ensure MongoDB URI is correct in `.env`
- Try seeding again: `npm run seed`
- Check MongoDB Atlas cluster is active

## Next Steps

1. Customize sample data with your own projects
2. Upload high-quality images for banners and portfolio
3. Update service descriptions as needed
4. Deploy to production when ready

## Production Deployment

When deploying to production:
1. Update `API_URL` in `admin.js` to production server URL
2. Set production MongoDB URI in environment variables
3. Run seed script on production server to initialize data
4. Change `NODE_ENV` to "production" in `.env`

