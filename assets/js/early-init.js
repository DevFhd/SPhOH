/**
 * @file assets/js/early-init.js
 * @description تهيئة مبكرة للغة والاتجاه والثيم قبل أول رسم — تُحمَّل بشكل حاجب في <head>.
 * يجب إبقاؤها متوافقة مع I18n.applyDocumentLang() و Theme.applyTheme().
 */
(function (global) {
  'use strict';

  try {
    var root = global.document.documentElement;
    var storage = global.localStorage;

    var lang = storage.getItem('sphoh-lang');
    lang = lang === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // E9 — لوحة الألوان في CSS معرّفة مرة واحدة لكل وضع، لذا يُحسم "auto"
    // إلى وضع صريح (dark/light) قبل أول رسم بدل الاعتماد على استعلام وسائط.
    var theme = storage.getItem('sphoh-theme');
    if (theme !== 'dark' && theme !== 'light') {
      theme = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', theme);
  } catch (_) {
    /* التخزين معطّل — ستطبّق الخدمات القيم الافتراضية بعد الإقلاع */
  }
})(window);
