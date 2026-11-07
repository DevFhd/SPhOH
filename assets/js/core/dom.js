/**
 * @file assets/js/core/dom.js
 * @description دوال مساعدة للتعامل مع عناصر DOM، حماية النصوص من XSS، والنسخ إلى الحافظة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  /**
   * اختيار عنصر واحد من الصفحة
   * @param {string} selector
   * @param {ParentNode} [root=document]
   * @returns {Element|null}
   */
  function qs(selector, root = document) {
    return (root || document).querySelector(selector);
  }

  /**
   * اختيار مجموعة عناصر من الصفحة وإرجاعها كمصفوفة
   * @param {string} selector
   * @param {ParentNode} [root=document]
   * @returns {Element[]}
   */
  function qsa(selector, root = document) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  /**
   * تعقيم النصوص قبل إدراجها في HTML لمنع ثغرات XSS
   * @param {*} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * تأخير تنفيذ دالة حتى تتوقف الاستدعاءات المتكررة (بحث فوري بلا إرهاق للرسم).
   * المستدعون: `app.js` لحقلي البحث في المكتبة واستوديو الإدارة، ويُصدَّر ضمن `SPhOH.DOM`.
   * @param {Function} fn
   * @param {number} [wait=120] بالميلي ثانية
   * @returns {Function & { cancel: () => void }}
   */
  function debounce(fn, wait = 120) {
    let timer = null;
    const debounced = function (...args) {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, wait);
    };
    debounced.cancel = () => {
      if (timer !== null) clearTimeout(timer);
      timer = null;
    };
    return debounced;
  }

  /**
   * نسخ نص إلى الحافظة مع بديل متوافق لجميع المتصفحات
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // المتابعة للطريقة البديلة
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (_) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  }

  /**
   * تنزيل محتوى نصي كملف مباشرة من المتصفح
   * @param {string} filename
   * @param {string} content
   * @param {string} [mimeType='application/json;charset=utf-8']
   */
  function downloadTextFile(filename, content, mimeType = 'application/json;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  SPhOH.DOM = Object.freeze({
    qs,
    qsa,
    escapeHtml,
    debounce,
    copyToClipboard,
    downloadTextFile
  });
})(window);
