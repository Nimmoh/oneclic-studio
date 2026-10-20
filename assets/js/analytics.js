/* Traffic + ad tracking layer.
   - Captures UTM and ad click IDs (first touch + last touch)
   - Loads GA4 / Meta / TikTok / Google Ads only after consent
   - Exposes OC.track(name, params) used by the rest of the site */
(function () {
  var C = window.SITE_CONFIG || {};
  var DEBUG = /[?&]debug=1/.test(location.search);
  var KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid","ttclid"];
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // 1. Attribution capture
  var q = new URLSearchParams(location.search), touch = {};
  KEYS.forEach(function (k) { if (q.get(k)) touch[k] = q.get(k); });
  var hasCampaign = KEYS.some(function (k) { return touch[k]; });
  touch.referrer = document.referrer || "direct";
  touch.landing_page = location.pathname + location.search;
  touch.ts = Date.now();
  if (!store.get("oc_first")) store.set("oc_first", touch);
  if (hasCampaign) store.set("oc_last", touch);
  var attribution = function () { return store.get("oc_last") || store.get("oc_first") || touch; };

  var sid = null;
  try { sid = sessionStorage.getItem("oc_sid"); } catch (e) {}
  if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); try { sessionStorage.setItem("oc_sid", sid); } catch (e) {} }

  // 2. Consent
  function consent() { return !C.REQUIRE_CONSENT || localStorage.getItem("oc_consent") === "yes"; }

  // 3. Load vendor tags (once, after consent)
  var loaded = false;
  function loadScript(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }
  function loadVendors() {
    if (loaded) return; loaded = true;
    if (C.GA4_ID || C.GOOGLE_ADS_ID) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + (C.GA4_ID || C.GOOGLE_ADS_ID));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date());
      if (C.GA4_ID) gtag("config", C.GA4_ID);
      if (C.GOOGLE_ADS_ID) gtag("config", C.GOOGLE_ADS_ID);
    }
    if (C.META_PIXEL_ID) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", C.META_PIXEL_ID); fbq("track", "PageView");
    }
    if (C.TIKTOK_PIXEL_ID) {
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n=d.createElement("script");n.src="https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+e+"&lib="+t;n.async=!0;d.head.appendChild(n)};ttq.load(C.TIKTOK_PIXEL_ID);ttq.page()}(window,document,"ttq");
    }
  }

  // 4. Public event API
  var MAP = { generate_lead: { meta: "Lead", tiktok: "SubmitForm" }, cta_click: { meta: "ViewContent", tiktok: "ClickButton" } };
  function track(name, params) {
    params = params || {};
    var payload = Object.assign({ session_id: sid, page: location.pathname }, attribution(), params);
    if (DEBUG) console.log("[track]", name, payload);
    if (C.FIRST_PARTY_ENDPOINT && navigator.sendBeacon) {
      navigator.sendBeacon(C.FIRST_PARTY_ENDPOINT, JSON.stringify({ event: name, data: payload }));
    }
    if (!consent()) return;
    loadVendors();
    if (window.gtag) {
      gtag("event", name, params);
      if (name === "generate_lead" && C.GOOGLE_ADS_ID && C.GOOGLE_ADS_LEAD_LABEL) gtag("event", "conversion", { send_to: C.GOOGLE_ADS_ID + "/" + C.GOOGLE_ADS_LEAD_LABEL });
    }
    var m = MAP[name];
    if (window.fbq) { m ? fbq("track", m.meta, params) : fbq("trackCustom", name, params); }
    if (window.ttq) { m ? ttq.track(m.tiktok, params) : ttq.track(name, params); }
  }

  window.OC = {
    track: track, attribution: attribution, consent: consent,
    setConsent: function (yes) { localStorage.setItem("oc_consent", yes ? "yes" : "no"); if (yes) { loadVendors(); track("page_view"); } }
  };
  if (consent()) loadVendors();
})();
