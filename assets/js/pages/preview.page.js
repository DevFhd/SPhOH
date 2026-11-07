/**
 * @file assets/js/pages/preview.page.js
 * @description وحدة قارئ المناهج والحلول المدمج (preview.html) مع عرض الوصف الشامل والمرجع الفيزيائي ومفكرة المسودة،
 * وشريط تحكم العارض المدمج، ودعم الجوال الذكي، ووضع التركيز (Focus Mode) مع العرض الجانبي المقسوم.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, CurriculumService, Downloads, CardComponent, Toast, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let activeHelperTool = null; // null | 'formulas' | 'scratchpad'
  let forceInlinePreview = false; // يسمح للمستخدم على الجوال بتجربة العرض المدمج داخل الصفحة

  /**
   * عزل إطار PDF مع إبقاء عارض Chrome المدمج يعمل.
   * لا يوجد في Chrome أي `sandbox` token يسمح بالـplugin، لذا يُختبر الإطار بعد التحميل:
   * الإطار العامل يعرّض `contentDocument.contentType === 'application/pdf'`،
   * والمحجوب يعيد `contentDocument === null` — عندها نستبدله بإطار بلا `sandbox` مرة واحدة.
   * `null` = لم يُختبر بعد، `true` = الـsandbox مدعوم، `false` = تعطيله لهذه الجلسة.
   */
  const PDF_FRAME_SANDBOX =
    'allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms';
  let pdfSandboxSupported = null;

  // يُخزَّن آخر `src` مُحمَّل في الإطار المعاد استخدامه، فلا يُعاد تحميل الـPDF
  // عند تبديل وضع التركيز أو تحديث الأدوات الجانبية.
  let currentFrameSrc = null;

  function markStageLoaded(frame) {
    const stageEl = frame?.closest('.preview-stage');
    if (stageEl) stageEl.classList.remove('is-loading');
  }

  function handlePdfFrameLoad(event) {
    const frame = event.currentTarget;
    if (!frame) return;

    const frameSrc = frame.getAttribute('src');
    if (!frameSrc) return;

    if (frame.dataset.pdfSandbox !== 'pending') {
      markStageLoaded(frame);
      return;
    }

    frame.dataset.pdfSandbox = 'settled';

    let doc = null;
    try {
      doc = frame.contentDocument;
    } catch (_) {
      doc = null;
    }

    if (doc && doc.contentType === 'application/pdf') {
      pdfSandboxSupported = true;
      markStageLoaded(frame);
      return;
    }

    pdfSandboxSupported = false;
    const replacement = document.createElement('iframe');
    replacement.id = 'previewPdfFrame';
    replacement.src = frameSrc;
    replacement.title = frame.getAttribute('title') || '';
    replacement.setAttribute('referrerpolicy', 'no-referrer');
    replacement.addEventListener('load', handlePdfFrameLoad);
    frame.replaceWith(replacement);
  }

  /**
   * يكشف المتصفحات المحمولة أو التي لا تدعم عرض PDF متعدد الصفحات داخل iframe.
   * @returns {boolean}
   */
  function isIosOrMobilePdfLimited() {
    const nav = global.navigator;
    if (!nav) return false;
    if (nav.pdfViewerEnabled === false) return true;
    const ua = String(nav.userAgent || '');
    if (/iPad|iPhone|iPod|Android/i.test(ua)) return true;
    // iPadOS 13+ يقدّم نفسه كـ Macintosh مع دعم لمس متعدد النقاط.
    return /Macintosh/.test(ua) && Number(nav.maxTouchPoints || 0) > 1;
  }

  /**
   * شريط إرشادي علوي يظهر عند تفعيل العرض المدمج على جهاز لا يدعم PDF داخل iframe بشكل كامل.
   */
  function renderExternalHint(stageEl, activePath) {
    const existing = DOM.qs('.preview-external-hint', stageEl);
    if (!isIosOrMobilePdfLimited()) {
      if (existing) existing.remove();
      return;
    }
    const hint = existing || document.createElement('div');
    if (!existing) {
      hint.className = 'preview-external-hint';
      stageEl.insertBefore(hint, stageEl.firstChild);
    }
    hint.innerHTML = `
      <span>${escapeHtml(I18n.t('reader_external_hint'))}</span>
      <a class="btn btn-primary btn-sm"
         href="${escapeHtml(activePath)}"
         target="_blank"
         rel="noopener noreferrer">${escapeHtml(I18n.t('open_new_tab'))}</a>
    `;
  }

  /**
   * إعادة استخدام إطار PDF واحد داخل `.preview-stage`.
   * يُغيَّر `src` فقط عند تغيّر المورد أو اللغة أو التبويب.
   * @param {HTMLElement} stageEl
   * @param {string} src
   * @param {string} title
   * @returns {HTMLIFrameElement}
   */
  function ensurePdfFrame(stageEl, src, title) {
    let frame = DOM.qs('#previewPdfFrame', stageEl);

    const mobileCard = DOM.qs('.preview-mobile-stage', stageEl);
    if (mobileCard) mobileCard.remove();

    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'previewPdfFrame';
      frame.setAttribute('referrerpolicy', 'no-referrer');
      frame.addEventListener('load', handlePdfFrameLoad);
      if (pdfSandboxSupported !== false) {
        frame.setAttribute('sandbox', PDF_FRAME_SANDBOX);
        frame.dataset.pdfSandbox = 'pending';
      }
      currentFrameSrc = null;
    }

    if (frame.title !== title) frame.title = title;
    if (currentFrameSrc !== src) {
      currentFrameSrc = src;
      stageEl.classList.add('is-loading');
      // يُسنَد المصدر قبل الإدراج حتى لا يسبق تحميل about:blank اختبار الـsandbox.
      frame.src = src;
    }
    if (!frame.isConnected) stageEl.appendChild(frame);
    return frame;
  }

  /**
   * بناء شريط التحكم العلوي ومنطقة العرض داخل `#previewBody` دون المساس بهيكل الصفحة.
   */
  function renderPreviewViewport(bodyEl, resource, activePath, resolvedType, docHeading, activeCount) {
    let viewportBar = DOM.qs('.preview-viewport-bar', bodyEl);
    let stageEl = DOM.qs('.preview-stage', bodyEl);

    if (!viewportBar || !stageEl) {
      bodyEl.innerHTML = '';
      currentFrameSrc = null;

      viewportBar = document.createElement('div');
      viewportBar.className = 'preview-viewport-bar';
      bodyEl.appendChild(viewportBar);

      stageEl = document.createElement('div');
      stageEl.className = 'preview-stage';
      stageEl.innerHTML = `<div class="preview-loading-pill" aria-hidden="true">${escapeHtml(I18n.t('reader_loading'))}</div>`;
      bodyEl.appendChild(stageEl);
    }

    const fileName = String(activePath || '').split('/').pop() || '';
    const typeLabel =
      resolvedType === 'solution' ? I18n.t('preview_tab_solution') : I18n.t('preview_tab_problem');
    const isFocus = Boolean(Store.getState().preview.isFocusMode);
    const mobileLimited = isIosOrMobilePdfLimited();
    const showMobileStage = mobileLimited && !forceInlinePreview;

    viewportBar.innerHTML = `
      <div class="preview-viewport-meta">
        <span class="preview-viewport-type">${escapeHtml(typeLabel)}</span>
        <span class="preview-viewport-filename" dir="ltr">${escapeHtml(fileName)}</span>
      </div>
      <div class="preview-viewport-actions">
        ${
          mobileLimited
            ? `<button type="button" class="btn btn-ghost btn-sm" data-preview-inline-toggle="1">
                 ${escapeHtml(I18n.t(forceInlinePreview ? 'reader_mobile_hide_inline' : 'reader_mobile_try_inline'))}
               </button>`
            : `<button type="button"
                       class="btn btn-ghost btn-sm"
                       data-preview-reload="1"
                       aria-label="${escapeHtml(I18n.t('reader_reload_aria'))}">
                 ${escapeHtml(I18n.t('reader_reload_btn'))}
               </button>`
        }
        <button type="button"
                class="btn btn-ghost btn-sm"
                data-preview-focus-toggle="1"
                aria-pressed="${isFocus ? 'true' : 'false'}">
          ${escapeHtml(isFocus ? I18n.t('preview_focus_exit') : I18n.t('preview_focus_enter'))}
        </button>
        <a class="btn btn-ghost btn-sm"
           href="${escapeHtml(activePath)}"
           target="_blank"
           rel="noopener noreferrer">${escapeHtml(I18n.t('open_new_tab'))}</a>
      </div>
    `;

    const loadingPill = DOM.qs('.preview-loading-pill', stageEl);
    if (loadingPill) loadingPill.textContent = I18n.t('reader_loading');

    bodyEl.classList.toggle("is-mobile-card-mode", showMobileStage);
    if (showMobileStage) {
      const existingFrame = DOM.qs('#previewPdfFrame', stageEl);
      if (existingFrame) existingFrame.remove();
      const existingHint = DOM.qs('.preview-external-hint', stageEl);
      if (existingHint) existingHint.remove();
      currentFrameSrc = null;
      stageEl.classList.remove('is-loading');

      let mobileCard = DOM.qs('.preview-mobile-stage', stageEl);
      if (!mobileCard) {
        mobileCard = document.createElement('div');
        mobileCard.className = 'preview-mobile-stage';
        stageEl.appendChild(mobileCard);
      }

      const formatDownloads = I18n.t('downloads_label');
      const dlCountText =
        typeof formatDownloads === 'function' ? formatDownloads(activeCount) : `↓ ${activeCount}`;
      const downloadLabel =
        resolvedType === 'solution' ? I18n.t('solution_download') : I18n.t('btn_download');

      mobileCard.innerHTML = `
        <div class="preview-mobile-card">
          <span class="preview-mobile-eyebrow">${escapeHtml(I18n.t('reader_mobile_badge'))}</span>
          <h2 class="preview-mobile-title">${escapeHtml(docHeading)}</h2>
          <div class="tags preview-mobile-tags">${CardComponent.renderTags(resource)}</div>
          <code class="preview-mobile-file" dir="ltr">${escapeHtml(fileName)}</code>
          <p class="preview-mobile-lead">${escapeHtml(I18n.t('reader_mobile_lead'))}</p>
          <div class="preview-mobile-actions">
            <a class="btn btn-primary preview-mobile-btn"
               href="${escapeHtml(activePath)}"
               target="_blank"
               rel="noopener noreferrer">
              ${escapeHtml(I18n.t('reader_mobile_open_btn'))}
            </a>
            <a class="btn btn-ghost preview-mobile-btn"
               href="${escapeHtml(activePath)}"
               download
               data-download-key="${escapeHtml(activePath)}">
              ${escapeHtml(downloadLabel)} (${escapeHtml(dlCountText)})
            </a>
            <button type="button"
                    class="btn btn-ghost preview-mobile-btn"
                    data-preview-inline-toggle="1">
              ${escapeHtml(I18n.t('reader_mobile_try_inline'))}
            </button>
          </div>
        </div>
      `;
      return;
    }

    ensurePdfFrame(stageEl, activePath, docHeading);
    renderExternalHint(stageEl, activePath);
  }

  function reloadPdfFrame() {
    const bodyEl = DOM.qs('#previewBody');
    if (!bodyEl) return;
    const frame = DOM.qs('#previewPdfFrame', bodyEl);
    const stageEl = DOM.qs('.preview-stage', bodyEl);
    if (!frame || !currentFrameSrc) return;
    if (stageEl) stageEl.classList.add('is-loading');
    frame.src = currentFrameSrc;
  }

  function toggleInlinePreview() {
    forceInlinePreview = !forceInlinePreview;
    render();
  }

  function syncPreviewUrl() {
    if (!DOM.qs('#previewSection')) return;
    const { preview } = Store.getState();
    const nextUrl = `preview.html?id=${encodeURIComponent(preview.id)}&type=${encodeURIComponent(preview.type)}`;
    try {
      global.history.replaceState({}, '', nextUrl);
    } catch (_) {}
  }

  const TOPIC_FORMULAS = {
    kin: [
      { label: { ar: 'معادلات الحركة بتسارع ثابت', en: 'Constant Acceleration' }, eq: 'v = v₀ + at  |  Δx = v₀t + ½at²  |  v² = v₀² + 2aΔx' },
      { label: { ar: 'المقذوفات والمدى الأفقي', en: 'Projectile Motion' }, eq: 'R = (v₀² sin 2θ) / g  |  H = (v₀² sin²θ) / 2g' },
      { label: { ar: 'التسارع المركزي والنسبي', en: 'Centripetal & Relative' }, eq: 'a_c = v² / r = ω²r  |  v_AB = v_A − v_B' }
    ],
    mech: [
      { label: { ar: 'قوانين نيوتن والاحتكاك', en: 'Newton & Friction' }, eq: '∑F = dp/dt = ma  |  f_s ≤ μ_s N  |  f_k = μ_k N' },
      { label: { ar: 'الشغل والطاقة والزخم', en: 'Work, Energy & Momentum' }, eq: 'W = ∫ F·dr = ΔK  |  p = mv  |  J = ∫ F dt = Δp' },
      { label: { ar: 'ميكانيكا الموائع والطفو', en: 'Hydrostatics & Buoyancy' }, eq: 'P = P₀ + ρgh  |  F_b = ρ_fluid V_sub g  |  P + ½ρv² + ρgh = C' }
    ],
    math: [
      { label: { ar: 'الضرب القياسي والاتجاهي', en: 'Vector Products' }, eq: 'A · B = |A||B| cos θ  |  |A × B| = |A||B| sin θ' },
      { label: { ar: 'متطابقات مثلثية أساسية', en: 'Trig Identities' }, eq: 'sin(2θ) = 2 sin θ cos θ  |  cos(2θ) = cos²θ − sin²θ' },
      { label: { ar: 'تقريبات الزوايا الصغيرة (θ ≪ 1)', en: 'Small Angle Approx.' }, eq: 'sin θ ≈ θ  |  tan θ ≈ θ  |  cos θ ≈ 1 − θ²/2  |  (1+x)ⁿ ≈ 1 + nx' }
    ],
    coll: [
      { label: { ar: 'ثوابت فيزيائية أساسية', en: 'Fundamental Constants' }, eq: 'g ≈ 9.81 m/s²  |  G = 6.674×10⁻¹¹ N·m²/kg²  |  c = 3.0×10⁸ m/s' },
      { label: { ar: 'تحليل الأبعاد والوحدات', en: 'Dimensional Homogeneity' }, eq: '[Force] = M L T⁻²  |  [Energy] = M L² T⁻²  |  [Pressure] = M L⁻¹ T⁻²' },
      { label: { ar: 'حفظ الطاقة الميكانيكية', en: 'Conservation Laws' }, eq: 'E_mech = K + U = const  |  ∑τ_ext = dL/dt' }
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
      const numericId = Number(idParam);

      Store.setState((s) => {
        if (idParam && Number.isFinite(numericId) && numericId > 0) {
          s.preview.id = numericId;
        }
        if (typeParam === 'solution' || typeParam === 'problem') {
          s.preview.type = typeParam;
        }
      });
    } catch (_) {}
  }

  function renderNotFoundState() {
    const tagsEl = DOM.qs('#previewTags');
    if (tagsEl) tagsEl.innerHTML = '';

    const titleEl = DOM.qs('#previewTitle');
    if (titleEl) titleEl.textContent = I18n.t('preview_not_found');

    const descEl = DOM.qs('#previewDesc');
    if (descEl) descEl.textContent = I18n.t('preview_not_found_desc');

    [
      '#previewDownloadBtn',
      '#previewDownloadBadge',
      '#previewExternalLink',
      '#previewFocusBtn',
      '#readerFormulasBtn',
      '#readerScratchpadBtn',
      '#readerHelperDrawer'
    ].forEach((selector) => {
      const el = DOM.qs(selector);
      if (el) el.style.display = 'none';
    });

    const shell = DOM.qs('#filePreviewDialog');
    if (shell) {
      shell.classList.remove('is-focus-mode', 'has-helper-open');
    }
    document.body.classList.remove('has-focus-mode');

    const bodyEl = DOM.qs('#previewBody');
    currentFrameSrc = null;
    if (bodyEl) {
      bodyEl.removeAttribute('role');
      bodyEl.removeAttribute('aria-labelledby');
      bodyEl.innerHTML = `
        <div class="preview-empty-msg">
          <p class="preview-desc-text">${escapeHtml(I18n.t('preview_not_found_desc'))}</p>
          <a class="btn btn-ghost btn-sm" href="files.html">${escapeHtml(I18n.t('preview_back'))}</a>
        </div>
      `;
    }
  }

  function renderReaderHelperTools(resource) {
    const shell = DOM.qs('#filePreviewDialog');
    const bodyEl = DOM.qs('#previewBody');
    const titleRowActions = DOM.qs('.preview-title-row .preview-actions-right', shell);
    if (!shell || !bodyEl || !titleRowActions) return;

    const { lang } = Store.getState();

    let formulasBtn = DOM.qs('#readerFormulasBtn', titleRowActions);
    if (!formulasBtn) {
      formulasBtn = document.createElement('button');
      formulasBtn.id = 'readerFormulasBtn';
      formulasBtn.type = 'button';
      formulasBtn.className = 'btn btn-ghost btn-sm';
      titleRowActions.prepend(formulasBtn);
    }
    formulasBtn.style.display = '';
    formulasBtn.textContent = I18n.t('reader_formulas_btn');
    formulasBtn.classList.toggle('active', activeHelperTool === 'formulas');
    formulasBtn.setAttribute('aria-pressed', String(activeHelperTool === 'formulas'));

    let scratchBtn = DOM.qs('#readerScratchpadBtn', titleRowActions);
    if (!scratchBtn) {
      scratchBtn = document.createElement('button');
      scratchBtn.id = 'readerScratchpadBtn';
      scratchBtn.type = 'button';
      scratchBtn.className = 'btn btn-ghost btn-sm';
      titleRowActions.insertBefore(scratchBtn, formulasBtn.nextSibling);
    }
    scratchBtn.style.display = '';
    scratchBtn.textContent = I18n.t('reader_scratchpad_btn');
    scratchBtn.classList.toggle('active', activeHelperTool === 'scratchpad');
    scratchBtn.setAttribute('aria-pressed', String(activeHelperTool === 'scratchpad'));

    let drawer = DOM.qs('#readerHelperDrawer', shell);
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'readerHelperDrawer';
      drawer.className = 'reader-helper-drawer';
      shell.insertBefore(drawer, bodyEl);
    }

    shell.classList.toggle('has-helper-open', Boolean(activeHelperTool));

    if (!activeHelperTool) {
      drawer.hidden = true;
      return;
    }

    drawer.hidden = false;
    const closeBtnHtml = `
      <button type="button" class="btn btn-ghost btn-sm reader-helper-close" data-close-helper="1">
        ${escapeHtml(I18n.t('reader_helper_close'))}
      </button>
    `;

    if (activeHelperTool === 'formulas') {
      const list = TOPIC_FORMULAS[resource.t] || TOPIC_FORMULAS.coll;
      drawer.innerHTML = `
        <div class="reader-helper-head">
          <strong>${escapeHtml(I18n.t('reader_formulas_btn'))}</strong>
          ${closeBtnHtml}
        </div>
        <div class="reader-helper-grid">
          ${list
            .map(
              (f) => `
                <div class="formula-ref-card">
                  <strong>${escapeHtml(f.label[lang] || f.label.en)}</strong>
                  <code>${escapeHtml(f.eq)}</code>
                </div>
              `
            )
            .join('')}
        </div>
      `;
    } else if (activeHelperTool === 'scratchpad') {
      const savedNote = getScratchpadText(resource.id);
      drawer.innerHTML = `
        <div class="scratchpad-wrap">
          <div class="scratchpad-head">
            <span>📝 ${escapeHtml(I18n.t('reader_scratchpad_lead'))}</span>
            ${closeBtnHtml}
          </div>
          <textarea id="readerScratchpadInput"
                    class="scratchpad-textarea"
                    data-scratchpad-id="${escapeHtml(resource.id)}"
                    placeholder="${escapeHtml(I18n.t('reader_scratchpad_ph'))}">${escapeHtml(savedNote)}</textarea>
        </div>
      `;
    }
  }

  function toggleHelperTool(toolName) {
    activeHelperTool = !toolName || activeHelperTool === toolName ? null : toolName;
    const { preview } = Store.getState();
    const resource = CurriculumService.findById(preview.id);
    if (resource) renderReaderHelperTools(resource);
  }

  function render() {
    const section = DOM.qs('#previewSection');
    if (!section) {
      document.body.classList.remove('has-focus-mode');
      return;
    }

    const { lang, preview } = Store.getState();
    const resource = CurriculumService.findById(preview.id);

    if (!resource) {
      renderNotFoundState();
      return;
    }

    const pdfPath = CurriculumService.getProblemPdfPath(resource, lang);
    const solPath = CurriculumService.getSolutionPdfPath(resource, lang);
    const resolvedType = preview.type === 'solution' && !solPath ? 'problem' : preview.type;

    // لا تُعدَّل الحالة مباشرة داخل render(): كل تغيير يمر عبر setState.
    if (Number(preview.id) !== Number(resource.id) || preview.type !== resolvedType) {
      Store.setState((s) => {
        s.preview.id = Number(resource.id);
        s.preview.type = resolvedType;
      });
    }

    const activePath = resolvedType === 'solution' ? solPath : pdfPath;
    const activeCount = activePath ? Downloads.getCount(activePath) : 0;

    const tagsEl = DOM.qs('#previewTags');
    if (tagsEl) tagsEl.innerHTML = CardComponent.renderTags(resource);

    const baseTitle = resource.title?.[lang] || resource.file || '';
    const docHeading =
      resolvedType === 'solution'
        ? `${baseTitle} — ${I18n.t('official_solutions')}`
        : baseTitle;

    const titleEl = DOM.qs('#previewTitle');
    if (titleEl) titleEl.textContent = docHeading;

    const descEl = DOM.qs('#previewDesc');
    if (descEl) descEl.textContent = CurriculumService.getDisplayDescription(resource, lang);

    // E3 — تبويبات بمعمارية ARIA كاملة: aria-selected + tabindex متدرّج.
    [
      [DOM.qs('#tabProblemBtn'), 'problem'],
      [DOM.qs('#tabSolutionBtn'), 'solution']
    ].forEach(([tabEl, tabType]) => {
      if (!tabEl) return;
      const selected = resolvedType === tabType;
      tabEl.classList.toggle('active', selected);
      tabEl.setAttribute('aria-selected', String(selected));
      tabEl.setAttribute('tabindex', selected ? '0' : '-1');
      if (tabType === 'solution') tabEl.classList.toggle('is-disabled-tab', !solPath);
    });

    const shell = DOM.qs('#filePreviewDialog');
    const focusBtn = DOM.qs('#previewFocusBtn');
    const closeBtn = DOM.qs('#previewCloseBtn');
    const isFocus = Boolean(preview.isFocusMode);

    if (shell) shell.classList.toggle('is-focus-mode', isFocus);
    document.body.classList.toggle('has-focus-mode', isFocus);

    if (focusBtn) {
      focusBtn.style.display = '';
      focusBtn.textContent = isFocus ? I18n.t('preview_focus_exit') : I18n.t('preview_focus_enter');
      focusBtn.setAttribute('aria-pressed', String(isFocus));
    }
    if (closeBtn) {
      closeBtn.hidden = !isFocus;
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
      dlBtn.textContent = resolvedType === 'solution' ? I18n.t('solution_download') : I18n.t('btn_download');
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

    bodyEl.setAttribute('role', 'tabpanel');
    bodyEl.setAttribute(
      'aria-labelledby',
      resolvedType === 'solution' ? 'tabSolutionBtn' : 'tabProblemBtn'
    );

    if (!activePath) {
      currentFrameSrc = null;
      bodyEl.innerHTML = `<p class="preview-desc-text preview-empty-msg">${escapeHtml(I18n.t('pdf_toast'))}</p>`;
      return;
    }

    renderPreviewViewport(bodyEl, resource, activePath, resolvedType, docHeading, activeCount);
  }

  function selectResource(id, type = 'problem') {
    const resource = CurriculumService.findById(id);
    if (!resource) {
      Toast.show(I18n.t('preview_not_found'));
      return;
    }

    if (type === 'solution' && !CurriculumService.getSolutionPdfPath(resource)) {
      Toast.show(I18n.t('solution_toast'));
      return;
    }

    Store.setState((s) => {
      s.preview.id = Number(resource.id);
      s.preview.type = type === 'solution' ? 'solution' : 'problem';
    });

    if (DOM.qs('#previewSection')) {
      syncPreviewUrl();
      render();
      global.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    global.location.href = `preview.html?id=${encodeURIComponent(resource.id)}&type=${encodeURIComponent(type)}`;
  }

  function switchTab(targetType) {
    const { preview } = Store.getState();
    const resource = CurriculumService.findById(preview.id);
    if (!resource) {
      Toast.show(I18n.t('preview_not_found'));
      return;
    }
    if (targetType === 'solution' && !CurriculumService.getSolutionPdfPath(resource)) {
      Toast.show(I18n.t('solution_toast'));
      return;
    }
    Store.setState((s) => {
      s.preview.type = targetType;
    });
    syncPreviewUrl();
    render();
  }

  /**
   * E3 — تنقّل لوحة المفاتيح بين تبويبات القارئ (أسهم، Home، End) مع احترام الاتجاه.
   * @param {KeyboardEvent} event
   * @param {HTMLElement} tabEl
   */
  function handleTabKeydown(event, tabEl) {
    const key = event.key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

    const tabs = [DOM.qs('#tabProblemBtn'), DOM.qs('#tabSolutionBtn')].filter(Boolean);
    if (!tabs.length) return;

    const current = tabs.indexOf(tabEl);
    if (current === -1) return;

    event.preventDefault();
    const isRtl = (document.documentElement.getAttribute('dir') || '') === 'rtl';
    let next = current;

    if (key === 'Home') next = 0;
    else if (key === 'End') next = tabs.length - 1;
    else {
      const step = key === 'ArrowRight' ? (isRtl ? -1 : 1) : isRtl ? 1 : -1;
      next = (current + step + tabs.length) % tabs.length;
    }

    const target = tabs[next];
    target.focus();
    switchTab(target.getAttribute('data-preview-tab'));
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
    const wasFocus = Boolean(Store.getState().preview.isFocusMode);
    const nextFocus = typeof forceVal === 'boolean' ? forceVal : !wasFocus;

    Store.setState((s) => {
      s.preview.isFocusMode = nextFocus;
    });
    render();

    if (wasFocus && !nextFocus) {
      const focusBtn = DOM.qs('#previewFocusBtn');
      if (focusBtn && typeof focusBtn.focus === 'function') {
        try {
          focusBtn.focus({ preventScroll: true });
        } catch (_) {
          focusBtn.focus();
        }
      }
    }
  }

  SPhOH.PreviewPage = Object.freeze({
    parseUrlParams,
    render,
    selectResource,
    switchTab,
    handleTabKeydown,
    stepResource,
    toggleFocusMode,
    toggleHelperTool,
    reloadPdfFrame,
    toggleInlinePreview,
    saveScratchpadText,
    syncPreviewUrl
  });
})(window);
