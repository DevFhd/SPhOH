/**
 * @file assets/js/components/toast.component.js
 * @description مكوّن الإشعارات المنبثقة (Toast Notifications).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { DOM } = SPhOH;

  let hideTimer = null;

  /**
   * إظهار رسالة إشعار مؤقتة أسفل الشاشة
   * @param {string} message
   * @param {number} [duration=3200]
   */
  function show(message, duration = 3200) {
    let toastEl = DOM.qs('#toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;
    toastEl.hidden = false;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, duration);
  }

  SPhOH.Toast = Object.freeze({
    show
  });
})(window);
