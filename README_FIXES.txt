
TFX — Then & Now: Drop‑in Fix Pack (v1.0)
========================================

What this fixes (without rewriting your page):
1) Before/After slider drag works again (mouse + touch)
2) Hero edge arrows navigate images (click + keyboard ←/→)
3) Back‑to‑top button shows and scrolls to top
4) Lightbox / Expanded View is anchored to <body> and opens images, with Esc/arrow keys

Files in this ZIP:
- fixes.css  → minimal overlay styles (safe to include last)
- fixes.js   → self‑contained JS (no dependencies)
- README_FIXES.txt → this file

How to install (60 seconds):
1) Upload `fixes.css` and `fixes.js` to the root or your /assets folder.
2) In your index.html add **after your existing CSS** in the <head>:
     <link rel="stylesheet" href="fixes.css">
   or, if you use /assets: 
     <link rel="stylesheet" href="/assets/css/fixes.css">

3) Just before </body> add **after your existing scripts**:
     <script src="fixes.js" defer></script>
   or with /assets:
     <script src="/assets/js/fixes.js" defer></script>

That’s it. No need to rename your current classes. The script auto-detects:
- Compare containers: `.compare` / `.compare-slider` (with children `.before` + `.after` + `.handle`)
  If your HTML uses other names, add data-attributes:
    <div class="myCompare" data-compare>
      <img data-compare="before" src="then.jpg">
      <img data-compare="after"  src="now.jpg">
      <div data-compare="handle"></div>
    </div>

- Hero arrows: add to your hero container (or keep existing):
    <button data-hero-prev>‹</button>
    <button data-hero-next>›</button>
  Slides should have either `.hero__slide` or `[data-hero-slide]` and one should have `.is-active`.

- Back to top: if you already have #backToTop it will be reused; if missing, the script creates one.

- Lightbox: any image with `data-lightbox` (or inside `.gallery`) will open in the Expanded View.
  You can force a higher-res file via `data-full="path/to/big.jpg"` and an optional caption `data-caption="..."`.

Notes:
- The CSS increases legibility (system font stack, subtle background), but is intentionally minimal.
- All features are isolated; if a section is missing in your HTML, nothing breaks.
- If you have custom z-index overlays, ensure they are below 9998 so the lightbox appears on top.

Rollback:
- Simply remove the `<link rel="stylesheet" href="fixes.css">` and `<script src="fixes.js" defer></script>` lines.

— Made for your GitHub Pages build.
