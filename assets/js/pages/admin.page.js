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

  function isUnlocked() {
    return Storage.getString(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, '0', true) === '1';
  }

  function setUnlocked(unlocked) {
    if (unlocked) {
      Storage.setString(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, '1', true);
    } else {
      Storage.remove(Settings.STORAGE_KEYS.ADMIN_UNLOCKED, true);
    }
  }

  function updateStemPathHint() {
    const stemInput = DOM.qs('#adminFileStem');
    const hintEl = DOM.qs('#adminStemHint');
    if (!stemInput || !hintEl) return;

    const stem =
      (stemInput.value || 'New_Curriculum_I')
        .trim()
        .replace(/\.pdf$/i, '')
        .replace(/_(AR|ENG)$/i, '')
        .replace(/\s+/g, '_') || 'New_Curriculum_I';

    hintEl.innerHTML = `
      <div>📘 <b>PDFs/ar/${escapeHtml(stem)}_AR.pdf</b> &nbsp;|&nbsp; <b>PDFs/en/${escapeHtml(stem)}_ENG.pdf</b></div>
      <div>✅ <b>PDFs/ar/${escapeHtml(stem)}_Solutions_AR.pdf</b> &nbsp;|&nbsp; <b>PDFs/en/${escapeHtml(stem)}_Solutions_ENG.pdf</b></div>
    `;

    renderLiveCardPreview();
  }

  function getDraftFromForm() {
    const topicVal = DOM.qs('#adminTopic')?.value || 'kin';
    const levelVal = Number(DOM.qs('#adminLevel')?.value || 1);
    const stemVal =
      (DOM.qs('#adminFileStem')?.value || 'Sample_Set_I')
        .trim()
        .replace(/\.pdf$/i, '')
        .replace(/_(AR|ENG)$/i, '') || 'Sample_Set_I';

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
        ar: titleAr || 'عنوان المنهج التجريبي',
        en: titleEn || 'Sample Curriculum Title'
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
    Toast.show(
      I18n.getLang() === 'ar'
        ? '✨ تم توليد الوصف الأكاديمي باللغتين تلقائياً!'
        : '✨ Academic description auto-generated in both languages!'
    );
  }

  function renderLiveCardPreview() {
    const previewContainer = DOM.qs('#adminLiveCardPreview');
    if (!previewContainer) return;

    const { lang } = Store.getState();
    const draftResource = getDraftFromForm();

    previewContainer.innerHTML = `
      <div class="studio-preview-badge">
        <span>👁️ ${lang === 'ar' ? 'معاينة فورية لبطاقة الطالب' : 'Live Student Card Preview'}</span>
        <span>${lang.toUpperCase()}</span>
      </div>
      ${CardComponent.renderCard(draftResource, {})}
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
          autoBtn.textContent = '✨ توليد وصف تلقائي';
          row.appendChild(autoBtn);
        }
      }

      const solModeField = DOM.qs('#adminSolutionMode', formEl)?.closest('.admin-field');
      if (solModeField && !DOM.qs('#adminProblemLangs', formEl)) {
        const probLangField = document.createElement('div');
        probLangField.className = 'admin-field full';
        probLangField.innerHTML = `
          <label for="adminProblemLangs" id="adminLblProbLangs">توفر ملف المسائل (Problem Set PDF)</label>
          <select class="admin-select" id="adminProblemLangs">
            <option value="both">متوفر بالعربية والإنجليزية (AR + EN)</option>
            <option value="ar">متوفر بالعربية فقط (AR Only)</option>
            <option value="en">متوفر بالإنجليزية فقط (EN Only)</option>
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
        <span id="adminImportJsonLabel">📂 استيراد ملف JSON</span>
        <input type="file" id="adminImportJsonInput" accept=".json,application/json" hidden>
      `;
      dbToolsBody.prepend(importLabel);
    }
  }

  function openFormDrawer(isEdit = false) {
    ensureStudioEnhancements();
    Store.setState((s) => {
      s.admin.isFormOpen = true;
    });

    const drawer = DOM.qs('#adminFormModalCard');
    if (drawer) {
      drawer.hidden = false;
      drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const heading = DOM.qs('#adminFormHeading');
    if (heading) {
      heading.textContent = isEdit ? I18n.t('admin_form_edit_title') : I18n.t('admin_form_add_title');
    }
    renderLiveCardPreview();
  }

  function resetFormDrawer() {
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
    if (stemIn) stemIn.value = resource.file || '';
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

    const { resources, topics, lang } = Store.getState();
    const total = resources.length;
    const arProblems = resources.filter((r) => CurriculumService.hasProblemForLang(r, 'ar')).length;
    const enProblems = resources.filter((r) => CurriculumService.hasProblemForLang(r, 'en')).length;
    const withSolutions = resources.filter(
      (r) => Boolean(CurriculumService.getSolutionStemForLang(r, 'ar')) || Boolean(CurriculumService.getSolutionStemForLang(r, 'en'))
    ).length;

    kpiStrip.innerHTML = `
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${total}</span>
        <span class="studio-kpi-lbl">${lang === 'ar' ? 'إجمالي المناهج المسجلة' : 'Total Curricula'}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${arProblems} / ${enProblems}</span>
        <span class="studio-kpi-lbl">${lang === 'ar' ? 'ملفات المسائل (عربي / إنجليزي)' : 'Problem PDFs (AR / EN)'}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${withSolutions} / ${total}</span>
        <span class="studio-kpi-lbl">${lang === 'ar' ? 'مناهج مزودة بالحلول' : 'Sets with Official Solutions'}</span>
      </div>
      <div class="studio-kpi-card">
        <span class="studio-kpi-val">${Object.keys(topics).length}</span>
        <span class="studio-kpi-lbl">${lang === 'ar' ? 'الأقسام الفيزيائية' : 'Physics Sections'}</span>
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
          ${lang === 'ar' ? '⏳ بدون حلول' : '⏳ Needs Solution'}
        </button>
      </div>
      <input type="search"
             id="studioSearchInput"
             class="search-input"
             value="${escapeHtml(studioSearchQuery)}"
             placeholder="${lang === 'ar' ? 'ابحث في استوديو المناهج...' : 'Search curricula in studio...'}">
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
      importLbl.textContent = lang === 'ar' ? '📂 استيراد ملف JSON' : '📂 Import JSON File';
    }

    const autoDescBtn = DOM.qs('#adminAutoDescBtn');
    if (autoDescBtn) {
      autoDescBtn.textContent = lang === 'ar' ? '✨ توليد وصف تلقائي' : '✨ Auto-Generate Description';
    }

    const probLangsLbl = DOM.qs('#adminLblProbLangs');
    if (probLangsLbl) {
      probLangsLbl.textContent =
        lang === 'ar' ? 'اللغات المتوفرة لملف المسائل (Problem PDF)' : 'Available Problem PDF Languages';
    }

    const drawer = DOM.qs('#adminFormModalCard');
    if (drawer) drawer.hidden = !admin.isFormOpen;

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
      topicSel.value = topics[currentTopic] || currentTopic === '__new__' ? currentTopic : 'kin';
      toggleNewTopicBox();
    }

    const levelSel = DOM.qs('#adminLevel');
    if (levelSel) {
      const currentLevel = levelSel.value || '1';
      levelSel.innerHTML = [1, 2, 3]
        .map((lvl) => `<option value="${lvl}">${escapeHtml(`${Catalog.LEVELS[lvl][lang]} (Level ${lvl})`)}</option>`)
        .join('');
      levelSel.value = currentLevel;
    }

    updateStemPathHint();
    renderCurriculaList();
  }

  function renderCurriculaList() {
    const listEl = DOM.qs('#adminResourcesList');
    if (!listEl) return;

    const { resources, lang } = Store.getState();
    const q = studioSearchQuery.trim().toLowerCase();

    const filtered = resources.filter((item) => {
      if (studioTopicFilter === '__no_sol__') {
        const hasAnySol =
          Boolean(CurriculumService.getSolutionStemForLang(item, 'ar')) ||
          Boolean(CurriculumService.getSolutionStemForLang(item, 'en'));
        if (hasAnySol) return false;
      } else if (studioTopicFilter !== 'all' && item.t !== studioTopicFilter) {
        return false;
      }

      if (q) {
        const hay = `${item.title?.ar || ''} ${item.title?.en || ''} ${item.desc?.ar || ''} ${item.desc?.en || ''} ${item.file || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
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

        const primaryTitle = item.title?.[lang] || item.file;
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
                <div class="admin-item-stem">📄 ${escapeHtml(item.file)}</div>
              </div>
              <div class="admin-item-actions">
                <button type="button" class="studio-move-btn" data-admin-move="${escapeHtml(item.id)}" data-move-dir="-1" title="${lang === 'ar' ? 'تحريك للأعلى' : 'Move Up'}">↑</button>
                <button type="button" class="studio-move-btn" data-admin-move="${escapeHtml(item.id)}" data-move-dir="1" title="${lang === 'ar' ? 'تحريك للأسفل' : 'Move Down'}">↓</button>
                <a href="preview.html?id=${encodeURIComponent(item.id)}&type=problem"
                   class="btn btn-ghost btn-sm"
                   data-open-preview="${escapeHtml(item.id)}"
                   data-preview-type="problem">
                  👁️ ${lang === 'ar' ? 'معاينة' : 'Preview'}
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
              <span class="admin-sol-label">${lang === 'ar' ? 'التحكم السريع بالملفات والحلول:' : '1-Click File & Solution Matrix:'}</span>
              <div class="admin-sol-buttons">
                <button type="button"
                        class="sol-chip-btn ${hasArProb ? 'is-on' : ''}"
                        data-toggle-prob="${escapeHtml(item.id)}"
                        data-prob-lang="ar">
                  ${hasArProb ? '📘 ' : '⬜ '}${lang === 'ar' ? 'مسائل (AR)' : 'Problem (AR)'}
                </button>
                <button type="button"
                        class="sol-chip-btn ${hasEnProb ? 'is-on' : ''}"
                        data-toggle-prob="${escapeHtml(item.id)}"
                        data-prob-lang="en">
                  ${hasEnProb ? '📘 ' : '⬜ '}${lang === 'ar' ? 'مسائل (EN)' : 'Problem (EN)'}
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

  function handleLoginSubmit(formEl) {
    const passInput = DOM.qs('#adminPasswordInput', formEl);
    const errorEl = DOM.qs('#adminLoginError', formEl);
    const entered = passInput?.value || '';

    if (entered === Settings.ADMIN_PASSWORD) {
      setUnlocked(true);
      if (errorEl) errorEl.hidden = true;
      if (passInput) passInput.value = '';
      render();
    } else if (errorEl) {
      errorEl.hidden = false;
    }
  }

  function handleResourceFormSubmit() {
    let topicVal = DOM.qs('#adminTopic')?.value || 'kin';
    if (topicVal === '__new__') {
      const newAr = DOM.qs('#adminNewTopicAr')?.value || '';
      const newEn = DOM.qs('#adminNewTopicEn')?.value || '';
      const newKey = DOM.qs('#adminNewTopicKey')?.value || newEn;
      topicVal = CurriculumService.addTopic(newKey, newAr, newEn);
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
    if (!saved) return;

    resetFormDrawer();
    SPhOH.App?.refreshAllViews();
    Toast.show(I18n.t('admin_saved_toast'));
  }

  function applyPickedPdfFile(file) {
    if (!file) return;
    const isSolutionFile = /_Solutions/i.test(file.name);
    const stem = file.name
      .replace(/\.pdf$/i, '')
      .replace(/_Solutions(_(AR|ENG))?$/i, '')
      .replace(/_(AR|ENG)_Solutions$/i, '')
      .replace(/_(AR|ENG)$/i, '');

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

  function handleImportJsonFile(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'));
        if (Array.isArray(parsed) && parsed.length > 0) {
          CurriculumService.saveAll(parsed);
          SPhOH.App?.refreshAllViews();
          Toast.show(I18n.getLang() === 'ar' ? 'تم استيراد ملف المناهج بنجاح!' : 'Curricula JSON imported successfully!');
        }
      } catch (_) {
        Toast.show(I18n.getLang() === 'ar' ? 'ملف JSON غير صالح.' : 'Invalid JSON file.');
      }
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

  function resetDefaultCurricula() {
    CurriculumService.resetToDefaults();
    resetFormDrawer();
    SPhOH.App?.refreshAllViews();
    Toast.show(I18n.t('admin_reset_toast'));
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
    copyResourcesJson,
    resetDefaultCurricula
  });
})(window);
