const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Schemas
const bannerSchema = new mongoose.Schema({
  id: Number,
  title: String,
  desc: String,
  image: String,
  order: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const portfolioSchema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  desc: String,
  image: String,
  order: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  key: String,
  title: String,
  image: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Banner = mongoose.model('Banner', bannerSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
const Service = mongoose.model('Service', serviceSchema);

// Sample data with placeholder images
const sampleBanners = [
  {
    id: 1,
    title: 'Professional Photography',
    desc: 'Capturing moments that matter with precision and creativity',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZTUyNTJkIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkJhbm5lciAxPC90ZXh0Pjwvc3ZnPg==',
    order: 1
  },
  {
    id: 2,
    title: 'Web Design Excellence',
    desc: 'Fast, modern websites that convert visitors into customers',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMmQyZDJkIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkJhbm5lciAyPC90ZXh0Pjwvc3ZnPg==',
    order: 2
  }
];

const samplePortfolio = [
  {
    id: 1,
    title: 'Luxury Brand Website',
    category: 'Web Design',
    desc: 'Modern e-commerce website for luxury fashion brand with integrated analytics',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZTUyNTJkIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlBvcnRmb2xpbyAxPC90ZXh0Pjwvc3ZnPg==',
    order: 1
  },
  {
    id: 2,
    title: 'Event Photography Coverage',
    category: 'Photography',
    desc: 'Complete professional event coverage with editing and delivery',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMmQyZDJkIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlBvcnRmb2xpbyAyPC90ZXh0Pjwvc3ZnPg==',
    order: 2
  },
  {
    id: 3,
    title: 'Brand Identity System',
    category: 'Branding',
    desc: 'Complete branding package including logo, guidelines, and assets',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZWY0YzRjIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlBvcnRmb2xpbyAzPC90ZXh0Pjwvc3ZnPg==',
    order: 3
  }
];

const sampleServices = [
  {
    key: 'photography',
    title: 'Photography',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjNjY3ZWVhIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlBob3RvZ3JhcGh5PC90ZXh0Pjwvc3ZnPg==',
    images: []
  },
  {
    key: 'web-design',
    title: 'Web Design',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZjA5M2ZiIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPldlYiBEZXNpZ248L3RleHQ+PC9zdmc+',
    images: []
  },
  {
    key: 'graphic-design',
    title: 'Graphic Design',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjNGZhY2ZlIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkdyYXBoaWMgRGVzaWduPC90ZXh0Pjwvc3ZnPg==',
    images: []
  },
  {
    key: 'branding',
    title: 'Branding',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZmE3MDlhIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkJyYW5kaW5nPC90ZXh0Pjwvc3ZnPg==',
    images: []
  },
  {
    key: 'digital-marketing',
    title: 'Digital Marketing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMzBjZmQwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkRpZ2l0YWwgTWFya2V0aW5nPC90ZXh0Pjwvc3ZnPg==',
    images: []
  },
  {
    key: 'social-media',
    title: 'Social Media Marketing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjYThlZGVhIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlNvY2lhbCBNZWRpYTwvdGV4dD48L3N2Zz4=',
    images: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oneclic-studio');
    console.log('✓ MongoDB connected for seeding');

    // Clear existing data
    await Banner.deleteMany({});
    await Portfolio.deleteMany({});
    await Service.deleteMany({});
    console.log('✓ Cleared existing data');

    // Seed banners
    const banners = await Banner.insertMany(sampleBanners);
    console.log(`✓ Seeded ${banners.length} banners`);

    // Seed portfolio
    const portfolio = await Portfolio.insertMany(samplePortfolio);
    console.log(`✓ Seeded ${portfolio.length} portfolio items`);

    // Seed services
    const services = await Service.insertMany(sampleServices);
    console.log(`✓ Seeded ${services.length} services`);

    console.log('\n✓ Database seeded successfully!');
    console.log('You can now upload custom images from the admin panel.');
    console.log('Visit: http://localhost:8000/admin.html');

    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
