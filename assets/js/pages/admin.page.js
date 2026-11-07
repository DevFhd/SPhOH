/**
 * @file assets/js/pages/admin.page.js
 * @description استوديو إدارة المناهج المتكامل وسهل الاستخدام (SPhOH Content Studio):
 * - عرض الوصف الكامل لكل منهج في قائمة الاستوديو
 * - زر التوليد التلقائي الذكي للوصف باللغتين (✨ توليد وصف تلقائي)
 * - المعاينة الحية للبطاقة ومنطقة السحب والإفلات ومصفوفة التبديل السريع
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Catalog, Storage, Store, I18n, CurriculumService, CardComponent, Toast, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let studioSearchQuery = '';
  let studioTopicFilter = 'all';

  const UNDO_WINDOW_MS = 10000;
  const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_MS = 30000;

  let sessionUnlocked = false;
  let failedAttempts = 0;
  let lockedUntil = 0;

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function isUnlocked() {
    if (sessionUnlocked) return true;
    const raw = Storage.getString(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, '0', true);
    if (!raw || raw === '0') return false;

    const stamp = Number(String(raw).split('|')[1]);
    if (!stamp || Date.now() - stamp > ADMIN_SESSION_TTL_MS) {
      Storage.remove(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, true);
      return false;
    }
    return true;
  }

  function setUnlocked(unlocked) {
    if (unlocked) {
      sessionUnlocked = true;
      return Storage.setString(
        Settings.STORAGE_KEYS.ADMIN_UNLOCKED,
        `1|${Date.now()}`,
        true
      );
    }
    sessionUnlocked = false;
    Storage.remove(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, true);
    return true;
  }

  function snapshotState() {
    const { resources, topics } = Store.getState();
    return {
      resources: JSON.parse(JSON.stringify(resources || [])),
      topics: JSON.parse(JSON.stringify(topics || {}))
    };
  }

  function restoreSnapshot(snapshot) {
    if (!snapshot) return;
    const okResources = CurriculumService.saveAll(snapshot.resources);
    const okTopics = CurriculumService.saveTopics(snapshot.topics);
    document.dispatchEvent(new Event('sphoh:refresh'));
    Toast.show(I18n.t(okResources && okTopics ? 'admin_undo_toast' : 'admin_storage_error'));
  }

  function offerUndo(message, snapshot) {
    Toast.show(message, {
      duration: UNDO_WINDOW_MS,
      actionLabel: I18n.t('admin_undo_btn'),
      onAction: () => restoreSnapshot(snapshot)
    });
  }

  function updateStemPathHint() {
    const stemInput = DOM.qs('#adminFileStem');
    const hintEl = DOM.qs('#adminStemHint');
    if (!stemInput || !hintEl) return;

    const stem = CurriculumService.normalizeStem(stemInput.value) || 'New_Curriculum_I';
    const problemAr = CurriculumService.buildResourcePath(stem, 'ar');
    const problemEn = CurriculumService.buildResourcePath(stem, 'en');
    const solutionAr = CurriculumService.buildResourcePath(`${stem}_Solutions`, 'ar');
    const solutionEn = CurriculumService.buildResourcePath(`${stem}_Solutions`, 'en');
    const pathLabel = (value) => escapeHtml(value || '—');

    hintEl.innerHTML = `
      <div>📘 <b>${pathLabel(problemAr)}</b> &nbsp;|&nbsp; <b>${pathLabel(problemEn)}</b></div>
      <div>✅ <b>${pathLabel(solutionAr)}</b> &nbsp;|&nbsp; <b>${pathLabel(solutionEn)}</b></div>
    `;

    renderLiveCardPreview();
  }

  function getDraftFromForm() {
    const topicVal = DOM.qs('#adminTopic')?.value || 'kin';
    const levelVal = Number(DOM.qs('#adminLevel')?.value || 1);
    const stemVal =
      CurriculumService.normalizeStem(DOM.qs('#adminFileStem')?.value) || 'Sample_Set_I';

    const titleAr = DOM.qs('#adminTitleAr')?.value || '';
    const titleEn = DOM.qs('#adminTitleEn')?.value || '';
    const descAr = DOM.qs('#adminDescAr')?.value || '';
    const descEn = DOM.qs('#adminDescEn')?.value || '';
    const solMode = DOM.qs('#adminSolutionMode')?.value || 'none';
    const probLangs = DOM.qs('#adminProblemLangs')?.value || 'both';

    let solField = null;
    if (solMode === 'both') solField = `${stemVal}_Solutions`;
    else if (solMode === 'ar') solField = { ar: `${stemVal}_Solutions`, en: null };
    else if (solMode === 'en') solField = { ar: null, en: `${stemVal}_Solutions` };

    const draft = {
      id: 999,
      t: topicVal === '__new__' ? DOM.qs('#adminNewTopicKey')?.value || 'kin' : topicVal,
      l: levelVal,
      file: stemVal,
      solution: solField,
      title: {
        ar: titleAr || I18n.t('admin_sample_title'),
        en: titleEn || I18n.t('admin_sample_title')
      },
      desc: {
        ar: descAr,
        en: descEn
      }
    };

    const autoDesc = CurriculumService.generateSmartDescription(draft);
    if (!draft.desc.ar) draft.desc.ar = autoDesc.ar;
    if (!draft.desc.en) draft.desc.en = autoDesc.en;

    if (probLangs === 'ar') draft.langs = ['ar'];
    else if (probLangs === 'en') draft.langs = ['en'];

    return draft;
  }

  function fillSmartDescriptionIntoForm() {
    const draft = getDraftFromForm();
    const autoDesc = CurriculumService.generateSmartDescription(draft);
    const descArEl = DOM.qs('#adminDescAr');
    const descEnEl = DOM.qs('#adminDescEn');
    if (descArEl) descArEl.value = autoDesc.ar;
    if (descEnEl) descEnEl.value = autoDesc.en;
    renderLiveCardPreview();
    Toast.show(I18n.t('admin_auto_desc_toast'));
  }

  function renderLiveCardPreview() {
    const previewContainer = DOM.qs('#adminLiveCardPreview');
    if (!previewContainer) return;

    const { lang } = Store.getState();
    const draftResource = getDraftFromForm();

    previewContainer.innerHTML = `
      <div class="studio-preview-badge">
        <span>👁️ ${I18n.t('admin_preview_badge')}</span>
        <span>${lang.toUpperCase()}</span>
      </div>
      ${CardComponent.renderCard(draftResource, {}, { interactive: false })}
    `;
  }

  function toggleNewTopicBox() {
    const topicSelect = DOM.qs('#adminTopic');
    const newTopicBox = DOM.qs('#adminNewTopicBox');
    if (!topicSelect || !newTopicBox) return;

    const isNew = topicSelect.value === '__new__';
    newTopicBox.hidden = !isNew;

    const arInput = DOM.qs('#adminNewTopicAr');
    const enInput = DOM.qs('#adminNewTopicEn');
    if (arInput) arInput.required = isNew;
    if (enInput) enInput.required = isNew;
    renderLiveCardPreview();
  }

  function ensureStudioEnhancements() {
    const dashboard = DOM.qs('#adminDashboard');
    if (!dashboard) return;

    if (!DOM.qs('#adminKpiStrip', dashboard)) {
      const kpiStrip = document.createElement('div');
      kpiStrip.id = 'adminKpiStrip';
      kpiStrip.className = 'studio-kpi-grid';
      dashboard.prepend(kpiStrip);
    }

    const formDrawer = DOM.qs('#adminFormModalCard', dashboard);
    const formEl = DOM.qs('#adminResourceForm', formDrawer);
    if (formDrawer && formEl && !DOM.qs('.studio-editor-layout', formDrawer)) {
      // جعل حقول الوصف اختيارية (تُملأ تلقائياً إن تُركت فارغة) وإضافة زر التوليد الذكي
      const descArEl = DOM.qs('#adminDescAr', formEl);
      const descEnEl = DOM.qs('#adminDescEn', formEl);
      if (descArEl) descArEl.required = false;
      if (descEnEl) descEnEl.required = false;

      const descArField = descArEl?.closest('.admin-field');
      if (descArField && !DOM.qs('#adminAutoDescBtn', descArField)) {
        const labelEl = DOM.qs('label', descArField);
        if (labelEl) {
          const row = document.createElement('div');
          row.className = 'admin-stem-label-row';
          labelEl.parentNode.insertBefore(row, labelEl);
          row.appendChild(labelEl);

          const autoBtn = document.createElement('button');
          autoBtn.type = 'button';
          autoBtn.id = 'adminAutoDescBtn';
          autoBtn.className = 'btn btn-ghost btn-sm admin-pick-pdf-btn';
          autoBtn.textContent = I18n.t('admin_btn_auto_desc');
          row.appendChild(autoBtn);
        }
      }

      const solModeField = DOM.qs('#adminSolutionMode', formEl)?.closest('.admin-field');
      if (solModeField && !DOM.qs('#adminProblemLangs', formEl)) {
        const probLangField = document.createElement('div');
        probLangField.className = 'admin-field full';
        probLangField.innerHTML = `
          <label for="adminProblemLangs" id="adminLblProbLangs">${I18n.t('admin_lbl_prob_langs')}</label>
          <select class="admin-select" id="adminProblemLangs">
            <option value="both">${I18n.t('admin_prob_both')}</option>
            <option value="ar">${I18n.t('admin_prob_ar')}</option>
            <option value="en">${I18n.t('admin_prob_en')}</option>
          </select>
        `;
        formEl.insertBefore(probLangField, solModeField);
      }

      const layoutWrap = document.createElement('div');
      layoutWrap.className = 'studio-editor-layout';
      formEl.parentNode.insertBefore(layoutWrap, formEl);
      layoutWrap.appendChild(formEl);

      const previewPane = document.createElement('div');
      previewPane.id = 'adminLiveCardPreview';
      previewPane.className = 'studio-live-preview-pane';
      layoutWrap.appendChild(previewPane);

      const filePicker = DOM.qs('#adminPdfFilePicker', formEl);
      const stemRow = filePicker?.closest('.admin-stem-label-row');
      if (stemRow && !stemRow.classList.contains('studio-dropzone')) {
        stemRow.classList.add('studio-dropzone');
        stemRow.addEventListener('dragover', (e) => {
          e.preventDefault();
          stemRow.classList.add('is-dragover');
        });
        stemRow.addEventListener('dragleave', () => stemRow.classList.remove('is-dragover'));
        stemRow.addEventListener('drop', (e) => {
          e.preventDefault();
          stemRow.classList.remove('is-dragover');
          const droppedFile = e.dataTransfer?.files?.[0];
          if (droppedFile) {
            applyPickedPdfFile(droppedFile);
          }
        });
      }
    }

    const listEl = DOM.qs('#adminResourcesList', dashboard);
    if (listEl && !DOM.qs('#studioListToolbar', listEl.parentNode)) {
      const toolbar = document.createElement('div');
      toolbar.id = 'studioListToolbar';
      toolbar.className = 'studio-list-toolbar';
      listEl.parentNode.insertBefore(toolbar, listEl);
    }

    const dbToolsBody = DOM.qs('.admin-db-tools-body', dashboard);
    if (dbToolsBody && !DOM.qs('#adminImportJsonInput', dbToolsBody)) {
      const importLabel = document.createElement('label');
      importLabel.className = 'btn btn-ghost btn-sm';
      importLabel.style.cursor = 'pointer';
      importLabel.innerHTML = `
        <span id="adminImportJsonLabel">${I18n.t('admin_import_json_btn')}</span>
        <input type="file" id="adminImportJsonInput" accept=".json,application/json" class="sr-only">
      `;
      dbToolsBody.prepend(importLabel);
    }
  }

  // E6 — إدارة التركيز لدرج النموذج: نحفظ العنصر الذي فتح الدرج لنعيد التركيز إليه عند الإغلاق.
  let drawerOpener = null;

  function focusSafely(el) {
    if (!el || typeof el.focus !== 'function') return;
    try {
      el.focus({ preventScroll: true });
    } catch (_) {
      el.focus();
    }
  }

  function openFormDrawer(isEdit = false) {
    ensureStudioEnhancements();
    Store.setState((s) => {
      s.admin.isFormOpen = true;
    });

    const drawer = DOM.qs('#adminFormModalCard');
    if (drawer) {
      if (!drawerOpener) drawerOpener = document.activeElement;
      drawer.hidden = false;
      drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const openerBtn = DOM.qs('#openAddCurriculumBtn');
    if (openerBtn) openerBtn.setAttribute('aria-expanded', 'true');

    const heading = DOM.qs('#adminFormHeading');
    if (heading) {
      heading.textContent = isEdit ? I18n.t('admin_form_edit_title') : I18n.t('admin_form_add_title');
    }
    renderLiveCardPreview();
    focusSafely(DOM.qs('#adminTopic'));
  }

  function resetFormDrawer() {
    const wasOpen = Boolean(Store.getState().admin.isFormOpen);

    Store.setState((s) => {
      s.admin.editingId = null;
      s.admin.isFormOpen = false;
    });

    const form = DOM.qs('#adminResourceForm');
    if (form) form.reset();

    const newTopicBox = DOM.qs('#adminNewTopicBox');
    if (newTopicBox) newTopicBox.hidden = true;

    const drawer = DOM.qs('#adminFormModalCard');
    if (drawer) drawer.hidden = true;

    const openerBtn = DOM.qs('#openAddCurriculumBtn');
    if (openerBtn) openerBtn.setAttribute('aria-expanded', 'false');

    if (wasOpen) {
      focusSafely(drawerOpener || openerBtn);
      drawerOpener = null;
    }

    updateStemPathHint();
  }

  function populateFormForEdit(id) {
    ensureStudioEnhancements();
    const resource = CurriculumService.findById(id);
    if (!resource) return;

    Store.setState((s) => {
      s.admin.editingId = Number(resource.id);
    });

    openFormDrawer(true);

    const topicSel = DOM.qs('#adminTopic');
    const lvlSel = DOM.qs('#adminLevel');
    const stemIn = DOM.qs('#adminFileStem');
    const titleAr = DOM.qs('#adminTitleAr');
    const titleEn = DOM.qs('#adminTitleEn');
    const descAr = DOM.qs('#adminDescAr');
    const descEn = DOM.qs('#adminDescEn');
    const solMode = DOM.qs('#adminSolutionMode');
    const probLangs = DOM.qs('#adminProblemLangs');
    const cancelBtn = DOM.qs('#adminCancelEditBtn');

    if (topicSel) {
      topicSel.value = resource.t || 'kin';
      toggleNewTopicBox();
    }
    if (lvlSel) lvlSel.value = String(resource.l || 1);
    if (stemIn) {
      stemIn.value = CurriculumService.getFileStemForLang(resource, Store.getState().lang) || '';
    }
    if (titleAr) titleAr.value = resource.title?.ar || '';
    if (titleEn) titleEn.value = resource.title?.en || '';
    if (descAr) descAr.value = CurriculumService.getDisplayDescription(resource, 'ar');
    if (descEn) descEn.value = CurriculumService.getDisplayDescription(resource, 'en');

    if (probLangs) {
      const hasArProb = CurriculumService.hasProblemForLang(resource, 'ar');
      const hasEnProb = CurriculumService.hasProblemForLang(resource, 'en');
      if (hasArProb && hasEnProb) probLangs.value = 'both';
      else if (hasArProb) probLangs.value = 'ar';
      else probLangs.value = 'en';
    }

    const hasAr = Boolean(CurriculumService.getSolutionStemForLang(resource, 'ar'));
    const hasEn = Boolean(CurriculumService.getSolutionStemForLang(resource, 'en'));

    if (solMode) {
      if (hasAr && hasEn) solMode.value = 'both';
      else if (hasAr) solMode.value = 'ar';
      else if (hasEn) solMode.value = 'en';
      else solMode.value = 'none';
    }

    if (cancelBtn) cancelBtn.hidden = false;
    updateStemPathHint();
  }

  function renderStudioKpis() {
    const kpiStrip = DOM.qs('#adminKpiStrip');
    if (!kpiStrip) return;

    const { resources, topics } = Store.getState();
    const total = resources.length;
    const arProblems = resources.filter((r) => CurriculumService.hasProblemForLang(r, 'ar')).length;
    const enProblems = resources.filter((r) => CurriculumService.hasProblemForLang(r, 'en')).length;
    const withSolutions = resources.filter(
      (r) => Boolean(CurriculumService.getSolutionStemForLang(r, 'ar')) || Boolean(CurriculumService.getSolutionStemForLang(r, 'en'))
    ).length;

    kpiStrip.innerHTML = `
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${total}</span>
        <span class="studio-kpi-lbl">${I18n.t('admin_kpi_total')}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${arProblems} / ${enProblems}</span>
        <span class="studio-kpi-lbl">${I18n.t('admin_kpi_pdfs')}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${withSolutions} / ${total}</span>
        <span class="studio-kpi-lbl">${I18n.t('admin_kpi_solutions')}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${Object.keys(topics).length}</span>
        <span class="studio-kpi-lbl">${I18n.t('admin_kpi_sections')}</span>
      </div>
    `;
  }

  function renderStudioListToolbar() {
    const toolbar = DOM.qs('#studioListToolbar');
    if (!toolbar) return;

    const { resources, topics, lang } = Store.getState();
    const usedTopics = ['all'];
    resources.forEach((r) => {
      if (!usedTopics.includes(r.t)) usedTopics.push(r.t);
    });

    const chipsHtml = usedTopics
      .map((tKey) => {
        const label = tKey === 'all' ? I18n.t('filter_all') : topics[tKey]?.[lang] || tKey;
        return `
          <button type="button"
                  class="filter-chip ${studioTopicFilter === tKey ? 'active' : ''}"
                  data-studio-topic="${escapeHtml(tKey)}">
            ${escapeHtml(label)}
          </button>
        `;
      })
      .join('');

    toolbar.innerHTML = `
      <div class="studio-list-filters">
        ${chipsHtml}
        <button type="button"
                class="filter-chip ${studioTopicFilter === '__no_sol__' ? 'active' : ''}"
                data-studio-topic="__no_sol__">
          ${I18n.t('admin_needs_solution')}
        </button>
      </div>
      <input type="search"
             id="studioSearchInput"
             class="search-input"
             value="${escapeHtml(studioSearchQuery)}"
             placeholder="${I18n.t('admin_search_ph')}">
    `;
  }

  function render() {
    const gate = DOM.qs('#adminLoginGate');
    const dashboard = DOM.qs('#adminDashboard');
    if (!gate || !dashboard) return;

    const unlocked = isUnlocked();
    gate.hidden = unlocked;
    dashboard.hidden = !unlocked;

    const passInput = DOM.qs('#adminPasswordInput');
    if (passInput) {
      passInput.placeholder = I18n.t('admin_pass_placeholder');
    }

    if (!unlocked) return;

    ensureStudioEnhancements();
    renderStudioKpis();
    renderStudioListToolbar();

    const { topics, lang, admin } = Store.getState();

    const importLbl = DOM.qs('#adminImportJsonLabel');
    if (importLbl) {
      importLbl.textContent = I18n.t('admin_import_json_btn');
    }

    const autoDescBtn = DOM.qs('#adminAutoDescBtn');
    if (autoDescBtn) {
      autoDescBtn.textContent = I18n.t('admin_btn_auto_desc');
    }

    const probLangsLbl = DOM.qs('#adminLblProbLangs');
    if (probLangsLbl) {
      probLangsLbl.textContent = I18n.t('admin_lbl_prob_langs');
    }

    const probLangsSel = DOM.qs('#adminProblemLangs');
    if (probLangsSel) {
      const probLangKeys = { both: 'admin_prob_both', ar: 'admin_prob_ar', en: 'admin_prob_en' };
      Array.from(probLangsSel.options).forEach((opt) => {
        const key = probLangKeys[opt.value];
        if (key) opt.textContent = I18n.t(key);
      });
    }

    const drawer = DOM.qs('#adminFormModalCard');
    if (drawer) drawer.hidden = !admin.isFormOpen;

    // E6 — حالة aria-expanded لزر فتح الدرج تبقى متزامنة مع الحالة الفعلية.
    const addCurriculumBtn = DOM.qs('#openAddCurriculumBtn');
    if (addCurriculumBtn) addCurriculumBtn.setAttribute('aria-expanded', String(Boolean(admin.isFormOpen)));

    const heading = DOM.qs('#adminFormHeading');
    if (heading) {
      heading.textContent = admin.editingId !== null ? I18n.t('admin_form_edit_title') : I18n.t('admin_form_add_title');
    }

    const topicSel = DOM.qs('#adminTopic');
    if (topicSel) {
      const currentTopic = topicSel.value || 'kin';
      const topicOptions = Object.keys(topics)
        .map((key) => `<option value="${escapeHtml(key)}">${escapeHtml(`${topics[key][lang]} (${key})`)}</option>`)
        .join('');

      topicSel.innerHTML = `
        ${topicOptions}
        <option value="__new__">${escapeHtml(I18n.t('admin_opt_new_topic'))}</option>
      `;
      const knownTopic =
        currentTopic === '__new__' || Object.prototype.hasOwnProperty.call(topics, currentTopic);
      topicSel.value = knownTopic ? currentTopic : 'kin';
      toggleNewTopicBox();
    }

    const levelSel = DOM.qs('#adminLevel');
    if (levelSel) {
      const currentLevel = levelSel.value || '1';
      levelSel.innerHTML = CurriculumService.getLevelOrder()
        .map((lvl) => `<option value="${lvl}">${escapeHtml(`${Catalog.LEVELS[lvl]?.[lang] || `Level ${lvl}`} (Level ${lvl})`)}</option>`)
        .join('');
      levelSel.value = currentLevel;
    }

    updateStemPathHint();
    renderCurriculaList();
  }

  function renderCurriculaList() {
    const listEl = DOM.qs('#adminResourcesList');
    if (!listEl) return;

    const { lang } = Store.getState();

    // البحث الموحّد نفسه المستخدم في المكتبة ولوحة الأوامر.
    const filtered = CurriculumService.searchResources(studioSearchQuery, {
      topic: studioTopicFilter === '__no_sol__' ? 'all' : studioTopicFilter,
      requireNoSolution: studioTopicFilter === '__no_sol__'
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty">${escapeHtml(I18n.t('empty'))}</div>`;
      return;
    }

    listEl.innerHTML = filtered
      .map((item) => {
        const hasArProb = CurriculumService.hasProblemForLang(item, 'ar');
        const hasEnProb = CurriculumService.hasProblemForLang(item, 'en');
        const hasArSol = Boolean(CurriculumService.getSolutionStemForLang(item, 'ar'));
        const hasEnSol = Boolean(CurriculumService.getSolutionStemForLang(item, 'en'));

        const arStem = CurriculumService.getFileStemForLang(item, 'ar');
        const enStem = CurriculumService.getFileStemForLang(item, 'en');
        const stemLabel = arStem === enStem ? arStem : `${arStem} / ${enStem}`;
        const primaryTitle = item.title?.[lang] || stemLabel;
        const secondaryLang = lang === 'ar' ? 'en' : 'ar';
        const secondaryTitle = item.title?.[secondaryLang] || '';
        const itemDesc = CurriculumService.getDisplayDescription(item, lang);

        return `
          <div class="admin-item">
            <div class="admin-item-head">
              <div style="max-width: 680px">
                <div class="tags admin-item-tags">${CardComponent.renderTags(item)}</div>
                <div class="admin-item-title">
                  ${escapeHtml(primaryTitle)}
                  ${secondaryTitle ? `<span class="admin-item-subtitle">/ ${escapeHtml(secondaryTitle)}</span>` : ''}
                </div>
                <p style="margin: 6px 0 4px; color: var(--muted); font-size: 0.9rem; line-height: 1.55">${escapeHtml(itemDesc)}</p>
                <div class="admin-item-stem">📄 ${escapeHtml(stemLabel || '—')}</div>
              </div>
              <div class="admin-item-actions">
                <button type="button" class="studio-move-btn" data-admin-move="${escapeHtml(item.id)}" data-move-dir="-1" title="${I18n.t('admin_move_up')}">↑</button>
                <button type="button" class="studio-move-btn" data-admin-move="${escapeHtml(item.id)}" data-move-dir="1" title="${I18n.t('admin_move_down')}">↓</button>
                <a href="preview.html?id=${encodeURIComponent(item.id)}&type=problem"
                   class="btn btn-ghost btn-sm"
                   data-open-preview="${escapeHtml(item.id)}"
                   data-preview-type="problem">
                  ${I18n.t('admin_preview_btn')}
                </a>
                <button type="button" class="btn btn-ghost btn-sm" data-admin-edit="${escapeHtml(item.id)}">
                  ${escapeHtml(I18n.t('admin_btn_edit'))}
                </button>
                <button type="button" class="btn btn-danger btn-sm" data-admin-delete="${escapeHtml(item.id)}">
                  ${escapeHtml(I18n.t('admin_btn_delete'))}
                </button>
              </div>
            </div>

            <div class="admin-sol-toggles">
              <span class="admin-sol-label">${I18n.t('admin_sol_matrix_label')}</span>
              <div class="admin-sol-buttons">
                <button type="button"
                        class="sol-chip-btn ${hasArProb ? 'is-on' : ''}"
                        data-toggle-prob="${escapeHtml(item.id)}"
                        data-prob-lang="ar">
                  ${hasArProb ? '📘 ' : '⬜ '}${I18n.t('admin_problem_ar')}
                </button>
                <button type="button"
                        class="sol-chip-btn ${hasEnProb ? 'is-on' : ''}"
                        data-toggle-prob="${escapeHtml(item.id)}"
                        data-prob-lang="en">
                  ${hasEnProb ? '📘 ' : '⬜ '}${I18n.t('admin_problem_en')}
                </button>
                <button type="button"
                        class="sol-chip-btn ${hasArSol ? 'is-on' : ''}"
                        data-toggle-sol="${escapeHtml(item.id)}"
                        data-sol-lang="ar">
                  ${hasArSol ? '✅ ' : '⬜ '}${escapeHtml(I18n.t('admin_sol_ar_chip'))}
                </button>
                <button type="button"
                        class="sol-chip-btn ${hasEnSol ? 'is-on' : ''}"
                        data-toggle-sol="${escapeHtml(item.id)}"
                        data-sol-lang="en">
                  ${hasEnSol ? '✅ ' : '⬜ '}${escapeHtml(I18n.t('admin_sol_en_chip'))}
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /** مقارنة ثابتة الزمن تقريباً لمنع استنتاج طول كلمة المرور من زمن الرد. */
  function safeEqualStrings(a, b) {
    const x = String(a);
    const y = String(b);
    let diff = x.length ^ y.length;
    const len = Math.max(x.length, y.length);
    for (let i = 0; i < len; i += 1) {
      diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
    }
    return diff === 0;
  }

  function showLoginError(errorEl, message) {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent = message;
    // E4 — إعلان حالة الخطأ على الحقل نفسه، مرتبط بـ aria-describedby.
    const passInput = DOM.qs('#adminPasswordInput');
    if (passInput) passInput.setAttribute('aria-invalid', 'true');
  }

  function handleLoginSubmit(formEl) {
    const passInput = DOM.qs('#adminPasswordInput', formEl);
    const errorEl = DOM.qs('#adminLoginError', formEl);
    const entered = passInput?.value || '';

    const now = Date.now();
    if (now < lockedUntil) {
      const seconds = Math.max(1, Math.ceil((lockedUntil - now) / 1000));
      const lockoutText = I18n.t('admin_lockout');
      showLoginError(errorEl, typeof lockoutText === 'function' ? lockoutText(seconds) : lockoutText);
      return;
    }

    if (safeEqualStrings(entered, Settings.ADMIN_PASSWORD)) {
      failedAttempts = 0;
      lockedUntil = 0;
      const stored = setUnlocked(true);
      if (errorEl) errorEl.hidden = true;
      if (passInput) {
        passInput.value = '';
        passInput.removeAttribute('aria-invalid');
      }
      if (!stored) Toast.show(I18n.t('admin_storage_error'));
      render();
      return;
    }

    failedAttempts += 1;
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      failedAttempts = 0;
      lockedUntil = Date.now() + LOCKOUT_MS;
      const lockoutText = I18n.t('admin_lockout');
      showLoginError(
        errorEl,
        typeof lockoutText === 'function' ? lockoutText(Math.round(LOCKOUT_MS / 1000)) : lockoutText
      );
      return;
    }

    showLoginError(errorEl, I18n.t('admin_wrong_pass'));
  }

  function handleResourceFormSubmit() {
    let topicVal = DOM.qs('#adminTopic')?.value || 'kin';
    if (topicVal === '__new__') {
      const newAr = DOM.qs('#adminNewTopicAr')?.value || '';
      const newEn = DOM.qs('#adminNewTopicEn')?.value || '';
      const newKey = DOM.qs('#adminNewTopicKey')?.value || newEn;
      topicVal = CurriculumService.addTopic(newKey, newAr, newEn);
      if (!topicVal) {
        Toast.show(I18n.t('admin_storage_error'));
        return;
      }
    }

    const payload = {
      topic: topicVal,
      level: Number(DOM.qs('#adminLevel')?.value || 1),
      fileStem: DOM.qs('#adminFileStem')?.value || '',
      titleAr: DOM.qs('#adminTitleAr')?.value || '',
      titleEn: DOM.qs('#adminTitleEn')?.value || '',
      descAr: DOM.qs('#adminDescAr')?.value || '',
      descEn: DOM.qs('#adminDescEn')?.value || '',
      problemLangs: DOM.qs('#adminProblemLangs')?.value || 'both',
      solutionMode: DOM.qs('#adminSolutionMode')?.value || 'none'
    };

    const { editingId } = Store.getState().admin;
    const saved = CurriculumService.upsertResource(payload, editingId);
    if (!saved) {
      Toast.show(I18n.t('admin_storage_error'));
      return;
    }

    resetFormDrawer();
    document.dispatchEvent(new Event('sphoh:refresh'));
    Toast.show(I18n.t('admin_saved_toast'));
  }

  function applyPickedPdfFile(file) {
    if (!file) return;
    const isSolutionFile = /_Solutions/i.test(file.name);
    const stem = CurriculumService.normalizeStem(
      file.name
        .replace(/\.pdf$/i, '')
        .replace(/_Solutions(_(AR|ENG))?$/i, '')
        .replace(/_(AR|ENG)_Solutions$/i, '')
    );

    const stemInput = DOM.qs('#adminFileStem');
    if (stemInput) {
      stemInput.value = stem;
    }

    const titleEnInput = DOM.qs('#adminTitleEn');
    if (titleEnInput && !titleEnInput.value) {
      titleEnInput.value = `${stem.replace(/_/g, ' ')} Problem Set`;
    }

    if (isSolutionFile) {
      const solMode = DOM.qs('#adminSolutionMode');
      if (solMode && solMode.value === 'none') {
        solMode.value = 'both';
      }
    }

    const descArEl = DOM.qs('#adminDescAr');
    const descEnEl = DOM.qs('#adminDescEn');
    if (descArEl && !descArEl.value && descEnEl && !descEnEl.value) {
      fillSmartDescriptionIntoForm();
    } else {
      updateStemPathHint();
    }
  }

  function handlePdfFilePick(fileInput) {
    const file = fileInput?.files?.[0];
    if (file) applyPickedPdfFile(file);
  }

  function mergeTopicsPayload(rawTopics) {
    const merged = JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS));
    Object.keys(rawTopics).forEach((key) => {
      const entry = rawTopics[key];
      if (!isPlainObject(entry)) return;
      const ar = typeof entry.ar === 'string' ? entry.ar.trim() : '';
      const en = typeof entry.en === 'string' ? entry.en.trim() : '';
      if (!ar && !en) return;
      merged[key] = { ...(merged[key] || {}), ar: ar || en, en: en || ar };
    });
    return merged;
  }

  function handleImportJsonFile(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (fileInput) fileInput.value = '';

      let parsed;
      try {
        parsed = JSON.parse(String(reader.result || ''));
      } catch (_) {
        Toast.show(I18n.t('admin_import_invalid'));
        return;
      }

      // يقبل إما مصفوفة موارد خام (متوافقة مع resources.json) أو نسخة كاملة { resources, topics }
      const bundle = isPlainObject(parsed) && Array.isArray(parsed.resources) ? parsed : null;
      const list = Array.isArray(parsed) ? parsed : bundle ? bundle.resources : null;

      if (list === null) {
        Toast.show(I18n.t('admin_import_invalid'));
        return;
      }

      const validation = CurriculumService.validateResourcesPayload(list);
      if (validation.empty) {
        Toast.show(I18n.t('admin_import_empty'));
        return;
      }
      if (!validation.ok) {
        Toast.show(I18n.t('admin_import_invalid'));
        return;
      }

      if (typeof global.confirm === 'function' && !global.confirm(I18n.t('admin_confirm_import'))) {
        return;
      }

      const snapshot = snapshotState();
      const okResources = await CurriculumService.saveAll(validation.resources);
      let okTopics = true;
      if (bundle && isPlainObject(bundle.topics)) {
        okTopics = CurriculumService.saveTopics(mergeTopicsPayload(bundle.topics));
      }

      if (!okResources || !okTopics) {
        Toast.show(I18n.t('admin_storage_error'));
        return;
      }

      document.dispatchEvent(new Event('sphoh:refresh'));
      offerUndo(I18n.t('admin_import_success'), snapshot);
    };
    reader.readAsText(file);
  }

  function setStudioTopicFilter(topicKey) {
    studioTopicFilter = topicKey || 'all';
    renderStudioListToolbar();
    renderCurriculaList();
  }

  function setStudioSearchQuery(q) {
    studioSearchQuery = q || '';
    renderCurriculaList();
  }

  function exportResourcesJson() {
    const { resources } = Store.getState();
    const jsonString = JSON.stringify(resources, null, 2);
    DOM.downloadTextFile('resources.json', jsonString);
  }

  async function copyResourcesJson() {
    const { resources } = Store.getState();
    const jsonString = JSON.stringify(resources, null, 2);
    await DOM.copyToClipboard(jsonString);
    Toast.show(I18n.t('admin_json_copied'));
  }

  function exportFullBackup() {
    const { resources, topics } = Store.getState();
    const payload = {
      app: 'SPhOH',
      version: 1,
      exportedAt: new Date().toISOString(),
      resources,
      topics
    };
    DOM.downloadTextFile('sphoh-backup.json', JSON.stringify(payload, null, 2));
    Toast.show(I18n.t('admin_backup_success'));
  }

  function deleteResourceWithUndo(id) {
    if (typeof global.confirm === 'function' && !global.confirm(I18n.t('admin_confirm_delete'))) {
      return false;
    }

    const snapshot = snapshotState();
    const ok = CurriculumService.deleteResource(id);
    if (!ok) {
      Toast.show(I18n.t('admin_storage_error'));
      return false;
    }

    document.dispatchEvent(new Event('sphoh:refresh'));
    offerUndo(I18n.t('admin_deleted_toast'), snapshot);
    return true;
  }

  async function resetDefaultCurricula() {
    if (typeof global.confirm === 'function' && !global.confirm(I18n.t('admin_confirm_reset'))) {
      return;
    }

    const snapshot = snapshotState();
    await CurriculumService.resetToDefaults();
    resetFormDrawer();
    document.dispatchEvent(new Event('sphoh:refresh'));
    offerUndo(I18n.t('admin_reset_toast'), snapshot);
  }

  SPhOH.AdminPage = Object.freeze({
    isUnlocked,
    setUnlocked,
    updateStemPathHint,
    renderLiveCardPreview,
    fillSmartDescriptionIntoForm,
    toggleNewTopicBox,
    openFormDrawer,
    resetFormDrawer,
    populateFormForEdit,
    render,
    renderCurriculaList,
    handleLoginSubmit,
    handleResourceFormSubmit,
    handlePdfFilePick,
    handleImportJsonFile,
    setStudioTopicFilter,
    setStudioSearchQuery,
    exportResourcesJson,
    exportFullBackup,
    copyResourcesJson,
    deleteResourceWithUndo,
    resetDefaultCurricula
  });
})(window);
