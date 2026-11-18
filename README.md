# yux-ren.github.io

Personal site of Yuxuan Ren, built with Jekyll on GitHub Pages. It ships its own layouts and plain CSS, with no theme and no build step beyond Jekyll.

## Editing content

- **Papers**: `_data/publications.yml` (newest first; `selected: true` shows a paper on the home page; optional `image:`).
- **News**: `_data/news.yml`.
- **Positions and education**: `_data/timeline.yml`.
- **Home page text**: `index.html`.
- **CV**: put the PDF in `assets/cv/` and update `cv_pdf` in `_config.yml` and the redirect in `pages/cv.md`.
- **Blog**: add `_posts/YYYY-MM-DD-title.md` with `layout: post`.

## Design

- Styles: `assets/css/site.css`. Fonts (STIX Two Text, Schibsted Grotesk; SIL Open Font License) are self-hosted in `assets/fonts/`.
- Hero animation: `assets/js/flow.js`.

## Local preview

```bash
bundle install
bundle exec jekyll serve --livereload
```
