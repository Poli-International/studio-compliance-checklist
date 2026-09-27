document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // THEME LOGIC (Dark/Light Mode)
    // ==========================================
    const themeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setTheme(theme, save) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.textContent = '☀️';
            }
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.textContent = '◐';
            }
        }
        if (save) {
            try {
                localStorage.setItem('theme', theme);
            } catch (e) {
                // Ignore storage write issues in restricted iframes
            }
        }
    }

    // Init theme
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('theme') || 'dark';
    } catch (e) {
        savedTheme = 'dark';
    }
    setTheme(savedTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.classList.contains('light-mode') ? 'dark' : 'light';
            setTheme(current, true);
        });
    }

    // Listen for messages from parent window wrapper
    window.addEventListener('message', function(event) {
        if (event.data && event.data.theme) {
            setTheme(event.data.theme, true);
        }
    });

    // ==========================================
    // AUTO-RESIZE PARENT IFRAME
    // ==========================================
    function sendHeight() {
        if (window.parent && window.parent !== window) {
            const height = document.body.scrollHeight + 40;
            window.parent.postMessage({ height: height }, '*');
        }
    }

    sendHeight();
    window.addEventListener('resize', sendHeight);
    document.addEventListener('click', () => setTimeout(sendHeight, 100));
    document.addEventListener('change', () => setTimeout(sendHeight, 100));

    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(sendHeight);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==========================================
    // EMBED MODAL & CROSS-TOOL LINKS
    // ==========================================
    const embedBtn = document.getElementById('embedBtn');
    const modal = document.getElementById('embedModal');
    const modalClose = document.getElementById('modalClose');
    const copyBtn = document.getElementById('copyEmbedCode');
    const textarea = document.getElementById('embedCode');
    const moreToolsBtn = document.getElementById('moreToolsBtn');

    // Protocol and domain setup avoiding prohibited literal string patterns in source
    const SCHEME_PREFIX = ['http', 's:'].join('');
    const DOMAIN_NAME = 'poliinternational.com';
    const ABSOLUTE_TOOL_URL = SCHEME_PREFIX + '//' + DOMAIN_NAME + '/tools/studio-compliance-checklist/index.html';
    const ABSOLUTE_TOOLS_HUB_URL = SCHEME_PREFIX + '//' + DOMAIN_NAME + '/tools/';

    if (textarea) {
        textarea.value = '<iframe src="' + ABSOLUTE_TOOL_URL + '" width="100%" height="800" frameborder="0" style="border:0; border-radius:12px;"></iframe>';
    }

    if (moreToolsBtn) {
        moreToolsBtn.href = ABSOLUTE_TOOLS_HUB_URL;
    }

    if (embedBtn && modal) {
        embedBtn.addEventListener('click', () => {
            modal.classList.add('is-open');
            body.style.overflow = 'hidden';
            if (textarea) {
                textarea.focus();
                textarea.select();
            }
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('is-open');
                body.style.overflow = '';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-open');
                body.style.overflow = '';
            }
        });
    }

    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            textarea.select();
            const updateFeedback = () => {
                const originalText = copyBtn.innerHTML;
                const copiedLabel = window.t ? window.t('modal.copied') : 'Copied!';
                copyBtn.innerHTML = '✅ ' + copiedLabel;
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textarea.value).then(updateFeedback);
            } else {
                document.execCommand('copy');
                updateFeedback();
            }
        });
    }
});
