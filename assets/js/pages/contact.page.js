/**
 * @file assets/js/pages/contact.page.js
 * @description وحدة صفحة التواصل والمجتمع (contact.html).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, I18n, Toast, DOM } = SPhOH;

  async function copyOfficialEmail() {
    await DOM.copyToClipboard(Settings.LINKS.EMAIL);
    Toast.show(I18n.t('email_copied'));
  }

  SPhOH.ContactPage = Object.freeze({
    copyOfficialEmail
  });
})(window);
