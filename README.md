# YuX Ren Personal Website

A simple, extensible personal site powered by Jekyll (GitHub Pages compatible). Inspired by the structure of `zytzrh.github.io`.

## Local Development

1. Install Ruby (>= 3.1 recommended) and Bundler.
2. Install deps:

```bash
bundle install
```

3. Run locally:

```bash
bundle exec jekyll serve --livereload
```

Open `http://127.0.0.1:4000`.

## Structure

- `index.md`: Home with news and quick links
- `pages/`:
  - `about.md`, `blog.md`, `projects.md`, `publications.md`, `cv.md`
- `_posts/`: Blog posts (e.g., `YYYY-MM-DD-title.md`)
- `assets/`: Images, styles, documents (e.g., `assets/cv/CV.pdf`)

## Extend

- Add posts in `_posts/`
- Add projects/publications as Markdown lists, or later introduce data files under `_data/`
- Customize styles by adding `assets/main.scss` and importing `minima`

## Deploy

Push to the `main` branch of `YuX-Ren.github.io`. GitHub Pages will build and serve at `https://yux-ren.github.io`. 