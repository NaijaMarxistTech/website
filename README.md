# The Naija Marxists — Official Website

[![Built with Jekyll](https://img.shields.io/badge/built%20with-Jekyll-red)](https://jekyllrb.com/)
[![Hosted on GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://pages.github.com/)
[![Deployed with Netlify](https://img.shields.io/badge/deployed%20with-Netlify-00C7B7)](https://netlify.com/)

The official website of **The Naija Marxists**, a revolutionary socialist organisation rooted in the Nigerian working class. Built with **Jekyll**, hosted on **GitHub Pages**, with a **Supabase** backend for forms, AI classification, mailing list management, and admin dashboards.

---

## Directory Structure

```
naija-marxists/
│
├── _config.yml # Jekyll configuration
├── index.html # Homepage
├── archive.html # All articles archive
├── statements.html # All statements archive
├── signup.html # Membership application page
├── subscribe.html # Mailing list subscription page
├── unsubscribe.html # Unsubscribe from mailing list
├── privacy.html # Privacy policy
│
├── _layouts/ # Jekyll layouts
│ ├── default.html # Main layout (head, nav, hero, footer)
│ ├── article.html # Article layout
│ ├── statement.html # Statement layout
│ └── event.html # Event layout
│
├── _includes/ # Reusable HTML components
│ ├── header.html # Header (logo + tagline)
│ ├── nav.html # Navigation bar (desktop + mobile)
│ ├── hero.html # Hero band with CTA buttons
│ ├── footer.html # Footer content
│ ├── signup-form.html # Membership application form
│ ├── success-message.html # Reusable success message
│ ├── social-icons.html # SVG social icons
│ └── social-icons-footer.html # SVG social icons for footer
│
├── _posts/ # Analysis articles
│ └── YYYY-MM-DD-title.md
│
├── _statements/ # Official statements
│ └── YYYY-MM-DD-title.md
│
├── events/ # Events
│ └── YYYY-MM-DD-event-title.md
│
├── assets/
│ ├── favicons/ # Favicon images
│ ├── images/ # Article/statement/event images
│ │ ├── events/ # Event images
│ │ ├── posts/ # Article images
│ │ └── statements/ # Statement images
│ ├── logo.jpg # Site logo (full lockup)
│ └── logo.jpg # Site logo (symbol only)
│
├── css/
│ ├── base.css # Variables, reset, typography, buttons
│ ├── layout.css # Masthead, header, nav, footer
│ ├── sections.css # Section styles (about, statements, analysis, etc.)
│ ├── pages.css # Article, statement, event page styles
│ ├── signup.css # Signup form styles
│ ├── subscribe.css # Subscribe/unsubscribe form styles
│ ├── admin.css # Admin page styles (mailing list)
│ ├── dashboard.css # Recruitment dashboard styles
│ └── print.css # Print stylesheet
│
├── js/
│ ├── scroll.js # Fade-in animations, active nav, hamburger toggle
│ ├── signup.js # Membership form submission & validation
│ ├── contact.js # Contact form submission
│ ├── subscribe.js # Mailing list subscription form
│ ├── unsubscribe.js # Unsubscribe functionality
│ ├── admin.js # Mailing list admin page
│ ├── dashboard.js # Recruitment dashboard
│ └── masthead.js # Masthead date (commented out)
│
├── recruitment-view/ # Mailing list admin page
│ └── index.html
│
├── recruitment-dashboard/ # Recruitment dashboard
│ └── index.html
│
├── sections/ # Reference HTML snippets (not served)
│ ├── analysis.html
│ ├── events.html
│ ├── header.html
│ ├── hero.html
│ ├── social.html
│ └── statements.html
│
├── supabase/ # Supabase Edge Functions
│ └── functions/
│ ├── classify-applicant/ # AI classification of applicants
│ │ ├── deno.json
│ │ └── index.ts
│ ├── verify-admin-password/ # Admin password verification
│ │ └── index.ts
│ └── github-analytics/ # GitHub traffic data
│ └── index.ts
│
├── .github/workflows/
│ └── build.yml # GitHub Actions workflow
│
├── Gemfile # Ruby gem dependencies
├── Gemfile.lock # Locked gem versions
├── .gitignore # Excludes _site/, .jekyll-cache/, node_modules/
└── README.md # This file
```

---

## Quick Start (Local Development)

### Prerequisites

- **Ruby** 2.7+ — [Installation guide](https://www.ruby-lang.org/en/documentation/installation/)
- **Bundler** — `gem install bundler`
- **Git** — [Download](https://git-scm.com/)

### Clone and run locally

```bash
git clone git@github.com:NaijaMarxistTech/website.git
cd website
bundle install
bundle exec jekyll serve --host 0.0.0.0
```

Open `http://localhost:4000` in your browser. The site rebuilds automatically when files are saved.

---

## Publishing Content

### Adding an Article (Analysis section)

1. Create a new file in `_posts/` named:
   ```
   YYYY-MM-DD-title-with-dashes.md
   ```
   Example: `2026-05-29-the-death-and-autopsy-of-may-29.md`

2. Add front matter at the top:
   ```yaml
   ---
   title: "Your Article Title"
   date: 2026-05-29
   category: Analysis
   excerpt: "Short summary shown on the homepage (25–30 words)."
   ---
   ```

3. Write the article body in Markdown below the front matter:
   ```markdown
   ## Section Heading

   Paragraph text here. Blank lines separate paragraphs.

   [Link text](https://example.com)
   ```

4. Commit and push. then create a PR.

---

### Adding a Statement (Official Statements section)

1. Create a new file in `_statements/` named:
   ```
   YYYY-MM-DD-statement-title.md
   ```

2. Add front matter:
   ```yaml
   ---
   title: "Statement Title"
   date: 2026-05-26
   doc-type: "Official Statement"
   excerpt: "Short summary shown on the homepage."
   layout: statement
   ---
   ```
   The `doc-type` field accepts any label: `"Founding Statement"`, `"Condemnation"`, `"Solidarity Statement"`, etc.

3. Write the statement body in Markdown.

4. Commit and push, then create a PR.

---

### Adding an Event

Events are now their own Jekyll collection rather than hand-edited HTML.

1. Create a new file in `_events/` named:
   ```
   YYYY-MM-DD-event-title.md
   ```

2. Add front matter:
   ```yaml
   ---
   layout: event
   title: "Event Title"
   date: 2026-06-30
   time: "6:00 PM WAT"
   location: "X Space: @NGNMarxists"
   excerpt: "Short summary shown on the homepage."
   ---
   ```

3. Write the event description in Markdown.

4. Commit and push, then create a PR.

---

### Updating Social Media Links

Open `index.html`, find the `#social` section, and update the `href` and handle text in each `.social-card`. No other files need to change.

---

### Changing Colours

All colours are defined as CSS variables in `css/base.css` under `:root`:

```css
:root {
  --red:        #C62828;   /* Primary red — buttons, accents, borders */
  --red-dk:     #8B1A1A;   /* Darker red — hover states */
  --green:      #2E7D32;   /* Green — ticker, event accents */
  --gold:       #F5B041;   /* Gold — nav hover, footer headings */
  --navy:       #1E1E2A;   /* Navy — nav, footer, date blocks */
  --navy-light: #2E3E52;   /* Light navy — scrolled nav state */
  --ink:        #1a1a1a;   /* Body text */
  --paper:      #F8F8FF;   /* Page background */
  --off:        #F5E0E0;   /* Card/section backgrounds */
  --rule:       #E53935;   /* Borders and dividers */
}
```

Change the hex values and the whole site recolours automatically.

---

### Changing the Logo

Replace `assets/logo.jpg` with the new image. Keep the exact filename `logo.jpg` so no HTML changes are needed. `assets/logo_.jpg` is the symbol-only variant used where space is tight.

For favicons, replace the files inside `assets/favicons/` — `favicon.ico`, `favicon.svg`, `favicon-32.png`, and `apple-touch-icon.png`.

---

## Backend & Supabase

### Membership Application

- **Page:** `/signup/`
- **Table:** `members`
- **Script:** `js/signup.js`
- **AI Classification:** Automatically classifies applicants as `beginner`, `intermediate`, or `advanced` using the `classify-applicant` Edge Function.

Located at `/signup/`, built from `_includes/signup-form.html` and `js/signup.js`. Collects:

- Personal information (name, gender, email, profession, location)
- Skills and contributions
- Social media handles (optional)
- 10 political questions

**Supabase table:** `members`
**Columns:** `id, first_name, last_name, gender, email, telegram_username, resident_in_nigeria, location, profession, primary_skill, social_handles, q1–q10, score, level, created_at`

**Applicant classification:** Each application is automatically scored (0–20+) and classified as `beginner`, `intermediate`, or `advanced` based on keyword analysis of the written answers. The recruitment team reviews and can override the classification.


### Contact Form

- **Page:** Homepage `#contact` section
- **Table:** `contact_messages`
- **Script:** `js/contact.js`

Located in the `#contact` section on the homepage, handled by `js/contact.js`.

**Supabase table:** `contact_messages`
**Columns:** `id, full_name, email, subject, message, created_at`


**When testing, add a 'test_' prefix to the table names in the code:**

*Therefore:*
```js
const { error } = await supabase
        .from('table_name')
        .insert([formData]);
```
*Becomes:*
```js
const { error } = await supabase
        .from('test_table_name')
        .insert([formData]);
```


### Mailing List

- **Subscription Page:** `/subscribe/`
- **UnSubscribe Page:** `/unsubscribe/`
- **Table:** `mailing_list`
- **Script:** `js/subscribe.js`, `js/unsubscribe.js`
- **Admin Page:** `/recruitment-view/` (password protected)


### Admin Dashboards

| Admin Page | URL | Purpose | Script |
|---|---|---|---|
| Mailing List Admin | `/recruitment-view/` | View, search, and export mailing list subscribers | `js/admin.js` |
| Recruitment Dashboard | `/recruitment-dashboard/` | View members, classifications, and GitHub analytics | `js/dashboard.js` |

**Both admin pages are password protected** using the `verify-admin-password` Edge Function. The password is stored as a Supabase secret (`ADMIN_PASSWORD`).


### Environment Variables

| Variable	| Purpose |
|---|---|
| SUPABASE_URL	| Supabase project URL |
| SUPABASE_ANON_KEY |	Supabase anonymous API key |
| ADMIN_PASSWORD |	Password for admin pages |
| GITHUB_TOKEN |	GitHub Personal Access Token for analytics |

**Where they're set:**

- **Netlify** — Environment variables in site settings (previews and production)
- **GitHub Actions** — Injected via repository secrets
- **Supabase** — Edge Function secrets


### Supabase Edge Functions

| Function |	Purpose |	URL |
|---|---|---|
| `classify-applicant` |	AI classification of membership applicants |	`/functions/v1/classify-applicant` |
| `verify-admin-password` |	Password verification for admin pages |	`/functions/v1/verify-admin-password` |
| `github-analytics`	| Fetch GitHub traffic data |	`/functions/v1/github-analytics` |


### Deploying Edge Functions
Via Supabase Dashboard:

1. Go to **Edge Functions**

2. Click **Create Function**

3. Paste the code from `supabase/functions/[name]/index.ts`

4. Set **"No verification required"** (public)

5. Click **Deploy**


### Email Notifications

When a new signup or contact form is submitted, an email notification is sent to the recruitment team.


---

## How Jekyll Works (Non-Technical Summary)

You do not need to understand Jekyll to publish articles, statements, or events. Just follow the steps above.

For context:

- `_layouts/default.html` is the outer shell every page uses — it contains the `<head>`, masthead, nav, hero, ticker, and footer.
- `_layouts/article.html` and `_layouts/statement.html` are minimal layouts for article and statement pages — no hero or ticker, just the content.
- `_layouts/event.html` is the minimal layout for individual event pages.
- `_posts/`, `_statements/`, and `_events/` are **collections** — Jekyll reads every Markdown file in these folders and makes them available as pages and as data on the homepage.
- **Liquid** is the templating syntax (`{% for post in site.posts %}`) that builds the homepage dynamically from those collections.
- `_config.yml` registers collections and sets site-wide settings.

---

## Mobile Optimisation

The site is fully responsive. Key features on mobile (max 768px):

- **Hamburger menu** — navigation collapses behind a ☰ button, controlled by `js/scroll.js`.
- **Fixed nav** — the navigation bar stays at the top of the screen as you scroll.
- **Scroll transparency** — the nav becomes semi-transparent with a blur effect after scrolling, controlled by `js/scroll.js`.
- **Single-column layouts** — all grids (statements, study groups, social, contact form, signup form) collapse to one column.
- **Ticker** — the scrolling text band stays in a single line and animates correctly on narrow screens.
- **44px minimum tap targets** on all form inputs, checkboxes, and buttons in the signup form.

---

## JavaScript Reference

| File | Purpose |
|------|---------|
| `js/masthead.js` | Writes the current day and date (e.g. `SUNDAY, 7 JUNE 2026`) into the masthead bar. Currently commented out. |
| `js/scroll.js` | Triggers `.visible` on `.fade-in` elements as they scroll into the viewport. Marks the active nav link on scroll. Toggles the hamburger menu open/closed on mobile and closes it when a nav link is tapped. |
| `js/signup.js` | Membership form submission, validation, applicant classification, Supabase integration. |
| `js/contact.js` | Contact form submission, validation, Supabase integration. |
| `js/subscribe.js`	| Mailing list subscription form. |
| `js/unsubscribe.js` |	Unsubscribe functionality. |
| `js/admin.js` |	Mailing list admin page (view, search, CSV export). |
| `js/dashboard.js` |	Recruitment dashboard (members, classifications, GitHub analytics). |

---

## Testing Before Publishing

Always test locally before pushing:

```bash
bundle exec jekyll clean
bundle exec jekyll serve
```

Check:
- New articles appear under **Analysis** on the homepage.
- New statements appear under **Official Statements**.
- New events appear under **Events**.
- All links work and images load.
- Signup and contact forms submit correctly (check the netlify link on github when merging to master, confirm the supabase dashboard for the new row).
- Mobile layout (Chrome DevTools — `F12` → device toolbar, or a real device).

---

## Git Workflow

**IMPORTANT: NEVER COMMIT DIRECTLY TO `master`**

### Pull the latest version from GitHub

```bash
git pull origin master
```

### Discard all local changes and reset to the live version

```bash
git fetch origin
git reset --hard origin/master
```

Use this if local edits have broken the site and you want to start fresh from the last known-good version on GitHub.

### Standard edit -> commit -> push

```bash
git add .
git commit -m "Brief description of what changed"
git push origin master
```

---

## Deployment

### GitHub Pages (Production)

The site is hosted on **GitHub Pages** and deploys automatically when changes are pushed to the `master` branch.

- Build time: ~30–60 seconds after push.
- To force a rebuild without changing any file:
  ```bash
  git commit --allow-empty -m "Trigger rebuild"
  git push origin master
  ```

### Netlify (Previews)

Netlify automatically builds a preview for every pull request, each with its own unique URL — useful for testing changes before merging to `master`.

### GitHub Actions Workflow

`.github/workflows/build.yml` runs on every push to `master`:

1. Checks out the code
2. Sets up Ruby and dependencies
3. Injects Supabase keys from repository secrets
4. Builds the Jekyll site
5. Deploys to GitHub Pages

---

## Security & Privacy

### Account Separation

Contributors are encouraged to use a separate GitHub account to keep personal and political identities separate, if needed.

### Supabase Row Level Security (RLS)

RLS is enabled on all tables. Anonymous users can only `INSERT` — they cannot `SELECT`, `UPDATE`, or `DELETE` rows.

### Environment Variables

Sensitive keys are stored as GitHub Secrets and Netlify environment variables — never committed to the codebase.

### Admin Pages
Both admin pages are protected by:

- Semi-random URL (/recruitment-view/, /recruitment-dashboard/)
- Password protection (verified via Supabase Edge Function)

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Article not showing on homepage | Wrong filename or missing front matter | Ensure file is in `_posts/` named `YYYY-MM-DD-title.md` with valid YAML front matter |
| Statement not showing | Collection not registered | Check `_config.yml` has `_statements` listed under `collections` |
| Event not showing | Collection not registered | Check `_config.yml` has `_events` listed under `collections` |
| Signup form fails to submit | Supabase keys missing or invalid | Check environment variables in Netlify/GitHub Actions secrets |
| CSS broken on article page | Relative asset paths | Use absolute paths: `/css/base.css` not `css/base.css` |
| Nav not sticking | `position: fixed` overridden | Check `layout.css` — nav must have `position: fixed; top: 0; left: 0; right: 0` |
| Hamburger not working | `scroll.js` not loaded | Check `_layouts/default.html` has `<script src="/js/scroll.js"></script>` before `</body>` |
| Favicon not showing | Wrong path or browser cache | Hard refresh (`Ctrl+Shift+R`); check `<link>` tags in `_layouts/default.html` |
| Jekyll build fails | Missing gem | Run `bundle install` then retry |
| Applicant classification not working | `signup.js` missing or not loaded | Ensure `js/signup.js` is loaded on `/signup/` |
| Horizontal scroll on mobile | Overflowing element | In Chrome DevTools console run: `document.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > window.innerWidth) console.log(el, r.right); });` |
| Jekyll ERROR `.well-known/appspecific` | Chrome DevTools probe | Harmless — ignore it entirely |

---

## Dependencies

- **Jekyll** — Static site generator (MIT License)
- **GitHub Pages gem** — Ensures local and remote build parity
- **Supabase JS** — Backend database client for signup and contact forms
- **Google Fonts** — Playfair Display, Inter, DM Mono (loaded via CDN in `_layouts/default.html`)

---

## Content License

The written content — articles, statements, events, and all political material — is the property of **The Naija Marxists**. The site structure and code may be reused freely by other socialist organisations.

---

**Workers of all countries, unite!**
✊🏿 *The Naija Marxists*