(function() {
  // MongoDB API Base URL
  const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5002/api' 
    : '/api';
  
  // Fallback to localStorage data
  const STORAGE_KEY = 'oc_studio_data';
  
  // Default data
  const DEFAULT_DATA = {
    banners: [],
    portfolio: [],
    services: {
      photography: { title: 'Photography', image: '' },
      'web-design': { title: 'Web Design', image: '' },
      'graphic-design': { title: 'Graphic Design', image: '' },
      branding: { title: 'Branding', image: '' },
      'digital-marketing': { title: 'Digital Marketing', image: '' },
      'social-media': { title: 'Social Media Marketing', image: '' }
    }
  };

  function getData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Sync local data with MongoDB on load
  async function syncDataFromMongoDB() {
    try {
      console.log('🔄 Syncing data from MongoDB...');
      const [bannersRes, portfolioRes, servicesRes] = await Promise.all([
        fetch(`${API_URL}/banners`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch(`${API_URL}/portfolio`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch(`${API_URL}/services`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      ]);
      
      if (bannersRes.ok && portfolioRes.ok && servicesRes.ok) {
        const banners = await bannersRes.json();
        const portfolio = await portfolioRes.json();
        const services = await servicesRes.json();
        
        const data = getData();
        data.banners = banners;
        data.portfolio = portfolio;
        data.services = services;
        saveData(data);
        console.log('✓ Data synced from MongoDB');
        return true;
      } else {
        console.warn('⚠️ One or more API responses failed');
      }
    } catch (err) {
      console.warn('⚠️ Could not sync from MongoDB:', err.message);
    }
    return false;
  }
  
  // Sync on page load
  syncDataFromMongoDB();

  // API functions
  async function fetchBanners() {
    try {
      const response = await fetch(`${API_URL}/banners`);
      if (response.ok) return await response.json();
    } catch (err) {
      console.log('MongoDB unavailable, using localStorage');
    }
    return getData().banners;
  }

  async function saveBannerToAPI(banner, isUpdate = false) {
    try {
      const method = isUpdate ? 'PUT' : 'POST';
      const endpoint = isUpdate && banner._id ? `${API_URL}/banners/${banner._id}` : `${API_URL}/banners`;
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      if (!response.ok) throw new Error('API error');
      return await response.json();
    } catch (err) {
      console.log('Saving to MongoDB failed:', err.message);
      return null;
    }
  }

  async function deleteBannerFromAPI(bannerId) {
    try {
      const response = await fetch(`${API_URL}/banners/${bannerId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('API error');
    } catch (err) {
      console.log('Delete from MongoDB failed:', err.message);
    }
  }

  async function fetchPortfolio() {
    try {
      const response = await fetch(`${API_URL}/portfolio`);
      if (response.ok) return await response.json();
    } catch (err) {
      console.log('MongoDB unavailable, using localStorage');
    }
    return getData().portfolio;
  }

  async function savePortfolioToAPI(item, isUpdate = false) {
    try {
      const method = isUpdate ? 'PUT' : 'POST';
      const endpoint = isUpdate && item._id ? `${API_URL}/portfolio/${item._id}` : `${API_URL}/portfolio`;
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('API error');
      return await response.json();
    } catch (err) {
      console.log('Saving to MongoDB failed:', err.message);
      return null;
    }
  }

  async function deletePortfolioFromAPI(itemId) {
    try {
      const response = await fetch(`${API_URL}/portfolio/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('API error');
    } catch (err) {
      console.log('Delete from MongoDB failed:', err.message);
    }
  }

  async function fetchServices() {
    try {
      const response = await fetch(`${API_URL}/services`);
      if (response.ok) return await response.json();
    } catch (err) {
      console.log('MongoDB unavailable, using localStorage');
    }
    return getData().services;
  }

  async function saveServiceToAPI(key, data) {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, ...data })
      });
      if (!response.ok) throw new Error('API error');
      return await response.json();
    } catch (err) {
      console.log('Saving to MongoDB failed:', err.message);
      return null;
    }
  }

  function showMessage(msg, type = 'success') {
    const msgEl = document.querySelector('.success-msg') || document.createElement('div');
    msgEl.className = 'success-msg show';
    msgEl.textContent = msg;
    if (!msgEl.parentNode) document.querySelector('.admin-content').prepend(msgEl);
    setTimeout(() => msgEl.classList.remove('show'), 3000);
  }

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(this.dataset.tab + '-tab').classList.add('active');
    });
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('oc_admin_logged_in');
    window.location.href = 'index.html';
  });

  // Banner Management
  document.getElementById('banner-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const titleInput = document.getElementById('banner-title');
    const descInput = document.getElementById('banner-desc');
    const imageInput = document.getElementById('banner-image');
    const editId = this.dataset.editId;
    
    const files = imageInput.files;
    const data = getData();
    
    if (!files || files.length === 0) {
      showMessage('Please select at least one image', 'error');
      return;
    }

    // Process each file
    let filesProcessed = 0;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = async function(event) {
        filesProcessed++;
        
        if (editId && filesProcessed === 1) {
          // Update existing banner with first image only
          const banner = data.banners.find(b => b.id === parseInt(editId));
          if (banner) {
            banner.title = titleInput.value;
            banner.desc = descInput.value;
            banner.image = event.target.result;
            saveData(data);
            await saveBannerToAPI(banner, true);
          }
        } else if (!editId) {
          // Add new banners for each image
          const newBanner = {
            id: Date.now() + filesProcessed,
            title: titleInput.value,
            desc: descInput.value,
            image: event.target.result,
            order: data.banners.length + filesProcessed
          };
          data.banners.push(newBanner);
          saveData(data);
          await saveBannerToAPI(newBanner, false);
        }
        
        // If this is the last file
        if (filesProcessed === files.length) {
          document.getElementById('banner-form').reset();
          delete document.getElementById('banner-form').dataset.editId;
          document.querySelector('#banner-form button').textContent = 'Add Banner';
          renderBanners();
          showMessage(editId ? 'Banner updated!' : `${files.length} banner(s) added!`);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  function renderBanners() {
    const data = getData();
    const list = document.getElementById('banners-list');
    list.innerHTML = data.banners.map(b => `
      <div class="list-item">
        <div class="item-info">
          <p class="item-title">${b.title}</p>
          <p class="item-desc">${b.desc || 'No description'}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-sm" onclick="window.adminEditBanner(${b.id})">Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.adminDeleteBanner(${b.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.adminDeleteBanner = async function(id) {
    if (confirm('Delete this banner?')) {
      const data = getData();
      const banner = data.banners.find(b => b.id === id);
      data.banners = data.banners.filter(b => b.id !== id);
      saveData(data);
      await deleteBannerFromAPI(banner?._id || id);
      renderBanners();
      showMessage('Banner deleted');
    }
  };

  window.adminEditBanner = function(id) {
    const data = getData();
    const banner = data.banners.find(b => b.id === id);
    if (banner) {
      document.getElementById('banner-title').value = banner.title;
      document.getElementById('banner-desc').value = banner.desc;
      document.getElementById('banner-form').dataset.editId = id;
      document.querySelector('#banner-form button').textContent = 'Update Banner';
      document.querySelector('#banner-form button').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Portfolio Management
  document.getElementById('portfolio-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const titleInput = document.getElementById('portfolio-title');
    const categoryInput = document.getElementById('portfolio-category');
    const descInput = document.getElementById('portfolio-desc');
    const imageInput = document.getElementById('portfolio-image');
    const editId = this.dataset.editId;
    
    const files = imageInput.files;
    const data = getData();
    
    if (!files || files.length === 0) {
      showMessage('Please select at least one image', 'error');
      return;
    }
    
    if (editId) {
      // Update existing portfolio item with first image only
      const item = data.portfolio.find(p => p.id === parseInt(editId));
      if (item && files[0]) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          item.title = titleInput.value;
          item.category = categoryInput.value;
          item.desc = descInput.value;
          item.image = event.target.result;
          saveData(data);
          await savePortfolioToAPI(item, true);
          document.getElementById('portfolio-form').reset();
          delete document.getElementById('portfolio-form').dataset.editId;
          document.querySelector('#portfolio-form button').textContent = 'Add Item';
          renderPortfolio();
          showMessage('Portfolio item updated!');
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      // Add new portfolio items for each image
      let filesProcessed = 0;
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          filesProcessed++;
          const newItem = {
            id: Date.now() + filesProcessed,
            title: titleInput.value,
            category: categoryInput.value,
            desc: descInput.value,
            image: event.target.result,
            order: data.portfolio.length + filesProcessed
          };
          data.portfolio.push(newItem);
          saveData(data);
          await savePortfolioToAPI(newItem, false);
          
          // If this is the last file
          if (filesProcessed === files.length) {
            document.getElementById('portfolio-form').reset();
            renderPortfolio();
            showMessage(`${files.length} portfolio item(s) added!`);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  });

  function renderPortfolio() {
    const data = getData();
    const list = document.getElementById('portfolio-list');
    list.innerHTML = data.portfolio.map(p => `
      <div class="list-item">
        <div class="item-info">
          <p class="item-title">${p.title}</p>
          <p class="item-desc">${p.category}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-sm" onclick="window.adminEditPortfolio(${p.id})">Edit</button>
          <button class="btn btn-sm btn-delete" onclick="window.adminDeletePortfolio(${p.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.adminDeletePortfolio = async function(id) {
    if (confirm('Delete this portfolio item?')) {
      const data = getData();
      const item = data.portfolio.find(p => p.id === id);
      data.portfolio = data.portfolio.filter(p => p.id !== id);
      saveData(data);
      await deletePortfolioFromAPI(item?._id || id);
      renderPortfolio();
      showMessage('Item deleted');
    }
  };

  window.adminEditPortfolio = function(id) {
    const data = getData();
    const item = data.portfolio.find(p => p.id === id);
    if (item) {
      document.getElementById('portfolio-title').value = item.title;
      document.getElementById('portfolio-category').value = item.category;
      document.getElementById('portfolio-desc').value = item.desc;
      document.getElementById('portfolio-form').dataset.editId = id;
      document.querySelector('#portfolio-form button').textContent = 'Update Item';
      document.querySelector('#portfolio-form button').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Services Management
  document.getElementById('services-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const serviceType = document.getElementById('service-type').value;
    const imageInput = document.getElementById('service-image');
    
    const files = imageInput.files;
    const fileCount = files.length; // Store count before any processing
    
    if (!files || fileCount === 0) {
      showMessage('Please select at least one image', 'error');
      return;
    }

    if (!serviceType) {
      showMessage('Please select a service', 'error');
      return;
    }
    
    // For services, we'll use the first image as primary, but store all images in an array
    let filesProcessed = 0;
    const serviceImages = [];
    const data = getData();
    
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = async function(event) {
        filesProcessed++;
        serviceImages.push(event.target.result);
        
        // If this is the last file
        if (filesProcessed === fileCount) {
          // Ensure service exists in data
          if (!data.services[serviceType]) {
            data.services[serviceType] = { title: serviceType, images: [] };
          }
          
          // Store all images as array, use first as primary
          data.services[serviceType].images = serviceImages;
          data.services[serviceType].image = serviceImages[0];
          saveData(data);
          await saveServiceToAPI(serviceType, data.services[serviceType]);
          document.getElementById('services-form').reset();
          document.getElementById('service-type').disabled = false;
          delete document.getElementById('services-form').dataset.editKey;
          document.querySelector('#services-form button').textContent = 'Update Service';
          renderServices();
          showMessage(`Service updated with ${fileCount} image(s)!`);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  function renderServices() {
    const data = getData();
    const list = document.getElementById('services-list');
    list.innerHTML = Object.entries(data.services).map(([key, svc]) => {
      const imageCount = (svc.images && svc.images.length) || (svc.image ? 1 : 0);
      return `
      <div class="list-item">
        <div class="item-info" style="display:flex;gap:1rem;align-items:center;flex:1;">
          <img src="${svc.image || svc.images?.[0]}" style="width:80px;height:60px;object-fit:cover;" alt="${svc.title}">
          <div>
            <p class="item-title">${svc.title}</p>
            <p class="item-desc">${imageCount} image(s)</p>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-sm" onclick="window.adminEditService('${key}')">Edit</button>
        </div>
      </div>
    `;
    }).join('');
  }

  window.adminEditService = function(serviceKey) {
    document.getElementById('service-type').value = serviceKey;
    document.getElementById('service-type').disabled = true;
    document.getElementById('services-form').dataset.editKey = serviceKey;
    document.querySelector('#services-form button').textContent = 'Update Service';
    document.querySelector('#services-form button').scrollIntoView({ behavior: 'smooth' });
  };

  // Initial render
  renderBanners();
  renderPortfolio();
  renderServices();
})();
