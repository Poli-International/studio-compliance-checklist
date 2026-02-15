# Studio Compliance Checklist & Health Auditor

> **Professional health, safety, and administrative auditor for tattoo and piercing studios.**

[![License](https://img.shields.io/github/license/Poli-International/studio-compliance-checklist)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Poli-International/studio-compliance-checklist)](https://github.com/Poli-International/studio-compliance-checklist/commits/main)
[![GitHub Stars](https://img.shields.io/github/stars/Poli-International/studio-compliance-checklist?style=social)](https://github.com/Poli-International/studio-compliance-checklist/stargazers)

**Live Tool:** [https://poliinternational.com/studio-compliance-checklist/](https://poliinternational.com/studio-compliance-checklist/)

---

## 📋 Overview

The **Studio Compliance Checklist** is a rigorous internal auditing tool designed to help studio owners verify their adherence to global biosecurity, legal, and operational standards. It provides a data-driven "Compliance Score" and generates official reports for health authority preparation.

### Key Features

1. **🔬 Biosecurity Audit**
   - Verification of infection control protocols.
   - Autoclave validation and spore testing frequency checks.
   - PPE and surface decontamination standards.

2. **📝 Legal & Administrative Verification**
   - Consent form archiving and informed choice verification.
   - staff certification tracking (Bloodborne Pathogens, First Aid).
   - Compliance with GDPR/HIPAA for digital client records.

3. **🏢 Facility Standards Tracker**
   - Analysis of procedure area separation.
   - Surface porosity and environmental health checks.
   - Storage and waste management auditing.

4. **📈 Dynamic Scoring & Reports**
   - Weighted scoring based on critical safety risks.
   - Real-time compliance visualization.
   - Printable **Official Audit Report** for internal records.

---

## 🔧 Technical Logic & Algorithms

### Weighted Compliance Scoring

The engine uses a weighted scoring algorithm where critical biosecurity items carry significantly more mass than administrative items:

```javascript
totalPossible = Σ(itemWeights)
userTotal = Σ(checkedItemWeights)
complianceScore = (userTotal / totalPossible) * 100
```

#### Weight Distribution Examples:
- **Biosecurity (Critical):** Validated Autoclave Cycle (Weight: 15)
- **Legal (Major):** Signed Consent Forms (Weight: 10)
- **Facility (Standard):** Adequate Lighting (Weight: 2)

#### Compliance Thresholds:
- **95%+:** COMPLIANT / EXCELLENCE (Green)
- **80-94%:** CONDITIONALLY COMPLIANT (Yellow)
- **< 80%:** CRITICAL FAILURE (Red)

---

## 📁 File Structure

```
studio-compliance-checklist/
├── index.html              # Main audit interface
├── css/
│   └── style.css          # Professional clinical aesthetic
├── js/
│   ├── database.js        # Compliance standards and weights
│   ├── main.js            # Scoring engine and report generator
│   └── common.js          # Unified theme & embed logic
└── images/
    └── Poli-International-Co.webp  # Brand Identity
```

---

## 🚀 Deployment & Usage

### Live Production
This tool is integrated into the Poli International ecosystem via the **Poli Core System**. It features full synchronization with the site-wide dark mode and scientific wiki links.

### Standalone Embed
To use this tool on your own studio website, use the following iframe:

```html
<iframe src="https://poliinternational.com/wp-content/standalone-tools/studio-compliance-checklist/index.html" 
        width="100%" 
        height="1200" 
        frameborder="0" 
        style="border-radius: 12px; border: 1px solid #0693e3;">
</iframe>
```

---

## 🎨 Branding & Standards

- **Theme:** Streetwise / Clinical Dark Mode (Primary: #0693e3, Success: #10b981)
- **Naming:** BEM (Block Element Modifier)
- **SEO Keywords:** Tattoo studio audit, piercing health standards, studio compliance checklist, infection control for tattooers, bloodborne pathogen compliance.

---

## 👨‍💻 Credits

**Built by:** Claude Code Agent System (opencode)
**Client:** Poli International
**Scientific Foundation:** [Legal & Compliance Standards Wiki](https://poliinternational.com/wp-content/standalone-tools/standards/legal-compliance-standards.html)

---

## 📧 Contact & Support

**Technical Support:** [patrick@poli-international.com](mailto:patrick@poli-international.com)
**Support Innovation:** [Buy Me a Coffee](https://ko-fi.com/patrickkofi)

---

© 2026 Poli International Ltd. | Precision Engineering for the Body Art Industry.
