/**
 * @file assets/js/services/state.service.js
 * @description مخزن الحالة المركزي (Centralized State Store) لتوحيد حالة التطبيق عبر جميع الصفحات.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Catalog, Storage } = SPhOH;

  const savedLang = Storage.getString(Settings.STORAGE_KEYS.LANG, Settings.DEFAULT_LANG);
  const savedTheme = Storage.getString(Settings.STORAGE_KEYS.THEME, Settings.DEFAULT_THEME);
  const savedViewMode = Storage.getString(Settings.STORAGE_KEYS.VIEW_MODE, 'grid');
  const savedBookmarks = Storage.getJSON(Settings.STORAGE_KEYS.BOOKMARKS, []);
  const savedCompleted = Storage.getJSON(Settings.STORAGE_KEYS.COMPLETED, []);

  const state = {
    lang: savedLang === 'en' || savedLang === 'ar' ? savedLang : Settings.DEFAULT_LANG,
    theme: savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : Settings.DEFAULT_THEME,
    resources: Catalog.FALLBACK_RESOURCES.map((item) => ({ ...item })),
    topics: JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS)),
    bookmarks: Array.isArray(savedBookmarks) ? savedBookmarks.map(Number) : [],
    completed: Array.isArray(savedCompleted) ? savedCompleted.map(Number) : [],
    filters: {
      topic: 'all',
      level: 'all',
      status: 'all', // all | bookmarked | completed | pending
      sortBy: 'default', // default | lvl_asc | lvl_desc | downloads | title
      viewMode: savedViewMode === 'list' ? 'list' : 'grid',
      query: ''
    },
    simulator: {
      angle: 53,
      velocity: 24,
      gravity: 9.8,
      isAnimating: false
    },
    commandPalette: {
      isOpen: false,
      query: ''
    },
    preview: {
      id: Settings.DEFAULT_PREVIEW_ID,
      type: 'problem',
      isFocusMode: false,
      zoom: 100
    },
    admin: {
      editingId: null,
      isFormOpen: false
    }
  };

  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    if (typeof updater === 'function') {
      updater(state);
    } else if (updater && typeof updater === 'object') {
      Object.assign(state, updater);
    }
    notify();
  }

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.add(listener);
    }
    return () => listeners.delete(listener);
  }

  function notify() {
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('[SPhOH Store Error]:', err);
      }
    });
  }

  SPhOH.Store = Object.freeze({
    getState,
    setState,
    subscribe,
    notify
  });
})(window);
