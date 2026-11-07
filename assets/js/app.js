/**
 * @file assets/js/app.js
 * @description المنسق الرئيسي للتطبيق (Application Bootstrapper & Global Event Controller).
 *
 * كل تفاعل يمر عبر سجل إجراءات مركزي (`registerAction`) وتفويض أحداث واحد على `document`.
 * كل إجراء معزول بـtry/catch، فلا يُسقط خطأٌ في إجراء واحد بقية الصفحة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const {
    Settings,
    Storage,
    Store,
    I18n,
    Theme,
    CurriculumService,
    Downloads,
    Progress,
    Effects,
    Layout,
    Toast,
    HomePage,
    FilesPage,
    PreviewPage,
    AboutPage,
    ContactPage,
    AdminPage,
    DOM
  } = SPhOH;

  // ---------------------------------------------------------------------------
  // 1) سجل الإجراءات (Action Registry)
  // ---------------------------------------------------------------------------

  const EVENT_TYPES = ['click', 'submit', 'input', 'change', 'keydown'];
  const actionRegistry = Object.create(null);
  EVENT_TYPES.forEach((type) => {
    actionRegistry[type] = [];
  });

  /**
   * يحوّل محدِّداً (selector) أو دالة إلى `match(event)` يعيد العنصر المطابق أو `null`.
   * @param {string|Function} matcher
   * @returns {(event: Event) => (Element|boolean|null)}
   */
  function resolveMatcher(matcher) {
    if (typeof matcher === 'function') return matcher;
    const selector = String(matcher);
    return (event) => {
      const target = event.target;
      return target && typeof target.closest === 'function' ? target.closest(selector) : null;
    };
  }

  /**
   * تسجيل إجراء واحد.
   * @param {'click'|'submit'|'input'|'change'|'keydown'} eventType
   * @param {string|Function} matcher selector أو دالة `(event) => Element|null`
   * @param {(event: Event, element: any) => void} handler
   * @param {{ name?: string, preventDefault?: boolean }} [options]
   */
  function registerAction(eventType, matcher, handler, options = {}) {
    if (!actionRegistry[eventType]) {
      throw new Error(`[SPhOH] unknown action event type: ${eventType}`);
    }
    actionRegistry[eventType].push({
      name: options.name || String(matcher),
      match: resolveMatcher(matcher),
      handler,
      preventDefault: Boolean(options.preventDefault)
    });
  }

  /** ينفّذ إجراءً واحداً بمعزل عن الأخطاء. */
  function runAction(action, event, matchedEl) {
    if (action.preventDefault) event.preventDefault();
    try {
      action.handler(event, matchedEl);
    } catch (err) {
      console.error(`[SPhOH] action "${action.name}" failed:`, err);
    }
  }

  /** تفويض واحد على `document` لكل نوع حدث؛ أول إجراء مطابق فقط ينفَّذ. */
  function bindDelegatedEvent(eventType) {
    document.addEventListener(eventType, (event) => {
      const actions = actionRegistry[eventType] || [];
      for (let i = 0; i < actions.length; i += 1) {
        const action = actions[i];
        let matchedEl = null;
        try {
          matchedEl = action.match(event);
        } catch (err) {
          matchedEl = null;
        }
        if (!matchedEl) continue;
        runAction(action, event, matchedEl);
        return;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2) إجراءات النقر
  // ---------------------------------------------------------------------------

  function registerClickActions() {
    registerAction('click', '#langBtn', () => {
      I18n.toggleLang();
      refreshAllViews();
    });

    registerAction('click', '#themeBtn', () => {
      Theme.toggleTheme();
    });

    registerAction('click', '#cmdPaletteBtn', () => {
      Effects?.toggleCommandPalette(true);
    });

    registerAction('click', '#cmdPaletteCloseBtn', () => {
      Effects?.toggleCommandPalette(false);
    });

    registerAction('click', '[data-cmd-action]', (event, el) => {
      Effects?.handleCommandAction(el.getAttribute('data-cmd-action'));
    });

    registerAction('click', '#backToTopBtn', () => {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });

    registerAction('click', '#simLaunchBtn', () => {
      HomePage.launchProjectileAnimation();
    });

    registerAction('click', '#randomPracticeBtn', () => {
      FilesPage.pickRandomPracticeSet();
    });

    registerAction('click', '#readerFormulasBtn', () => {
      PreviewPage.toggleHelperTool('formulas');
    });

    registerAction('click', '#readerScratchpadBtn', () => {
      PreviewPage.toggleHelperTool('scratchpad');
    });

    registerAction('click', '[data-close-helper]', () => {
      PreviewPage.toggleHelperTool(null);
    });

    registerAction('click', '[data-preview-reload]', () => {
      PreviewPage.reloadPdfFrame();
    });

    registerAction('click', '[data-preview-inline-toggle]', () => {
      PreviewPage.toggleInlinePreview();
    });

    registerAction('click', '#adminAutoDescBtn', () => {
      AdminPage.fillSmartDescriptionIntoForm();
    });

    registerAction('click', '[data-toggle-bookmark]', (event, el) => {
      Progress?.toggleBookmark(el.getAttribute('data-toggle-bookmark'));
      HomePage.renderFeatured();
      FilesPage.render();
    });

    registerAction('click', '[data-toggle-complete]', (event, el) => {
      Progress?.toggleCompleted(el.getAttribute('data-toggle-complete'));
      HomePage.renderFeatured();
      FilesPage.render();
    });

    registerAction('click', '[data-status-filter]', (event, el) => {
      FilesPage.setStatusFilter(el.getAttribute('data-status-filter'));
    });

    registerAction('click', '[data-view-mode]', (event, el) => {
      FilesPage.setViewMode(el.getAttribute('data-view-mode'));
    });

    registerAction('click', '[data-open-preview]', (event, el) => {
      // إغلاق لوحة الأوامر أولاً إن كان النقر صادراً منها.
      if (Store.getState().commandPalette.isOpen) Effects?.toggleCommandPalette(false);

      if (DOM.qs('#previewSection')) {
        event.preventDefault();
        PreviewPage.selectResource(
          el.getAttribute('data-open-preview'),
          el.getAttribute('data-preview-type') || 'problem'
        );
      }
    });

    // يُسجَّل بعد `[data-open-preview]` حتى تُغلق نتائج لوحة الأوامر مع الانتقال إليها،
    // ويبقى فعّالاً لأي عنصر `data-cmd-close` بلا وجهة.
    registerAction('click', '[data-cmd-close]', () => {
      Effects?.toggleCommandPalette(false);
    });

    registerAction('click', '[data-preview-tab]', (event, el) => {
      PreviewPage.switchTab(el.getAttribute('data-preview-tab'));
    });

    registerAction('click', '[data-preview-step]', (event, el) => {
      PreviewPage.stepResource(Number(el.getAttribute('data-preview-step')));
    });

    registerAction('click', '#previewFocusBtn, #previewCloseBtn, [data-preview-focus-toggle]', () => {
      PreviewPage.toggleFocusMode();
    });

    registerAction('click', '[data-filter-topic]', (event, el) => {
      FilesPage.setTopicFilter(el.getAttribute('data-filter-topic'));
    });

    registerAction('click', '[data-download-key]', (event, el) => {
      Downloads.recordDownload(el.getAttribute('data-download-key'));
      Toast.show(I18n.t('download_started'));
    });

    registerAction('click', '[data-missing-file]', (event, el) => {
      event.preventDefault();
      const isSolution = el.getAttribute('data-missing-file') === 'solution';
      Toast.show(I18n.t(isSolution ? 'solution_toast' : 'pdf_toast'));
    });

    registerAction('click', '[data-faq]', (event, el) => {
      HomePage.handleFaqToggle(el);
    });

    registerAction('click', '#copyEmailBtn', () => {
      ContactPage.copyOfficialEmail();
    });

    // --- استوديو الإدارة ---
    registerAction('click', '[data-studio-topic]', (event, el) => {
      AdminPage.setStudioTopicFilter(el.getAttribute('data-studio-topic'));
    });

    registerAction('click', '[data-toggle-prob]', (event, el) => {
      const ok = CurriculumService.toggleProblemForLang(
        el.getAttribute('data-toggle-prob'),
        el.getAttribute('data-prob-lang')
      );
      refreshAllViews();
      Toast.show(I18n.t(ok ? 'admin_saved_toast' : 'admin_storage_error'));
    });

    registerAction('click', '[data-toggle-sol]', (event, el) => {
      const ok = CurriculumService.toggleSolutionForLang(
        el.getAttribute('data-toggle-sol'),
        el.getAttribute('data-sol-lang')
      );
      refreshAllViews();
      Toast.show(I18n.t(ok ? 'admin_saved_toast' : 'admin_storage_error'));
    });

    registerAction('click', '[data-admin-move]', (event, el) => {
      const ok = CurriculumService.moveResource(
        el.getAttribute('data-admin-move'),
        Number(el.getAttribute('data-move-dir'))
      );
      refreshAllViews();
      if (!ok) Toast.show(I18n.t('admin_storage_error'));
    });

    registerAction('click', '[data-admin-edit]', (event, el) => {
      AdminPage.populateFormForEdit(el.getAttribute('data-admin-edit'));
    });

    registerAction('click', '[data-admin-delete]', (event, el) => {
      AdminPage.deleteResourceWithUndo(el.getAttribute('data-admin-delete'));
    });

    registerAction('click', '#openAddCurriculumBtn', () => {
      Store.setState((s) => {
        s.admin.editingId = null;
      });
      const form = DOM.qs('#adminResourceForm');
      if (form) form.reset();
      AdminPage.toggleNewTopicBox();
      AdminPage.updateStemPathHint();
      AdminPage.openFormDrawer(false);
    });

    registerAction('click', '#adminCancelEditBtn, #adminCloseFormBtn', () => {
      AdminPage.resetFormDrawer();
    });

    registerAction('click', '#adminLogoutBtn', () => {
      AdminPage.setUnlocked(false);
      AdminPage.render();
    });

    registerAction('click', '#adminExportJsonBtn', () => {
      AdminPage.exportResourcesJson();
    });

    registerAction('click', '#adminExportBackupBtn', () => {
      AdminPage.exportFullBackup();
    });

    registerAction('click', '#adminCopyJsonBtn', () => {
      AdminPage.copyResourcesJson();
    });

    registerAction('click', '#adminResetDefaultBtn', () => {
      AdminPage.resetDefaultCurricula();
    });

    // النقر على خلفية لوحة الأوامر وحدها يغلقها. يُسجَّل أخيراً حتى تصل نقرات
    // الحوار الداخلية إلى إجراءاتها بدل أن يبتلعها مطابق الخلفية.
    registerAction(
      'click',
      (event) => (event.target && event.target.id === 'cmdPaletteBackdrop' ? event.target : null),
      () => {
        Effects?.toggleCommandPalette(false);
      },
      { name: 'cmd-palette-backdrop' }
    );
  }

  // ---------------------------------------------------------------------------
  // 3) إجراءات الإرسال والإدخال والتغيير
  // ---------------------------------------------------------------------------

  function registerFormActions() {
    registerAction(
      'submit',
      '#adminLoginForm',
      (event, form) => {
        AdminPage.handleLoginSubmit(form);
      },
      { preventDefault: true, name: 'admin-login' }
    );

    registerAction(
      'submit',
      '#adminResourceForm',
      () => {
        AdminPage.handleResourceFormSubmit();
      },
      { preventDefault: true, name: 'admin-resource-form' }
    );
  }

  function registerInputActions() {
    registerAction(
      'input',
      '#adminFileStem, #adminTitleAr, #adminTitleEn, #adminDescAr, #adminDescEn, #adminNewTopicKey',
      () => {
        AdminPage.updateStemPathHint();
      }
    );

    const debouncedFilesSearch = DOM.debounce((value) => {
      FilesPage.setSearchQuery(value);
    }, 120);

    registerAction('input', '#searchInput', (event, input) => {
      debouncedFilesSearch(input.value);
    });

    const debouncedStudioSearch = DOM.debounce((value) => {
      AdminPage.setStudioSearchQuery(value);
    }, 120);

    registerAction('input', '#studioSearchInput', (event, input) => {
      debouncedStudioSearch(input.value);
    });

    registerAction('input', '#readerScratchpadInput', (event, input) => {
      PreviewPage.saveScratchpadText(input.getAttribute('data-scratchpad-id'), input.value);
    });

    registerAction('input', '#cmdPaletteInput', (event, input) => {
      Effects?.renderCommandResults(input.value);
    });

    registerAction('input', '#simAngleInput, #simVelInput', () => {
      const angleVal = Number(DOM.qs('#simAngleInput')?.value || 53);
      const velVal = Number(DOM.qs('#simVelInput')?.value || 24);
      Store.setState((s) => {
        s.simulator.angle = angleVal;
        s.simulator.velocity = velVal;
      });
      HomePage.updateSimulatorView();
      HomePage.launchProjectileAnimation(true);
    });
  }

  function registerChangeActions() {
    registerAction('change', '#adminTopic, #adminLevel, #adminSolutionMode, #adminProblemLangs', () => {
      AdminPage.toggleNewTopicBox();
    });

    registerAction('change', '#adminPdfFilePicker', (event, input) => {
      AdminPage.handlePdfFilePick(input);
    });

    registerAction('change', '#adminImportJsonInput', (event, input) => {
      AdminPage.handleImportJsonFile(input);
    });

    registerAction('change', '#sortFilterSelect', (event, select) => {
      FilesPage.setSortBy(select.value);
    });

    registerAction('change', '#levelFilter', (event, select) => {
      FilesPage.setLevelFilter(select.value);
    });

    registerAction('change', '#simGravSelect', (event, select) => {
      Store.setState((s) => {
        s.simulator.gravity = Number(select.value || 9.8);
      });
      HomePage.updateSimulatorView();
      HomePage.launchProjectileAnimation(true);
    });
  }

  function registerKeyboardActions() {
    registerAction(
      'keydown',
      (event) => ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' ? true : null),
      (event) => {
        event.preventDefault();
        Effects?.toggleCommandPalette();
      },
      { name: 'cmdk' }
    );

    registerAction(
      'keydown',
      (event) => (event.key === 'Escape' ? true : null),
      () => {
        if (Store.getState().commandPalette.isOpen) {
          Effects?.toggleCommandPalette(false);
          return;
        }
        // E7 — إغلاق درج الإدارة بـEsc وإعادة التركيز إلى زر الفتح.
        if (Store.getState().admin.isFormOpen) {
          AdminPage?.resetFormDrawer();
          return;
        }
        if (Store.getState().preview.isFocusMode) {
          PreviewPage.toggleFocusMode(false);
        }
      },
      { name: 'escape' }
    );

    // E3 — أسهم لوحة المفاتيح بين تبويبات القارئ (يُسجَّل بعد Escape حتى يفوز الإغلاق عليه).
    registerAction('keydown', '.preview-doc-tab', (event, el) => {
      PreviewPage.handleTabKeydown(event, el);
    });
  }

  function bindGlobalEvents() {
    registerClickActions();
    registerFormActions();
    registerInputActions();
    registerChangeActions();
    registerKeyboardActions();

    document.addEventListener('sphoh:refresh', refreshAllViews);
    EVENT_TYPES.forEach(bindDelegatedEvent);
  }

  // ---------------------------------------------------------------------------
  // 4) الرسم والحالة
  // ---------------------------------------------------------------------------

  function refreshAllViews() {
    I18n.applyDocumentLang();
    Theme.applyTheme();
    HomePage.render();
    FilesPage.render();
    PreviewPage.render();
    AboutPage.render();
    AdminPage?.render();
    Effects?.observeRevealElements();
  }

  /** بصمة بيانات الموارد تُستخدم لمنع إعادة الرسم غير الضرورية عند الإقلاع. */
  function dataSignature() {
    return JSON.stringify(Store.getState().resources);
  }

  /**
   * مزامنة التبويبات: أي تغيير في مفاتيح التخزين المشتركة يعيد تحميل الحالة هنا.
   */
  function bindStorageSync() {
    global.addEventListener('storage', (event) => {
      const key = event.key;
      if (!key) return;
      const keys = Settings.STORAGE_KEYS;

      if (key === keys.CUSTOM_RESOURCES || key === keys.CUSTOM_TOPICS) {
        CurriculumService.loadTopics();
        Promise.resolve(CurriculumService.initResources()).then(() => refreshAllViews());
        return;
      }

      if (key === keys.LANG) {
        const lang = event.newValue === 'en' ? 'en' : 'ar';
        if (Store.getState().lang !== lang) {
          Store.setState((s) => {
            s.lang = lang;
          });
          refreshAllViews();
        }
        return;
      }

      if (key === keys.THEME) {
        const theme =
          event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : 'auto';
        Store.setState((s) => {
          s.theme = theme;
        });
        Theme.applyTheme();
        return;
      }

      if (key === keys.BOOKMARKS || key === keys.COMPLETED) {
        const stored = Storage.getJSON(key, []);
        const values = Array.isArray(stored) ? stored.map(Number) : [];
        Store.setState((s) => {
          if (key === keys.BOOKMARKS) s.bookmarks = values;
          else s.completed = values;
        });
        refreshAllViews();
      }
    });
  }

  async function init() {
    Layout.mount();
    PreviewPage.parseUrlParams();
    bindGlobalEvents();
    bindStorageSync();
    Effects?.init();

    const beforeData = dataSignature();
    refreshAllViews();

    await CurriculumService.initResources();

    // تُعاد الواجهات فقط إن تغيّرت بيانات الموارد فعلياً بعد الجلب
    // (مثلاً JSON مختلف عن FALLBACK_RESOURCES أو وجود قائمة إدارة مخصصة).
    if (dataSignature() !== beforeData) refreshAllViews();
  }

  SPhOH.App = Object.freeze({
    init,
    refreshAllViews,
    registerAction,
    dataSignature
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
