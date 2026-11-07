/**
 * @file assets/js/services/effects.service.js
 * @description محرك التأثيرات البصرية والأنميشنز المتقدمة ونافذة البحث السريع (Command Palette ⌘K).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Store, I18n, Theme, CurriculumService, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let revealObserver = null;
  const revealSeen = new WeakSet();
  let lastScan = { count: -1, first: null, last: null };

  function observeRevealElements() {
    const targets = DOM.qsa('.card, .pillar-card, .stat-card, .feedback-card, .faq-item, .pillar, .admin-item');

    if (!('IntersectionObserver' in global)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // لا تُعاد نفس المجموعة مرتين متتاليتين (refreshAllViews + render الخاص بالصفحة).
    const first = targets[0] || null;
    const last = targets[targets.length - 1] || null;
    if (targets.length === lastScan.count && first === lastScan.first && last === lastScan.last) {
      return;
    }
    lastScan = { count: targets.length, first, last };

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
      );
    }

    targets.forEach((el, idx) => {
      if (revealSeen.has(el)) return;
      revealSeen.add(el);
      el.style.setProperty('--stagger-idx', String(idx % 6));
      el.classList.add('reveal-item');
      revealObserver.observe(el);
    });
  }

  function initScrollTracker() {
    if (document.body.dataset.scrollBound) return;
    document.body.dataset.scrollBound = 'true';

    const updateScrollUI = () => {
      const scrollTop = global.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

      const bar = DOM.qs('#scrollProgressBar');
      if (bar) bar.style.width = `${pct}%`;

      const topBtn = DOM.qs('#backToTopBtn');
      if (topBtn) {
        topBtn.classList.toggle('is-visible', scrollTop > 320);
      }
    };

    global.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();
  }

  // E6/E7 — إدارة التركيز للوحة الأوامر: نحفظ العنصر الذي فُتحت منه لنعيد التركيز إليه عند الإغلاق.
  let paletteOpener = null;

  function toggleCommandPalette(forceOpen) {
    const modal = DOM.qs('#cmdPaletteBackdrop');
    if (!modal) return;

    const nextState = typeof forceOpen === 'boolean' ? forceOpen : modal.hidden;
    Store.setState((s) => {
      s.commandPalette.isOpen = nextState;
      if (!nextState) s.commandPalette.query = '';
    });

    modal.hidden = !nextState;

    // E6 — aria-expanded على زر فتح لوحة الأوامر.
    const triggerBtn = DOM.qs('#cmdPaletteBtn');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', String(nextState));

    if (nextState) {
      paletteOpener = document.activeElement;
      const input = DOM.qs('#cmdPaletteInput');
      if (input) {
        input.value = '';
        input.placeholder = I18n.t('cmd_placeholder');
        setTimeout(() => input.focus(), 30);
      }
      renderCommandResults('');
      return;
    }

    // إغلاق — إعادة التركيز إلى مصدر الفتح، أو إلى زر الفتح كبديل آمن.
    const target = paletteOpener && paletteOpener.isConnected ? paletteOpener : triggerBtn;
    paletteOpener = null;
    if (!target || typeof target.focus !== 'function') return;
    try {
      target.focus({ preventScroll: true });
    } catch (_) {
      target.focus();
    }
  }

  function renderCommandResults(rawQuery = '') {
    const listEl = DOM.qs('#cmdPaletteResults');
    if (!listEl) return;

    const { topics, lang } = Store.getState();
    const q = rawQuery.trim().toLowerCase();

    // البحث الموحّد نفسه المستخدم في المكتبة واستوديو الإدارة (CurriculumService.searchResources).
    const matchedResources = CurriculumService.searchResources(rawQuery);

    const quickActions = [
      { id: 'act-files', icon: '📚', label: I18n.t('cmd_act_files'), action: 'nav:files' },
      { id: 'act-theme', icon: '🌓', label: I18n.t('cmd_act_theme'), action: 'toggle:theme' },
      { id: 'act-lang', icon: '🌐', label: I18n.t('cmd_act_lang'), action: 'toggle:lang' },
      { id: 'act-about', icon: '👥', label: I18n.t('cmd_act_about'), action: 'nav:about' },
      { id: 'act-contact', icon: '✉️', label: I18n.t('cmd_act_contact'), action: 'nav:contact' }
    ].filter((act) => !q || act.label.toLowerCase().includes(q));

    if (matchedResources.length === 0 && quickActions.length === 0) {
      listEl.innerHTML = `<div class="cmd-empty">${escapeHtml(I18n.t('cmd_empty'))}</div>`;
      return;
    }

    let html = '';

    if (matchedResources.length > 0) {
      html += `<div class="cmd-group-title">${escapeHtml(I18n.t('cmd_group_curricula'))}</div>`;
      html += matchedResources
        .slice(0, 8)
        .map((item) => {
          const title = item.title?.[lang] || item.file;
          const topicLabel = topics[item.t]?.[lang] || item.t;
          const desc = CurriculumService.getDisplayDescription(item, lang);
          const hasSol = Boolean(CurriculumService.getSolutionPdfPath(item, lang));
          return `
            <div class="cmd-item-row">
              <a href="preview.html?id=${encodeURIComponent(item.id)}&type=problem"
                 class="cmd-item-main"
                 data-open-preview="${escapeHtml(item.id)}"
                 data-preview-type="problem"
                 data-cmd-close="true">
                <span class="cmd-item-icon">📘</span>
                <span class="cmd-item-text">
                  <strong>${escapeHtml(title)} <small style="color:var(--accent)">(${escapeHtml(topicLabel)} • L${escapeHtml(item.l)})</small></strong>
                  <small>${escapeHtml(desc)}</small>
                </span>
              </a>
              ${
                hasSol
                  ? `<a href="preview.html?id=${encodeURIComponent(item.id)}&type=solution"
                        class="btn btn-ghost btn-sm cmd-sol-pill"
                        data-open-preview="${escapeHtml(item.id)}"
                        data-preview-type="solution"
                        data-cmd-close="true">✅ ${I18n.t('solution_pill')}</a>`
                  : ''
              }
            </div>
          `;
        })
        .join('');
    }

    if (quickActions.length > 0) {
      html += `<div class="cmd-group-title">${escapeHtml(I18n.t('cmd_group_actions'))}</div>`;
      html += quickActions
        .map(
          (act) => `
            <button type="button" class="cmd-action-btn" data-cmd-action="${escapeHtml(act.action)}">
              <span class="cmd-item-icon">${act.icon}</span>
              <span>${escapeHtml(act.label)}</span>
            </button>
          `
        )
        .join('');
    }

    listEl.innerHTML = html;
  }

  function handleCommandAction(actionCode) {
    toggleCommandPalette(false);
    if (actionCode === 'toggle:theme') {
      Theme.toggleTheme();
      return;
    }
    if (actionCode === 'toggle:lang') {
      I18n.toggleLang();
      document.dispatchEvent(new Event('sphoh:refresh'));
      return;
    }
    if (actionCode.startsWith('nav:')) {
      const targetPage = actionCode.split(':')[1];
      const map = { home: 'index.html', files: 'files.html', about: 'about.html', contact: 'contact.html' };
      global.location.href = map[targetPage] || 'index.html';
    }
  }

  function init() {
    initScrollTracker();
    observeRevealElements();
  }

  SPhOH.Effects = Object.freeze({
    init,
    observeRevealElements,
    toggleCommandPalette,
    renderCommandResults,
    handleCommandAction
  });
})(window);
