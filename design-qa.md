# Design QA

## Reference

- Source mock: `C:\Users\KJS\Desktop\웨딩사진\mock`
- Target: `http://localhost:3001/`
- Primary viewport: mobile portrait

## Implemented comparison points

- Hero uses the supplied wedding image, centered white serif typography, lightweight title weight, and staggered title/name/date entrance motion.
- Body typography now separates editorial serif headings from readable sans-serif supporting copy.
- Calendar is a compact bordered card with an olive serif date, English weekday labels, and circular wedding-date emphasis.
- Gallery is a dense three-column layout with one featured tile, staggered scroll entrance, image hover feedback, and an animated lightbox.
- Venue and contact areas use the mock's thin-border, softly rounded card treatment.
- Contact actions are arranged as a two-column panel.
- No fake venue or map imagery was created because no source asset exists in the project.
- RSVP and account sections remain data-driven and hidden while disabled; no fabricated personal data was added.

## Engineering checks

- TypeScript: passed (`npm run typecheck`)
- Production build: passed (`npm run build`)
- Responsive primitives: CSS grid, fluid type, and existing mobile-first page shell retained.
- Reduced motion: static semantic fallback retained for the hero and motion-sensitive behavior.
- Core gallery interaction: preserved.

## Visual QA blocker

The Codex in-app browser could not access the local preview because its admin-enforced browser security policy could not be verified. The local Next.js server itself started successfully, but the required side-by-side reference/prototype screenshot comparison could not be completed without bypassing the browser security control. No bypass was attempted.

final result: blocked
