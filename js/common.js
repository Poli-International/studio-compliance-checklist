document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // THEME LOGIC (Dark/Light Mode)
    // ==========================================
    const themeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const toolName = window.location.pathname.split('/').filter(Boolean).pop() || 'poli-tool';

    function setTheme(theme, save = true) {
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
        if (save) localStorage.setItem('theme', theme);
    }

    // Init theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.classList.contains('light-mode') ? 'dark' : 'light';
            setTheme(current);
        });
    }

    // Listen for messages from WordPress wrapper
    window.addEventListener('message', function(event) {
        if (event.data && event.data.theme) {
            setTheme(event.data.theme, true);
        }
    });

    // ==========================================
    // AUTO-RESIZE PARENT IFRAME
    // ==========================================
    function sendHeight() {
        const height = document.body.scrollHeight + 50; // Buffer
        window.parent.postMessage({ height: height }, '*');
    }

    // Send height on load and on any interaction
    sendHeight();
    window.addEventListener('resize', sendHeight);
    document.addEventListener('click', () => setTimeout(sendHeight, 100));
    document.addEventListener('change', () => setTimeout(sendHeight, 100));
    
    // Mutation observer to catch dynamic content changes
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    // ==========================================
    // EMBED MODAL LOGIC
    // ==========================================
    const embedBtn = document.getElementById('embedBtn') || document.getElementById('embed-button');
    const modal = document.getElementById('embedModal') || document.getElementById('embed-modal');
    const modalClose = document.getElementById('modalClose') || document.querySelector('.modal-close');
    const copyBtn = document.getElementById('copyEmbedCode');
    const textarea = document.getElementById('embedCode');

    if (textarea) {
        const cleanUrl = window.location.href.split('?')[0].split('#')[0];
        textarea.value = `<iframe src="${cleanUrl}" width="100%" height="800" frameborder="0" style="border:1px solid #333; border-radius:12px;"></iframe>`;
    }

    if (embedBtn && modal) {
        embedBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            body.style.overflow = 'hidden';
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.style.display = 'none';
                body.style.overflow = '';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                body.style.overflow = '';
            }
        });
    }

    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            textarea.select();
            navigator.clipboard.writeText(textarea.value).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                setTimeout(() => copyBtn.innerHTML = originalText, 2000);
            });
        });
    }

    // ==========================================
    // EMAIL FORM SIMULATION
    // ==========================================
    const emailForms = document.querySelectorAll('.email-form');
    emailForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = '✅ Subscribed!';
            btn.disabled = true;
            input.value = '';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 3000);
        });
    });
});
