/**
 * @file assets/js/services/i18n.service.js
 * @description خدمة إدارة اللغات والترجمة واتجاه الصفحة (RTL / LTR).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Locales, Storage, Store, DOM } = SPhOH;

  /**
   * جلب النص المترجم حسب المفتاح واللغة الحالية
   * @param {string} key
   * @param {string} [targetLang]
   * @returns {*}
   */
  function t(key, targetLang) {
    const lang = targetLang || Store.getState().lang;
    const dict = Locales[lang] || Locales[Settings.DEFAULT_LANG] || {};
    return dict[key] !== undefined ? dict[key] : key;
  }

  /**
   * الحصول على اللغة الحالية
   * @returns {'ar'|'en'}
   */
  function getLang() {
    return Store.getState().lang;
  }

  /**
   * تغيير اللغة وحفظها وتحديث الواجهة
   * @param {'ar'|'en'} nextLang
   */
  function setLang(nextLang) {
    const validLang = nextLang === 'en' ? 'en' : 'ar';
    Storage.setString(Settings.STORAGE_KEYS.LANG, validLang);
    Store.setState((s) => {
      s.lang = validLang;
    });
    applyDocumentLang();
  }

  /**
   * التبديل بين اللغتين العربية والإنجليزية
   */
  function toggleLang() {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
  }

  /**
   * تطبيق اللغة واتجاه الصفحة على جميع العناصر التي تحمل السمة [data-i18n]
   */
  function applyDocumentLang() {
    const lang = getLang();
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    DOM.qsa('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = t(key, lang);
      if (typeof value === 'string') {
        el.textContent = value;
      }
    });

    [
      ['data-i18n-placeholder', 'placeholder'],
      ['data-i18n-aria-label', 'aria-label'],
      ['data-i18n-title', 'title'],
      ['data-i18n-alt', 'alt']
    ].forEach(([dataAttr, targetAttr]) => {
      DOM.qsa(`[${dataAttr}]`).forEach((el) => {
        const value = t(el.getAttribute(dataAttr), lang);
        if (typeof value === 'string') {
          el.setAttribute(targetAttr, value);
        }
      });
    });

    DOM.qsa('#langBtn [data-l]').forEach((span) => {
      span.classList.toggle('on', span.getAttribute('data-l') === lang);
    });
  }

  SPhOH.I18n = Object.freeze({
    t,
    getLang,
    setLang,
    toggleLang,
    applyDocumentLang
  });
})(window);
