# The Naija Marxists — Website

## Directory Structure

```
naija-marxists/
│
├── index.html              # Master file — the actual website
│
├── assets/
│   └── logo.jpg            # NMM logo (rename 240004.jpg → logo.jpg)
│
├── css/
│   ├── base.css            # Variables, reset, typography, buttons, animations
│   ├── layout.css          # Header, nav, hero, ticker, footer
│   └── sections.css        # Content section styles (about, statements, etc.)
│
├── js/
│   ├── masthead.js         # Writes today's date into the masthead bar
│   └── scroll.js           # Fade-in animations and active nav highlighting
│
└── sections/               # Reference copies of each section (for editing)
    ├── header.html
    ├── hero.html
    ├── statements.html
    ├── analysis.html
    ├── events.html
    └── social.html
```

---

## Publishing Articles — Dynamic Workflow (Jekyll)

> **You no longer need to edit `index.html` to add articles.**
> Just write Markdown, save it in `_posts/`, and commit.

### 1. Write your article in Markdown

Create a file named using the format `YYYY-MM-DD-title-with-dashes.md`, for example:

```
_posts/2025-06-06-why-marxism-matters.md
```

Add this front matter at the very top of the file (between the `---` lines):

```yaml
---
title: "Your article title"
date: 2025-06-06
categories: Category Name
excerpt: "Short summary shown on the homepage."
---
```

Then write the article body in Markdown:

```markdown
## Introduction

Paragraphs are separated by blank lines.

[Link text](https://example.com)
```

### 2. Save the file in `_posts/`

If the folder doesn't exist yet, create it at the root of the repository.

### 3. Commit and push to GitHub

The live site updates automatically within ~30 seconds. The article will appear under **Analysis** on the homepage, and clicking it opens a clean, styled article page.

---

## Updating Other Content

Statements, events, and social links are still edited directly in `index.html`. Follow the steps below for each section.

### Adding a Statement

1. Open `sections/statements.html`
2. Copy the `STATEMENT CARD TEMPLATE` comment block
3. Fill in: date, category, title, summary, and link
4. Paste it into `index.html` inside `#statements .statements-grid`, above the placeholder cards
5. Delete one placeholder card to keep the grid tidy
6. Save and upload `index.html` to GitHub

### Adding an Article (manual fallback)

1. Open `sections/analysis.html`
2. Copy the `ARTICLE ITEM TEMPLATE` comment block
3. Fill in: day, month/year, category, title, summary, and link
4. Paste it into `index.html` inside `#analysis .analysis-list`, above the placeholder items
5. Delete one placeholder item
6. Save and upload `index.html` to GitHub

### Adding an Event

1. Open `sections/events.html`
2. Copy the `EVENT ROW TEMPLATE` comment block
3. Fill in: title, date, time, and location
4. Paste it into `index.html` inside `#events .events-list`
5. Remove past events by deleting their `.event-row` block
6. Save and upload `index.html` to GitHub

### Updating Social Media Handles

1. Open `index.html`
2. Find the `#social` section
3. Update each `href` link and the handle text beside it
4. Save and upload `index.html` to GitHub

### Changing Colours

All colour values live in `css/base.css` under `:root`. Edit the hex values there to retheme the entire site.

### Changing the Logo

Replace `assets/logo.jpg` with the new image file. Keep the filename exactly as `logo.jpg`.

---

## Uploading to GitHub

Only the following need to be on GitHub for the site to work:

- `index.html`
- `css/`
- `js/`
- `assets/`
- `_posts/` (for Jekyll articles)

The `sections/` folder is for your own local reference and does not need to be uploaded.

After any change, upload the edited file(s) and commit. GitHub Pages will update the live site within ~30 seconds.
