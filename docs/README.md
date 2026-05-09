# Aperture &mdash; Live Demo

This folder is a **static site** you can host on GitHub Pages (or any
static host) to preview the Aperture3D WordPress theme without installing
WordPress.

## View it locally

```bash
# From the repo root:
python3 -m http.server 8000 --directory docs
# then open http://localhost:8000
```

(Or any static server &mdash; `npx serve docs`, `php -S localhost:8000 -t docs`, etc.)

## Host it on GitHub Pages (free)

1. Go to the repo on GitHub &rarr; **Settings &rarr; Pages**.
2. Under **Source**, pick **Deploy from a branch**.
3. Choose branch `main` (or the PR branch) and folder `/docs`, then **Save**.
4. After a minute or two, GitHub will give you a live URL like
   `https://<username>.github.io/<repo>/`.

## What's in here

| File                         | Purpose                                     |
| ---------------------------- | ------------------------------------------- |
| `index.html`                 | Home &mdash; cinematic 3D carousel + featured grid |
| `gallery.html`               | Full gallery grid with scroll-reveal        |
| `photo.html?id=...`          | Single photo view (Ken Burns + float)       |
| `about.html`                 | About page                                  |
| `assets/js/gallery.js`       | All cinematic animation code                |
| `assets/js/photos.js`        | The demo photo catalog                      |
| `assets/css/style.css`       | The same theme CSS used by WordPress        |

## Swap in your own photos

Edit `docs/assets/js/photos.js`. Each entry is:

```js
{
  id: 42,                       // any unique number
  title: "Photo title",
  tags:  "Landscape",
  body:  "Caption / description.",
  image: "https://example.com/path/to/image-1024.jpg",
  thumb: "https://example.com/path/to/image-800.jpg",   // optional, for the grid
  full:  "https://example.com/path/to/image-1600.jpg",  // optional, for single view
  url:   "./photo.html?id=42",                          // keep as-is
}
```

The sample data uses [picsum.photos](https://picsum.photos) for public-domain demo images.
