# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Portfolio and coursework reviewers (teachers, recruiters, visitors) who open the live site for a few minutes to try the app and judge both its craft and its full-stack execution. They create a few tasks, complete, edit and delete them, toggle the theme, and leave.

## Product Purpose

TaskBoard is a full-stack task manager (React + Vite frontend, Express API, PostgreSQL on Render) built as a deliverable. It exists to demonstrate a working CRUD product end to end, deployed with CI and branch-based environments. Success: a visitor understands the app instantly, every action works and gives clear feedback, and the interface is memorable enough to stand out in a portfolio.

## Positioning

A single-list task manager whose interface is drawn as a comic book: the everyday act of finishing a task becomes a comic panel moment, while the app stays a real, deployed, tested full-stack product.

## Operating Context

- Free Render plan: the API sleeps after inactivity, so the first load can take up to a minute; the UI shows a waking notice and a status indicator.
- Visitors arrive on desktop and mobile, often for one short session.
- Production at https://skillware.online, API at https://api.skillware.online.

## Capabilities and Constraints

- Create tasks (empty-title validation, 200-character limit, "/" shortcut focuses the field).
- Complete / uncomplete, rename by double click or edit button, delete; optimistic updates with rollback and toasts.
- Filters: all, pending, completed, with counts; progress indicator; pending summary.
- API status indicator; loading, waking, error-with-retry and empty states.
- Light and dark theme, persisted.
- Interface language: Spanish by default, with a user-selectable switch to English.
- Visual style switch: Classic, Comic, Brutal (see Brand Commitments); every style keeps every function, both themes and both languages.
- Respect the system "reduce motion" setting.
- Backend, API contract and database stay untouched; the redesign is frontend only.
- Stack: React 19, Vite 8, Tailwind CSS 4, Motion, Lucide, Sonner.

## Brand Commitments

- Name: TaskBoard.
- The interface offers three user-selectable visual styles over the same product, chosen from a style switch and remembered per browser (default: Comic):
  - **Classic:** the original TaskBoard design (Inter, soft translucent cards, violet accent), kept as it was.
  - **Comic:** full-intensity cartoon comic-book style, 2D artwork that fakes 3D depth, in the spirit of the animated film *Spider-Man: Into the Spider-Verse* (halftone dots, thick ink lines, color misregistration, panels with layered depth). Inspired by that art style only; no characters, logos or franchise imagery.
  - **Brutal:** Kinetic Neo-Brutalism with the owner's "Ponche Tropical" palette (Nightfall #351C4D, Tropical Pink #F5AB99, warm white #FFFDF9, Liquid Sunset #FEB47B, Heatwave #FF7E5F, Paradise #765285), tactile hover-lift / press-sink compression and spring physics.

## Evidence on Hand

- Live deployment and public GitHub repository (JulianVaca/taskboard), backend tests in `backend/test/`.
- No testimonials, users or metrics exist; none may be invented.

## Product Principles

1. Every action answers visibly: what happened, and how to undo or retry.
2. The comic world carries personality without slowing the task: titles stay readable, controls stay obvious.
3. Honest about the infrastructure: waking and offline states are told plainly.
4. Bilingual parity: everything readable in Spanish reads equally well in English.

## Accessibility & Inclusion

Readable contrast on halftone and colored grounds, full keyboard operation, screen-reader labels in the active language, and all decorative motion disabled under reduced motion.
