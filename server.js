const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oneclic-studio')
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.log('✗ MongoDB connection error:', err));

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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Banner = mongoose.model('Banner', bannerSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
const Service = mongoose.model('Service', serviceSchema);

// Routes - Banners
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const banner = new Banner({
      id: Date.now(),
      ...req.body,
      order: req.body.order || 1
    });
    await banner.save();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes - Portfolio
app.get('/api/portfolio', async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const item = new Portfolio({
      id: Date.now(),
      ...req.body,
      order: req.body.order || 1
    });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes - Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    const result = {};
    services.forEach(svc => {
      result[svc.key] = { title: svc.title, image: svc.image };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { key, ...data } = req.body;
    let service = await Service.findOne({ key });
    if (service) {
      service = await Service.findByIdAndUpdate(service._id, { ...data, updatedAt: Date.now() }, { new: true });
    } else {
      service = new Service({ key, ...data });
      await service.save();
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
