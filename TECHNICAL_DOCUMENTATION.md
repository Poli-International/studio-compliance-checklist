# Studio Compliance Auditor - Technical Documentation

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

### Technology Stack

The Studio Compliance Auditor is a client-side only web application built with:

- **HTML5** - Semantic markup and tab-based navigation
- **CSS3** - Custom stylesheets with dark/light mode support
- **Vanilla JavaScript (ES6)** - No frameworks, no external dependencies
- **Local Storage** - Theme persistence across sessions

### File Structure

```
/studio-compliance-checklist/
├── index.html                  # Main entry point, tab navigation, embed modal
├── documentation.html          # Full documentation page (loaded in iframe)
├── css/
│   ├── poli-standard.css       # Standard Poli styles (referenced but not provided)
│   └── style.css               # Tool-specific styles (referenced but not provided)
└── js/
    ├── database.js             # Compliance data definitions
    ├── main.js                 # Core application logic and rendering
    └── common.js               # Shared utilities (theme, embed, resize)
```

### Component / Logic Breakdown

| Component | File | Purpose |
|-----------|------|---------|
| Tab Navigation | `index.html` | Switches between Tool, Documentation, and Embed views |
| Compliance Database | `database.js` | Defines all audit categories, items, and weights |
| Application Renderer | `main.js` | Renders the checklist UI, handles user input, calculates scores |
| Report Generator | `main.js` | Generates and displays the compliance report modal |
| Theme Manager | `common.js` | Handles dark/light mode toggling and persistence |
| Embed Modal | `common.js` | Provides iframe embed code for external sites |
| Auto-Resizer | `common.js` | Sends height updates to parent iframe |

---

## Data Schemas

### Compliance Database (`COMPLIANCE_DATABASE`)

Defined in `database.js` as a constant array of category objects.

**Category Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique category identifier |
| `category` | string | Display name for the category |
| `icon` | string | Emoji icon for the category |
| `items` | array | Array of checklist item objects |

**Item Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique item identifier (e.g., "b1", "d3", "f5") |
| `text` | string | The compliance question text |
| `weight` | number | Integer weight value for scoring |

**Example Data:**

```javascript
const COMPLIANCE_DATABASE = [
    {
        id: "biosecurity",
        category: "Biosecurity & Infection Control",
        icon: "🔬",
        items: [
            { id: "b1", text: "Is there a designated hand-washing station in the procedure area?", weight: 10 },
            { id: "b2", text: "Are EPA-registered, hospital-grade disinfectants used on all surfaces?", weight: 10 },
            { id: "b3", text: "Are single-use, sterile gloves used for every procedure?", weight: 5 },
            { id: "b4", text: "Is there a sharp container located within arm's reach of the procedure area?", weight: 10 },
            { id: "b5", text: "Are all reusable tools processed through a validated autoclave cycle?", weight: 15 }
        ]
    },
    {
        id: "documentation",
        category: "Documentation & Legal",
        icon: "📝",
        items: [
            { id: "d1", text: "Is an informed consent form signed and archived for every client?", weight: 10 },
            { id: "d2", text: "Are sterilization logs maintained for every autoclave cycle?", weight: 10 },
            { id: "d3", text: "Are biological indicator (spore test) results archived weekly?", weight: 10 },
            { id: "d4", text: "Is there a bloodborne pathogen certificate on file for all staff?", weight: 5 },
            { id: "d5", text: "Are ink and jewelry batch certifications accessible for audit?", weight: 5 }
        ]
    },
    {
        id: "facility",
        category: "Facility Standards",
        icon: "🏢",
        items: [
            { id: "f1", text: "Is the procedure area physically separated from the waiting area?", weight: 5 },
            { id: "f2", text: "Are floors and walls constructed of non-porous, easy-to-clean materials?", weight: 5 },
            { id: "f3", text: "Is the studio free of animals (except service animals)?", weight: 5 },
            { id: "f4", text: "Is there adequate lighting in the procedure area?", weight: 2 },
            { id: "f5", text: "Is the sterilization room separate from the procedure area?", weight: 10 }
        ]
    }
];
```

### User Responses (`userResponses`)

Defined in `main.js` as a module-level object.

| Field | Type | Description |
|-------|------|-------------|
| `[itemId]` | boolean | `true` if checkbox is checked, `false` or `undefined` if unchecked |

**Example:**

```javascript
let userResponses = {
    "b1": true,
    "b2": false,
    "b3": true,
    // ... other item IDs
};
```

---

## Calculation / Logic Algorithms

### Score Calculation (`calculateScore()`)

Located in `main.js`. This function computes the weighted compliance score.

**Algorithm Steps:**

1. Initialize `totalPossible = 0` and `userTotal = 0`
2. Iterate through each category in `COMPLIANCE_DATABASE`
3. For each item in the category:
   - Add `item.weight` to `totalPossible`
   - If `userResponses[item.id]` is `true`, add `item.weight` to `userTotal`
4. Calculate percentage: `Math.round((userTotal / totalPossible) * 100)`
5. Return the integer percentage

**Formula:**

```
complianceScore = round((sum of checked item weights / sum of all item weights) × 100)
```

**Weight Distribution:**

| Category | Items | Total Weight |
|----------|-------|--------------|
| Biosecurity & Infection Control | 5 | 50 |
| Documentation & Legal | 5 | 40 |
| Facility Standards | 5 | 27 |
| **Total** | **15** | **117** |

### Status Determination (`showReport()`)

Located in `main.js`. Determines compliance status based on score.

| Score Range | Status | Color Variable |
|-------------|--------|----------------|
| 95%+ | COMPLIANT / EXCELLENCE | `var(--success)` |
| 80-94% | CONDITIONALLY COMPLIANT | `var(--warning)` |
| < 80% | CRITICAL FAILURE | `var(--error)` |

### Application Rendering (`renderApp()`)

Located in `main.js`. This function:

1. Calls `calculateScore()` to get current score
2. Builds HTML string containing:
   - Score header with percentage and visual progress bar
   - Compliance sections with checkboxes for each item
   - "Generate Official Report" button
3. Sets `appRoot.innerHTML` to the generated HTML
4. Attaches change event listeners to all checkboxes
5. Attaches click listener to the report button

### Report Generation (`showReport()`)

Located in `main.js`. This function:

1. Calls `calculateScore()` to get final score
2. Determines status based on score thresholds
3. Creates a modal overlay with:
   - Report title
   - Score percentage
   - Status text (color-coded)
   - Current date
   - Print and Close buttons
4. Inserts the modal into the DOM

---

## API Reference

### Public Functions

#### `calculateScore()`

- **Location:** `main.js`
- **Parameters:** None (reads from `userResponses` and `COMPLIANCE_DATABASE`)
- **Returns:** `number` - Integer percentage (0-100)
- **Behavior:** Computes weighted compliance score based on checked items

#### `renderApp()`

- **Location:** `main.js`
- **Parameters:** None
- **Returns:** `void`
- **Behavior:** Re-renders the entire application UI with current state

#### `showReport()`

- **Location:** `main.js`
- **Parameters:** None
- **Returns:** `void`
- **Behavior:** Generates and displays a compliance report modal

#### `new_Date()`

- **Location:** `main.js`
- **Parameters:** None
- **Returns:** `Date` object
- **Behavior:** Helper function that returns `new Date()` for report timestamp

### Event Handlers (in `common.js`)

#### Theme Toggle

- **Element:** `#darkModeToggle`
- **Event:** `click`
- **Behavior:** Toggles between dark and light mode, persists to `localStorage`

#### Embed Modal

- **Element:** `#embedBtn` or `#embed-button`
- **Event:** `click`
- **Behavior:** Opens embed modal with iframe code

#### Copy Embed Code

- **Element:** `#copyEmbedCode`
- **Event:** `click`
- **Behavior:** Copies embed code to clipboard, shows confirmation

#### Auto-Resize

- **Element:** `window`
- **Event:** `resize`, `click`, `change`
- **Behavior:** Sends height updates to parent iframe via `postMessage`

---

## Integration Guide

### Standalone Embedding

The tool can be embedded in any website using an iframe:

```html
<iframe 
    src="https://poliinternational.com/tools/studio-compliance-checklist/index.html" 
    width="100%" 
    height="1200" 
    frameborder="0" 
    style="border-radius:12px;">
</iframe>
```

### Embed Code (from tool UI)

The tool provides a pre-generated embed code in the "Embed Code" tab. Users can copy it directly from the tool interface.

### Dependencies

The tool is **dependency-free**. It uses only:
- Vanilla JavaScript (ES6)
- HTML5
- CSS3

No external libraries, frameworks, or CDN resources are required.

### Iframe Communication

The tool sends height updates to the parent window via `postMessage`:

```javascript
window.parent.postMessage({ height: document.body.scrollHeight + 50 }, '*');
```

This allows the iframe to auto-resize based on content.

### Theme Support

The tool listens for theme messages from the parent window:

```javascript
window.addEventListener('message', function(event) {
    if (event.data && event.data.theme) {
        setTheme(event.data.theme, true);
    }
});
```

---

## Customization

### Modifying Compliance Items

To add, remove, or modify compliance items, edit the `COMPLIANCE_DATABASE` array in `js/database.js`:

```javascript
// Example: Add a new item to the Biosecurity category
{
    id: "biosecurity",
    category: "Biosecurity & Infection Control",
    icon: "🔬",
    items: [
        // ... existing items
        { id: "b6", text: "Are all surfaces disinfected between clients?", weight: 8 }
    ]
}
```

### Changing Weights

Adjust the `weight` values in `database.js` to change scoring impact. Higher values increase the item's contribution to the final score.

### Visual Customization

- **CSS:** Edit `css/style.css` for tool-specific styles
- **Theme Colors:** Modify CSS custom properties in `poli-standard.css`

---

## Performance

- **Bundle Size:** Minimal - three small JavaScript files and two CSS files
- **Rendering:** Full re-render on every checkbox change (acceptable for small dataset of 15 items)
- **Memory:** No memory leaks; all data is stored in simple JavaScript objects
- **Network:** Zero external requests after initial page load

---

## Browser Compatibility

The tool uses standard ES6 features and should work in:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 49+ |
| Firefox | 52+ |
| Safari | 10+ |
| Edge | 14+ |
| Opera | 36+ |

**Note:** Internet Explorer is not supported due to ES6 syntax and `postMessage` usage.

---

## Security

### Input Handling

- All user input is limited to checkbox toggles (boolean values)
- No text input fields exist in the tool
- No form submissions or data transmission

### XSS Prevention

- The tool uses `innerHTML` for rendering, but all dynamic content is:
  - Pre-defined strings from `COMPLIANCE_DATABASE`
  - Numeric values from `calculateScore()`
  - Boolean states from `userResponses`
- No user-supplied text is ever rendered in the DOM

### Data Privacy

- All data remains client-side only
- No data is sent to any server
- No cookies are used
- Only `localStorage` is used for theme preference

### Iframe Security

- The tool sets `document.documentElement.setAttribute('data-theme', 'dark')` when loaded in an iframe
- It listens for `postMessage` events only from trusted sources

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial release with 3 compliance categories, 15 checklist items, weighted scoring, and report generation |

---

## Support / Contact

For technical support, feature requests, or custom integration assistance:

- **Email:** support@poliinternational.com
- **Contact Form:** https://poliinternational.com/contact-us/
- **Tool URL:** https://poliinternational.com/tools/studio-compliance-checklist/

---

*Documentation generated from source code version 1.0.0*
