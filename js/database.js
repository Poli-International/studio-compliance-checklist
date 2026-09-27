/**
 * Studio Inspection Readiness Checklist Database
 * Pure client-side data definition.
 */
var REGIONS = [
  { id: "uk", nameKey: "region.uk", noteKey: "region.note.uk" },
  { id: "eu", nameKey: "region.eu", noteKey: "region.note.eu" },
  { id: "us", nameKey: "region.us", noteKey: "region.note.us" },
  { id: "au", nameKey: "region.au", noteKey: "region.note.au" }
];

var GROUPS = [
  { id: 1, titleKey: "group.1.title", icon: "🧼" },
  { id: 2, titleKey: "group.2.title", icon: "🧪" },
  { id: 3, titleKey: "group.3.title", icon: "♨️" },
  { id: 4, titleKey: "group.4.title", icon: "🗑️" },
  { id: 5, titleKey: "group.5.title", icon: "🎓" },
  { id: 6, titleKey: "group.6.title", icon: "📋" },
  { id: 7, titleKey: "group.7.title", icon: "🏢" },
  { id: 8, titleKey: "group.8.title", icon: "💎" }
];

var CHECKLIST_ITEMS = [
  {
    "id": "g1_sink",
    "group": 1,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.facility_walkthrough"
  },
  {
    "id": "g1_gloves",
    "group": 1,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.packaging_labels"
  },
  {
    "id": "g1_ppe",
    "group": 1,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.packaging_labels"
  },
  {
    "id": "g2_disinfectant",
    "group": 2,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.supplier_invoices"
  },
  {
    "id": "g2_cleaning_sop",
    "group": 2,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.physical_binder"
  },
  {
    "id": "g3_autoclave_logs",
    "group": 3,
    "evidenceToolSlug": "autoclave-calculator",
    "evidenceTypeKey": "evidence.autoclave_calc"
  },
  {
    "id": "g3_spore_tests",
    "group": 3,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.lab_reports"
  },
  {
    "id": "g3_sterile_packaging",
    "group": 3,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.packaging_labels"
  },
  {
    "id": "g4_sharps_container",
    "group": 4,
    "evidenceToolSlug": "sharps-disposal-tracker",
    "evidenceTypeKey": "evidence.sharps_tracker"
  },
  {
    "id": "g4_waste_contract",
    "group": 4,
    "evidenceToolSlug": "sharps-disposal-tracker",
    "evidenceTypeKey": "evidence.sharps_tracker"
  },
  {
    "id": "g5_bbp_cert",
    "group": 5,
    "evidenceToolSlug": "bbp-training-tracker",
    "evidenceTypeKey": "evidence.bbp_tracker"
  },
  {
    "id": "g5_hepb_records",
    "group": 5,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.staff_records"
  },
  {
    "id": "g6_consent_forms",
    "group": 6,
    "evidenceToolSlug": "form-builder",
    "evidenceTypeKey": "evidence.consent_builder"
  },
  {
    "id": "g6_age_verification",
    "group": 6,
    "evidenceToolSlug": "form-builder",
    "evidenceTypeKey": "evidence.consent_builder"
  },
  {
    "id": "g6_record_retention",
    "group": 6,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.client_archive"
  },
  {
    "id": "g7_separation_areas",
    "group": 7,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.facility_walkthrough"
  },
  {
    "id": "g7_cleanable_surfaces",
    "group": 7,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.facility_walkthrough"
  },
  {
    "id": "g7_decon_area",
    "group": 7,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.facility_walkthrough"
  },
  {
    "id": "g7_animal_policy",
    "group": 7,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.physical_binder"
  },
  {
    "id": "g8_ink_compliance",
    "group": 8,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.supplier_invoices"
  },
  {
    "id": "g8_jewellery_cert",
    "group": 8,
    "evidenceToolSlug": null,
    "evidenceTypeKey": "evidence.mill_certificates"
  }
];
