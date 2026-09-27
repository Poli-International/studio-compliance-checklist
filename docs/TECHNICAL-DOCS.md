# Studio Inspection Readiness Checklist - Technical Documentation

## Architecture Overview

The Studio Inspection Readiness Checklist is a client-side single-page web application served via a minimal Node.js Express server (`server.js`). It requires zero external network calls and adheres strictly to a Content Security Policy of `script-src 'self'`.

### Technology Stack
- **Server**: Node.js with Express (`server.js`) on port 3000 (`0.0.0.0`)
- **Document Entry**: Semantic HTML5 (`index.html`)
- **Styling**: Pure CSS3 (`css/style.css`) with light and dark mode CSS custom properties and print stylesheets (`@media print`)
- **Data & Internationalization**: Plain JavaScript dictionaries (`js/i18n.js`) and checklist definitions (`js/database.js`) loaded synchronously
- **Application Engine**: Vanilla JavaScript (`js/main.js`) handling dynamic DOM rendering, state management, and tab routing
- **Common Utilities**: Theme persistence, parent iframe auto-resizing via `postMessage`, and embed modal handling (`js/common.js`)
- **Persistence**: Browser `localStorage` wrapped in defensive `try/catch` blocks

---

## File Structure

```
.
├── css/
│   └── style.css            # Light/Dark custom properties, responsive layout & print styles
├── docs/
│   ├── TECHNICAL-DOCS.md    # Architecture and data structure documentation
│   └── USER-GUIDE.md        # Studio operational guide in 7 languages
├── images/
│   └── Poli-International-Co.webp  # Brand logo asset
├── js/
│   ├── i18n.js              # Complete 7-language translation dictionaries (en, de, es, fr, it, pt, nl)
│   ├── database.js          # Checklist items, groups, regions, and evidence mappings
│   ├── main.js              # State tracking, view rendering, filtering, and print preparation
│   └── common.js            # Theme toggle, iframe postMessage handshake, and embed modal
├── index.html               # Main application entry point
├── package.json             # Manifest declaring engines (Node >= 20) and dependencies
├── package-lock.json        # Pinned dependency lockfile
├── server.js                # Minimal Node.js HTTP server
├── CONTRIBUTING.md          # Project contribution guidelines
├── LICENSE                  # MIT License
└── README.md                # Project introduction and overview
```

---

## Data Model & Schemas

### 1. Regions (`REGIONS` in `js/database.js`)
Supported jurisdictions:
- `uk`: United Kingdom (Local Authority Environmental Health Officers)
- `eu`: European Union (Member State public health inspectorates)
- `us`: United States (County/City public health departments & OSHA)
- `au`: Australia (State/Territory public health authorities & Council EHOs)

Each region entry contains:
- `id`: Unique region string identifier
- `nameKey`: i18n translation key for the region name
- `noteKey`: i18n translation key detailing the regulatory authority framework

### 2. Checklist Groups (`GROUPS` in `js/database.js`)
Eight operational inspection groups:
1. `hand_hygiene_ppe`: Hand Hygiene and PPE
2. `surfaces_disinfection`: Work Surfaces and Decontamination
3. `sterilisation`: Sterilisation and Autoclave Verification
4. `sharps_waste`: Sharps Safety and Waste Management
5. `staff_training`: Staff Training and Exposure Control
6. `client_records`: Client Records and Consent
7. `premises`: Premises Layout and Sanitation
8. `products`: Product Quality and Traceability

### 3. Checklist Items (`CHECKLIST_ITEMS` in `js/database.js`)
Each item represents an inspection topic and defines:
- `id`: Unique identifier (e.g. `g1_sink`, `g3_autoclave_logs`, `g8_jewellery_cert`)
- `group`: Associated group ID (1 through 8)
- `evidenceToolSlug`: Slug of the dedicated Poli record-keeping tool, or `null` if kept physically
- `evidenceTypeKey`: i18n key describing the physical or digital evidence record

Jurisdiction-specific text for each item is resolved through `js/i18n.js`:
- `item.<id>.topic`: Core topic title
- `item.<id>.ask.<region>`: What the inspector asks to see in that region
- `item.<id>.auth.<region>`: The specific regulatory body or standard setting the requirement

---

## State Management

Checklist readiness status is maintained client-side in `localStorage`:
- `studio_inspection_readiness_region`: Current selected region (`uk`, `eu`, `us`, `au`)
- `studio_inspection_readiness_status`: JSON object mapping item ID to status (`ready`, `not_yet`, `na`)
- `studio_inspection_readiness_studioname`: Studio name string for the inspection binder header
- `poli_tools_language`: User language selection (`en`, `de`, `es`, `fr`, `it`, `pt`, `nl`)
- `theme`: Theme preference (`dark` or `light`)

All storage accesses are wrapped in defensive `try/catch` handlers to safeguard against private browsing sandboxes or restricted iframe constraints.

---

## Evidence Tool Integration

Items requiring ongoing logs link directly to Poli International's companion tools:
- **Autoclave Calculator**: `https://poliinternational.com/autoclave-calculator/`
- **Sharps Disposal Tracker**: `https://poliinternational.com/sharps-disposal-tracker/`
- **BBP Training Tracker**: `https://poliinternational.com/bbp-training-tracker/`
- **Consent Form Builder**: `https://poliinternational.com/form-builder/`

All outbound links open with `target="_top"` to break out of child iframe containers.

---

## Printable Inspection-Day Binder

The "Inspection Binder Index" view compiles all checklist items into a printable reference matrix:
- Header: Studio Name, Selected Jurisdiction, Inspection Date, and Inspector / Manager Initials.
- Table columns:
  1. Group / Section
  2. Checklist Topic
  3. Inspector Request (Jurisdiction-specific)
  4. Evidence Location (Physical Binder or Poli Tool)
  5. Current Status (Ready / Not Yet / N/A)
  6. Date Last Checked & Initials (Physical sign-off line)
- Print formatting (`@media print`):
  - Inverts dark backgrounds to clean high-contrast white.
  - Hides navigation bars, header action buttons, and control panels.
  - Page-break controls prevent orphan table rows.
