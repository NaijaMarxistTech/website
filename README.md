# The Naija Marxists -- Website

## Directory structure

```
naija-marxists/
|
|-- index.html              # Master file -- the actual website
|
|-- assets/
|   `-- logo.jpg            # The NMM logo (rename 240004.jpg to logo.jpg)
|
|-- css/
|   |-- base.css            # Variables, reset, typography, buttons, animations
|   |-- layout.css          # Header, nav, hero, ticker, footer
|   `-- sections.css        # All content section styles (about, statements, etc.)
|
|-- js/
|   |-- masthead.js         # Writes today's date into the masthead bar
|   `-- scroll.js           # Fade-in animations and active nav highlighting
|
`-- sections/               # Reference copies of each section (for editing)
    |-- header.html
    |-- hero.html
    |-- statements.html
    |-- analysis.html
    |-- events.html
    `-- social.html
```

## How to update content

### Adding a statement
1. Open `sections/statements.html`
2. Copy the STATEMENT CARD TEMPLATE comment block
3. Fill in: date/category, title, summary, and link
4. Paste it into `index.html` inside `#statements .statements-grid`, above the placeholder cards
5. Delete a placeholder card to keep the grid tidy
6. Save and upload `index.html` to GitHub

### Adding an article
1. Open `sections/analysis.html`
2. Copy the ARTICLE ITEM TEMPLATE comment block
3. Fill in: day, month/year, category, title, summary, and link
4. Paste it into `index.html` inside `#analysis .analysis-list`, above the placeholder items
5. Delete a placeholder item
6. Save and upload `index.html` to GitHub

### Adding an event
1. Open `sections/events.html`
2. Copy the EVENT ROW TEMPLATE comment block
3. Fill in: title, date, time, location
4. Paste it into `index.html` inside `#events .events-list`
5. Remove past events by deleting their `.event-row` block
6. Save and upload `index.html` to GitHub

### Updating social media handles
1. Open `index.html`
2. Find the `#social` section
3. Update each `href` link and handle text
4. Upload `index.html` to GitHub

### Changing colours
All colours are in `css/base.css` under `:root`. Change the hex values there.

### Changing the logo
Replace `assets/logo.jpg` with the new image file. Keep the same filename.


## Publishing articles – new dynamic workflow (Jekyll)

> **You no longer need to edit `index.html` to add articles.**  
> Just write Markdown, save it in `_posts/`, and commit.

### 1. Write your article in Markdown

Create a new file with a name like: `YYYY-MM-DD-title-with-dashes.md`  
Example: `2025-06-06-why-marxism-matters.md`

At the top of the file, add this front matter (between `---` lines):

```yaml
---
title: "Your article title"
date: 2025-06-06
categories: Category Name
excerpt: "Short summary shown on the homepage."
---
``` 

Then write the article using Markdown:

# Main heading
## Subheading
Paragraphs are separated by blank lines.
[Link text](https://example.com)

### 2. Save the file in the _posts/ folder
If the folder doesn’t exist, create it in the root of the repository.

### 3. Commit and push to GitHub
- The live site will update automatically within 30 seconds.
- The article will appear under Analysis on the homepage.
- Clicking it opens a clean, styled page with only the article content.

## Adding statements, events, social links
For now, statements, events, and social links are still edited directly in index.html.
Follow the original instructions for those sections.

## Uploading to GitHub
Only `index.html`, the `css/` folder, the `js/` folder, and `assets/` need to be
on GitHub for the site to work. The `sections/` folder is for your own reference.

When you make a change: upload the edited file(s) to the repository and commit.
GitHub Pages will update the live site within about 30 seconds.