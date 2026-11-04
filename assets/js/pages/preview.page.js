/**
 * @file assets/js/pages/preview.page.js
 * @description وحدة قارئ المناهج والحلول المدمج (preview.html) مع عرض الوصف الشامل والمرجع الفيزيائي ومفكرة المسودة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, CurriculumService, Downloads, CardComponent, Toast, DOM, MathTypeset } = SPhOH;
  const { escapeHtml } = DOM;

  let activeHelperTool = null; // null | 'formulas' | 'scratchpad'

  const TOPIC_FORMULAS = {
    kin: [
      { label: { ar: 'معادلات الحركة بتسارع ثابت', en: 'Constant Acceleration' }, eq: [String.raw`v = v_0 + at`, String.raw`\Delta x = v_0t + \frac{1}{2}at^2`, String.raw`v^2 = v_0^2 + 2a\Delta x`] },
      { label: { ar: 'المقذوفات والمدى الأفقي', en: 'Projectile Motion' }, eq: [String.raw`R = \frac{v_0^2\sin(2\theta)}{g}`, String.raw`H = \frac{v_0^2\sin^2\theta}{2g}`] },
      { label: { ar: 'التسارع المركزي والنسبي', en: 'Centripetal & Relative' }, eq: [String.raw`a_c = \frac{v^2}{r} = \omega^2r`, String.raw`v_{AB} = v_A - v_B`] }
    ],
    mech: [
      { label: { ar: 'قوانين نيوتن والاحتكاك', en: 'Newton & Friction' }, eq: [String.raw`\sum \vec{F} = \frac{d\vec{p}}{dt} = m\vec{a}`, String.raw`f_s \leq \mu_s N`, String.raw`f_k = \mu_k N`] },
      { label: { ar: 'الشغل والطاقة والزخم', en: 'Work, Energy & Momentum' }, eq: [String.raw`W = \int \vec{F}\cdot d\vec{r} = \Delta K`, String.raw`\vec{p} = m\vec{v}`, String.raw`J = \int F\,dt = \Delta p`] },
      { label: { ar: 'ميكانيكا الموائع والطفو', en: 'Hydrostatics & Buoyancy' }, eq: [String.raw`P = P_0 + \rho gh`, String.raw`F_b = \rho_{\text{fluid}} V_{\text{sub}}g`, String.raw`P + \frac{1}{2}\rho v^2 + \rho gh = C`] }
    ],
    math: [
      { label: { ar: 'الضرب القياسي والاتجاهي', en: 'Vector Products' }, eq: [String.raw`\vec{A}\cdot\vec{B} = |\vec{A}||\vec{B}|\cos\theta`, String.raw`|\vec{A}\times\vec{B}| = |\vec{A}||\vec{B}|\sin\theta`] },
      { label: { ar: 'متطابقات مثلثية أساسية', en: 'Trig Identities' }, eq: [String.raw`\sin(2\theta) = 2\sin\theta\cos\theta`, String.raw`\cos(2\theta) = \cos^2\theta - \sin^2\theta`] },
      { label: { ar: 'تقريبات الزوايا الصغيرة (θ ≪ 1)', en: 'Small Angle Approx.' }, eq: [String.raw`\sin\theta \approx \theta`, String.raw`\tan\theta \approx \theta`, String.raw`\cos\theta \approx 1 - \frac{\theta^2}{2}`, String.raw`(1+x)^n \approx 1+nx`] }
    ],
    coll: [
      { label: { ar: 'ثوابت فيزيائية أساسية', en: 'Fundamental Constants' }, eq: [String.raw`g \approx 9.81\,\mathrm{m/s^2}`, String.raw`G = 6.674\times 10^{-11}\,\mathrm{N\cdot m^2/kg^2}`, String.raw`c = 3.0\times 10^8\,\mathrm{m/s}`] },
      { label: { ar: 'تحليل الأبعاد والوحدات', en: 'Dimensional Homogeneity' }, eq: [String.raw`[\text{Force}] = ML T^{-2}`, String.raw`[\text{Energy}] = ML^2T^{-2}`, String.raw`[\text{Pressure}] = ML^{-1}T^{-2}`] },
      { label: { ar: 'حفظ الطاقة الميكانيكية', en: 'Conservation Laws' }, eq: [String.raw`E_{\text{mech}} = K + U = \text{const}`, String.raw`\sum \tau_{\text{ext}} = \frac{dL}{dt}`] }
    ]
  };

  function getScratchpadMap() {
    return Storage.getJSON(Settings.STORAGE_KEYS.SCRATCHPAD, {});
  }

  function getScratchpadText(resourceId) {
    const map = getScratchpadMap();
    return String(map[String(resourceId)] || '');
  }

  function saveScratchpadText(resourceId, text) {
    const map = getScratchpadMap();
    map[String(resourceId)] = String(text || '');
    Storage.setJSON(Settings.STORAGE_KEYS.SCRATCHPAD, map);
  }

  function parseUrlParams() {
    try {
      const params = new URLSearchParams(global.location.search);
      const idParam = params.get('id');
      const typeParam = params.get('type');

      Store.setState((s) => {
        if (idParam) s.preview.id = Number(idParam);
        if (typeParam === 'solution' || typeParam === 'problem') {
          s.preview.type = typeParam;
        }
      });
    } catch (_) {}
  }

  function renderCanvasSheetViewer(bodyEl, activePath, docHeading) {
    const { lang, preview } = Store.getState();
    const pageInfo = global.__SPHOH_CANVAS_PAGES__?.[activePath] || {};
    const images = pageInfo.images || [];
    const totalPages = pageInfo.total || images.length;

    bodyEl.innerHTML = `
      <div class="canvas-reader-bar">
        <span>📄 ${escapeHtml(activePath)} (${lang === 'ar' ? 'إجمالي الصفحات: ' : 'Total pages: '}${totalPages})</span>
        <div class="canvas-reader-controls">
          <button type="button" class="reader-icon-btn" data-zoom-dir="-" aria-label="Zoom out">−</button>
          <span id="readerZoomLabel">${preview.zoom}%</span>
          <button type="button" class="reader-icon-btn" data-zoom-dir="+" aria-label="Zoom in">+</button>
        </div>
      </div>
      <div class="canvas-pages-scroller" id="canvasPagesScroller"></div>
    `;

    const scroller = DOM.qs('#canvasPagesScroller', bodyEl);
    const sheetWidth = Math.round(740 * (preview.zoom / 100));

    images.forEach((src, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'canvas-page-sheet';
      wrap.style.width = `${sheetWidth}px`;

      const img = document.createElement('img');
      img.src = src;
      img.alt = `${docHeading} - Page ${idx + 1}`;
      wrap.appendChild(img);
      scroller.appendChild(wrap);
    });
  }

  function renderReaderHelperTools(resource) {
    const shell = DOM.qs('#filePreviewDialog');
    const bodyEl = DOM.qs('#previewBody');
    const titleRowActions = DOM.qs('.preview-title-row .preview-actions-right', shell);
    if (!shell || !bodyEl || !titleRowActions) return;

    const { lang } = Store.getState();
    const isAr = lang === 'ar';

    let formulasBtn = DOM.qs('#readerFormulasBtn', titleRowActions);
    if (!formulasBtn) {
      formulasBtn = document.createElement('button');
      formulasBtn.id = 'readerFormulasBtn';
      formulasBtn.type = 'button';
      formulasBtn.className = 'btn btn-ghost btn-sm';
      titleRowActions.prepend(formulasBtn);
    }
    formulasBtn.textContent = isAr ? '📐 القوانين والثوابت' : '📐 Formula Sheet';
    formulasBtn.classList.toggle('active', activeHelperTool === 'formulas');

    let scratchBtn = DOM.qs('#readerScratchpadBtn', titleRowActions);
    if (!scratchBtn) {
      scratchBtn = document.createElement('button');
      scratchBtn.id = 'readerScratchpadBtn';
      scratchBtn.type = 'button';
      scratchBtn.className = 'btn btn-ghost btn-sm';
      titleRowActions.insertBefore(scratchBtn, formulasBtn.nextSibling);
    }
    scratchBtn.textContent = isAr ? '📝 مسودة الحل' : '📝 Scratchpad';
    scratchBtn.classList.toggle('active', activeHelperTool === 'scratchpad');

    let drawer = DOM.qs('#readerHelperDrawer', shell);
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'readerHelperDrawer';
      drawer.className = 'reader-helper-drawer';
      shell.insertBefore(drawer, bodyEl);
    }

    if (!activeHelperTool) {
      drawer.hidden = true;
      return;
    }

    drawer.hidden = false;
    if (activeHelperTool === 'formulas') {
      const list = TOPIC_FORMULAS[resource.t] || TOPIC_FORMULAS.coll;
      drawer.innerHTML = `
        <div class="reader-helper-grid">
          ${list
            .map(
              (f) => `
                <div class="formula-ref-card">
                  <strong>${escapeHtml(f.label[lang] || f.label.en)}</strong>
                  <div class="formula-equations">
                    ${f.eq.map((equation) => `<span class="formula-equation">\\(${escapeHtml(equation)}\\)</span>`).join('')}
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      `;
      MathTypeset?.typeset(drawer);
    } else if (activeHelperTool === 'scratchpad') {
      const savedNote = getScratchpadText(resource.id);
      drawer.innerHTML = `
        <div class="scratchpad-wrap">
          <div class="scratchpad-head">
            <span>📝 ${isAr ? 'ملاحظاتك ومسودة حلك لهذا المنهج (تُحفظ تلقائياً في متصفحك):' : 'Your personal scratchpad for this set (auto-saved in browser):'}</span>
          </div>
          <textarea id="readerScratchpadInput"
                    class="scratchpad-textarea"
                    data-scratchpad-id="${escapeHtml(resource.id)}"
                    placeholder="${isAr ? 'اكتب خطوات الحل، المعادلات، أو رقم المسألة التي توقفت عندها...' : 'Write down equations, final answers, or problem numbers...'}">${escapeHtml(savedNote)}</textarea>
        </div>
      `;
    }
  }

  function toggleHelperTool(toolName) {
    activeHelperTool = activeHelperTool === toolName ? null : toolName;
    const { preview } = Store.getState();
    const resource = CurriculumService.findById(preview.id);
    if (resource) renderReaderHelperTools(resource);
  }

  function render() {
    const section = DOM.qs('#previewSection');
    const { resources, topics, lang, preview } = Store.getState();
    if (!section || resources.length === 0) return;

    const resource = CurriculumService.findById(preview.id);
    if (!resource) return;
    preview.id = resource.id;

    const pdfPath = CurriculumService.getProblemPdfPath(resource, lang);
    const solPath = CurriculumService.getSolutionPdfPath(resource, lang);

    if (preview.type === 'solution' && !solPath) {
      preview.type = 'problem';
    }

    const activePath = preview.type === 'solution' ? solPath : pdfPath;
    const activeCount = activePath ? Downloads.getCount(activePath) : 0;

    const selectEl = DOM.qs('#previewResourceSelect');
    if (selectEl) {
      selectEl.innerHTML = resources
        .map((item) => {
          const topicLabel = topics[item.t]?.[lang] || item.t;
          const itemTitle = item.title?.[lang] || item.file;
          return `<option value="${escapeHtml(item.id)}">${escapeHtml(`${itemTitle} (${topicLabel})`)}</option>`;
        })
        .join('');
      selectEl.value = String(resource.id);

      if (!selectEl.dataset.bound) {
        selectEl.dataset.bound = 'true';
        selectEl.addEventListener('change', (e) => {
          selectResource(Number(e.target.value), 'problem');
        });
      }
    }

    const tagsEl = DOM.qs('#previewTags');
    if (tagsEl) tagsEl.innerHTML = CardComponent.renderTags(resource);

    const baseTitle = resource.title?.[lang] || resource.file || '';
    const docHeading =
      preview.type === 'solution'
        ? `${baseTitle} — ${lang === 'ar' ? 'الحلول النموذجية' : 'Official Solutions'}`
        : baseTitle;

    const titleEl = DOM.qs('#previewTitle');
    if (titleEl) titleEl.textContent = docHeading;

    const descEl = DOM.qs('#previewDesc');
    if (descEl) descEl.textContent = CurriculumService.getDisplayDescription(resource, lang);

    const tabProb = DOM.qs('#tabProblemBtn');
    const tabSol = DOM.qs('#tabSolutionBtn');
    if (tabProb) tabProb.classList.toggle('active', preview.type === 'problem');
    if (tabSol) {
      tabSol.classList.toggle('active', preview.type === 'solution');
      tabSol.classList.toggle('is-disabled-tab', !solPath);
    }

    const shell = DOM.qs('#filePreviewDialog');
    const focusBtn = DOM.qs('#previewFocusBtn');
    const closeBtn = DOM.qs('#previewCloseBtn');
    if (shell) shell.classList.toggle('is-focus-mode', preview.isFocusMode);
    if (focusBtn) {
      focusBtn.textContent = preview.isFocusMode ? I18n.t('preview_focus_exit') : I18n.t('preview_focus_enter');
    }
    if (closeBtn) {
      closeBtn.hidden = !preview.isFocusMode;
      closeBtn.setAttribute('aria-label', I18n.t('close_preview'));
    }

    renderReaderHelperTools(resource);

    const dlBtn = DOM.qs('#previewDownloadBtn');
    const dlBadge = DOM.qs('#previewDownloadBadge');
    const extLink = DOM.qs('#previewExternalLink');
    [dlBtn, dlBadge, extLink].forEach((el) => {
      if (el) el.style.display = activePath ? '' : 'none';
    });

    if (dlBtn && activePath) {
      dlBtn.href = activePath;
      dlBtn.setAttribute('data-download-key', activePath);
      dlBtn.textContent = preview.type === 'solution' ? I18n.t('solution_download') : I18n.t('btn_download');
    }

    if (dlBadge && activePath) {
      const formatDownloads = I18n.t('downloads_label');
      dlBadge.setAttribute('data-count-for', activePath);
      dlBadge.textContent = typeof formatDownloads === 'function' ? formatDownloads(activeCount) : `↓ ${activeCount}`;
    }

    if (extLink && activePath) {
      extLink.href = activePath;
      extLink.textContent = I18n.t('open_new_tab');
    }

    const bodyEl = DOM.qs('#previewBody');
    if (!bodyEl) return;

    if (!activePath) {
      bodyEl.innerHTML = `<p class="preview-desc-text preview-empty-msg">${escapeHtml(I18n.t('pdf_toast'))}</p>`;
      return;
    }

    if (global.__SPHOH_CANVAS_PAGES__ && global.__SPHOH_CANVAS_PAGES__[activePath]) {
      renderCanvasSheetViewer(bodyEl, activePath, docHeading);
    } else {
      bodyEl.innerHTML = '';
      const frame = document.createElement('iframe');
      frame.src = activePath;
      frame.title = docHeading;
      bodyEl.appendChild(frame);
    }
    MathTypeset?.typeset(section);
  }

  function selectResource(id, type = 'problem') {
    const resource = CurriculumService.findById(id);
    if (!resource) return;

    if (type === 'solution' && !CurriculumService.getSolutionPdfPath(resource)) {
      Toast.show(I18n.t('solution_toast'));
      return;
    }

    Store.setState((s) => {
      s.preview.id = Number(resource.id);
      s.preview.type = type === 'solution' ? 'solution' : 'problem';
    });

    const previewView = DOM.qs('[data-page-view="preview"]');
    if (previewView && SPhOH.App?.switchCanvasView) {
      SPhOH.App.switchCanvasView('preview');
      return;
    }

    if (DOM.qs('#previewSection')) {
      try {
        const nextUrl = `preview.html?id=${encodeURIComponent(resource.id)}&type=${encodeURIComponent(type)}`;
        global.history.replaceState({}, '', nextUrl);
      } catch (_) {}
      render();
      global.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    global.location.href = `preview.html?id=${encodeURIComponent(resource.id)}&type=${encodeURIComponent(type)}`;
  }

  function switchTab(targetType) {
    const { preview } = Store.getState();
    const resource = CurriculumService.findById(preview.id);
    if (targetType === 'solution' && !CurriculumService.getSolutionPdfPath(resource)) {
      Toast.show(I18n.t('solution_toast'));
      return;
    }
    Store.setState((s) => {
      s.preview.type = targetType;
    });
    render();
  }

  function stepResource(direction) {
    const { resources, preview } = Store.getState();
    if (resources.length === 0) return;

    const currentIndex = Math.max(
      0,
      resources.findIndex((item) => Number(item.id) === Number(preview.id))
    );
    const nextIndex = (currentIndex + Number(direction) + resources.length) % resources.length;
    selectResource(resources[nextIndex].id, 'problem');
  }

  function toggleFocusMode(forceVal) {
    Store.setState((s) => {
      s.preview.isFocusMode = typeof forceVal === 'boolean' ? forceVal : !s.preview.isFocusMode;
    });
    render();
  }

  function adjustZoom(dir) {
    Store.setState((s) => {
      if (dir === '+' && s.preview.zoom < 140) s.preview.zoom += 15;
      if (dir === '-' && s.preview.zoom > 70) s.preview.zoom -= 15;
    });
    const { zoom } = Store.getState().preview;
    const zoomLabel = DOM.qs('#readerZoomLabel');
    if (zoomLabel) zoomLabel.textContent = `${zoom}%`;
    const width = Math.round(740 * (zoom / 100));
    DOM.qsa('.canvas-page-sheet').forEach((sheet) => {
      sheet.style.width = `${width}px`;
    });
  }

  SPhOH.PreviewPage = Object.freeze({
    parseUrlParams,
    render,
    selectResource,
    switchTab,
    stepResource,
    toggleFocusMode,
    toggleHelperTool,
    saveScratchpadText,
    adjustZoom
  });
})(window);
