# Feature: Gallery section

Goal: add an elegant gallery section after the cinema scene ("Todo amor comienza con un sí")
that previews 3 photos; clicking any photo opens a lightbox to browse every photo in full.
Image files are not available yet: ship configured paths and graceful placeholders.

## Decisions

- Placement: after `.cinema-scene`, before the venue section ("Dónde será").
- Data: `INVITATION_DATA.gallery.images` (ordered list of `{ src, alt }`); first 3 are previews.
- Paths: `assets/images/gallery/galeria-01.jpg` … `galeria-09.jpg` (add/remove entries to change count).
- Missing files render an elegant placeholder instead of a broken image.
- Section uses the existing pinned `cinematic-panel` reveal.
- Lightbox: full image (`object-fit: contain`), prev/next, counter, close; keyboard (Esc, ←, →), swipe, focus return, scroll lock.

## Tasks

- [x] 1. Gallery data + asset folder README with expected paths
- [x] 2. Gallery section markup and preview layout styles
- [x] 3. Lightbox (markup, styles, JS behavior, placeholders)
- [x] 4. Browser verification (desktop, mobile, reduced motion, missing images)

## Evidence

- `node --check` passes for scripts/main.js and scripts/invitation-data.js.
- Playwright (1440x900, 390x844, reduced motion): heading + 3 previews fit the pinned viewport;
  lightbox opens at clicked index, arrows/wrap/Escape/backdrop/focus trap/focus return work;
  body scroll-lock class removed on close; no page errors.
- Real photos routed into gallery paths: lightbox image uses object-fit contain and stays fully in view.
- Missing files render the "Foto próximamente" placeholder in previews and lightbox.
- Touch swipe: left -> next, right -> previous, wraps 1 -> 9, short swipe ignored.
- Regression: venue sequenced panel still reveals title > Ceremonia > Lugar with no overlap.
- Committed in 31c09b3 (feat: add story, gallery and venue detail sections) on main.
