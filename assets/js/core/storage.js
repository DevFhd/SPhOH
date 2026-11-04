/**
 * @file assets/js/core/storage.js
 * @description غلاف آمن للتعامل مع localStorage و sessionStorage مع معالجة الأخطاء تلقائياً.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  function getString(key, fallback = null, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      const val = store.getItem(key);
      return val !== null ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setString(key, value, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      store.setItem(key, String(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function remove(key, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      store.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function getJSON(key, fallback = null, useSession = false) {
    const raw = getString(key, null, useSession);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setJSON(key, value, useSession = false) {
    try {
      return setString(key, JSON.stringify(value), useSession);
    } catch (_) {
      return false;
    }
  }

  SPhOH.Storage = Object.freeze({
    getString,
    setString,
    remove,
    getJSON,
    setJSON
  });
})(window);
