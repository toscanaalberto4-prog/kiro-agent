# Aperture3D — WordPress photography theme with real 3D animations

An immersive, dark-mode WordPress theme built for photographers. Every photo
you publish is pulled into a real-time WebGL carousel on the homepage (powered
by [Three.js](https://threejs.org/)) and a CSS-3D tilting gallery grid on the
archive page. No page builder or plugin required.

## Features

- **3D rotating photo ring** on the homepage (drag to rotate, scroll to zoom,
  gentle auto-rotation when idle).
- **CSS 3D hover tilt** on every gallery card with depth-layered captions.
- **Floating 3D frame** on the single-photo view.
- Custom `photo` post type + `photo_category` taxonomy so your gallery stays
  separate from blog posts.
- Automatic fallback to the **Media Library** — the moment you activate the
  theme, any images you've already uploaded show up in the 3D gallery.
- Responsive, accessible, and lightweight (one ~5KB JS file + Three.js from
  CDN; no jQuery, no build step).

## Installation

1. Copy the folder `wp-content/themes/aperture3d/` into your WordPress
   install's own `wp-content/themes/` directory.
   (Or zip it and upload via **Appearance → Themes → Add New → Upload**.)
2. Activate **Aperture3D** in **Appearance → Themes**.
3. Go to **Settings → Permalinks** and click **Save Changes** once. This
   flushes the rewrite rules so `/photos/` and the custom post type work.

## Adding photos

Two ways, both work out of the box:

- **Recommended** — go to **Photos → Add New**, set a title + featured
  image, optionally add a description, and publish.
- **Quick start** — just upload images to **Media → Add New**. The homepage
  will show them until you start using the `photo` post type.

The homepage automatically re-queries the latest 60 photos on every page
load, so new uploads appear immediately.

## Customization

| What                     | Where                                        |
| ------------------------ | -------------------------------------------- |
| Colors & typography      | `style.css`                                  |
| Carousel behavior        | `assets/js/three-gallery.js` (`initCarousel`)|
| Card tilt intensity      | `assets/js/three-gallery.js` (`initTiltGrid`)|
| Number of photos in ring | `functions.php` → `aperture3d_get_photo_payload()` (`posts_per_page`) |
| Menu                     | **Appearance → Menus** (location: *Primary*) |

## Browser support

Modern evergreen browsers with WebGL 1 support (effectively everything
released since ~2018). On devices that can't run WebGL, the canvas simply
stays dark and the static 3D-tilt gallery below still works.

## License

GPL-2.0-or-later. Three.js is distributed separately under the MIT license.
