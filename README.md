# The Naija Marxists — Official Website

[![Built with Jekyll](https://img.shields.io/badge/built%20with-Jekyll-red)](https://jekyllrb.com/)
[![Hosted on GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://pages.github.com/)

The official website of **The Naija Marxists**, a revolutionary socialist organisation rooted in the Nigerian working class. Built with **Jekyll** and hosted on **GitHub Pages**.

---

## Directory Structure

```
naija-marxists/
│
├── _config.yml                   # Jekyll configuration
├── index.html                    # Homepage sections (about, statements, analysis, etc.)
│
├── _layouts/
│   ├── default.html              # Main layout (head, masthead, nav, hero, ticker, footer)
│   └── article.html              # Clean layout for article pages
|   └── statement.html            # Clean layout for statement pages
│
├── _includes/                    # Reusable HTML components (footer.html, header.html, and hero.html)
│
├── _posts/                       # Analysis articles (Jekyll collection)
│   └── YYYY-MM-DD-title.md
│
├── _statements/                  # Official statements (Jekyll collection)
│   └── YYYY-MM-DD-title.md
│
├── assets/
|   └── favicons/                 # Contains favicon images (and .ico, and SVGs)
|   └── images/                   # Contains article/statement images  
│   ├── logo.jpg                  # Site logo (full lockup)
│   ├── logo_.jpg                 # Second site logo (just the logo symbols)
│
├── css/
│   ├── base.css                  # Variables, reset, typography, buttons, fade-in
│   ├── layout.css                # Masthead, header, nav, ticker, hero, footer
│   ├── sections.css              # Section styles (about, statements, analysis, etc.)
│   └── pages.css                 # Article and statement page styles
│
├── js/
│   ├── masthead.js               # Writes today's date into the masthead bar (already commented out)
│   ├── scroll.js                 # Fade-in animations, active nav, scroll transparency
│   └── nav.js                    # Hamburger menu toggle (mobile)
│
├── sections/                     # Reference HTML snippets (not served — editing reference only)
│   ├── header.html
│   ├── hero.html
│   ├── statements.html
│   ├── analysis.html
│   ├── events.html
│   └── social.html
│
├── Gemfile                       # Ruby gem dependencies
├── Gemfile.lock                  # Locked gem versions
├── .gitignore                    # Excludes _site/, .jekyll-cache/, node_modules/
└── README.md                     # This file
```

---

## Quick Start (Local Development)

### Prerequisites

- **Ruby** 2.7+ — [Installation guide](https://www.ruby-lang.org/en/documentation/installation/)
- **Bundler** — `gem install bundler`
- **Git** — [Download](https://git-scm.com/)

### Clone and run locally

```bash
git clone git@github.com:YourOrg/naija-marxists.git
cd naija-marxists
bundle install
bundle exec jekyll serve --host 0.0.0.0
```

Open `http://localhost:4000` in your browser. The site rebuilds automatically when files are saved.

The `--host 0.0.0.0` flag makes the site accessible from other devices on the same Wi-Fi — useful for mobile testing. Access it at `http://YOUR_LOCAL_IP:4000`.

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
   categories: Analysis
   excerpt: "Short summary shown on the homepage (25–30 words)."
   ---
   ```

3. Write the article body in Markdown below the front matter:
   ```markdown
   ## Section Heading

   Paragraph text here. Blank lines separate paragraphs.

   [Link text](https://example.com)
   ```

4. Commit and push. The live site updates within 30 seconds.

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
   ---
   ```
   The `doc-type` field accepts any label: `"Founding Statement"`, `"Condemnation"`, `"Solidarity Statement"`, etc.

3. Write the statement body in Markdown.

4. Commit and push.

---

### Adding an Event

1. Open `index.html` and find the `#events` section.
2. Copy an existing `.event-row` block and fill in the details:
   ```html
   <div class="event-row">
     <div></div>
     <div>
       <h3>Event Title</h3>
       <p class="event-meta">
         <span>15 July 2026</span> &mdash; 6:00 PM &mdash; Lagos / Online
       </p>
     </div>
   </div>
   ```
3. Remove past events by deleting their `.event-row` block.
4. Commit and push.

---

### Updating Social Media Links

Open `index.html`, find the `#social` section, and update the `href` and handle text in each `.social-card`. No other files need to change.

---

### Changing Colours

All colours are defined as CSS variables in `css/base.css` under `:root`:

```css
:root {
  --red:    #C62828;   /* Primary red — buttons, accents, borders */
  --red-dk: #8B1A1A;   /* Darker red — hover states */
  --green:  #2E7D32;   /* Green — ticker, event accents */
  --gold:   #F5B041;   /* Gold — nav hover, footer headings */
  --navy:   #1E1E2A;   /* Navy — nav, footer, date blocks */
  --navy-light: #2E3E52;   /* Light-Navy — scrolling nav */
  --ink:    #1a1a1a;   /* Body text */
  --paper:  #F8F8FF;   /* Page background */
  --off:    #F5E0E0;   /* Card/section backgrounds */
  --rule:   #E53935;   /* Borders and dividers */
  ...
}
```

Change the hex values and the whole site recolours automatically.

---

### Changing the Logo

Replace `assets/logo.jpg` with the new image. Keep the exact filename `logo.jpg` so no HTML changes are needed.

For favicons, replace `assets/favicon/favicon.ico`, `assets/favicon/favicon.svg`, `assets/favicon/favicon-32.png`, and `assets/favicon/apple-touch-icon.png`.

---

## How Jekyll Works (Non-Technical Summary)

You do not need to understand Jekyll to publish articles and statements. Just follow the steps above.

For context:

- `_layouts/default.html` is the outer shell every page uses — it contains the `<head>`, masthead, nav, hero, ticker, and footer.
- `_layouts/article.html` is a minimal layout for article pages — no hero or ticker, just the content.
- `_layouts/article.html` is a minimal layout for statement pages — no hero or ticker, just the content.
- `_posts/` and `_statements/` are **collections** — Jekyll reads every Markdown file in these folders and makes them available as pages and as data on the homepage.
- **Liquid** is the templating syntax (`{% for post in site.posts %}`) that builds the homepage dynamically from those collections.
- `_config.yml` registers collections and sets site-wide settings.

---

## Mobile Optimisation

The site is fully responsive. Key features on mobile (max 768px):

- **Hamburger menu** — navigation collapses behind a ☰ button, controlled by `js/scroll.js`.
- **Fixed nav** — the navigation bar stays at the top of the screen as you scroll.
- **Scroll transparency** — the nav becomes semi-transparent with a blur effect after scrolling 50px, controlled by `js/scroll.js`.
- **Single-column layouts** — all grids (statements, study groups, social, contact form) collapse to one column.
- **Ticker** — the scrolling text band stays in a single line and animates correctly on narrow screens.

---

## JavaScript Reference

| File | Purpose |
|------|---------|
| `js/masthead.js` | Writes the current day and date (e.g. `SUNDAY, 7 JUNE 2026`) into the masthead bar on page load. |
| `js/scroll.js` | Triggers `.visible` on `.fade-in` elements as they scroll into the viewport. Marks the active nav link on scroll. Toggles the hamburger menu open/closed on mobile. Closes the menu automatically when any nav link is tapped. |

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
- All links work and images load.
- Mobile layout (Chrome DevTools — `F12` → device toolbar).

---

## Deployment

The site is hosted on **GitHub Pages** and deploys automatically when changes are pushed to the `master` branch.

- Build time: ~30–60 seconds after push.
- To force a rebuild without changing any file:
  ```bash
  git commit --allow-empty -m "Trigger rebuild"
  git push origin master
  ```

---

## Git Workflow

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

### Standard edit → commit → push

```bash
git add .
git commit -m "Brief description of what changed"
git push origin master
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Article not showing on homepage | Wrong filename or missing front matter | Ensure file is in `_posts/` named `YYYY-MM-DD-title.md` with valid YAML front matter |
| Statement not showing | Collection not registered | Check `_config.yml` has `_statements` listed under `collections` |
| CSS broken on article page | Relative asset paths | Use absolute paths: `/css/base.css` not `css/base.css` |
| Nav not sticking | `position: fixed` overridden | Check `layout.css` — nav must have `position: fixed; top: 0; left: 0; right: 0` |
| Hamburger not working | `scroll.js` not loaded | Check `_layouts/default.html` has `<script src="/js/scroll.js"></script>` before `</body>` |
| Favicon not showing | Wrong path or browser cache | Hard refresh (`Ctrl+Shift+R`); check `<link>` tags in `_layouts/default.html` |
| Jekyll build fails | Missing gem | Run `bundle install` then retry |
| Horizontal scroll on mobile | Overflowing element | In Chrome DevTools console run: `document.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > window.innerWidth) console.log(el, r.right); });` |
| Jekyll ERROR `.well-known/appspecific` | Chrome DevTools probe | Harmless — ignore it entirely |

---

## Dependencies

- **Jekyll** — Static site generator (MIT License)
- **GitHub Pages gem** — Ensures local and remote build parity
- **Google Fonts** — Playfair Display, Source Serif 4, DM Mono (loaded via CDN in `_layouts/default.html`)

---

## Content License

The written content of this site — articles, statements, and all political material — is the property of **The Naija Marxists**. The site structure and code may be reused freely by other socialist organisations.

---

**Workers of all countries, unite!**
✊🏿 *The Naija Marxists*