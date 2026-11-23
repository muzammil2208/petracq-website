# Petracq website

A static marketing site (HTML, CSS and JavaScript) with no build step.

```
index.html            page content
assets/css/style.css  styles (brand colours are at the top)
assets/js/main.js     menu, animations, inquiry form
assets/img/           logo + favicon
```

## Inquiry form → email

The form posts to [FormSubmit](https://formsubmit.co), which forwards each inquiry to
**muzammilsk90@gmail.com**. The address is set in `FORM_ENDPOINT` at the top of
`assets/js/main.js`, and in the `action` of the form in `index.html` (a fallback for
browsers with JavaScript turned off).

**One-time activation (required):**
1. Open the site from a web server (see below) and submit the form once.
2. FormSubmit emails muzammilsk90@gmail.com with an **Activate Form** button. Click it.
   Check Spam/Promotions if you don't see it.
3. From then on, every inquiry arrives as an email. Hitting "Reply" replies to the customer.

**Hide your email from the page source (recommended):** after activation, FormSubmit
sends you a random alias (like `a1b2c3d4e5...`). Replace the email address with that alias
in both places above.

**To change the recipient later**, replace the email in both places and repeat the activation.

> The form will not send if you double-click `index.html` and open it as a file
> (`file://`). It must be opened from a web server.

## Preview locally

```
python -m http.server 8000
```
Then open http://localhost:8000

## Deploy on Vercel

The site is ready for Vercel as-is. There's no build step, and `vercel.json` adds clean URLs,
security headers and asset caching.

1. Go to https://vercel.com/new and sign in with GitHub.
2. **Import** this repository.
3. Leave the settings as detected: Framework Preset **Other**, no build command, output
   directory = root. Click **Deploy**.
4. Every push to `main` redeploys automatically.

**Custom domain:** in Vercel, open the project, then **Settings → Domains**, add `petracq.com`, and
set the DNS records Vercel shows at your domain registrar.

After the first deploy, submit the form once on the live site and click the FormSubmit
activation email (see above).

The site also works on any other static host (Netlify, Cloudflare Pages, cPanel, etc.).

## SEO

The page targets **"quarry mining management system"** and close variants (quarry management
software, mining management system, stone crusher software). What's in place:

- Keyword-led `<title>`, meta description, `<h1>` and section headings
- Canonical URL, Open Graph and Twitter tags with a PNG share image (`assets/img/og-image.png`)
- JSON-LD structured data: Organization, WebSite, SoftwareApplication and FAQPage
- A visible FAQ section. If you edit an answer, update the matching text in the JSON-LD in `<head>` too
- `robots.txt` and `sitemap.xml`

All URLs assume the site lives at **https://www.petracq.com/**. If you use a different domain,
search and replace it in `index.html`, `robots.txt` and `sitemap.xml`.

**After the site is live on the domain (these matter as much as the code):**
1. Add the site to [Google Search Console](https://search.google.com/search-console), verify the
   domain, then submit `https://www.petracq.com/sitemap.xml` and request indexing for the home page.
2. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (you can import from Google).
3. Create a [Google Business Profile](https://business.google.com) for Petracq (Mira Road, Mumbai)
   with the website link.
4. Get links from other sites: industry directories, crusher and mining associations, partner
   weighbridge vendors, LinkedIn company page, and any customer who will mention you.
5. Add more pages over time (for example, separate pages for weighbridge software, royalty
   management and stone crusher billing, or customer case studies). Add each one to `sitemap.xml`.

## Before going live
- Confirm the iOS, offline sync and CCTV claims with your development partner.
- The hero card ("MH 04 XX 0000", weights) is an illustration with sample data.
