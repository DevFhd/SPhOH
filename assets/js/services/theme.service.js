/**
 * @file assets/js/services/theme.service.js
 * @description خدمة إدارة المظهر الموحد (فاتح / داكن / تلقائي حسب النظام).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, DOM } = SPhOH;

  const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';
  let mediaBound = false;

  function isDarkActive() {
    const { theme } = Store.getState();
    if (theme === 'auto') {
      return Boolean(global.matchMedia && global.matchMedia(SYSTEM_DARK_QUERY).matches);
    }
    return theme === 'dark';
  }

  /**
   * E9 — لوحة الألوان في variables.css معرّفة مرتين فقط (:root و[data-theme="dark"]).
   * لذلك يُحسم "auto" إلى وضع صريح، ويُكتب دائماً كـ data-theme على <html>.
   */
  function resolveTheme(theme) {
    if (theme === 'dark' || theme === 'light') return theme;
    return global.matchMedia && global.matchMedia(SYSTEM_DARK_QUERY).matches ? 'dark' : 'light';
  }

  /** إعادة تطبيق الثيم عند تغيّر تفضيل النظام — فقط عندما يكون الوضع "auto". */
  function bindSystemTheme() {
    if (mediaBound || !global.matchMedia) return;
    mediaBound = true;

    const mq = global.matchMedia(SYSTEM_DARK_QUERY);
    const onChange = () => {
      if (Store.getState().theme === 'auto') applyTheme();
    };

    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  }

  function applyTheme() {
    const { theme } = Store.getState();
    const root = document.documentElement;

    root.setAttribute('data-theme', resolveTheme(theme));
    root.removeAttribute('data-palette');
    bindSystemTheme();

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
