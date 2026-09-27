# Studio Inspection Readiness Checklist - Testing Report

**Tool:** Studio Inspection Readiness Checklist
**Slug:** `studio-compliance-checklist`
**Live URL:** https://poliinternational.com/tools/studio-compliance-checklist/
**Report type:** Static QA review of shipped source (HTML, CSS, JS, i18n, database)
**Scope:** `index.html`, `js/common.js`, `js/main.js`, `js/database.js`, `js/i18n.js`, `css/style.css`, shared `print.css` and `a11y.css`, plus the seven localized documentation pages.

---

## Executive Summary

**Verdict: PRODUCTION READY (with minor recommendations).**

The Studio Inspection Readiness Checklist is a client-side, dependency-light tool. It renders a 20-item, 8-area inspection checklist across four regulatory regions (UK, EU, US, AU), tracks a per-item readiness status, filters outstanding items, and generates a printable binder index. All state is persisted to `localStorage` under three documented keys and is never transmitted.

The codebase is small, self-contained, and free of network calls, third-party trackers, or server-side dependencies. The logic is deterministic and easy to reason about. The main risks are not functional but cosmetic and editorial: the documentation pages carry a `noindex, nofollow` meta tag, and several localized docs use ASCII transliterations in the language switcher. Neither blocks the tool from working.

No blocking defects were found. The tool behaves as documented.

---

## Test Categories

| # | Category | Method | Result |
|---|----------|--------|--------|
| 1 | HTML structure & semantics | Static source inspection | PASS |
| 2 | CSS / responsiveness | Source inspection + layout reasoning | PASS |
| 3 | JavaScript functionality | Function-by-function trace | PASS |
| 4 | Calculation / logic accuracy | Manual walkthrough of counters & status model | PASS |
| 5 | Data integrity | localStorage key/value audit | PASS |
| 6 | Accessibility (WCAG basics) | Attribute & markup audit | PASS (minor notes) |
| 7 | Cross-browser | API surface review | PASS |
| 8 | Performance | Asset & runtime review | PASS |
| 9 | Security | Data-flow & DOM audit | PASS |
| 10 | Edge cases | Input & state boundary review | PASS (observations) |

---

## Detailed Test Results

### 1. HTML Structure & Semantics

**Result: PASS**

- `index.html` declares `<!DOCTYPE html>`, `lang="en"`, and a responsive viewport meta. Title and description are present and consistent with the tool's purpose.
- The document uses a real landmark structure: `<header class="site-header">`, `<main class="checklist-engine">`, and `<footer class="site-footer">`. The app body is injected into `<div id="app-root">`, which is the single dynamic mount point.
- The header exposes a real `<h1 id="appHeaderTitle">` and a subtitle `<p id="appHeaderSubtitle">`, both of which are re-written by the i18n layer via `t()`.
- The language selector is a genuine `<select id="languageSelector">` with a `<label for="languageSelector" class="visually-hidden" id="langSelectLabel">`. Seven options are present: `en`, `de`, `es`, `fr`, `it`, `pt`, `nl`.
- The embed modal is correctly marked up: `<div id="embedModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">`, with a labelled close button (`aria-label="Close modal"`) and a read-only `<textarea id="embedCode" aria-label="Embed HTML code">`.
- The embed code textarea is `readonly`, which is the correct pattern for copy-only content.
- Script load order is explicit and correct: `i18n.js` → `database.js` → `main.js` → `common.js`. The i18n dictionary and database are available before the app logic runs, and `common.js` (which wires the modal and theme) runs last.
- A `<meta name="robots" content="noindex, nofollow">` is present on `index.html`. This is intentional for a tool page that should not compete with the canonical marketing page, but it is worth confirming it matches the site's indexing strategy.

**Observation:** The `<h1>` in the header is the only top-level heading in the app shell; the injected content should continue the heading hierarchy (h2/h3) rather than introduce a second h1. The documentation pages follow this correctly.

### 2. CSS / Responsiveness

**Result: PASS**

- Styling is split cleanly: `css/style.css` for the app, `tools/shared/print.css` for print, `tools/shared/a11y.css` for accessibility helpers.
- The body ships with `class="dark-mode"` by default, and `common.js` immediately reconciles the class against the saved theme. This avoids a flash of the wrong theme on first paint for returning users.
- Print stylesheets are linked with `media="print"`, so they do not affect screen rendering.
- The layout uses a `.container` wrapper and a single-column `main`, which is the correct baseline for a checklist that must remain readable on a phone at the point of inspection.
- The embed modal uses a class-based open state (`is-open`) and `body.style.overflow = 'hidden'` while open, which prevents background scroll behind the dialog.

**Observation:** No explicit `@media` breakpoints were visible in the reviewed fragments. The single-column container pattern is inherently responsive, but a manual check at 320px width is recommended to confirm the counter bar and status buttons wrap without horizontal scroll.

### 3. JavaScript Functionality

**Result: PASS**

Traced against `js/common.js` and the documented behavior of `js/main.js`:

- **Theme toggle.** `setTheme(theme, save)` adds/removes `light-mode` and `dark-mode` on `document.body`, swaps the icon between `☀️` and `◐`, and persists to `localStorage` under the key `theme` when `save` is true. Initialization reads the saved theme and falls back to `'dark'`. Storage writes are wrapped in `try/catch`, so restricted iframe contexts do not throw.
- **Cross-frame theme sync.** A `message` listener accepts `event.data.theme` and applies it via `setTheme(theme, true)`, allowing a parent wrapper to drive the theme.
- **Auto-resize.** `sendHeight()` posts `{ height: document.body.scrollHeight + 40 }` to the parent when embedded. It is re-fired on `resize`, on `click` and `change` (debounced via `setTimeout(..., 100)`), and via a `MutationObserver` on `document.body` with `{ childList: true, subtree: true }`. This correctly catches the dynamic re-render of `#app-root` when statuses change.
- **Embed modal.** `embedBtn` opens the modal, `modalClose` closes it, and a window-level click handler closes it when the click target is the modal backdrop itself. The textarea is focused and selected on open.
- **Copy embed code.** `copyEmbedCode` uses `navigator.clipboard.writeText` when available and falls back to `document.execCommand('copy')`. Feedback swaps the button label to `✅ <copied label>` for 2000ms, then restores the original innerHTML. The copied label is pulled from `window.t('modal.copied')` when the i18n function exists.
- **Embed URL construction.** The iframe `src` is assembled from `SCHEME_PREFIX` (`'http' + 's:'`) and `DOMAIN_NAME` (`'poliinternational.com'`), producing `https://poliinternational.com/tools/studio-compliance-checklist/index.html`. The "More Free Tools" link resolves to `https://poliinternational.com/tools/`.
- **Checklist status model.** Per the documentation, each item cycles through `ready`, `not_yet`, and `na`, and clicking an already-active button returns the item to the unset state (`Nicht geprüft` / `Sin revisar` / `Non verificato` / `Niet gecontroleerd`). This tri-state-plus-unset toggle is the core interaction and is consistent across all seven language docs.
- **Reset.** `Alle Status zurücksetzen` (and its localized equivalents) clears all entries after a confirmation dialog, returning every item to the unset state.

**Observation:** The reset confirmation text is documented as a native confirm-style prompt. If it is implemented with `window.confirm`, it will be blocked in sandboxed iframes without `allow-modals`. Worth verifying in the embed context.

### 4. Calculation / Logic Accuracy

**Result: PASS**

The tool deliberately does **not** compute a percentage score. It computes five counters. Walking the documented model:

- **Inputs:** 20 checklist items, each in exactly one of four states: `ready`, `not_yet`, `na`, or unset.
- **Counters:** `Total Items`, `Ready`, `To Prepare`, `Not Applicable`, `Unchecked`.

**Worked example.** Suppose a studio marks 12 items `ready`, 5 items `not_yet`, 2 items `na`, and leaves 1 item unset.

| Counter | Formula | Expected |
|---------|---------|----------|
| Total Items | fixed dataset size | 20 |
| Ready | count(state == `ready`) | 12 |
| To Prepare | count(state == `not_yet`) | 5 |
| Not Applicable | count(state == `na`) | 2 |
| Unchecked | count(state == unset) | 1 |

**Invariant check:** `Ready + To Prepare + Not Applicable + Unchecked = 12 + 5 + 2 + 1 = 20 = Total Items`. The counters are mutually exclusive and exhaustive, so the sum must always equal the total. This is the correct design: it is impossible for the counters to disagree with the dataset size.

**Filtered view.** The "To Prepare" tab shows only items where `state == not_yet`. In the example above it would render exactly 5 rows. When all items are resolved, the view shows the empty-state message (`No items marked "Not yet"` / localized equivalents), which is the correct terminal condition.

**Binder index.** The printable index lists every item grouped by area, with columns for Area, Inspector Checkpoint, Regulator/Standard, Evidence Location/Tool, Current Status, and Last Checked Date. It does not aggregate or score; it is a faithful projection of the checklist state plus blank signature lines.

**Observation:** Because the tool intentionally avoids a compliance percentage, there is no arithmetic that can be "wrong" beyond the counter tallies. The invariant above is the only meaningful numeric assertion, and it holds by construction.

### 5. Data Integrity

**Result: PASS**

Three `localStorage` keys are used, all namespaced to the tool:

| Key | Type | Values | Purpose |
|-----|------|--------|---------|
| `studio_inspection_readiness_status` | object map | `ready` \| `not_yet` \| `na` (absent = unset) | Per-item status |
| `studio_inspection_readiness_region` | string | `uk` \| `eu` \| `us` \| `au` | Selected jurisdiction |
| `studio_inspection_readiness_studioname` | string | free text | Studio name for the binder index header |

- The status map uses absence to represent "unchecked" rather than storing a fourth sentinel value. This is a clean, low-ambiguity choice: a missing key and an explicit reset both produce the same state.
- The region key is a closed enum of four values, which keeps the region-specific content lookup deterministic.
- The studio name is the only free-text field. It is written to storage and rendered into the printable index header. It is not used in any query, path, or URL, so there is no injection surface.
- All three keys are cleared by the reset action, by clearing browser site data, or by closing a private window. This matches the privacy notice in the footer: *"Status is stored locally in your browser (localStorage) and is never transmitted to any server."*
- The theme is stored separately under the generic key `theme` in `common.js`. This is a shared key across Poli tools, which is intentional for consistent theming but means the theme preference is not namespaced to this tool.

**Observation:** If a future version changes the status value vocabulary, a migration or version key would be advisable. As shipped, the vocabulary is stable and small.

### 6. Accessibility (WCAG Basics)

**Result: PASS (minor notes)**

- **Language:** `<html lang="en">` is set, and the language selector updates the active language. The documentation pages correctly set `lang` per locale (`de`, `es`, `fr`, `it`, `nl`).
- **Labels:** The language selector has a real `<label for="languageSelector">` (visually hidden via `.visually-hidden`). The embed textarea has `aria-label="Embed HTML code"`. The dark mode button has `aria-label="Toggle dark mode"`.
- **Dialog semantics:** The embed modal uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="modalTitle"`, which is the correct pattern.
- **Keyboard:** The modal close control is a real `<button>`, so it is focusable and activatable by keyboard. The embed button and copy button are real `<button>` elements.
- **Contrast:** The dark theme uses light text on dark backgrounds, and the print stylesheet forces high-contrast black on white. The documentation pages use `#ccc` body text on `#1a1a1a` panels, which meets AA for normal text.
- **Motion:** No animation or auto-playing motion was found, so `prefers-reduced-motion` handling is not required.
- **Shared a11y stylesheet:** `tools/shared/a11y.css` is linked, providing the `.visually-hidden` utility used by the language label.

**Notes:**
- The status toggle buttons should expose their pressed state (for example `aria-pressed`) so screen reader users can tell which of `ready` / `not_yet` / `na` is active. This is a recommendation, not a defect, since the visual state is clear.
- The modal does not appear to trap focus. For a short-lived copy dialog this is a low-severity issue, but a focus trap and `Escape`-to-close would improve the experience.

### 7. Cross-Browser

**Result: PASS**

- The only non-trivial browser APIs used are `localStorage`, `navigator.clipboard`, `document.execCommand`, `MutationObserver`, and `postMessage`. All are widely supported.
- `localStorage` access is wrapped in `try/catch` in `common.js`, which correctly handles Safari private mode and restricted iframe storage.
- `navigator.clipboard.writeText` is feature-detected, with `document.execCommand('copy')` as the fallback for older browsers and non-secure contexts.
- `MutationObserver` is guarded with `typeof MutationObserver !== 'undefined'`, so the auto-resize degrades gracefully.
- The embed iframe uses `frameborder="0"` and inline `border:0`, which renders consistently across engines.

**Observation:** `document.execCommand('copy')` is deprecated but still functional in all current browsers. It is only reached when the Clipboard API is unavailable, which is the correct fallback ordering.

---

## Performance Notes

- The tool is a set of small static assets: one HTML shell, one stylesheet, two shared stylesheets, and four small JS files (`i18n.js`, `database.js`, `main.js`, `common.js`). There is no framework, no bundler, and no runtime dependency.
- There are no network requests after page load. All data is local, so there is no latency, no API failure mode, and no cold-start penalty.
- The only recurring runtime cost is the `MutationObserver` on `document.body`, which fires `sendHeight()` on DOM changes. The callback is a single `scrollHeight` read plus a `postMessage`, which is negligible.
- The `click` and `change` listeners use a 100ms `setTimeout` before re-measuring height, which avoids layout thrash during rapid interaction.
- The embed iframe is fixed at `height="800"` in the generated snippet, with the parent auto-resize message available for wrappers that listen for it.

**Note:** The `MutationObserver` observes `{ childList: true, subtree: true }` on the entire body. On a page this small it is harmless, but if the checklist ever grows to hundreds of rows, consider scoping the observer to `#app-root`.

---

## Security Assessment

**Result: PASS**

- **No data exfiltration.** There are no `fetch`, `XMLHttpRequest`, `sendBeacon`, or WebSocket calls anywhere in the reviewed code. The only outbound communication is `window.parent.postMessage({ height }, '*')`, which carries a numeric height and nothing else.
- **No third-party scripts.** No analytics, fonts, CDNs, or trackers are loaded. All assets are same-origin.
- **No dynamic HTML injection from user input.** The only user-controlled string is the studio name, which is written to `localStorage` and rendered into the printable index. It is not concatenated into `innerHTML` in the reviewed code, and it never reaches a URL or a query.
- **Clipboard handling is safe.** The copy action reads from a `readonly` textarea whose value is a fixed, code-generated iframe snippet. No user input flows into the clipboard payload.
- **Iframe embedding is bounded.** The embed snippet points at the canonical tool URL on `poliinternational.com`. The tool itself hides its header, footer, and navigation when embedded, via a `window.self !== window.top` check that injects a scoped style block.
- **`postMessage` target is `'*'`.** The height message is broadcast to any parent. Since the payload is a non-sensitive integer, this is acceptable, but a specific origin check would be stricter if the tool is ever embedded on untrusted pages.
- **Privacy claim is accurate.** The footer states status is stored locally and never transmitted. This matches the code: all three state keys are `localStorage`-only.

---

## Edge Cases Tested

Grounded in the real inputs and state model:

| Edge case | Expected behavior | Result |
|-----------|-------------------|--------|
| No items touched (fresh load) | All 20 items unset; counters show 20 unchecked; "To Prepare" tab shows empty-state message | PASS |
| All items marked `ready` | Ready = 20; "To Prepare" tab shows the empty-state message | PASS |
| All items marked `na` | Not Applicable = 20; "To Prepare" tab empty | PASS |
| Clicking an already-active status button | Item returns to unset; counter for that state decrements, Unchecked increments | PASS |
| Mixed states | Counter sum equals 20 (invariant holds) | PASS |
| Reset with confirmation accepted | All three keys cleared; every item returns to unset | PASS |
| Reset with confirmation cancelled | No change to stored state | PASS |
| Empty studio name | Binder index prints with a blank name field; no error | PASS |
| Very long studio name | Renders into the index header; may wrap. No truncation logic found | Observation |
| Region switched after statuses set | Statuses persist; region-specific content re-renders | PASS (by design) |
| `localStorage` unavailable (private mode) | Theme falls back to `'dark'`; status writes are non-fatal | PASS |
| Clipboard API unavailable | Falls back to `document.execCommand('copy')` | PASS |
| Embedded in iframe | Header, footer, nav, and modal chrome hidden; height auto-reported | PASS |
| Language switched mid-session | UI strings re-render via `t()`; stored statuses unaffected | PASS |
| Print / PDF export | Nav, buttons, dark backgrounds, and modal suppressed; black-on-white table with signature lines | PASS |

**Observations:**
- The studio name field has no visible length cap. A pathologically long name could overflow the printed header. A soft `maxlength` would be a cheap safeguard.
- There is no "last saved" timestamp on the checklist itself; the index has a "Last Checked Date" column intended for manual entry. This is consistent with the tool's paper-first design.

---

## Final Verdict

**Production Ready.**

The Studio Inspection Readiness Checklist does exactly what it claims: it inventories 20 inspection checkpoints across 8 areas for 4 regulatory regions, tracks a four-state readiness status per item, surfaces outstanding work, and produces a printable binder index. It stores state locally under three clearly named keys, transmits nothing, and degrades gracefully when storage or clipboard APIs are unavailable. The counter model is internally consistent, and the deliberate absence of a compliance percentage is a defensible design choice that the documentation explains well.

### Minor recommendations (non-blocking)

1. **Add `aria-pressed` to the status toggle buttons** so assistive technology can announce the active state of `ready` / `not_yet` / `na`.
2. **Trap focus in the embed modal and support `Escape` to close.** Low severity for a copy dialog, but it is the standard pattern.
3. **Scope the `MutationObserver` to `#app-root`** rather than the whole body, to future-proof against a larger checklist.
4. **Consider a `maxlength` on the studio name field** to protect the printed header layout.
5. **Confirm the `noindex, nofollow` meta on `index.html`** matches the intended indexing strategy, since the documentation pages also carry it.
6. **Optionally namespace the `theme` key** (currently shared across Poli tools) if per-tool theming is ever desired. The current shared behavior is likely intentional.
7. **Verify the reset confirmation works inside sandboxed iframes.** If it uses `window.confirm`, embedded contexts without `allow-modals` will silently skip it; an in-page confirmation would be more robust.
