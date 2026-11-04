/**
 * @file assets/js/app.js
 * @description المنسق الرئيسي للتطبيق (Application Bootstrapper & Global Event Controller).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const {
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

  function syncSimUrlBar(pageKey) {
    const urlInput = DOM.qs('#simBrowserUrlInput');
    if (!urlInput) return;

    const pageFileMap = {
      home: 'index.html',
      files: 'files.html',
      preview: 'preview.html',
      about: 'about.html',
      contact: 'contact.html',
      admin: 'Admin.html'
    };

    const fileName = pageFileMap[pageKey] || 'index.html';
    urlInput.value = `https://devfhd.github.io/SPhOH/${fileName}`;
  }

  function switchCanvasView(targetPage) {
    DOM.qsa('[data-page-view]').forEach((viewEl) => {
      viewEl.hidden = viewEl.getAttribute('data-page-view') !== targetPage;
    });

    DOM.qsa('.links a[data-nav-page]').forEach((linkEl) => {
      linkEl.classList.toggle('active', linkEl.getAttribute('data-nav-page') === targetPage);
    });

    syncSimUrlBar(targetPage);
    if (targetPage === 'preview') PreviewPage.render();
    if (targetPage === 'admin') AdminPage.render();
    Effects?.observeRevealElements();
    global.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function refreshAllViews() {
    I18n.applyDocumentLang();
    Theme.applyTheme();
    HomePage.render();
    FilesPage.render();
    PreviewPage.render();
    AboutPage.render();
    AdminPage.render();
    Effects?.observeRevealElements();
    SPhOH.MathTypeset?.typeset(document.body);
  }

  function bindGlobalEvents() {
    // 1. أحداث النقر (Click Delegation)
    document.addEventListener('click', (e) => {
      if (e.target.closest('#langBtn')) {
        I18n.toggleLang();
        refreshAllViews();
        return;
      }

      if (e.target.closest('#themeBtn')) {
        Theme.toggleTheme();
        return;
      }

      if (e.target.closest('#cmdPaletteBtn')) {
        Effects?.toggleCommandPalette(true);
        return;
      }

      if (e.target.closest('#cmdPaletteCloseBtn') || e.target.id === 'cmdPaletteBackdrop') {
        Effects?.toggleCommandPalette(false);
        return;
      }

      const cmdActBtn = e.target.closest('[data-cmd-action]');
      if (cmdActBtn) {
        Effects?.handleCommandAction(cmdActBtn.getAttribute('data-cmd-action'));
        return;
      }

      if (e.target.closest('[data-cmd-close]')) {
        Effects?.toggleCommandPalette(false);
      }

      if (e.target.closest('#backToTopBtn')) {
        global.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (e.target.closest('#simLaunchBtn')) {
        HomePage.launchProjectileAnimation();
        return;
      }

      if (e.target.closest('#randomPracticeBtn')) {
        FilesPage.pickRandomPracticeSet();
        return;
      }

      if (e.target.closest('#readerFormulasBtn')) {
        PreviewPage.toggleHelperTool('formulas');
        return;
      }
      if (e.target.closest('#readerScratchpadBtn')) {
        PreviewPage.toggleHelperTool('scratchpad');
        return;
      }

      // زر التوليد التلقائي الذكي للوصف في استوديو الإدارة
      if (e.target.closest('#adminAutoDescBtn')) {
        AdminPage.fillSmartDescriptionIntoForm();
        return;
      }

      const bookmarkBtn = e.target.closest('[data-toggle-bookmark]');
      if (bookmarkBtn) {
        Progress?.toggleBookmark(bookmarkBtn.getAttribute('data-toggle-bookmark'));
        HomePage.renderFeatured();
        FilesPage.render();
        return;
      }

      const completeBtn = e.target.closest('[data-toggle-complete]');
      if (completeBtn) {
        Progress?.toggleCompleted(completeBtn.getAttribute('data-toggle-complete'));
        HomePage.renderFeatured();
        FilesPage.render();
        return;
      }

      const statusTab = e.target.closest('[data-status-filter]');
      if (statusTab) {
        FilesPage.setStatusFilter(statusTab.getAttribute('data-status-filter'));
        return;
      }

      const viewModeBtn = e.target.closest('[data-view-mode]');
      if (viewModeBtn) {
        FilesPage.setViewMode(viewModeBtn.getAttribute('data-view-mode'));
        return;
      }

      const navPageLink = e.target.closest('[data-nav-page]');
      if (navPageLink && global.__SPHOH_CANVAS_MODE__) {
        e.preventDefault();
        switchCanvasView(navPageLink.getAttribute('data-nav-page'));
        return;
      }

      const openPrevBtn = e.target.closest('[data-open-preview]');
      if (openPrevBtn && (global.__SPHOH_CANVAS_MODE__ || DOM.qs('#previewSection'))) {
        e.preventDefault();
        PreviewPage.selectResource(
          openPrevBtn.getAttribute('data-open-preview'),
          openPrevBtn.getAttribute('data-preview-type') || 'problem'
        );
        return;
      }

      const previewTabBtn = e.target.closest('[data-preview-tab]');
      if (previewTabBtn) {
        PreviewPage.switchTab(previewTabBtn.getAttribute('data-preview-tab'));
        return;
      }

      const previewStepBtn = e.target.closest('[data-preview-step]');
      if (previewStepBtn) {
        PreviewPage.stepResource(Number(previewStepBtn.getAttribute('data-preview-step')));
        return;
      }

      if (e.target.closest('#previewFocusBtn, #previewCloseBtn')) {
        PreviewPage.toggleFocusMode();
        return;
      }

      const zoomBtn = e.target.closest('[data-zoom-dir]');
      if (zoomBtn) {
        PreviewPage.adjustZoom(zoomBtn.getAttribute('data-zoom-dir'));
        return;
      }

      const topicChip = e.target.closest('[data-filter-topic]');
      if (topicChip) {
        FilesPage.setTopicFilter(topicChip.getAttribute('data-filter-topic'));
        return;
      }

      const downloadLink = e.target.closest('[data-download-key]');
      if (downloadLink) {
        if (global.__SPHOH_CANVAS_MODE__) {
          e.preventDefault();
        }
        Downloads.recordDownload(downloadLink.getAttribute('data-download-key'));
        Toast.show(I18n.t('download_started'));
        return;
      }

      const missingBtn = e.target.closest('[data-missing-file]');
      if (missingBtn) {
        e.preventDefault();
        const isSolution = missingBtn.getAttribute('data-missing-file') === 'solution';
        Toast.show(I18n.t(isSolution ? 'solution_toast' : 'pdf_toast'));
        return;
      }

      const faqBtn = e.target.closest('[data-faq]');
      if (faqBtn) {
        HomePage.handleFaqToggle(faqBtn);
        return;
      }

      if (e.target.closest('#copyEmailBtn')) {
        ContactPage.copyOfficialEmail();
        return;
      }

      // --- أحداث استوديو الإدارة المتكامل (SPhOH Content Studio) ---
      const studioTopicBtn = e.target.closest('[data-studio-topic]');
      if (studioTopicBtn) {
        AdminPage.setStudioTopicFilter(studioTopicBtn.getAttribute('data-studio-topic'));
        return;
      }

      const probToggleBtn = e.target.closest('[data-toggle-prob]');
      if (probToggleBtn) {
        CurriculumService.toggleProblemForLang(
          probToggleBtn.getAttribute('data-toggle-prob'),
          probToggleBtn.getAttribute('data-prob-lang')
        );
        refreshAllViews();
        Toast.show(I18n.t('admin_saved_toast'));
        return;
      }

      const solToggleBtn = e.target.closest('[data-toggle-sol]');
      if (solToggleBtn) {
        CurriculumService.toggleSolutionForLang(
          solToggleBtn.getAttribute('data-toggle-sol'),
          solToggleBtn.getAttribute('data-sol-lang')
        );
        refreshAllViews();
        Toast.show(I18n.t('admin_saved_toast'));
        return;
      }

      const moveBtn = e.target.closest('[data-admin-move]');
      if (moveBtn) {
        CurriculumService.moveResource(
          moveBtn.getAttribute('data-admin-move'),
          Number(moveBtn.getAttribute('data-move-dir'))
        );
        refreshAllViews();
        return;
      }

      const editBtn = e.target.closest('[data-admin-edit]');
      if (editBtn) {
        AdminPage.populateFormForEdit(editBtn.getAttribute('data-admin-edit'));
        return;
      }

      const deleteBtn = e.target.closest('[data-admin-delete]');
      if (deleteBtn) {
        CurriculumService.deleteResource(deleteBtn.getAttribute('data-admin-delete'));
        refreshAllViews();
        Toast.show(I18n.t('admin_deleted_toast'));
        return;
      }

      if (e.target.closest('#openAddCurriculumBtn')) {
        Store.setState((s) => {
          s.admin.editingId = null;
        });
        const form = DOM.qs('#adminResourceForm');
        if (form) form.reset();
        AdminPage.toggleNewTopicBox();
        AdminPage.updateStemPathHint();
        AdminPage.openFormDrawer(false);
        return;
      }

      if (e.target.closest('#adminCancelEditBtn, #adminCloseFormBtn')) {
        AdminPage.resetFormDrawer();
        return;
      }

      if (e.target.closest('#adminLogoutBtn')) {
        AdminPage.setUnlocked(false);
        AdminPage.render();
        return;
      }

      if (e.target.closest('#adminExportJsonBtn')) {
        AdminPage.exportResourcesJson();
        return;
      }

      if (e.target.closest('#adminCopyJsonBtn')) {
        AdminPage.copyResourcesJson();
        return;
      }

      if (e.target.closest('#adminResetDefaultBtn')) {
        AdminPage.resetDefaultCurricula();
      }
    });

    // 2. أحداث إرسال النماذج (Form Submits)
    document.addEventListener('submit', (e) => {
      if (e.target?.id === 'adminLoginForm') {
        e.preventDefault();
        AdminPage.handleLoginSubmit(e.target);
        return;
      }

      if (e.target?.id === 'adminResourceForm') {
        e.preventDefault();
        AdminPage.handleResourceFormSubmit();
        return;
      }

      if (e.target?.id === 'simBrowserUrlForm') {
        e.preventDefault();
        const urlInput = DOM.qs('#simBrowserUrlInput');
        if (!urlInput) return;

        const rawUrl = urlInput.value.trim();
        const lastSegment = rawUrl
          .split('/')
          .pop()
          .split('?')[0]
          .split('#')[0]
          .replace(/\.html$/i, '')
          .toLowerCase();

        const routeMap = {
          '': 'home',
          index: 'home',
          sphoh: 'home',
          files: 'files',
          preview: 'preview',
          about: 'about',
          contact: 'contact',
          admin: 'admin'
        };

        const targetPage = routeMap[lastSegment];
        if (targetPage) {
          switchCanvasView(targetPage);
        } else {
          const lang = I18n.getLang();
          Toast.show(
            lang === 'ar'
              ? 'الرابط غير معروف. غيّر index إلى Admin للوصول لصفحة المشرف.'
              : 'Unknown route. Change index to Admin to open the Admin page.'
          );
        }
      }
    });

    // 3. أحداث الإدخال والتغيير
    document.addEventListener('input', (e) => {
      const id = e.target?.id || '';
      if (
        id === 'adminFileStem' ||
        id === 'adminTitleAr' ||
        id === 'adminTitleEn' ||
        id === 'adminDescAr' ||
        id === 'adminDescEn' ||
        id === 'adminNewTopicKey'
      ) {
        AdminPage.updateStemPathHint();
        return;
      }

      if (id === 'studioSearchInput') {
        AdminPage.setStudioSearchQuery(e.target.value);
        return;
      }

      if (id === 'readerScratchpadInput') {
        PreviewPage.saveScratchpadText(e.target.getAttribute('data-scratchpad-id'), e.target.value);
        return;
      }

      if (id === 'cmdPaletteInput') {
        Effects?.renderCommandResults(e.target.value);
        return;
      }

      if (id === 'simAngleInput' || id === 'simVelInput') {
        const angleVal = Number(DOM.qs('#simAngleInput')?.value || 53);
        const velVal = Number(DOM.qs('#simVelInput')?.value || 24);
        Store.setState((s) => {
          s.simulator.angle = angleVal;
          s.simulator.velocity = velVal;
        });
        HomePage.updateSimulatorView();
        HomePage.launchProjectileAnimation();
      }
    });

    document.addEventListener('change', (e) => {
      const id = e.target?.id || '';
      if (id === 'adminTopic' || id === 'adminLevel' || id === 'adminSolutionMode' || id === 'adminProblemLangs') {
        AdminPage.toggleNewTopicBox();
        return;
      }
      if (id === 'adminPdfFilePicker') {
        AdminPage.handlePdfFilePick(e.target);
        return;
      }
      if (id === 'adminImportJsonInput') {
        AdminPage.handleImportJsonFile(e.target);
        return;
      }
      if (id === 'sortFilterSelect') {
        FilesPage.setSortBy(e.target.value);
        return;
      }
      if (id === 'simGravSelect') {
        Store.setState((s) => {
          s.simulator.gravity = Number(e.target.value || 9.8);
        });
        HomePage.updateSimulatorView();
        HomePage.launchProjectileAnimation();
      }
    });

    // 4. اختصارات لوحة المفاتيح العالمية
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        Effects?.toggleCommandPalette();
        return;
      }

      if (e.key === 'Escape') {
        if (Store.getState().commandPalette.isOpen) {
          Effects?.toggleCommandPalette(false);
          return;
        }
        if (Store.getState().preview.isFocusMode) {
          PreviewPage.toggleFocusMode(false);
        }
      }
    });
  }

  async function init() {
    Layout.mount();
    PreviewPage.parseUrlParams();
    bindGlobalEvents();
    Effects?.init();
    refreshAllViews();

    await CurriculumService.initResources();
    refreshAllViews();
  }

  SPhOH.App = Object.freeze({
    init,
    refreshAllViews,
    switchCanvasView
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
