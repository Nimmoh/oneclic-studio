# One Clic Studio website

Static site (HTML, CSS, JavaScript). No build step.

## Structure
```
oneclic-studio/
├── index.html
├── README.md
└── assets/
    ├── css/styles.css
    ├── img/logo.png
    └── js/
        ├── config.js      <- put your IDs here
        ├── analytics.js   <- UTM capture, consent, GA4/Meta/TikTok/Google Ads, events
        └── main.js        <- page behaviour, form, event wiring
```

## Run locally
Open `index.html`, or run `python3 -m http.server 8000` and visit http://localhost:8000

## Before running ads
1. Edit `assets/js/config.js`: add GA4, Meta Pixel, TikTok Pixel (and optional Google Ads) IDs, your WhatsApp number and email.
2. Set `FORM_ENDPOINT` (for example a Formspree URL) so leads arrive by email. If empty, the form opens WhatsApp with the brief.
3. Use tracked links in your ads:
   `https://yourdomain.com/?utm_source=tiktok&utm_medium=paid&utm_campaign=web_design_oct&service=web-design`
   `service` accepts `photography`, `web-design`, `graphic-design`. It highlights that service and preselects the form.
4. Add `&debug=1` to any URL to see every event in the browser console.

## Events sent
page_view, ad_landing_service, cta_click, outbound_click (TikTok), view_service, scroll_depth, form_start, generate_lead
(`generate_lead` maps to Meta `Lead`, TikTok `SubmitForm`, and a Google Ads conversion if a label is set.)

## Privacy
Ad and analytics tags load only after the visitor accepts cookies. Add a privacy policy page before launch.

## Deploy
Upload the folder to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host.
