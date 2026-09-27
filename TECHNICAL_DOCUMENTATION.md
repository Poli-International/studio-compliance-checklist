# Studio Inspection Readiness Checklist - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

---

## Architecture Overview

### Purpose

The Studio Inspection Readiness Checklist is a static, client-side web tool that helps tattoo and body piercing studios prepare for health and safety inspections. It organizes twenty hygiene and safety requirements across eight work areas, tracks the preparation status of each item, records where supporting evidence is stored, and generates a printable binder index for the studio's physical inspection folder.

### Technology Stack

- **HTML5** for markup (`index.html` plus seven localized documentation pages).
- **CSS** via two external stylesheets: `/tools/studio-compliance-checklist/css/style.css` and `/tools/shared/print.css` (print media), plus `/tools/shared/a11y.css` for accessibility.
- **Vanilla JavaScript** (no frameworks, no build step, no external runtime dependencies).
- **Browser `localStorage`** for persistence.
- **`postMessage`** for iframe height auto-resizing and theme synchronization with a parent wrapper.

### File Structure

```
/tools/studio-compliance-checklist/
├── index.html                  Main application shell
├── css/
│   └── style.css               Application styling
├── images/
│   └── Poli-International-Co.webp
└── js/
    ├── i18n.js                 Translation dictionary (loaded first)
    ├── database.js             Checklist content and regional data
    ├── main.js                 Application logic and rendering
    └── common.js               Theme, iframe resize, embed modal, cross-tool links

/tools/shared/
├── print.css                   Print stylesheet
└── a11y.css                    Accessibility stylesheet

/js/
└── input-guards.js             Shared input sanitization guards
```

Localized documentation pages (each a standalone HTML file with its own inline styles):

- `documentation.html` (English)
- `documentation-de.html` (Deutsch)
- `documentation-es.html` (Español)
- `documentation-fr.html` (Français)
- `documentation-it.html` (Italiano)
- `documentation-nl.html` (Nederlands)
- `documentation-pt.html` (Português)

### Script Load Order

Scripts load in strict order because each depends on the previous:

1. `/js/input-guards.js` (in `<head>`)
2. `/tools/studio-compliance-checklist/js/i18n.js` (translation dictionary)
3. `/tools/studio-compliance-checklist/js/database.js` (checklist data)
4. `/tools/studio-compliance-checklist/js/main.js` (application logic)
5. `/tools/studio-compliance-checklist/js/common.js` (utilities)

### Component Breakdown

| Component | Responsibility |
|---|---|
| `index.html` | Page shell, header with language selector, embed button, dark mode toggle, footer, embed modal, `#app-root` mount point. |
| `i18n.js` | Holds the translation dictionary consumed by `t()` in `main.js`. |
| `database.js` | Holds the checklist items, the eight work areas, and the four regional jurisdiction definitions. |
| `main.js` | Renders the app into `#app-root`, manages status state, counters, tabs, region selection, binder index, reset, and print. |
| `common.js` | Theme toggle, iframe height messaging, embed modal open/close/copy, cross-tool link wiring. |

### Iframe Content Hider

`index.html` includes an inline script that detects when the page is loaded inside an iframe (`window.self !== window.top`). When embedded, it injects a style block that hides the header, footer, breadcrumbs, discovery map, feedback sections, related tools, share cards, support cards, dark mode toggle, and global footer, and zeroes out body padding and margin. This keeps the embedded view limited to the checklist itself.

---

## Data Schemas

### Checklist Item

Each inspection item in `database.js` is an object. The rendered card exposes the following fields (field names as surfaced in the UI and consumed by `main.js`):

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | string | Stable identifier used as the `localStorage` status key. | `"hand_hygiene"` |
| `area` | string | One of the eight work areas. | `"Hand hygiene and PPE"` |
| `text` | string | The inspector-facing requirement. | `"Hands washed and dried before and after every procedure"` |
| `authority` | string | Regulator or standard reference for the selected region. | `"Local authority / Health and Safety at Work etc. Act 1974"` |
| `evidence` | string | Where the supporting evidence is kept. | `"Wash station log / training records"` |
| `toolLink` | string (optional) | URL to a companion Poli evidence tool, present only on items that require technical logs. | `"https://poliinternational.com/autoclave-calculator/"` |

### Status Values

Status is stored as a string per item. The three assignable values plus the default:

| Value | Meaning |
|---|---|
| `ready` | Item is prepared. |
| `not_yet` | Item still needs preparation. |
| `na` | Item is not applicable to this studio. |
| (unset) | Item has not been reviewed; treated as "not checked". |

Clicking an already-active status button clears the entry back to unset.

### Region Codes

| Code | Region |
|---|---|
| `uk` | United Kingdom |
| `eu` | European Union |
| `us` | United States |
| `au` | Australia |

### localStorage Keys

| Key | Contents |
|---|---|
| `studio_inspection_readiness_status` | Map of item `id` to status string (`ready`, `not_yet`, or `na`). |
| `studio_inspection_readiness_region` | Selected region code (`uk`, `eu`, `us`, or `au`). |
| `studio_inspection_readiness_studioname` | Studio name string entered for the binder index cover sheet. |
| `theme` | `"dark"` or `"light"` (written by `common.js`). |

### Counters

The counter bar above the tabs displays five values:

| Counter | Meaning |
|---|---|
| Total items | Total number of checklist items. |
| Ready | Items with status `ready`. |
| To prepare | Items with status `not_yet`. |
| Not applicable | Items with status `na`. |
| Not checked | Items with no status set. |

---

## Calculation / Logic Algorithms

The tool performs no scoring or percentage calculation. Its logic is state tracking, filtering, and rendering.

### Theme Initialization (`common.js`)

1. On `DOMContentLoaded`, read `localStorage.getItem('theme')`, defaulting to `"dark"` if absent or if storage access throws.
2. Call `setTheme(savedTheme, false)` to apply the class without re-saving.
3. `setTheme(theme, save)` adds `light-mode` and removes `dark-mode` for `"light"`, or the reverse for `"dark"`, and updates the toggle icon (`☀️` for light, `◐` for dark).
4. If `save` is true, write the theme to `localStorage` inside a `try/catch` that silently ignores restricted-iframe write failures.

### Theme Toggle Handler

On click of `#darkModeToggle`, compute the target theme as the opposite of the current body class and call `setTheme(target, true)`.

### Parent Theme Sync

A `message` listener reads `event.data.theme` and calls `setTheme(event.data.theme, true)`, allowing a parent wrapper to push a theme into the iframe.

### Iframe Auto-Resize (`common.js`)

1. `sendHeight()` posts `{ height: document.body.scrollHeight + 40 }` to the parent window when the page is framed.
2. It runs once on load, on `resize`, 100 ms after any `click` or `change`, and on any DOM mutation observed by a `MutationObserver` watching `document.body` with `childList` and `subtree` enabled.

### Status Assignment (`main.js`)

1. Each item renders three status buttons: Ready, Not yet, Not applicable.
2. Clicking a button sets that item's status in the in-memory map and persists the map to `studio_inspection_readiness_status`.
3. Clicking the button that matches the current status clears the entry (returns the item to "not checked").
4. Counters recompute from the map after every change.

### Region Selection (`main.js`)

1. The region selector offers United Kingdom, European Union, United States, and Australia.
2. Selecting a region persists the code to `studio_inspection_readiness_region` and updates the authority/standard text shown on each item.
3. An explanatory note describes the inspecting authorities and standards for the selected region.

### Tab Filtering (`main.js`)

1. **Inspection checklist** tab shows all items.
2. **Items to prepare** tab filters to items with status `not_yet` only. When none remain, it shows the message "No items marked as 'Not yet'".
3. **Binder index** tab renders the printable index table.

### Binder Index Generation (`main.js`)

1. The index table has six columns: Area, Typical inspection item, Regulator / standard, Evidence location / tool, Current status, and Last checked date.
2. The studio name field (`Studioname` / "Enter your studio name") is persisted to `studio_inspection_readiness_studioname` and printed on the cover sheet.
3. The print action outputs the studio name, region, date, and the full table with blank sign-off lines for handwritten initials and dates.

### Reset (`main.js`)

1. Clicking "Reset all statuses" opens a confirmation dialog: "Are you sure you want to reset all statuses? This will clear all entries in this browser."
2. On confirmation, all entries are cleared and every item returns to "not checked".

### Embed Modal (`common.js`)

1. The embed URL is assembled from a scheme prefix (`['http', 's:'].join('')`) and the domain `poliinternational.com`, producing the absolute tool URL.
2. The textarea is pre-filled with an `<iframe>` snippet pointing at that URL, with `width="100%"`, `height="800"`, and `border:0; border-radius:12px`.
3. Clicking the embed button opens the modal, locks body scroll, and focuses/selects the textarea.
4. The modal closes via the close button or by clicking the backdrop, restoring body scroll.
5. The copy button selects the textarea and copies via `navigator.clipboard.writeText`, falling back to `document.execCommand('copy')`. On success it swaps the button label to a checkmark plus the translated "Copied!" string for 2000 ms.

---

## API Reference

The tool exposes no public JavaScript API. All functions are module-scoped inside `DOMContentLoaded` handlers. The following handlers and DOM contracts are the effective interface.

### DOM Element Contracts

| Element ID | Type | Behavior |
|---|---|---|
| `#languageSelector` | `<select>` | Switches UI language across the seven supported locales. |
| `#embedBtn` | `<button>` | Opens the embed modal. |
| `#darkModeToggle` | `<button>` | Toggles light/dark theme. |
| `#app-root` | `<div>` | Mount point rendered by `main.js`. |
| `#embedModal` | `<div>` | Embed modal dialog (`role="dialog"`, `aria-modal="true"`). |
| `#modalClose` | `<button>` | Closes the embed modal. |
| `#embedCode` | `<textarea readonly>` | Holds the generated iframe embed snippet. |
| `#copyEmbedCode` | `<button>` | Copies the embed snippet to the clipboard. |
| `#moreToolsBtn` | `<a>` | Links to the Poli tools hub. |

### `common.js` Functions

| Function | Parameters | Behavior |
|---|---|---|
| `setTheme(theme, save)` | `theme`: `"light"` or `"dark"`; `save`: boolean | Applies the theme class, updates the toggle icon, and optionally persists to `localStorage`. |
| `sendHeight()` | none | Posts the current document height plus 40 px to the parent window when framed. |
| `updateFeedback()` | none | (Inner function of the copy handler) Temporarily replaces the copy button label with a success message. |

### `common.js` Event Listeners

| Target | Event | Effect |
|---|---|---|
| `#darkModeToggle` | `click` | Toggles theme. |
| `window` | `message` | Applies a theme pushed from the parent wrapper. |
| `window` | `resize` | Re-sends iframe height. |
| `document` | `click`, `change` | Re-sends iframe height after 100 ms. |
| `#embedBtn` | `click` | Opens the embed modal. |
| `#modalClose` | `click` | Closes the embed modal. |
| `window` | `click` | Closes the modal when the backdrop is clicked. |
| `#copyEmbedCode` | `click` | Copies the embed snippet. |

### `main.js` Responsibilities

`main.js` renders `#app-root` through the translation function `t()` and manages: region selection and persistence, per-item status assignment and persistence, the five-counter bar, tab switching and filtering, the binder index table, the studio name field, reset with confirmation, and the print action.

---

## Integration Guide

### Standalone Use

Open the live URL directly:

```
https://poliinternational.com/tools/studio-compliance-checklist/
```

No installation, account, or server is required. All state stays in the visitor's browser.

### Iframe Embedding

The tool ships with a built-in embed generator. Clicking the "Free Embed" button opens a modal containing a ready-to-copy snippet:

```html
<iframe src="https://poliinternational.com/tools/studio-compliance-checklist/index.html" width="100%" height="800" frameborder="0" style="border:0; border-radius:12px;"></iframe>
```

When embedded, the built-in iframe content hider automatically suppresses the header, footer, breadcrumbs, discovery map, feedback sections, related tools, share cards, support cards, dark mode toggle, and global footer so only the checklist is visible. The embedded page also posts its height to the parent so the host can resize the frame, and accepts a `theme` value via `postMessage` from the parent.

### Dependencies

The tool is dependency-free static HTML, CSS, and JavaScript. It loads no external libraries, fonts, or CDNs. The only cross-origin behavior is the optional `postMessage` handshake with a parent wrapper.

---

## Customization

- **Language:** The header language selector switches among English, Deutsch, Español, Français, Italiano, Português, and Nederlands. Strings are sourced from `i18n.js` and resolved through `t()`.
- **Region:** The jurisdiction selector switches the authority and standard references among the UK, EU, US, and Australia datasets in `database.js`.
- **Theme:** The dark mode toggle switches between light and dark, and the choice persists in `localStorage` under the `theme` key. A parent wrapper can override the theme by posting `{ theme: "light" | "dark" }`.
- **Studio name:** The binder index cover sheet accepts a free-text studio name, persisted under `studio_inspection_readiness_studioname`.

---

## Performance

- No network requests after initial page load; all data is bundled in `i18n.js` and `database.js`.
- No build step, bundler, or runtime framework.
- Rendering is direct DOM manipulation into `#app-root`.
- The `MutationObserver` in `common.js` re-sends iframe height on DOM changes, which keeps embedded layouts correct at the cost of a `postMessage` per mutation batch.
- State reads and writes are limited to `localStorage`, which is synchronous and fast for the small payloads involved.

---

## Browser Compatibility

- Uses standard DOM APIs (`querySelector`, `classList`, `addEventListener`, `MutationObserver`).
- Uses `navigator.clipboard.writeText` with a fallback to `document.execCommand('copy')` for older browsers.
- Uses `localStorage` inside `try/catch` blocks so restricted iframe contexts degrade gracefully rather than throwing.
- `MutationObserver` usage is guarded by a `typeof` check.
- No transpilation or polyfills are included; the tool targets modern evergreen browsers.

---

## Security

- **No server transmission:** All user input stays in `localStorage` on the visitor's device. Nothing is sent to Poli International or any external server.
- **Input handling:** The tool loads a shared `/js/input-guards.js` script in the head, which provides input sanitization guards for the page.
- **Embed snippet construction:** The embed URL is assembled at runtime from a split scheme prefix and the domain constant rather than a literal string, avoiding prohibited literal URL patterns in source.
- **Iframe isolation:** The content hider only activates when the page is framed, and it hides chrome elements rather than altering application logic.
- **No authentication or user accounts:** There is no login, no cookies for identity, and no central database.

---

## Version History

### 1.0.0

- Initial release of the Studio Inspection Readiness Checklist.
- Twenty inspection items across eight work areas.
- Four regional jurisdictions: United Kingdom, European Union, United States, Australia.
- Seven UI languages: English, Deutsch, Español, Français, Italiano, Português, Nederlands.
- Status tracking with Ready, Not yet, and Not applicable states, plus a not-checked default.
- Five-counter preparation bar.
- Items-to-prepare filtered view.
- Printable binder index with studio name, region, date, and sign-off lines.
- Reset-all-statuses with confirmation.
- Dark and light theme with persistence.
- Free iframe embed generator with copy-to-clipboard.
- Localized documentation pages in seven languages.

---

## Support / Contact

For questions, bug reports, or integration help, contact:

**support@poliinternational.com**

This tool is provided for internal preparation only and does not constitute a legal guarantee of compliance. Always verify your studio requirements with your local licensing authority.
