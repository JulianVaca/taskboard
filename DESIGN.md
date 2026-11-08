---
name: TaskBoard
description: A single-list task manager drawn as a four-colour comic page, where finishing a task is a panel moment.
colors:
  process-yellow: "#ffd60a"
  process-magenta: "#e0137a"
  process-magenta-night: "#ff3d9a"
  process-cyan: "#00a8f0"
  process-cyan-night: "#2ad4ff"
  sky-ground: "#29c5f6"
  sky-ground-deep: "#12a6dc"
  night-ground: "#170c34"
  night-ground-deep: "#0e0722"
  panel-paper: "#fbfcff"
  panel-paper-done: "#e9eef8"
  panel-paper-night: "#241a4d"
  panel-paper-done-night: "#1a1238"
  ink: "#14101f"
  ink-night: "#05030b"
  ink-text-night: "#f4f1ff"
  ink-soft: "#4a4360"
  ink-soft-night: "#c3b9e6"
  extrude-night: "#b0106a"
  danger: "#d61f2c"
  danger-night: "#ff5a64"
  far-city: "#63d4f8"
  near-city: "#0d7fb5"
  far-city-night: "#2a1863"
  near-city-night: "#0b0620"
  lit-window: "#ffe45c"
typography:
  display:
    fontFamily: "Bangers, Archivo Variable, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.75rem, 10vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Bangers, Archivo Variable, ui-sans-serif, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.05em"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.33
    letterSpacing: "0.025em"
    fontVariation: "'wdth' 85"
rounded:
  plate: "2px"
  panel: "3px"
  control: "4px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "32px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.process-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  task-panel:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  task-panel-done:
    backgroundColor: "{colors.panel-paper-done}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.panel}"
  composer-input:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.panel}"
    height: "48px"
  filter-tab:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "6px 12px"
  filter-tab-active:
    backgroundColor: "{colors.process-magenta}"
    textColor: "{colors.panel-paper}"
    rounded: "{rounded.plate}"
  icon-button:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "36px"
  narrator-caption:
    backgroundColor: "{colors.process-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 14px"
---

# Design System: TaskBoard

## Overview

**Creative North Star: "The Printed Comic Page"**

TaskBoard is a page of a comic book that happens to be a task manager. Every surface is a panel drawn in 2D that fakes 3D: white paper, a thick near-black ink outline, a stepped ink extrusion to the lower right, and a Ben-Day halftone shadow cast behind it. The page sits over a parallax sky: a cyan dotted sky by day, a violet night with magenta dots after dark, with speed lines, a halftone sun or moon, and two layers of inked skyline drifting at different depths with the pointer and scroll. Everything is CSS and inline SVG; the system ships no raster art.

The palette is four-colour process print: cyan, magenta, yellow and ink on paper. Display type is hand-lettered comic (Bangers) with cyan and magenta plates knocked out of register; working text is Archivo, a variable grotesque whose width axis condenses labels the way a letterer would. Motion is animated "on twos": scripted transitions advance in stepped frames instead of smooth easing, so the page moves like drawn animation. Completing a task triggers the signature onomatopoeia burst.

The style is inspired by the comic art direction of *Into the Spider-Verse* and stops at the art style. The system carries no characters, logos, or franchise imagery. Personality never gets in the way of the task: titles stay plain Archivo, controls stay obvious, and every decorative motion turns off under reduced motion.

**Key Characteristics:**
- Inked panels with ink extrusion plus halftone cast shadow as the only depth system.
- Four-colour process palette; yellow narrator captions; magenta as the "done/active" plate.
- Bangers lettering with cyan/magenta misregistration for display and SFX only; Archivo for everything you read.
- Stepped "on twos" timing for scripted motion; springs only for direct hover and tap response.
- Slight hand-pasted tilt on panels; small radii (2-4px) so panels read as cut paper, not cards.
- Day and night are two full printings of the same page, not a dimmed copy.

## Colors

A four-colour print run: process cyan, magenta and yellow plus ink on paper, re-inked for a night edition.

### Primary
- **Process Yellow** (process-yellow): the action and narration colour. The primary button, narrator captions (date box, waking notice, footer stack line), the logo tile, hover fill on secondary controls, the edit field, and text selection. Text on yellow is always fixed ink (#14101f) in both themes.

### Secondary
- **Process Magenta** (process-magenta, process-magenta-night): the "done and active" plate. Checked checkboxes, the active filter plate, active language, the progress meter fill, strike-through on completed titles, caret and accent colour, and the right-hand misregistered plate on lettering. In the night edition it also becomes the extrusion colour (extrude-night) and the dot colour of the sky.

### Tertiary
- **Process Cyan** (process-cyan, process-cyan-night): the left-hand misregistered plate on lettering and the burst, hover fill for the edit action, and the empty-state icon tile. Also the night edition's cast-shadow dot colour.

### Neutral
- **Sky Ground** (sky-ground, sky-ground-deep): the day page behind the panels, overlaid with white Ben-Day dots (rgb(255 255 255 / 0.32)).
- **Night Ground** (night-ground, night-ground-deep): the night page, overlaid with magenta dots (rgb(224 19 122 / 0.28)).
- **Panel Paper** (panel-paper, panel-paper-night): the fill of every inked panel. Completed tasks drop to panel-paper-done with a faint grey halftone over it.
- **Ink** (ink, ink-night): every outline, extrusion (by day), stroke on lettering, checkbox and control border. By night, readable text switches to ink-text-night while outlines stay near-black.
- **Soft Ink** (ink-soft, ink-soft-night): metadata lines, placeholders, the "/total" in the meter, toast descriptions.
- **Danger** (danger, danger-night): delete hover, the error speech balloon, the error state's extrusion and icon tile, the near-limit character count.
- **Skyline** (far-city, near-city, their night pair, lit-window): background-only colours for the two parallax city layers and their windows (yellow by day, magenta by night).

### Named Rules
**The Process Plate Rule.** Colour comes from the four process plates and the paper. A new accent needs a print reason; there is no fifth hue in the system.

**The Fixed Ink On Yellow Rule.** Anything set on Process Yellow uses fixed ink (#14101f) regardless of theme. Yellow never flips, so its text never flips.

**The Two Printings Rule.** Night is a second print run: the ground goes violet, the extrusion goes magenta, the cast dots go cyan, the windows go magenta. Never build dark mode by dimming the day palette.

## Typography

**Display Font:** Bangers (with Archivo Variable, ui-sans-serif fallback), self-hosted via @fontsource
**Body Font:** Archivo Variable with the wdth axis (with ui-sans-serif, system-ui, Segoe UI fallback), self-hosted via @fontsource-variable

**Character:** Bangers is the letterer's hand, loud, slanted and all-caps, used for what the page shouts. Archivo is the typesetter, a sturdy grotesque whose width axis (78-100%) condenses labels into tight comic-caption caps without changing family.

### Hierarchy
- **Display** (Bangers 400, clamp(2.75rem, 10vw, 4.75rem), line-height 0.95): the greeting headline, set as lettering (paper-white fill, 2px ink stroke, 4px stepped ink extrusion, cyan plate offset -3px -1px, magenta plate offset 7px 5px). Error SFX uses the same treatment at 3rem; the logotype uses it at 1.55-1.9rem with a 1.5-2px stroke.
- **Headline** (Bangers 400, 1.875-2.25rem, line-height 1): empty-state titles and the meter count. Plain ink, without plates.
- **Title** (Archivo 600, 1.125rem, line-height 1.375): task titles and composer text. Always Archivo so user content stays readable; wraps anywhere.
- **Body** (Archivo 500-700, 0.875-1rem): state explanations, caption summaries, toast text.
- **Label** (Archivo 800, 0.75rem, letter-spacing 0.025em, uppercase, wdth 85%; 78% on narrow viewports): metadata lines, filter tabs, status text, meter caption, list hint.
- **Button lettering** (Bangers 400, 1.125-1.25rem, letter-spacing 0.05em): the primary yellow buttons and the ES/EN switch, plus counts in filter chips.

### Named Rules
**The Lettering Is Shouted Rule.** Bangers carries only shouts: greetings, SFX, button calls, counts and empty-state titles. User content and anything read twice is Archivo.

**The Width Not Size Rule.** To fit a label, condense its width axis (100% to 85% to 78%) before shrinking it below 0.75rem.

## Layout

A single centred column (max-width 42rem) on a full-bleed sky. Page padding is 16px on mobile and 24px from the sm breakpoint (640px), with top padding of 24/32px. The vertical rhythm steps in large beats: top bar, then 40px (56px on sm) to the hero, 32px to the composer, 40px to the list, 80px to the footer. Inside the list, panels stack 16px apart; inside a panel, items sit 12px apart.

The hero stacks on mobile and goes to a row from sm, with the greeting left and the progress meter bottom-aligned at the right (meter fixed at 13rem on sm, full width below). Filter tabs span full width on mobile with condensed 78% labels and become an inline group on sm, where the "double click to edit" hint appears. On touch devices without hover, the per-task edit and delete actions are always visible; with real hover they appear on hover or focus-within.

Panels are not perfectly square to the page: each task panel tilts between -0.66deg and +0.66deg, derived from its id so it stays stable; the meter sits at 2deg and narrator captions at -1 to -1.5deg.

## Elevation & Depth

Depth is printed, not lit. There are no blurred shadows anywhere. Every raised surface is an inked panel: a 3px ink border, a stepped extrusion built from stacked 0-blur offsets up to the panel's depth (default 5px), and behind it a Ben-Day halftone cast shadow (6px dot grid) offset a further 6px right and 7px down. Depth is a variable, so state is expressed by changing how far the panel stands off the page: it rises on hover or focus and flattens when the task is done.

### Shadow Vocabulary
- **Ink extrusion** (`box-shadow: 1px 1px 0 var(--extrude), 2px 2px 0 var(--extrude), 3px 3px 0 var(--extrude), calc(var(--depth) - 1px) calc(var(--depth) - 1px) 0 var(--extrude), var(--depth) var(--depth) 0 var(--extrude)`): the body of every inked panel. Depth 5px default, 8px task hover, 7px composer focus, 3px for top-bar controls, filter group and footer links, 2px for completed tasks.
- **Halftone cast** (`background-image: radial-gradient(var(--cast) 34%, transparent 38%); background-size: 6px 6px; transform: translate(calc(var(--depth) + 6px), calc(var(--depth) + 7px))`): the dotted shadow behind every inked panel; ink at 55% by day, cyan at 45% by night.
- **Ink offset** (`box-shadow: 3px 3px 0 var(--ink)`, hover `5px 5px 0 var(--ink)`): the flat ink drop under yellow buttons, narrator captions and icon tiles that sit inside a panel. Toasts use 4px 4px 0 var(--extrude).
- **Lettering extrusion** (`text-shadow: 1px..4px stepped ink, -3px -1px 0 var(--cyan), 7px 5px 0 var(--magenta)`): depth and misregistration for display lettering only.

### Named Rules
**The Printed Depth Rule.** Depth is ink extrusion plus halftone cast, never a blur. If a shadow has a blur radius, it does not belong on this page.

**The Depth Is State Rule.** A panel's distance from the page is its state: raised on hover or focus, flattened when done. Change --depth; don't add a new shadow.

## Shapes

Cut paper with a pen line around it. Corners are barely softened: 2px for plates inside a group (filter and language plates, count chips, skeleton bars), 3px for panels, 4px for standalone controls (buttons, checkbox, icon buttons, speech balloon). Outlines are heavy and constant: 3px on panels, buttons and the checkbox, 2.5px on icon buttons, captions, the meter track and the edit field, 2px on chips and the kbd hint. Status dots are the only circles. The speech balloon carries an inked SVG tail pointing at the field it explains, and the completion burst is a hand-drawn 14-point star with irregular radii.

## Components

### Buttons
Loud, inked, a little crooked when you reach for them.
- **Shape:** gently squared (4px), 3px ink border.
- **Primary:** Process Yellow with fixed ink Bangers lettering (1.25rem, tracking 0.05em), 48px tall, 16px horizontal padding, 3px ink offset. On mobile the label collapses to a plus icon with a screen-reader label.
- **Hover / Focus:** rotates -2deg and scales 1.04 on a spring, the ink offset grows to 5px; tap scales to 0.92. Focus is the global 3px focus outline at 3px offset (ink by day, yellow by night).
- **Icon buttons:** 36px paper squares with a 2.5px border and a 2.5-stroke Lucide icon; hover lifts 2px and floods the action's plate (cyan for edit, danger with white icon for delete).
- **Top-bar controls:** 40px inked panels at depth 3px; the theme toggle floods yellow on hover and swaps sun and moon in four stepped frames.

### Chips
- **Count chips:** Bangers digits in a 2px-radius plate, ink with white text at rest, white with ink text on the active tab.
- **Status chip:** an inked panel with a ringed status dot (online green, waking yellow, offline danger, checking soft ink) and a condensed uppercase label.

### Cards / Containers
- **Corner Style:** 3px.
- **Background:** panel paper; completed tasks use panel-paper-done under a 7px grey halftone.
- **Shadow Strategy:** inked panel (see Elevation & Depth).
- **Border:** 3px ink.
- **Internal Padding:** 12px vertical, 12px horizontal on mobile and 16px from sm.
- **Task panel motion:** enters from scale 0.6 with an extra -6deg tilt on a spring, tilts in 3D on hover (rotateX 5deg, rotateY -6deg, lift 3px, depth 8px), exits by flinging left in four stepped frames.

### Inputs / Fields
- **Style:** the composer is a whole inked panel: pencil icon, transparent 48px field in Archivo 600 1.125rem, a "/" shortcut hint in a 2px-bordered Bangers key cap, and the yellow add button.
- **Focus:** the panel lifts 2px and its depth grows to 7px; the pencil turns magenta; the caret is magenta.
- **Error:** the extrusion turns danger, the panel shakes in six stepped frames, and a danger speech balloon with an inked tail appears below. A remaining-character count appears in the last 30 characters and turns danger in the last 10.
- **Inline edit:** the title becomes a yellow field with a 2.5px ink border and fixed ink text.

### Navigation
- **Filter tabs:** one inked group at depth 3px holding three condensed uppercase labels with counts. The active filter is a magenta plate with a 2px ink border that jumps between options in four stepped frames; inactive tabs flood yellow on hover.
- **Language switch:** the same plate grammar in Bangers ES / EN, magenta when active.
- **Footer links:** small inked panels at depth 3px with underlined Archivo bold text, flooding yellow on hover.

### Narrator Caption
The yellow comic caption box: Process Yellow, 2.5px ink border, 3px ink offset, Archivo 800 condensed caps, set slightly crooked. It holds the day's date and pending summary in the hero, the waking-server notice (Bangers title, explanation, and a stepped magenta progress sweep), and the footer stack line.

### Progress Meter
An inked panel tilted 2deg: Bangers count ("3/5", the total in soft ink), a condensed caption, and a 20px ink-bordered track filled with magenta under a white 6px halftone, which grows in eight stepped frames.

### Completion Burst (signature)
On completing a task, a 144px onomatopoeia starburst pops over the panel's top-left corner: a yellow 14-point star with a 4px ink stroke and magenta dot pattern, carrying a Bangers word in magenta with a heavy ink stroke. It animates on twos (1.1s across 13 stepped frames: scale 0.2 to 1.15 to 1, rotate -25deg to -8deg, then fade), while the cyan and magenta plates start 7px out of register and settle in four frames. Under reduced motion it simply appears at -8deg and fades.

### States
- **Loading:** three ghost panels at alternating tilts filled with a drifting skeleton halftone (6 steps per 1.2s).
- **Empty:** a lightly halftoned panel at depth 3px with a cyan icon tile that bobs in eight stepped frames and a Bangers title per filter.
- **Error:** an inked panel with a danger extrusion, lettered SFX, a danger icon tile, a plain explanation, and a yellow retry button.
- **Toasts:** paper with a 3px ink border, 4px extrusion offset, bold title and soft-ink description, and a yellow close button.

## Do's and Don'ts

### Do:
- **Do** build every raised surface as an inked panel: paper, 3px ink border, stepped extrusion (default 5px depth) and a 6px halftone cast.
- **Do** express state through depth: 8px on hover, 7px on focus, 2px when done, 3px for small controls.
- **Do** time scripted motion on twos with stepped easing (floor(p * n) / n, or CSS steps()), 4-13 frames; keep springs for direct hover and tap response.
- **Do** set lettering (Bangers with ink stroke, ink extrusion and offset cyan/magenta plates) only on shouted display text: greetings, SFX, the logotype.
- **Do** put fixed ink (#14101f) on Process Yellow in both themes.
- **Do** give panels a slight, stable tilt (within about plus or minus 0.7deg for list items, up to 2deg for single features).
- **Do** draw decoration as CSS gradients and inline SVG; disable every decorative motion under prefers-reduced-motion.

### Don't:
- **Don't** use blurred shadows, glassy blur, or soft floating cards; depth is printed.
- **Don't** use violet-to-pink gradients or any gradient other than halftone dots, speed lines and the sky masks.
- **Don't** set task titles or any user content in Bangers.
- **Don't** introduce characters, logos or franchise imagery; the reference is art style only.
- **Don't** add a hue outside cyan, magenta, yellow, ink and paper (danger and the status green excepted).
- **Don't** round panels beyond 4px; a pill or a 12px card breaks the cut-paper silhouette.
