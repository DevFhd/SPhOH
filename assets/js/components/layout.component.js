/**
 * @file assets/js/components/layout.component.js
 * @description مكوّن الهيكل المشترك:
 * - الهيدر الكبسولي المعماري العائم (Floating Capsule Navbar) مع زر البحث الشامل (Command Palette ⌘K)
 * - خلفية معمارية أكاديمية متزنة (Subtle Ambient Mesh)
 * - شريط تقدم القراءة العلوي وزر الصعود للأعلى
 * - نافذة البحث والأوامر السريعة (Command Palette Modal)
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, DOM } = SPhOH;

  const LOGO_SVG = `
    <svg class="logo-atom-svg" width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <ellipse class="atom-orbit orbit-1" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2"/>
      <ellipse class="atom-orbit orbit-2" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2" transform="rotate(60 16 16)"/>
      <ellipse class="atom-orbit orbit-3" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2" transform="rotate(120 16 16)"/>
      <circle class="atom-core" cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  `;

  const TELEGRAM_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.7 3.4a1.5 1.5 0 0 0-1.6-.2L2.5 10.1c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.3c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.2-2.2 4.6 3.4c.9.5 1.5.2 1.7-.8l3-14.2c.3-1.1-.2-1.6-.9-1.4ZM8 12.7l9.8-6.2c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.1L8 12.7Z"/>
    </svg>
  `;

  function detectActivePage() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage) return bodyPage;

    const path = (global.location.pathname || '').split('/').pop().toLowerCase();
    if (path.includes('files')) return 'files';
    if (path.includes('preview')) return 'files';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('admin')) return 'admin';
    return 'home';
  }

  function renderNavbar(activePage) {
    const navItems = [
      { page: 'home', href: 'index.html', i18n: 'nav_home' },
      { page: 'files', href: 'files.html', i18n: 'nav_files' },
      { page: 'about', href: 'about.html', i18n: 'nav_about' },
      { page: 'contact', href: 'contact.html', i18n: 'nav_contact' }
    ];

    const linksHtml = navItems
      .map(
        (item) =>
          `<a href="${item.href}" class="${activePage === item.page ? 'active' : ''}" data-nav-page="${item.page}" data-i18n="${item.i18n}"></a>`
      )
      .join('');

    return `
      <div class="scroll-progress-track" aria-hidden="true">
        <div class="scroll-progress-bar" id="scrollProgressBar"></div>
      </div>
      <div class="wrap nav-row">
        <a class="logo" href="index.html" data-nav-page="home" aria-label="SPhOH">
          <span class="logo-mark-box">${LOGO_SVG}</span>
          <span class="logo-text">SPhOH</span>
          <span class="logo-badge">OLYMPIAD</span>
        </a>

        <nav class="links" aria-label="Main Navigation">
          ${linksHtml}
        </nav>

        <div class="nav-controls">
          <button class="cmd-trigger-btn" id="cmdPaletteBtn" type="button" aria-label="Quick Search (Ctrl+K)">
            <span>🔍</span>
            <span class="cmd-trigger-label" data-i18n="nav_cmd_k"></span>
            <kbd class="cmd-kbd">⌘K</kbd>
          </button>

          <button class="theme-btn" id="themeBtn" type="button" aria-label="Toggle Theme">
            <span id="themeIcon">🌙</span>
            <span id="themeText">داكن</span>
          </button>

          <button class="lang" id="langBtn" type="button" aria-label="Switch language / تبديل اللغة">
            <span data-l="ar">AR</span>
            <span data-l="en">EN</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const displayYear = year >= 2026 ? year : 2026;
    return `
      <div class="wrap">
        <div class="footer-brand-cluster">
          <span class="footer-copy">© ${displayYear} SPhOH</span>
          <span class="footer-dot">•</span>
          <span class="footer-tag" data-i18n="foot"></span>
        </div>

        <div class="footer-right">
          <a class="telegram-link"
             href="${Settings.LINKS.TELEGRAM}"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Join the SPhOH Telegram channel">
            ${TELEGRAM_SVG}
            <span data-i18n="telegram_footer"></span>
          </a>
        </div>
      </div>
    `;
  }

  function renderCommandPaletteModal() {
    return `
      <div class="cmd-backdrop" id="cmdPaletteBackdrop" hidden>
        <div class="cmd-dialog" role="dialog" aria-modal="true" aria-label="Command Palette">
          <div class="cmd-header">
            <span class="cmd-search-icon" aria-hidden="true">🔍</span>
            <input type="search"
                   id="cmdPaletteInput"
                   class="cmd-input"
                   autocomplete="off"
                   placeholder="Search curricula, topics, or actions...">
            <button type="button" class="cmd-esc-btn" id="cmdPaletteCloseBtn" data-i18n="cmd_hint_esc">ESC</button>
          </div>
          <div class="cmd-results" id="cmdPaletteResults"></div>
        </div>
      </div>
    `;
  }

  function mount() {
    const activePage = detectActivePage();

    if (!DOM.qs('.aurora-bg')) {
      const aurora = document.createElement('div');
      aurora.className = 'aurora-bg';
      aurora.setAttribute('aria-hidden', 'true');
      aurora.innerHTML = `
        <div class="aurora-orb orb-1"></div>
        <div class="aurora-orb orb-2"></div>
        <div class="aurora-orb orb-3"></div>
        <div class="aurora-grid-overlay"></div>
      `;
      document.body.prepend(aurora);
    }

    const headerEl = DOM.qs('header.nav');
    if (headerEl) {
      headerEl.innerHTML = renderNavbar(activePage);
    }

    const footerEl = DOM.qs('footer.foot');
    if (footerEl) {
      footerEl.innerHTML = renderFooter();
    }

    if (!DOM.qs('#cmdPaletteBackdrop')) {
      const wrap = document.createElement('div');
      wrap.innerHTML = renderCommandPaletteModal();
      document.body.appendChild(wrap.firstElementChild);
    }

    if (!DOM.qs('#backToTopBtn')) {
      const topBtn = document.createElement('button');
      topBtn.id = 'backToTopBtn';
      topBtn.type = 'button';
      topBtn.className = 'back-to-top-fab';
      topBtn.setAttribute('aria-label', 'Back to top');
      topBtn.textContent = '↑';
      document.body.appendChild(topBtn);
    }

    if (!DOM.qs('#toast')) {
      const toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.hidden = true;
      document.body.appendChild(toastEl);
    }
  }

  SPhOH.Layout = Object.freeze({
    mount,
    renderNavbar,
    renderFooter
  });
})(window);
