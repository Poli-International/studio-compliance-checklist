# Studio Inspection Readiness Checklist

> **A professional preparation checklist and inspection binder index for body art studios (tattooing and body piercing) across the UK, EU, US, and Australia. Tracks evidence locations for health and safety inspections.**

Part of the free professional tools published by Poli International for tattoo artists, piercers, and studio owners. Runs entirely client-side in the browser with zero server data storage.

---

## Overview

The Studio Inspection Readiness Checklist enables studio owners and managers to prepare systematically for regulatory health, hygiene, and biosecurity inspections. It does not calculate arbitrary "compliance scores", issue passes or fails, or store records. Instead, it provides a practical preparation matrix of what inspectors typically ask to see in each jurisdiction, where evidence should be kept, and direct links to specialized Poli tools that maintain those records.

### Key Capabilities

1. **Jurisdiction-Specific Regulatory Context**:
   - **United Kingdom**: Regulated by Local Authority Environmental Health Officers (EHOs) under the Local Government (Miscellaneous Provisions) Act 1982, London Local Authorities Act 1991, Health and Safety at Work etc. Act 1974, and local byelaws.
   - **European Union**: Regulated by Member State public health inspectorates enforcing national sanitation decrees, European standards (EN 1811, EN 13060, EN 13727), and EU REACH Annex XVII (Regulation (EU) 2020/2081 on tattoo inks).
   - **United States**: Regulated by municipal/county public health departments under state body art administrative codes and OSHA Bloodborne Pathogens standard (29 CFR 1910.1030).
   - **Australia**: Regulated by State and Territory public health directorates and local council EHOs enforcing public health and skin penetration legislation.
   - **Local Authority Nuance**: Explicitly advises studios that body art licensing is administered locally, noting when rules vary by council, county, or municipality.

2. **Preparation Status, Not Scores**:
   - Replaces compliance scores and percentages with a preparation checklist.
   - Every item carries an actionable status: **Ready**, **Not Yet**, or **Not Applicable**.
   - Dedicated "Items Still to Prepare" view filtering only items requiring action before inspection day.

3. **Eight Comprehensive Inspection Groups**:
   - Group 1: Hand Hygiene & Personal Protective Equipment (PPE)
   - Group 2: Work Surfaces & Decontamination
   - Group 3: Sterilisation, Autoclave Verification & Packaging
   - Group 4: Sharps Safety & Clinical Waste Management
   - Group 5: Staff Training & Exposure Control
   - Group 6: Client Records, Informed Consent & Age Verification
   - Group 7: Premises Layout & Environmental Controls
   - Group 8: Product Traceability, Tattoo Inks & Jewellery Standards (ASTM F-136 titanium, BioFlex® body jewelry)

4. **Printable Inspection-Day Binder Index**:
   - Clean, tabular index formatted for physical print (`window.print()`).
   - Lists every item, its designated evidence location, and a blank column for the date last checked and staff initials.

5. **Integrated Poli Evidence Tool Links**:
   - Links directly to specialized record-keeping tools:
     - **Autoclave Calculator**: Cycle logging and steam sterilisation parameter tracking.
     - **Sharps Disposal Tracker**: Puncture-resistant container audits and waste carrier consignment notes.
     - **BBP Training Tracker**: Bloodborne pathogen certificate renewals and training records.
     - **Consent Form Builder**: Client medical history, procedural consent, and age verification retention.

6. **Full Internationalization (i18n)**:
   - Full support for 7 languages: English (`en`), German (`de`), Spanish (`es`), French (`fr`), Italian (`it`), Portuguese (`pt`), and Dutch (`nl`).
   - Synchronous dictionary loader ensuring immediate rendering with zero untranslated key fallbacks.

7. **Browser-Only Privacy**:
   - All checklist statuses are saved exclusively in browser `localStorage`.
   - Zero telemetry, zero analytics, zero external network requests.
   - One-click "Reset All" button to clear local checklist entries.

---

## Running Locally

### Prerequisites
- Node.js (version 20 or higher)

### Setup & Execution
```bash
# Install dependencies
npm install

# Start local server on port 3000
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## Embedding in an External Site

Studio owners can embed this tool on internal studio portals or public sites using the following standard snippet:

```html
<iframe src="https://poliinternational.com/tools/studio-compliance-checklist/index.html" width="100%" height="800" frameborder="0" style="border:0; border-radius:12px;"></iframe>
```

---

## Documentation

- [User Guide (7 Languages)](docs/USER-GUIDE.md)
- [Technical Documentation](docs/TECHNICAL-DOCS.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [License](LICENSE)

---

## Legal & Regulatory Disclaimer

This checklist is an internal operational preparation guide and does not constitute official legal advice, a regulatory assessment, or a guarantee of compliance. Body art regulations are set and enforced by local, state, and national authorities. Studios must verify all requirements with their local licensing authority or Environmental Health department.
