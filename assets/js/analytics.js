/**
 * @file assets/js/analytics.js
 * @description تهيئة Google Analytics 4 (gtag) — تُحمَّل على الصفحات العامة الخمس فقط.
 * يسبق هذا الملف وسم تحميل gtag.js الخارجي (async)، لذا يعرّف dataLayer و gtag مسبقاً.
 */
(function (global) {
  'use strict';

  global.dataLayer = global.dataLayer || [];

  global.gtag =
    global.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      global.dataLayer.push(arguments);
    };

  global.gtag('js', new Date());
  global.gtag('config', 'G-018KWMJE3F');
})(window);
