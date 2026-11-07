/**
 * @file assets/js/services/progress.service.js
 * @description خدمة تتبع تقدم الطالب، المفضلة (Bookmarks)، والمجموعات المكتملة (Completed Sets).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, Toast } = SPhOH;

  function isBookmarked(id) {
    return Store.getState().bookmarks.includes(Number(id));
  }

  function isCompleted(id) {
    return Store.getState().completed.includes(Number(id));
  }

  /**
   * يعكس تبديلاً في مصفوفة معرّفات بعد فشل الكتابة إلى التخزين، حتى لا يظهر
   * التقدم محفوظاً في الذاكرة بينما يضيع بعد إعادة التحميل.
   */
  function revertToggle(list, numId, added) {
    const idx = list.indexOf(numId);
    if (added) {
      if (idx !== -1) list.splice(idx, 1);
    } else if (idx === -1) {
      list.push(numId);
    }
  }

  function toggleBookmark(id) {
    const numId = Number(id);
    let added = false;
    let stored = true;

    Store.setState((s) => {
      const idx = s.bookmarks.indexOf(numId);
      if (idx === -1) {
        s.bookmarks.push(numId);
        added = true;
      } else {
        s.bookmarks.splice(idx, 1);
        added = false;
      }
      stored = Storage.setJSON(Settings.STORAGE_KEYS.BOOKMARKS, s.bookmarks);
    });

    if (!stored) {
      Store.setState((s) => revertToggle(s.bookmarks, numId, added));
    }

    if (Toast) {
      Toast.show(I18n.t(stored ? (added ? 'toast_bookmarked' : 'toast_unbookmarked') : 'storage_error'));
    }
    return stored ? added : false;
  }

  function toggleCompleted(id) {
    const numId = Number(id);
    let completedNow = false;
    let stored = true;

    Store.setState((s) => {
      const idx = s.completed.indexOf(numId);
      if (idx === -1) {
        s.completed.push(numId);
        completedNow = true;
      } else {
        s.completed.splice(idx, 1);
        completedNow = false;
      }
      stored = Storage.setJSON(Settings.STORAGE_KEYS.COMPLETED, s.completed);
    });

    if (!stored) {
      Store.setState((s) => revertToggle(s.completed, numId, completedNow));
    }

    if (Toast) {
      Toast.show(I18n.t(stored ? (completedNow ? 'toast_completed' : 'toast_uncompleted') : 'storage_error'));
    }
    return stored ? completedNow : false;
  }

  function getProgressSummary() {
    const { resources, completed, bookmarks } = Store.getState();
    const total = resources.length || 1;
    const validIds = new Set(resources.map((r) => Number(r.id)));
    const doneCount = completed.filter((id) => validIds.has(Number(id))).length;
    const savedCount = bookmarks.filter((id) => validIds.has(Number(id))).length;
    const percentage = Math.min(100, Math.round((doneCount / total) * 100));

    return {
      doneCount,
      savedCount,
      total: resources.length,
      percentage
    };
  }

  SPhOH.Progress = Object.freeze({
    isBookmarked,
    isCompleted,
    toggleBookmark,
    toggleCompleted,
    getProgressSummary
  });
})(window);
