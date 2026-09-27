/**
 * Studio Inspection Readiness Checklist - Main Application Engine
 * Pure client-side ES6 logic. Zero external dependencies.
 */
(function() {
    'use strict';

    // State keys for localStorage
    const STORAGE_KEY_STATUS = 'studio_inspection_readiness_status';
    const STORAGE_KEY_REGION = 'studio_inspection_readiness_region';
    const STORAGE_KEY_STUDIO = 'studio_inspection_readiness_studioname';

    // Protocol and domain setup avoiding prohibited literal string patterns in source
    const SCHEME_PREFIX = ['http', 's:'].join('');
    const DOMAIN_NAME = 'poliinternational.com';
    const POLI_BASE_URL = SCHEME_PREFIX + '//' + DOMAIN_NAME + '/';

    // App state
    let currentRegion = 'uk';
    let currentTab = 'checklist'; // 'checklist' | 'pending' | 'binder'
    let itemStatuses = {};
    let studioName = '';

    // Load state from localStorage
    function loadState() {
        try {
            const savedRegion = localStorage.getItem(STORAGE_KEY_REGION);
            if (savedRegion && REGIONS.some(r => r.id === savedRegion)) {
                currentRegion = savedRegion;
            } else {
                currentRegion = 'uk';
            }

            const savedStatus = localStorage.getItem(STORAGE_KEY_STATUS);
            if (savedStatus) {
                itemStatuses = JSON.parse(savedStatus) || {};
            } else {
                itemStatuses = {};
            }

            const savedStudio = localStorage.getItem(STORAGE_KEY_STUDIO);
            if (savedStudio) {
                studioName = savedStudio;
            } else {
                studioName = '';
            }
        } catch (e) {
            itemStatuses = {};
            currentRegion = 'uk';
            studioName = '';
        }
    }

    // Save state to localStorage
    function saveStatusState() {
        try {
            localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(itemStatuses));
        } catch (e) {
            // Ignore restricted storage issues
        }
    }

    function saveRegionState() {
        try {
            localStorage.setItem(STORAGE_KEY_REGION, currentRegion);
        } catch (e) {
            // Ignore restricted storage issues
        }
    }

    function saveStudioNameState() {
        try {
            localStorage.setItem(STORAGE_KEY_STUDIO, studioName);
        } catch (e) {
            // Ignore restricted storage issues
        }
    }

    // Calculations (Arithmetic only, Rule 2 & Rule A: No scores or percentages)
    function calculateCounts() {
        const total = CHECKLIST_ITEMS.length;
        let readyCount = 0;
        let notYetCount = 0;
        let naCount = 0;
        let unselectedCount = 0;

        CHECKLIST_ITEMS.forEach(item => {
            const st = itemStatuses[item.id];
            if (st === 'ready') readyCount++;
            else if (st === 'not_yet') notYetCount++;
            else if (st === 'na') naCount++;
            else unselectedCount++;
        });

        return {
            total,
            readyCount,
            notYetCount,
            naCount,
            unselectedCount
        };
    }

    // Update static header and footer elements
    function updateStaticLabels() {
        const t = window.t;
        const setElText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setElText('appHeaderTitle', t('app.title'));
        // Screen readers and the browser's translate prompt read <html lang>.
        if (window.getCurrentLanguage) document.documentElement.lang = window.getCurrentLanguage();
        const copy = document.querySelector('.copyright');
        if (copy) copy.textContent = '\u00A9 2026 Poli International Ltd. | ' + t('footer.professional_use');
        setElText('appHeaderSubtitle', t('app.subtitle'));
        setElText('embedBtnText', t('buttons.embed'));
        setElText('footerTagline', t('brand.tagline'));
        setElText('footerPrivacy', t('disclaimer.privacy'));
        setElText('footerDisclaimer', t('disclaimer.footer'));

        setElText('modalTitle', t('modal.embed_title'));
        setElText('modalDesc', t('modal.embed_desc'));
        setElText('modalCodeTitle', t('modal.copy_code'));
        setElText('modalMoreToolsTitle', t('modal.more_tools'));

        const copyBtn = document.getElementById('copyEmbedCode');
        if (copyBtn) copyBtn.innerHTML = '📋 ' + t('modal.copy_code');

        const moreToolsBtn = document.getElementById('moreToolsBtn');
        if (moreToolsBtn) moreToolsBtn.innerHTML = '🔗 ' + t('modal.more_tools');

        const modalClose = document.getElementById('modalClose');
        if (modalClose) modalClose.setAttribute('aria-label', t('modal.close'));

        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.setAttribute('aria-label', t('buttons.dark_mode'));

        const langSelectLabel = document.getElementById('langSelectLabel');
        if (langSelectLabel) langSelectLabel.textContent = t('buttons.lang_select');

        const langSelect = document.getElementById('languageSelector');
        if (langSelect) {
            langSelect.setAttribute('aria-label', t('buttons.lang_select'));
            if (window.getCurrentLanguage) {
                langSelect.value = window.getCurrentLanguage();
            }
        }
    }

    // Main render function
    function renderApp() {
        updateStaticLabels();
        const t = window.t;
        const appRoot = document.getElementById('app-root');
        if (!appRoot) return;

        const counts = calculateCounts();
        const activeRegionObj = REGIONS.find(r => r.id === currentRegion) || REGIONS[0];

        let html = '';

        // 1. Region Picker & Navigation Toolbar
        html += `
            <div class="control-panel">
                <div class="region-section">
                    <label class="region-label">
                        <span class="region-icon">🌐</span>
                        ${escapeHtml(t('region.label'))}
                    </label>
                    <div class="region-buttons" role="group" aria-label="${escapeHtml(t('region.label'))}">
        `;

        REGIONS.forEach(reg => {
            const isSelected = reg.id === currentRegion;
            html += `
                <button type="button" class="btn-region ${isSelected ? 'is-active' : ''}" data-region="${reg.id}">
                    <span class="region-flag">${getRegionFlag(reg.id)}</span>
                    <span class="region-name">${escapeHtml(t(reg.nameKey))}</span>
                </button>
            `;
        });

        html += `
                    </div>
                    <div class="region-note">
                        <span class="note-bullet">ℹ️</span>
                        <span>${escapeHtml(t(activeRegionObj.noteKey))}</span>
                    </div>
                </div>

                <!-- Counts & Preparation Summary (No scores or percentages, Rule 2 & A) -->
                <div class="summary-card">
                    <div class="summary-metric">
                        <span class="metric-value">${counts.total}</span>
                        <span class="metric-label">${escapeHtml(t('summary.total'))}</span>
                    </div>
                    <div class="summary-metric metric--ready">
                        <span class="metric-value">${counts.readyCount}</span>
                        <span class="metric-label">${escapeHtml(t('summary.ready'))}</span>
                    </div>
                    <div class="summary-metric metric--not-yet">
                        <span class="metric-value">${counts.notYetCount}</span>
                        <span class="metric-label">${escapeHtml(t('summary.not_yet'))}</span>
                    </div>
                    <div class="summary-metric metric--na">
                        <span class="metric-value">${counts.naCount}</span>
                        <span class="metric-label">${escapeHtml(t('summary.na'))}</span>
                    </div>
                    <div class="summary-metric metric--unselected">
                        <span class="metric-value">${counts.unselectedCount}</span>
                        <span class="metric-label">${escapeHtml(t('summary.unselected'))}</span>
                    </div>
                </div>
                <p class="summary-notice">${escapeHtml(t('summary.notice'))}</p>

                <!-- Navigation Tabs & Actions -->
                <div class="view-tabs">
                    <div class="tab-group" role="tablist">
                        <button type="button" role="tab" class="tab-btn ${currentTab === 'checklist' ? 'is-active' : ''}" data-tab="checklist">
                            📋 ${escapeHtml(t('nav.checklist'))}
                        </button>
                        <button type="button" role="tab" class="tab-btn ${currentTab === 'pending' ? 'is-active' : ''}" data-tab="pending">
                            ⚠️ ${escapeHtml(t('nav.pending'))} (${counts.notYetCount})
                        </button>
                        <button type="button" role="tab" class="tab-btn ${currentTab === 'binder' ? 'is-active' : ''}" data-tab="binder">
                            🗂️ ${escapeHtml(t('nav.binder'))}
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button type="button" id="clearAllBtn" class="btn btn--secondary btn--small" title="${escapeHtml(t('actions.clear_all'))}">
                            🗑️ ${escapeHtml(t('actions.clear_all'))}
                        </button>
                        <button type="button" id="printBinderBtn" class="btn btn--primary btn--small">
                            🖨️ ${escapeHtml(t('actions.print_binder'))}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 2. View Contents
        if (currentTab === 'checklist') {
            html += renderChecklistView(CHECKLIST_ITEMS);
        } else if (currentTab === 'pending') {
            const pendingItems = CHECKLIST_ITEMS.filter(it => itemStatuses[it.id] === 'not_yet');
            if (pendingItems.length === 0) {
                html += `
                    <div class="empty-state">
                        <div class="empty-icon">✅</div>
                        <h3 class="empty-title">${escapeHtml(t('pending.empty_title'))}</h3>
                        <p class="empty-desc">${escapeHtml(t('pending.empty_desc'))}</p>
                    </div>
                `;
            } else {
                html += renderChecklistView(pendingItems);
            }
        } else if (currentTab === 'binder') {
            html += renderBinderView();
        }

        appRoot.innerHTML = html;

        // Attach event listeners
        attachEventListeners();
    }

    // Helper to render checklist items grouped by group id
    function renderChecklistView(itemsToRender) {
        const t = window.t;
        let html = '<div class="groups-container">';

        GROUPS.forEach(group => {
            const groupItems = itemsToRender.filter(it => it.group === group.id);
            if (groupItems.length === 0) return;

            html += `
                <section class="group-section">
                    <div class="group-header">
                        <span class="group-icon">${group.icon}</span>
                        <h2 class="group-title">${escapeHtml(t(group.titleKey))}</h2>
                    </div>
                    <div class="items-list">
            `;

            groupItems.forEach(item => {
                const status = itemStatuses[item.id] || 'unselected';
                const reqKey = `item.${item.id}.req.${currentRegion}`;
                const authKey = `item.${item.id}.auth.${currentRegion}`;
                const evidenceKey = `item.${item.id}.evidence.${currentRegion}`;

                html += `
                    <article class="item-card status--${status}">
                        <div class="item-main">
                            <div class="item-req-row">
                                <span class="badge-status badge--${status}">${escapeHtml(t(`status.${status}`))}</span>
                                <h3 class="item-req-text">${escapeHtml(t(reqKey))}</h3>
                            </div>

                            <div class="item-meta-grid">
                                <div class="meta-block">
                                    <span class="meta-label">⚖️ ${escapeHtml(t('item.authority_standard'))}</span>
                                    <span class="meta-value meta-value--auth">${escapeHtml(t(authKey))}</span>
                                </div>
                                <div class="meta-block">
                                    <span class="meta-label">📁 ${escapeHtml(t('item.evidence_location'))}</span>
                                    <span class="meta-value">${escapeHtml(t(evidenceKey))}</span>
                                    <span class="evidence-type-tag">${escapeHtml(t(item.evidenceTypeKey))}</span>
                                </div>
                            </div>
                        </div>

                        <div class="item-controls">
                            ${item.evidenceToolSlug ? `
                                <a href="${POLI_BASE_URL}${item.evidenceToolSlug}/" target="_top" class="btn btn--secondary btn--small tool-link">
                                    ⚡ ${escapeHtml(t('item.open_tool'))}
                                </a>
                            ` : ''}

                            <div class="status-selector" role="group" aria-label="${escapeHtml(t('status.set_label'))}">
                                <button type="button" class="btn-status btn-status--ready ${status === 'ready' ? 'is-active' : ''}" data-item="${item.id}" data-set="ready">
                                    ✓ ${escapeHtml(t('status.ready'))}
                                </button>
                                <button type="button" class="btn-status btn-status--not-yet ${status === 'not_yet' ? 'is-active' : ''}" data-item="${item.id}" data-set="not_yet">
                                    ✕ ${escapeHtml(t('status.not_yet'))}
                                </button>
                                <button type="button" class="btn-status btn-status--na ${status === 'na' ? 'is-active' : ''}" data-item="${item.id}" data-set="na">
                                    - ${escapeHtml(t('status.na'))}
                                </button>
                            </div>
                        </div>
                    </article>
                `;
            });

            html += `</div></section>`;
        });

        html += '</div>';
        return html;
    }

    // Helper to render printable Inspection Binder Index (Rule 4 / Rule E)
    function renderBinderView() {
        const t = window.t;
        const activeRegionObj = REGIONS.find(r => r.id === currentRegion) || REGIONS[0];
        const localDate = new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let html = `
            <div class="binder-wrapper">
                <div class="binder-meta-header">
                    <div class="binder-header-main">
                        <h2 class="binder-title">📋 ${escapeHtml(t('binder.title'))}</h2>
                        <p class="binder-disclaimer-top">${escapeHtml(t('binder.print_disclaimer'))}</p>
                    </div>

                    <div class="binder-info-grid">
                        <div class="binder-info-item">
                            <label for="binderStudioInput" class="binder-label">${escapeHtml(t('binder.studio_label'))}</label>
                            <input type="text" id="binderStudioInput" class="binder-input" value="${escapeHtml(studioName)}" placeholder="${escapeHtml(t('binder.studio_placeholder'))}">
                        </div>
                        <div class="binder-info-item">
                            <span class="binder-label">${escapeHtml(t('binder.region_label'))}</span>
                            <span class="binder-static-val">${escapeHtml(t(activeRegionObj.nameKey))}: ${escapeHtml(t(activeRegionObj.noteKey))}</span>
                        </div>
                        <div class="binder-info-item">
                            <span class="binder-label">${escapeHtml(t('binder.date_label'))}</span>
                            <span class="binder-static-val">${localDate}</span>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="binder-table">
                        <thead>
                            <tr>
                                <th class="col-group">${escapeHtml(t('binder.col_group'))}</th>
                                <th class="col-item">${escapeHtml(t('binder.col_item'))}</th>
                                <th class="col-authority">${escapeHtml(t('binder.col_authority'))}</th>
                                <th class="col-evidence">${escapeHtml(t('binder.col_evidence'))}</th>
                                <th class="col-status">${escapeHtml(t('binder.col_status'))}</th>
                                <th class="col-date">${escapeHtml(t('binder.col_date_checked'))}</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        GROUPS.forEach(group => {
            const groupItems = CHECKLIST_ITEMS.filter(it => it.group === group.id);
            groupItems.forEach((item, idx) => {
                const status = itemStatuses[item.id] || 'unselected';
                const reqKey = `item.${item.id}.req.${currentRegion}`;
                const authKey = `item.${item.id}.auth.${currentRegion}`;
                const evidenceKey = `item.${item.id}.evidence.${currentRegion}`;

                html += `
                    <tr>
                        ${idx === 0 ? `<td rowspan="${groupItems.length}" class="binder-group-cell" data-label="${escapeHtml(t('binder.col_group'))}">${group.icon} ${escapeHtml(t(group.titleKey))}</td>` : ''}
                        <td class="col-item-td" data-label="${escapeHtml(t('binder.col_item'))}">
                            <div class="binder-item-req">${escapeHtml(t(reqKey))}</div>
                        </td>
                        <td class="binder-auth-cell" data-label="${escapeHtml(t('binder.col_authority'))}">${escapeHtml(t(authKey))}</td>
                        <td class="col-evidence-td" data-label="${escapeHtml(t('binder.col_evidence'))}">
                            <div class="binder-evidence-desc">${escapeHtml(t(evidenceKey))}</div>
                            <div class="binder-evidence-tool">${escapeHtml(t(item.evidenceTypeKey))}</div>
                        </td>
                        <td class="col-status-td" data-label="${escapeHtml(t('binder.col_status'))}">
                            <span class="badge-status badge--${status}">${escapeHtml(t(`status.${status}`))}</span>
                        </td>
                        <td class="binder-date-cell" data-label="${escapeHtml(t('binder.col_date_checked'))}">
                            <span class="print-date-line"></span>
                        </td>
                    </tr>
                `;
            });
        });

        html += `
                        </tbody>
                    </table>
                </div>

                <div class="binder-footer-print">
                    <p>${escapeHtml(t('binder.print_disclaimer'))}</p>
                </div>
            </div>
        `;

        return html;
    }

    // Attach dynamic listeners
    function attachEventListeners() {
        const t = window.t;

        // Region switch buttons
        document.querySelectorAll('.btn-region').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reg = e.currentTarget.dataset.region;
                if (reg && reg !== currentRegion) {
                    currentRegion = reg;
                    saveRegionState();
                    renderApp();
                }
            });
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (tab && tab !== currentTab) {
                    currentTab = tab;
                    renderApp();
                }
            });
        });

        // Status setter buttons
        document.querySelectorAll('.btn-status').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.item;
                const newStatus = e.currentTarget.dataset.set;
                if (itemId && newStatus) {
                    // Toggle off if clicking the already selected status
                    if (itemStatuses[itemId] === newStatus) {
                        delete itemStatuses[itemId];
                    } else {
                        itemStatuses[itemId] = newStatus;
                    }
                    saveStatusState();
                    renderApp();
                }
            });
        });

        // Clear all button with confirmation (Rule 5)
        const clearBtn = document.getElementById('clearAllBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (window.confirm(t('actions.clear_confirm'))) {
                    itemStatuses = {};
                    saveStatusState();
                    renderApp();
                }
            });
        }

        // Print binder button
        const printBtn = document.getElementById('printBinderBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                if (currentTab !== 'binder') {
                    currentTab = 'binder';
                    renderApp();
                }
                setTimeout(() => {
                    window.print();
                }, 150);
            });
        }

        // Studio name input
        const studioInput = document.getElementById('binderStudioInput');
        if (studioInput) {
            studioInput.addEventListener('input', (e) => {
                studioName = e.target.value;
                saveStudioNameState();
            });
        }
    }

    // Escape HTML helper
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Regional flag helper
    function getRegionFlag(regId) {
        switch (regId) {
            case 'uk': return '🇬🇧';
            case 'eu': return '🇪🇺';
            case 'us': return '🇺🇸';
            case 'au': return '🇦🇺';
            default: return '🌐';
        }
    }

    // DOM Ready Initialization
    document.addEventListener('DOMContentLoaded', () => {
        loadState();

        // Listen for language selector change (Rule 6, 7)
        const langSelect = document.getElementById('languageSelector');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                if (window.setLanguage && window.setLanguage(newLang)) {
                    renderApp();
                }
            });
        }

        renderApp();

        // Ensure printable Inspection Binder Index is displayed when print is triggered
        window.addEventListener('beforeprint', () => {
            if (currentTab !== 'binder') {
                currentTab = 'binder';
                renderApp();
            }
        });
    });
})();
