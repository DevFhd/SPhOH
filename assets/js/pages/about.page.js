/**
 * @file assets/js/pages/about.page.js
 * @description وحدة صفحة من نحن والفريق (about.html).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Catalog, Store, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  function renderTeam() {
    const container = DOM.qs('#teamContainer');
    if (!container) return;

    const { lang } = Store.getState();

    container.innerHTML = Catalog.TEAM.map(
      (member) => `
        <div class="member-item">
          <span class="member-name">${escapeHtml(member.name)}</span>
          <span class="member-role">${escapeHtml(member.role[lang] || member.role.en)}</span>
        </div>
      `
    ).join('');
  }

  function render() {
    renderTeam();
  }

  SPhOH.AboutPage = Object.freeze({
    render,
    renderTeam
  });
})(window);
