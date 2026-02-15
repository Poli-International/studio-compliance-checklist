document.addEventListener('DOMContentLoaded', function() {
    // Theme logic
    const themeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const themeKey = 'studio-compliance-theme';

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '◐';
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (themeToggle) themeToggle.innerHTML = '☀️';
        }
        localStorage.setItem(themeKey, theme);
    }

    const savedTheme = localStorage.getItem(themeKey) || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.classList.contains('light-mode') ? 'dark' : 'light';
            setTheme(current);
        });
    }

    // Embed Modal logic
    const embedBtn = document.getElementById('embedBtn');
    const modal = document.getElementById('embedModal');
    const modalClose = document.getElementById('modalClose');
    const copyBtn = document.getElementById('copyEmbedCode');
    const textarea = document.getElementById('embedCode');

    if (textarea) {
        textarea.value = `<iframe src="${window.location.href}" width="100%" height="800" frameborder="0"></iframe>`;
    }

    if (embedBtn && modal) {
        embedBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            setTimeout(() => copyBtn.innerHTML = originalText, 2000);
        });
    }
});
