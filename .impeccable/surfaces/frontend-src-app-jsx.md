---
version: 1
slug: "frontend-src-app-jsx"
primary_target: "frontend/src/App.jsx"
related_targets: ["frontend/src/index.css"]
---

## Scope

The whole TaskBoard web app (single screen: top bar, greeting, composer, filters, task list, states, footer, toasts). Mode: Operate. Build path: code-led (no image generation available).

## Audience and job

Portfolio and coursework reviewers trying the live app for a few minutes: create, complete, edit, delete, filter, switch theme and language (ES/EN).

## Constraints

All existing functions, light and dark theme, Spanish default plus English switch, backend untouched, reduced motion respected, readable contrast.

## Skins

The app ships three user-selectable skins over one shared behaviour layer (frontend/src/shared, hooks, i18n): Classic (the original incumbent design, restored as-is, no direction contract), Comic (contract below) and Brutal (second contract below). Each skin lives in frontend/src/skins/<name>/. Default: comic.

## Direction contract

THESIS: The task list is a comic page drawn in 2D that fakes 3D: every task is an inked panel with printed depth, and finishing a task is a panel moment. Refuses the soft SaaS list of blurred cards and violet gradients.

OWN-WORLD: Four-colour print: cyan sky ground with Ben-Day dots (day) or violet night with magenta dots (night), white paper panels, near-black ink, process magenta, process yellow caption boxes, cyan. Thick ink outlines, ink extrusion plus halftone cast shadow as the depth system, cyan/magenta plate misregistration on display type. Bangers for lettering and SFX, Archivo for UI text.

STORY: The visitor sees a comic page that is plainly a task manager, adds a task, completes it and gets a printed burst, and leaves remembering the panel pop.

FIRST VIEWPORT: Top bar: inked TASKBOARD logotype left; status caption, ES/EN switch, theme switch right. Below: yellow caption box with the date over a big lettered greeting and a printed progress meter. Composer panel with yellow ¡AGREGAR! button directly under, then filter tabs and the task panels. Background: parallax skyline layers and speed lines moving at different depths.

FORM: Comic page (brief-pinned, Spider-Verse-inspired art style only, no franchise imagery); signature move: completion burst — onomatopoeia starburst animated on twos (stepped frames) with plate misregistration settling into register. Brief-pinned direction beats the roll. seed:71a3253e6e305b13

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Direction contract — Brutal skin

THESIS: Tasks are physical slabs you press: Kinetic Neo-Brutalism where every card and button compresses under the cursor and the board's numbers ride a moving ribbon. Refuses soft depth, blur and gradients.

OWN-WORLD: "Ponche Tropical" palette, user-pinned: Nightfall #351C4D for every 4px border, main type and 6px zero-blur shadows; Tropical Pink #F5AB99 ground with warm white #FFFDF9 surfaces; Liquid Sunset #FEB47B marquees, card header strips and hover light; Heatwave #FF7E5F CTAs, reactive cursor and floating top-hierarchy badge; Paradise #765285 secondary bento cards, tickets and metadata pills. Archivo Variable at 900 and wide stretch for display, Archivo for UI. Night derives from Nightfall ground.

STORY: The visitor sees a bento board, pushes a card and feels it sink, adds and completes tasks, drags a sticker around, and remembers the tactile press.

FIRST VIEWPORT: Top bar with the wide TASKBOARD wordmark, status pill, ES/EN, theme; style switch row; a full-bleed Liquid Sunset marquee carrying live counts; bento grid: greeting card (Liquid Sunset header strip with the date) plus Paradise progress card and a floating Heatwave pending badge; composer with Heatwave Agregar; filters; task slabs.

FORM: Kinetic Neo-Brutalism (user-pinned brief beats the roll); signature move: tactile compression — hover lifts a slab diagonally with its shadow growing to 10px, press sinks it fully to 0px; spring-physics stagger, scroll-accelerated marquee, draggable elastic SVG stickers. seed:2b1d070230719430

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
