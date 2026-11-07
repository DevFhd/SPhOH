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
   * إظهار رسالة إشعار مؤقتة أسفل الشاشة، مع إمكانية إضافة زر إجراء (مثل «تراجع»).
   * @param {string} message
   * @param {number|{duration?: number, actionLabel?: string, onAction?: Function}} [options=3200]
   */
  function show(message, options = 3200) {
    const config = typeof options === 'number' ? { duration: options } : options || {};
    const duration = Number(config.duration) > 0 ? Number(config.duration) : 3200;
    const actionLabel = typeof config.actionLabel === 'string' ? config.actionLabel : '';
    const onAction = typeof config.onAction === 'function' ? config.onAction : null;

    let toastEl = DOM.qs('#toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }

    toastEl.innerHTML = '';

    if (actionLabel && onAction) {
      const textEl = document.createElement('span');
      textEl.textContent = message;

      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'toast-action';
      actionBtn.textContent = actionLabel;
      actionBtn.addEventListener('click', () => {
        toastEl.hidden = true;
        clearTimeout(hideTimer);
        try {
          onAction();
        } catch (err) {
          console.error('[SPhOH Toast Action Error]:', err);
        }
      });

      toastEl.appendChild(textEl);
      toastEl.appendChild(actionBtn);
    } else {
      toastEl.textContent = message;
    }

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
