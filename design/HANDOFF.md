# Handoff: Skolplanering — Design System

## Overview
A custom, sci‑fi‑inspired visual design system (nicknamed "Hail Mary" internally, after the reference posters it was drawn from) for the Skolplanering app — a parent/student school-planning app. This package specifies **only the design system**: colors, type, spacing/radius, component styling, and the specific screens/interactions built in the HTML prototype. It does not specify the full feature set of the real app.

## ⚠️ Critical: do not delete unspecified functionality
The production app has features, screens, edge cases and data behavior that were **never explored or shown in this prototype** — this prototype only covers the screens/flows listed below. When applying this design system to the real app:
- **Only restyle / re-skin what is specified here.** Any existing feature, screen, state, or behavior in the app that isn't mentioned in this document must be preserved as-is.
- Treat this as a *design system + reference screens* handoff, not a full rewrite spec. If a real screen has no equivalent here, keep its current structure and simply apply the tokens/components below.
- If something here appears to conflict with existing functionality, flag it for the design/product owner rather than removing the existing behavior.

## About the design files
The files in this bundle (`Skolplanering.dc.html`) are **design references built in HTML** — a working prototype demonstrating the intended look, states and interactions. They are not production code to copy verbatim. The task is to recreate this visual language and these interactions in the target codebase's existing stack (React Native, SwiftUI, Android/Compose, web, etc.), following that codebase's own conventions.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and component states below are final and should be recreated pixel-accurately, adapted to the target platform's idioms (e.g. native iOS sheets instead of a simulated bottom sheet).

## Design tokens

### Typography
- Heading font: **Space Grotesk** (weights 500/600/700) — Google Fonts.
- Body font: **Inter** (weights 400/500/600/700) — Google Fonts.
- App title / section headers: Space Grotesk 700, uppercase, `letter-spacing: 0.06em` — this tracked, geometric, uppercase treatment is the signature type gesture of the system (echoes the movie‑poster wordmark it's inspired by). Use it for the top-level app title and major section headers only, not for every heading.
- Body copy: Inter, regular weights, standard sentence case, no tracking.

### Radius
- `--radius-lg: 14px` — used on all cards, sheets (top corners only, 24px on bottom sheets), inputs, and swatches. This system is *not* pill-shaped/rounded — mid-radius rectangles, a deliberate contrast to fully rounded (skeuomorphic-soft) systems.

### Shadows
- Small (cards): `0 1px 2px rgba(0,0,0,.4)` dark / `0 1px 2px rgba(0,0,0,.08)` light.
- Large (bottom sheets, elevated overlays): `0 20px 50px rgba(0,0,0,.6)` dark / `0 20px 50px rgba(0,0,0,.18)` light.

### Color — dark mode (default)
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#0b0f14` | App background |
| `--color-text` | `#eef1f0` | Primary text |
| `--color-neutral-100` | `#121821` | Card/surface fill |
| `--color-neutral-200` | `#1c2530` | Borders, dividers |
| `--color-neutral-300` | `#2a3543` | Stronger borders, track fills |
| `--color-neutral-400` | `#45525f` | — |
| `--color-neutral-500` | `#64707c` | — |
| `--color-neutral-600` | `#8b96a0` | Secondary text |
| `--color-neutral-700` | `#aab3ba` | Tertiary/muted labels |
| `--color-neutral-800` | `#cdd3d7` | — |

### Color — light mode
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#f2ede3` | App background (warm paper) |
| `--color-text` | `#171512` | Primary text |
| `--color-neutral-100` | `#e9e2d3` | Card/surface fill |
| `--color-neutral-200` | `#ddd4c0` | Borders, dividers |
| `--color-neutral-300` | `#cbbfa5` | Stronger borders, track fills |
| `--color-neutral-400` | `#a89b7e` | — |
| `--color-neutral-500` | `#8a7d63` | — |
| `--color-neutral-600` | `#6b6250` | Secondary text |
| `--color-neutral-700` | `#4d473a` | Tertiary/muted labels |
| `--color-neutral-800` | `#2c2820` | — |

### Color — identity accents (per-child, both modes)
Each child/user gets one accent ramp used for their dot indicator, term-progress bar fill, and week-heatmap highlight when filtered to them alone.

**"Gustav" — pink ramp** (`--color-accent-*`)
- Dark: 400 `#ec8ebc`, 500 `#e0609e`, 600 `#c94a86`, 700 `#a53a6c`, 900 `#5c1f3c`
- Light: 400 `#e888b5`, 500 `#d94f8f`, 600 `#b93b74`, 700 `#93305d`, 900 `#4a1830`

**"Syno" — turquoise-blue ramp** (`--color-accent-2-*`)
- Dark: 200 `#163842`, 400 `#2a6d7a`, 500 `#2fb4c9`, 600 `#2494a6`, 700 `#1c7482`
- Light: 200 `#cdeaf0`, 400 `#6cc0cf`, 500 `#1fa3b8`, 600 `#17869a`, 700 `#136a7a`

This pairing (accent / accent-2) is meant to be **re-assignable per user** — the pattern is "two distinct, saturated identity colors," not specifically pink/turquoise. A settings control lets the current user swap their own accent among a small curated swatch set (see Components).

### Color — task-category colors (independent of user identity)
Task categories use a **separate, deliberately distinct palette** — never reuse a user's identity accent for a category, and never let two categories sit within one hue family (this was a explicit fix: earlier drafts used shades of one accent for all categories and they read as "too similar").

| Category | Dark hex | Light hex | Text on fill |
|---|---|---|---|
| prov (test) | `#e05252` | `#c23b3b` | white |
| nationellt prov (national test) | `#9b6bea` | `#7a4fc9` | white |
| muntligt (oral) | `#4c8fe0` | `#2f6fc2` | white |
| inlämning (submission) | `#e0a13c` | `#c9822a` | dark (`#1a1a1a`) on dark mode, white on light |
| läxa/förhör (homework/quiz) | `#d9c23c` | `#b8a02a` | dark on dark mode, white on light |
| lov (break/holiday) | `#5fae6f` | `#4f8f52` | white |
| övrigt (other) | `#7c8894` | `#6b6250` | white |

**Category dot/chip sizing scales with weight/importance**, not just color — this is a second, deliberate signal:
- nationellt prov: 10px dot (largest)
- prov: 9px
- muntligt / inlämning: 7px
- lov: 6px
- läxa/förhör / övrigt: 5px (smallest)

## Components

### Segmented pill toggle (child switch, metric switch, range switch)
Rounded-pill button group (radius 999px — the one place this system still uses full pill rounding, echoing selection controls). Active state: filled `var(--color-text)` background with inverted (`var(--color-bg)`) text; inactive: transparent fill, `1.5px solid var(--color-neutral-300)` border, `var(--color-text)` label.

### Theme toggle
Circular icon button (36px), `1.5px solid var(--color-neutral-300)` border, transparent fill. Shows ☀️ in dark mode (tap to go light) / 🌙 in light mode (tap to go dark). Placed top-right of the child-switch row.

### Cards (term progress, settings groups)
`background: var(--color-neutral-100)`, `border: 1px solid var(--color-neutral-200)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)`. Padding 14–16px.

### Term progress bar
34px-tall pill-shaped track (`border-radius: 999px`, `1.5px solid var(--color-neutral-300)` border, `var(--color-neutral-100)` fill background) with the child's accent-500 as a semi-transparent (0.55 opacity) fill from the left, and thin `1px` neutral-300 divider lines marking break milestones (höstlov/jullov/sportlov/slut), labeled above the track.

### Week heatmap
9-column grid of small rounded rectangles (one per school week), each shaded by a 5-step scale from `neutral-100` (empty) through `accent-2-200 → accent-2-400 → accent-600 → accent-900` (heaviest/"WTF?"). Selected week gets a `2px solid var(--color-text)` ring.

### Day cell task chips (weekly grid view)
Rectangular chip (`border-radius: 8px`), filled with the task's category color, small (10.5px) bold Inter label truncated to ~15 characters + ellipsis, prefixed with the child initial ("G ·" / "S ·").

### Calendar month grid
7-column grid, each day cell `1px solid var(--color-neutral-200)` border (or highlighted when selected: `2px solid var(--color-text)` + `neutral-100` fill), date label centered, up to 3 category dots (sized per the table above) centered below the date.

### Bottom sheets (task detail, week detail, day list)
Full-width sheet anchored to the bottom of the screen, `border-radius: 24px 24px 0 0`, `box-shadow: var(--shadow-lg)`, `var(--color-bg)` background, backdrop `rgba(0,0,0,.4)`. A 36×4px `neutral-300` grab-handle bar is centered at the top. Slide-up + fade-in on open (~200ms).

### Task detail sheet contents
Category swatch dot + uppercase tracked category label → task title (Space Grotesk 600, 20px) → child + time line (muted) → two side-by-side info tiles (`neutral-100` fill, `radius-lg`) for "Arbetsperiod" (date range) and "Vikt" (weight, with a −/+ stepper, 26px circular buttons) → "Material" description text → "Källor" (source links, styled as accent-700 text with a 🔗 prefix) → full-width primary action button ("Markera klar" / done state flips to accent‑2‑600 filled "✓ Klarmarkerad").

### Settings rows
Editable numeric thresholds (Amaze!/lagom/WTF? cutoffs) are plain `<input type="number">` fields, 56px wide, `radius: 8px`, `1.5px solid neutral-300` border, centered text — not sliders. Kid list and "source" (school calendar sync) rows are simple cards per the Cards spec above.

### Bottom tab bar
Fixed to the bottom of the screen, `background: var(--color-bg)`, `1px solid var(--color-neutral-200)` top border. Three flex-equal tabs (Översikt/Kalender/Inställningar), icon (emoji placeholder — swap for real iconography in production) above an 10.5px bold label; active tab tinted `accent-700`, inactive `neutral-500`.

## Component spec: "Next task" featured card
A single, prominent card on the Home screen surfacing the soonest upcoming task (across whichever child filter is active). Added after the initial handoff — documented in full here since it introduces a new card pattern (child-colored surfaces) worth reusing elsewhere.

### Structure (top to bottom, left to right)
1. **Category badge** — top-right corner, absolutely positioned. Small pill: `border-radius: 8px`, padding `5px 12px`, filled with the task's **category color** (see category table in the tokens section above), bold uppercase 11px label, `letter-spacing: .04em`. This is the *only* place category color appears on the card — everything else on the card uses the child's identity color.
2. **Title** — task title, Space Grotesk 700, 21px, `var(--color-text)`. Right padding (~70px) so long titles never run under the badge.
3. **Date row** — flex row, wraps if needed:
   - Plain date (e.g. "tis 25 aug"), Inter 500 13px, `var(--color-neutral-600)`.
   - Countdown pill next to it: `border-radius: 999px`, padding `2px 9px`, background `var(--color-neutral-200)`, text `var(--color-text)` 600 12px. Label is `"idag"` / `"imorgon"` / `"om N dagar"` — never a raw number alone.
4. **Child identity line** — small dot (child's accent-500, 9px, `border-radius: 50%`) + child name + class, Inter 500 12.5px, `var(--color-neutral-700)`.
5. **Work-period line** — "Arbetsperiod: start – slut", Inter 600 13.5px, `var(--color-text)` (this is the card's secondary heading — it's bolder than the date/child lines above it despite coming after them, because it's the second most decision-relevant fact after the title).
6. **Description** — Inter 400 13px/1.5, `var(--color-neutral-600)`, the task's material/description text; if the task has source links, the sentence is appended with "— N källor, klicka för underlag" as a plain-text affordance hint (no separate link chip on this card).
7. **Chevron affordance** — a bare `›` glyph, absolutely positioned bottom-right, Inter 600 20px, `var(--color-neutral-500)`. Signals "tap for more" without adding a full button.

### Child-color identity (the card's defining trait)
Every visual weight on this card that isn't the category badge follows **the child the task belongs to**, not the task's category — the point is to know "whose task is this" at a glance, before reading anything:
- **Left border accent**: `border-left: 4px solid <child-accent-500>` (Gustav = pink `--color-accent-500`, Syno = turquoise `--color-accent-2-500`). The other three border edges stay `1px solid var(--color-neutral-200)`.
- **Background tint**: `background: color-mix(in srgb, <child-accent-500> 14%, var(--color-neutral-100))` — a soft 14% wash of the child's color over the normal card surface. Keep this subtle; it should read as "tinted," not as a solid color block. Do not raise past ~15–18% or text contrast suffers.
- **Hover/press state**: all four border edges animate to the full child-accent-500 color (`border-color: <child-accent-500>`) — i.e. hovering "fills in" the outline with the identity color. No background or shadow change on hover.
- Card is a native button/pressable element (not a div+onClick) — `cursor: pointer`, full-width, no default button chrome (background/border are fully custom as above).

### Container
`border-radius: var(--radius-lg)` (14px, matches every other card in the system — no exception here), `box-shadow: var(--shadow-sm)`, padding `18px 18px 18px 16px` (2px less on the left to visually compensate for the 4px accent border), `margin-bottom: 16px` before the next section.

### Behavior
Tapping anywhere on the card opens the **task detail bottom sheet** for that task (see Bottom sheets / Task detail sheet in the base component spec above) — same destination as tapping the task from any other entry point (day chip, calendar day, week sheet row).

### Selecting "next task"
Whichever task in the currently-filtered set (all / Gustav / Syno) has the soonest date-time at or after "now" wins. If none are upcoming, don't render the card at all rather than showing a stale/past task.

## Screens covered in this prototype
1. **Home / Översikt** — header with app title + subtitle, child switch + theme toggle, per-child term-progress cards, week heatmap with legend and metric toggle (count vs. effort), "Kommande N veckor" range picker with category legend and a weekly day-grid of task chips.
2. **Calendar / Kalender** — month grid navigable by month, per-day dots sized by category weight but colored by child (see child-color identity rule above); tapping a day opens its task(s) directly in a bottom sheet (single task → task detail sheet directly; multiple tasks → a day list sheet to pick from) — **there is intentionally no intermediate small inline preview anymore**, that was removed in favor of opening the real detail view immediately.
3. **Settings / Inställningar** — kid list, school-calendar source/sync card, per-user accent-color swatch picker, editable effort thresholds.
4. **Task detail sheet** — see Components above.
5. **Week detail sheet** — week number + date range, each child's effort-level badge for that week.

## State & interaction notes
- `theme`: `'dark' | 'light'`, toggled via the header icon button; drives which token table above is active. No system-preference detection is wired up in the prototype — decide with the app team whether production should default from OS theme.
- `activeChild`: `'both' | 'g' | 's'` — filters cards, heatmap, and task lists.
- Clicking a week-heatmap cell opens the week detail sheet.
- Clicking a task chip (day grid) or a calendar day (task detail path) opens the task detail sheet.
- The weight stepper and "Markera klar" button are local prototype state only (not persisted) — production needs real persistence.
- Per-user accent swatch picker in Settings currently only re-themes one child's ("Gustav's") identity color in the prototype; the intent is a per-user control, generalize accordingly.

## Assets
No custom icons or imagery — emoji are used as icon placeholders throughout (🏠📅⚙️🌟🙂🫠⚪🔗☀️🌙). Replace with the app's real icon set in production; keep the category **size** differentiation when swapping to icons/dots.

## Files in this bundle
- `Skolplanering.dc.html` — the full interactive HTML prototype (single file, open directly in a browser) covering all screens/states described above.
