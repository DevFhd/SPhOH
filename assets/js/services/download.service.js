/**
 * @file assets/js/services/download.service.js
 * @description خدمة تتبع عدد مرات تحميل ملفات PDF وتحديث الشارات التفاعلية.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, I18n, DOM } = SPhOH;

  const memoryCounts = {};

  function syncFromStorage() {
    const saved = Storage.getJSON(Settings.STORAGE_KEYS.DOWNLOAD_COUNTS, {});
    if (saved && typeof saved === 'object') {
      Object.keys(saved).forEach((key) => {
        memoryCounts[key] = Math.max(Number(memoryCounts[key] || 0), Number(saved[key] || 0));
      });
    }
    return memoryCounts;
  }

  function getCount(fileKey) {
    if (!fileKey) return 0;
    const all = syncFromStorage();
    return Number(all[fileKey] || 0);
  }

  function getAllCounts() {
    return syncFromStorage();
  }

  function recordDownload(fileKey) {
    if (!fileKey) return 0;
    const counts = syncFromStorage();
    counts[fileKey] = Number(counts[fileKey] || 0) + 1;
    memoryCounts[fileKey] = counts[fileKey];

    Storage.setJSON(Settings.STORAGE_KEYS.DOWNLOAD_COUNTS, memoryCounts);

    const labelFn = I18n.t('downloads_label');
    DOM.qsa('[data-count-for]').forEach((badge) => {
      if (badge.getAttribute('data-count-for') === fileKey) {
        badge.textContent = typeof labelFn === 'function' ? labelFn(memoryCounts[fileKey]) : `↓ ${memoryCounts[fileKey]}`;
        badge.classList.remove('is-bumped');
        void badge.offsetWidth;
        badge.classList.add('is-bumped');
        setTimeout(() => badge.classList.remove('is-bumped'), 600);
      }
    });

    return memoryCounts[fileKey];
  }

  syncFromStorage();

  SPhOH.Downloads = Object.freeze({
    getCount,
    getAllCounts,
    recordDownload
  });
})(window);
