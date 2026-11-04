/**
 * @file assets/js/config/settings.js
 * @description الإعدادات العامة للمنصة، مفاتيح التخزين المحلي، وإعدادات استوديو الإدارة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  SPhOH.Settings = Object.freeze({
    /**
     * كلمة المرور الخاصة باستوديو الإدارة (Admin.html / admin.html)
     * لتغيير كلمة المرور، عدّل القيمة النصية أدناه.
     */
    ADMIN_PASSWORD: '00000000',

    /** اللغة الافتراضية والسمة الافتراضية */
    DEFAULT_LANG: 'ar',
    DEFAULT_THEME: 'auto',
    DEFAULT_PREVIEW_ID: 8,

    /** لواحق ملفات PDF لكل لغة */
    FILE_SUFFIX: Object.freeze({
      ar: 'AR',
      en: 'ENG'
    }),

    /** مفاتيح التخزين في المتصفح (localStorage / sessionStorage) */
    STORAGE_KEYS: Object.freeze({
      LANG: 'sphoh-lang',
      THEME: 'sphoh-theme',
      DOWNLOAD_COUNTS: 'sphoh-download-counts-v1',
      CUSTOM_RESOURCES: 'sphoh-custom-resources-v1',
      CUSTOM_TOPICS: 'sphoh-custom-topics-v1',
      ADMIN_UNLOCKED: 'sphoh-admin-unlocked',
      BOOKMARKS: 'sphoh-bookmarks-v1',
      COMPLETED: 'sphoh-completed-v1',
      VIEW_MODE: 'sphoh-view-mode-v1',
      SCRATCHPAD: 'sphoh-scratchpad-v1'
    }),

    /** الروابط الخارجية وبيانات التواصل */
    LINKS: Object.freeze({
      TELEGRAM: 'https://t.me/sphohc',
      FEEDBACK_FORM: 'https://forms.gle/5dETrhbTAqVMkgGv7',
      EMAIL: 'sphohc@gmail.com',
      RESOURCES_JSON: 'data/resources.json',
      GA_MEASUREMENT_ID: 'G-018KWMJE3F'
    }),

    /** ترتيب عرض الأقسام في صفحة المكتبة */
    TOPIC_DISPLAY_ORDER: Object.freeze([
      'kin',
      'mech',
      'math',
      'coll',
      'elec',
      'therm',
      'opt'
    ])
  });
})(window);
