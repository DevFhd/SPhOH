/**
 * @file assets/js/components/card.component.js
 * @description مكوّن بناء بطاقة المنهج المعمارية ثنائية الطبقة (Two-Tone Architectural Bento Card)
 * مع شريط تخصص علوي ملون، رقم تسلسلي أكاديمي، وصف كامل دائماً، ودرج إجراءات سفلي.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Catalog, Store, I18n, CurriculumService, Progress, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  const TOPIC_ICONS = {
    kin: '🚀',
    mech: '⚙️',
    math: '📐',
    coll: '🏆',
    elec: '⚡',
    therm: '🔥',
    opt: '🔭'
  };

  function renderTags(resource) {
    const { lang, topics } = Store.getState();
    const level = Number(resource.l || 1);

    let pipsHtml = '';
    for (let i = 1; i <= 3; i += 1) {
      pipsHtml += `<b${i <= level ? ' class="on"' : ''}></b>`;
    }

    const icon = TOPIC_ICONS[resource.t] || '⚛️';
    const topicLabel = topics[resource.t]?.[lang] || resource.t;
    const levelLabel = Catalog.LEVELS[level]?.[lang] || `L${level}`;

    return `
      <span class="tag" data-topic="${escapeHtml(resource.t)}">
        <span class="tag-icon" aria-hidden="true">${icon}</span>
        ${escapeHtml(topicLabel)}
      </span>
      <span class="tag lvl" data-lvl="${escapeHtml(level)}">
        <span class="pips">${pipsHtml}</span>${escapeHtml(levelLabel)}
      </span>
    `;
  }

  function renderCard(resource, counts = {}, options = {}) {
    const lang = I18n.getLang();
    // `interactive: false` يعرض الشكل نفسه بلا روابط أو إجراءات (معاينة الإدارة).
    const interactive = options.interactive !== false;
    const pdfPath = CurriculumService.getProblemPdfPath(resource, lang);
    const solutionPath = CurriculumService.getSolutionPdfPath(resource, lang);

    const title = resource.title?.[lang] || resource.title?.en || resource.file || '';
    const desc = CurriculumService.getDisplayDescription(resource, lang);

    const probCount = pdfPath ? Number(counts[pdfPath] || 0) : 0;
    const solCount = solutionPath ? Number(counts[solutionPath] || 0) : 0;

    const saved = Progress ? Progress.isBookmarked(resource.id) : false;
    const done = Progress ? Progress.isCompleted(resource.id) : false;

    const serialCode = `SET #${String(resource.id || 1).padStart(2, '0')}`;

    const previewProblemHref = `preview.html?id=${encodeURIComponent(resource.id)}&type=problem`;
    const previewSolHref = `preview.html?id=${encodeURIComponent(resource.id)}&type=solution`;
    const formatDownloads = I18n.t('downloads_label');

    const problemActionsHtml = pdfPath
      ? `
        ${interactive
          ? `<a href="${escapeHtml(previewProblemHref)}"
           class="btn btn-primary btn-sm"
           data-open-preview="${escapeHtml(resource.id)}"
           data-preview-type="problem">${escapeHtml(I18n.t('btn_preview'))}</a>
        <a href="${escapeHtml(pdfPath)}"
           download
           class="btn btn-ghost btn-sm"
           data-download-key="${escapeHtml(pdfPath)}">${escapeHtml(I18n.t('btn_download'))}</a>`
          : `<span class="btn btn-primary btn-sm">${escapeHtml(I18n.t('btn_preview'))}</span>
        <span class="btn btn-ghost btn-sm">${escapeHtml(I18n.t('btn_download'))}</span>`}
        <span class="download-count" data-count-for="${escapeHtml(pdfPath)}">${escapeHtml(formatDownloads(probCount))}</span>
      `
      : `
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable"${interactive ? ' data-missing-file="problem"' : ''}>${escapeHtml(I18n.t('btn_preview'))}</button>
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable"${interactive ? ' data-missing-file="problem"' : ''}>${escapeHtml(I18n.t('btn_download'))}</button>
      `;

    const solutionActionsHtml = solutionPath
      ? `
        ${interactive
          ? `<a href="${escapeHtml(previewSolHref)}"
           class="btn btn-primary btn-sm solution-action"
           data-open-preview="${escapeHtml(resource.id)}"
           data-preview-type="solution">${escapeHtml(I18n.t('solution_preview'))}</a>
        <a href="${escapeHtml(solutionPath)}"
           download
           class="btn btn-ghost btn-sm solution-action"
           data-download-key="${escapeHtml(solutionPath)}">${escapeHtml(I18n.t('solution_download'))}</a>`
          : `<span class="btn btn-primary btn-sm solution-action">${escapeHtml(I18n.t('solution_preview'))}</span>
        <span class="btn btn-ghost btn-sm solution-action">${escapeHtml(I18n.t('solution_download'))}</span>`}
        <span class="download-count" data-count-for="${escapeHtml(solutionPath)}">${escapeHtml(formatDownloads(solCount))}</span>
      `
      : `
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action"${interactive ? ' data-missing-file="solution"' : ''}>${escapeHtml(I18n.t('solution_preview'))}</button>
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action"${interactive ? ' data-missing-file="solution"' : ''}>${escapeHtml(I18n.t('solution_download'))}</button>
      `;

    return `
      <article class="card ${done ? 'is-completed-card' : ''} ${saved ? 'is-bookmarked-card' : ''}" data-card-topic="${escapeHtml(resource.t || 'kin')}">
        <div class="card-accent-bar" aria-hidden="true"></div>
        <div class="card-body-main">
          <div class="card-top-row">
            <div class="tags">${renderTags(resource)}</div>
            <div class="card-quick-toggles">
              <span class="card-serial-code">${escapeHtml(serialCode)}</span>
              ${interactive
                ? `<button type="button"
                      class="card-status-btn ${saved ? 'is-active-bookmark' : ''}"
                      data-toggle-bookmark="${escapeHtml(resource.id)}"
                      title="${escapeHtml(I18n.t(saved ? 'bookmark_remove' : 'bookmark_add'))}"
                      aria-label="${escapeHtml(I18n.t(saved ? 'bookmark_remove' : 'bookmark_add'))}">
                ${saved ? '★' : '☆'}
              </button>
              <button type="button"
                      class="card-status-btn ${done ? 'is-active-done' : ''}"
                      data-toggle-complete="${escapeHtml(resource.id)}"
                      title="${escapeHtml(I18n.t(done ? 'complete_remove' : 'complete_add'))}"
                      aria-label="${escapeHtml(I18n.t(done ? 'complete_remove' : 'complete_add'))}">
                ${done ? '✓' : '○'}
              </button>`
                : `<span class="card-status-btn ${saved ? 'is-active-bookmark' : ''}" aria-hidden="true">${saved ? '★' : '☆'}</span>
              <span class="card-status-btn ${done ? 'is-active-done' : ''}" aria-hidden="true">${done ? '✓' : '○'}</span>`}
            </div>
          </div>
          <h3 class="h3 card-title-heading mt-xs">${escapeHtml(title)}</h3>
          <p class="card-desc-text mt-xs">${escapeHtml(desc)}</p>
        </div>
        <div class="card-actions-group">
          <div class="action-row">${problemActionsHtml}</div>
          <div class="action-row">${solutionActionsHtml}</div>
        </div>
      </article>
    `;
  }

  SPhOH.CardComponent = Object.freeze({
    renderTags,
    renderCard
  });
})(window);
