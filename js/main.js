document.addEventListener('DOMContentLoaded', function() {
    const appRoot = document.getElementById('app-root');
    let userResponses = {};

    function calculateScore() {
        let totalPossible = 0;
        let userTotal = 0;

        COMPLIANCE_DATABASE.forEach(cat => {
            cat.items.forEach(item => {
                totalPossible += item.weight;
                if (userResponses[item.id]) {
                    userTotal += item.weight;
                }
            });
        });

        return Math.round((userTotal / totalPossible) * 100);
    }

    function renderApp() {
        const score = calculateScore();
        
        let html = `
            <div class="score-header">
                <div class="score-card">
                    <div class="score-value">${score}%</div>
                    <div class="score-label">Current Compliance Score</div>
                </div>
                <div class="score-visual">
                    <div class="score-bar-bg">
                        <div class="score-bar-fill" style="width: ${score}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="compliance-sections">
        `;

        COMPLIANCE_DATABASE.forEach(cat => {
            html += `
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-icon">${cat.icon}</span>
                        <h3>${cat.category}</h3>
                    </div>
                    <div class="item-list">
            `;

            cat.items.forEach(item => {
                const isChecked = userResponses[item.id] ? 'checked' : '';
                html += `
                    <label class="checklist-item">
                        <input type="checkbox" data-id="${item.id}" ${isChecked}>
                        <span class="checkbox-custom"></span>
                        <span class="item-text">${item.text}</span>
                    </label>
                `;
            });

            html += `</div></div>`;
        });

        html += `
            </div>
            <div class="actions-area">
                <button id="generate-report" class="btn btn--primary">📋 Generate Official Report</button>
            </div>
        `;

        appRoot.innerHTML = html;

        // Re-attach listeners
        document.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.addEventListener('change', (e) => {
                userResponses[e.target.dataset.id] = e.target.checked;
                renderApp();
            });
        });

        const reportBtn = document.getElementById('generate-report');
        if (reportBtn) {
            reportBtn.addEventListener('click', showReport);
        }
    }

    function showReport() {
        const score = calculateScore();
        let status = "CRITICAL FAILURE";
        let statusColor = "var(--error)";
        
        if (score >= 95) { status = "COMPLIANT / EXCELLENCE"; statusColor = "var(--success)"; }
        else if (score >= 80) { status = "CONDITIONALLY COMPLIANT"; statusColor = "var(--warning)"; }

        const reportHTML = `
            <div class="report-overlay">
                <div class="report-modal">
                    <h2>Studio Compliance Audit Report</h2>
                    <div class="report-summary" style="border-left-color: ${statusColor}">
                        <div class="final-score">${score}%</div>
                        <div class="final-status" style="color: ${statusColor}">${status}</div>
                    </div>
                    <p>Audit generated on: ${new_Date().toLocaleDateString()}</p>
                    <div class="report-actions">
                        <button onclick="window.print()" class="btn btn--primary">🖨️ Print Report</button>
                        <button id="close-report" class="btn btn--secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', reportHTML);
        document.getElementById('close-report').addEventListener('click', () => {
            document.querySelector('.report-overlay').remove();
        });
    }

    // Helper for date
    function new_Date() { return new Date(); }

    // Initial render
    setTimeout(renderApp, 1000);
});
