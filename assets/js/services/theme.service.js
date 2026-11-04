/**
 * @file assets/js/services/theme.service.js
 * @description خدمة إدارة المظهر الموحد (فاتح / داكن / تلقائي حسب النظام).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, DOM } = SPhOH;

  function isDarkActive() {
    const { theme } = Store.getState();
    if (theme === 'auto') {
      return Boolean(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return theme === 'dark';
  }

  function applyTheme() {
    const { theme } = Store.getState();
    const root = document.documentElement;

    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    root.removeAttribute('data-palette');

    const dark = isDarkActive();
    const iconEl = DOM.qs('#themeIcon');
    const textEl = DOM.qs('#themeText');

    if (iconEl) iconEl.textContent = dark ? '🌙' : '☀️';
    if (textEl) textEl.textContent = dark ? I18n.t('theme_dark') : I18n.t('theme_light');
  }

  function toggleTheme() {
    const nextTheme = isDarkActive() ? 'light' : 'dark';
    Storage.setString(Settings.STORAGE_KEYS.THEME, nextTheme);
    Store.setState((s) => {
      s.theme = nextTheme;
    });
    applyTheme();
  }

  SPhOH.Theme = Object.freeze({
    isDarkActive,
    applyTheme,
    toggleTheme
  });
})(window);
