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

  function toggleBookmark(id) {
    const numId = Number(id);
    let added = false;

    Store.setState((s) => {
      const idx = s.bookmarks.indexOf(numId);
      if (idx === -1) {
        s.bookmarks.push(numId);
        added = true;
      } else {
        s.bookmarks.splice(idx, 1);
        added = false;
      }
      Storage.setJSON(Settings.STORAGE_KEYS.BOOKMARKS, s.bookmarks);
    });

    if (Toast) {
      Toast.show(I18n.t(added ? 'toast_bookmarked' : 'toast_unbookmarked'));
    }
    return added;
  }

  function toggleCompleted(id) {
    const numId = Number(id);
    let completedNow = false;

    Store.setState((s) => {
      const idx = s.completed.indexOf(numId);
      if (idx === -1) {
        s.completed.push(numId);
        completedNow = true;
      } else {
        s.completed.splice(idx, 1);
        completedNow = false;
      }
      Storage.setJSON(Settings.STORAGE_KEYS.COMPLETED, s.completed);
    });

    if (Toast) {
      Toast.show(I18n.t(completedNow ? 'toast_completed' : 'toast_uncompleted'));
    }
    return completedNow;
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
