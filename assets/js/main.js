(function () {
  var C = window.SITE_CONFIG, OC = window.OC, $ = function (s) { return document.querySelector(s); };

  const LOCAL_IMAGE_LIBRARY = {
    services: {
      photography: '/images/photo1.jpg',
      'web-design': '/images/design.jpeg',
      'graphic-design': '/images/Graphic%20Design%20_%20Preferred%20Printing.jpg',
      branding: '/images/Mindset%20_%20Business.jpg',
      'digital-marketing': '/images/ad-img.jpg',
      'social-media': '/images/Ad%20Inspiration.jpg'
    },
    banners: [
      '/images/oneclic.jpeg',
      '/images/Graphics_flyer.jpg',
      '/images/Interface%20Design.jpg',
      '/images/pro-itee.jpg'
    ],
    portfolio: [
      '/images/pro-itee.jpg',
      '/images/photo1.jpg',
      '/images/Graphic%20Design%20_%20Preferred%20Printing.jpg',
      '/images/Interface%20Design.jpg',
      '/images/design.jpeg',
      '/images/Graphics_flyer.jpg'
    ]
  };

  function normalizeImageSource(src, fallback) {
    if (!src || src === '') return fallback || '';
    if (src.startsWith('data:image') || src.startsWith('http') || src.startsWith('/') || src.startsWith('./') || src.startsWith('blob:')) return src;
    if (src.indexOf('assets/') !== -1) return src;
    return 'assets/img/' + src.replace(/^\/+/, '');
  }

  function getLocalBannerFallback() {
    return LOCAL_IMAGE_LIBRARY.banners.map(function (src, index) {
      return { id: 'local-banner-' + index, title: 'One Clic Studio', desc: '', image: src, order: index };
    });
  }

  function getLocalPortfolioFallback() {
    return LOCAL_IMAGE_LIBRARY.portfolio.map(function (src, index) {
      return { id: 'local-portfolio-' + index, title: 'One Clic Studio', category: 'Local gallery', desc: 'Local project image', image: src, order: index };
    });
  }

  function getLocalServiceFallback() {
    return Object.keys(LOCAL_IMAGE_LIBRARY.services).reduce(function (acc, key) {
      acc[key] = { title: key, image: LOCAL_IMAGE_LIBRARY.services[key] };
      return acc;
    }, {});
  }

  // Page view, and preselect service from an ad link (?service=web-design)
  OC.track("page_view");
  var wanted = new URLSearchParams(location.search).get("service");
  var select = $("#service-select");
  if (wanted && select && select.querySelector('[value="' + wanted + '"]')) {
    select.value = wanted;
    var card = document.getElementById(wanted); if (card) card.classList.add("focus");
    OC.track("ad_landing_service", { service: wanted });
  }

  // Click tracking on anything with data-track
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]"); if (!el) return;
    var label = el.getAttribute("data-track");
    OC.track(label.indexOf("outbound") === 0 ? "outbound_click" : "cta_click", { label: label });
    var pick = el.getAttribute("data-service-pick"); if (pick && select) select.value = pick;
  });

  // Service section views
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (i) { var s = i.target.dataset.service; if (i.isIntersecting && !seen[s]) { seen[s] = 1; OC.track("view_service", { service: s }); } });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-service]").forEach(function (n) { io.observe(n); });
  }

  // Scroll depth
  var marks = { 25: 0, 50: 0, 75: 0, 100: 0 };
  addEventListener("scroll", function () {
    var p = (scrollY + innerHeight) / document.documentElement.scrollHeight * 100;
    Object.keys(marks).forEach(function (m) { if (!marks[m] && p >= m - 1) { marks[m] = 1; OC.track("scroll_depth", { percent: +m }); } });
  }, { passive: true });

  // WhatsApp link
  var wa = $("#wa-link");
  if (wa) wa.href = "https://wa.me/" + C.WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hi One Clic Studio, I'd like a quote.");

  // Lead form
  var form = $("#lead-form"), msg = $("#form-msg"), started = false;
  form.addEventListener("focusin", function () { if (!started) { started = true; OC.track("form_start"); } });
  form.addEventListener("submit", function (e) {
    e.preventDefault(); msg.className = "form-msg";
    var d = Object.fromEntries(new FormData(form));
    if (!d.name.trim() || !d.contact.trim() || !d.message.trim()) { msg.textContent = "Please fill in your name, contact and project details."; msg.classList.add("err"); return; }
    var a = OC.attribution();
    d.source = a.utm_source || a.referrer || "direct"; d.campaign = a.utm_campaign || ""; d.landing_page = a.landing_page || "";
    OC.track("generate_lead", { service: d.service, value: 1, currency: "USD" });
    var done = function () { msg.textContent = "Thanks, " + d.name.split(" ")[0] + ". We will reply within one working day."; form.reset(); };
    if (C.FORM_ENDPOINT) {
      fetch(C.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; done(); })
        .catch(function () { msg.textContent = "Could not send. Please use WhatsApp or email " + C.CONTACT_EMAIL + "."; msg.classList.add("err"); });
    } else {
      var t = "New brief from " + d.name + "\nService: " + d.service + "\nContact: " + d.contact + "\n\n" + d.message;
      window.open("https://wa.me/" + C.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(t), "_blank"); done();
    }
  });

  // Consent banner
  var banner = $("#consent");
  if (C.REQUIRE_CONSENT && !localStorage.getItem("oc_consent")) banner.hidden = false;
  $("#consent-yes").onclick = function () { OC.setConsent(true); banner.hidden = true; };
  $("#consent-no").onclick = function () { OC.setConsent(false); banner.hidden = true; };
  $("#cookie-settings").onclick = function (e) { e.preventDefault(); banner.hidden = false; };
})();


  // Carousel functionality
  var track = document.querySelector(".carousel-track");
  var prevBtn = document.querySelector(".carousel-prev");
  var nextBtn = document.querySelector(".carousel-next");
  var dotsContainer = document.querySelector(".carousel-dots");
  var items = document.querySelectorAll(".carousel-item");
  
  if (track && items.length > 0) {
    var currentIndex = 0;
    var itemWidth = 100;
    
    // Create dots
    items.forEach(function(item, index) {
      var dot = document.createElement("div");
      dot.className = "dot" + (index === 0 ? " active" : "");
      dot.onclick = function() { goToSlide(index); };
      dotsContainer.appendChild(dot);
    });
    
    var dots = document.querySelectorAll(".dot");
    
    function updateCarousel() {
      track.style.transform = "translateX(-" + (currentIndex * itemWidth) + "%)";
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = (index + items.length) % items.length;
      updateCarousel();
    }
    
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }
    
    if (nextBtn) nextBtn.onclick = nextSlide;
    if (prevBtn) prevBtn.onclick = prevSlide;
    
    // Auto-scroll carousel every 6 seconds
    setInterval(nextSlide, 6000);
  }


  // Banner carousel functionality
  function initBannersCarousel() {
    const STORAGE_KEY = 'oc_studio_data';

    const heroBg = document.getElementById("hero-bg");
    const prevBtn = document.querySelector(".hero-prev");
    const nextBtn = document.querySelector(".hero-next");

    if (!heroBg) return;

    let currentIndex = 0;
    const banners = getLocalBannerFallback();

    function updateHeroBackground() {
      const image = normalizeImageSource(banners[currentIndex].image, LOCAL_IMAGE_LIBRARY.banners[0]);
      const preloader = new Image();
      preloader.onload = function () {
        heroBg.style.backgroundImage = "url('" + image + "')";
      };
      preloader.onerror = function () {
        heroBg.style.backgroundImage = "url('" + LOCAL_IMAGE_LIBRARY.banners[0] + "')";
      };
      preloader.src = image;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % banners.length;
      updateHeroBackground();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + banners.length) % banners.length;
      updateHeroBackground();
    }

    updateHeroBackground();
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    const hero = document.querySelector('.hero');
    if (hero) {
      let touchStartX = 0;
      hero.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].clientX;
      }, { passive: true });
      hero.addEventListener('touchend', function (event) {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 50) distance < 0 ? nextSlide() : prevSlide();
      }, { passive: true });
    }

    setInterval(nextSlide, 6000);
  }

  initBannersCarousel();


  // Load service images from the deployed public/images folder.
  function loadServiceImages() {
    const serviceList = ['photography', 'web-design', 'graphic-design', 'branding', 'digital-marketing', 'social-media'];
    const serviceData = getLocalServiceFallback();

    serviceList.forEach(function(service) {
      const img = document.getElementById('service-img-' + service);
      if (img) {
        img.style.backgroundImage = 'url("' + LOCAL_IMAGE_LIBRARY.services[service] + '")';
      }
    });
  }

  loadServiceImages();

  // Load portfolio images from the deployed public/images folder.
  function loadPortfolioImages() {
    const portfolioItems = getLocalPortfolioFallback();
    const track = document.querySelector('.carousel-track');

    if (track) {
      track.innerHTML = '';
      portfolioItems.forEach(function(item, index) {
        const div = document.createElement('div');
        div.className = 'carousel-item';
        const itemImage = normalizeImageSource(item.image, LOCAL_IMAGE_LIBRARY.portfolio[index] || LOCAL_IMAGE_LIBRARY.portfolio[0]);
        div.innerHTML =
          '<div class="carousel-img" style="background-image:url(\'' + itemImage + '\')"></div>' +
          '<h3>' + (item.title || 'Project') + '</h3>' +
          '<p class="portfolio-category">' + (item.category || 'Gallery') + '</p>' +
          '<p>' + (item.desc || 'Portfolio item') + '</p>';
        track.appendChild(div);
      });

      const dotsContainer = document.querySelector('.carousel-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        portfolioItems.forEach(function(_item, index) {
          const dot = document.createElement('div');
          dot.className = 'dot' + (index === 0 ? ' active' : '');
          dot.onclick = function() { goToSlide(index); };
          dotsContainer.appendChild(dot);
        });
      }
    }
  }

  loadPortfolioImages();
