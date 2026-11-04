/**
 * @file assets/js/pages/files.page.js
 * @description وحدة صفحة المكتبة (files.html):
 * - لوحة تتبع تقدم الطالب الشخصي (Training Progress Tracker)
 * - زر التدريب العشوائي بضغطة واحدة (🎲 Random Practice Picker)
 * - فلاتر الحالة، الترتيب المتقدم، والتبديل بين عرض البطاقات وعرض القائمة
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Catalog, Storage, Store, I18n, CurriculumService, Downloads, Progress, CardComponent, PreviewPage, Effects, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  function renderProgressDashboard() {
    const filterBar = DOM.qs('.filter-bar');
    if (!filterBar) return;

    let progressBox = DOM.qs('#studentProgressBanner');
    if (!progressBox) {
      progressBox = document.createElement('div');
      progressBox.id = 'studentProgressBanner';
      progressBox.className = 'student-progress-banner';
      filterBar.parentNode.insertBefore(progressBox, filterBar);
    }

    const { filters, lang } = Store.getState();
    const summary = Progress.getProgressSummary();
    const statsFn = I18n.t('progress_stats');
    const statsLabel =
      typeof statsFn === 'function'
        ? statsFn(summary.doneCount, summary.total, summary.percentage)
        : `${summary.doneCount}/${summary.total}`;

    const statusTabs = [
      { key: 'all', label: I18n.t('status_all') },
      { key: 'bookmarked', label: `${I18n.t('status_saved')} (${summary.savedCount})` },
      { key: 'completed', label: `${I18n.t('status_completed')} (${summary.doneCount})` },
      { key: 'pending', label: I18n.t('status_pending') }
    ];

    progressBox.innerHTML = `
      <div class="progress-banner-top">
        <div class="progress-info">
          <span class="progress-title-label">🎯 ${escapeHtml(I18n.t('progress_title'))}</span>
          <span class="progress-stats-pill">${escapeHtml(statsLabel)}</span>
        </div>
        <div class="progress-bar-track" role="progressbar" aria-valuenow="${summary.percentage}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-fill" style="width: ${summary.percentage}%"></div>
        </div>
      </div>

      <div class="progress-controls-row">
        <div class="status-tabs-group" role="tablist">
          ${statusTabs
            .map(
              (tab) => `
                <button type="button"
                        class="status-tab-btn ${filters.status === tab.key ? 'active' : ''}"
                        data-status-filter="${escapeHtml(tab.key)}">
                  ${escapeHtml(tab.label)}
                </button>
              `
            )
            .join('')}
        </div>

        <div class="view-sort-cluster">
          <button type="button" class="btn btn-ghost btn-sm" id="randomPracticeBtn">
            🎲 ${lang === 'ar' ? 'تدريب عشوائي' : 'Random Set'}
          </button>

          <select id="sortFilterSelect" class="level-select sort-select" aria-label="Sort problem sets">
            <option value="default" ${filters.sortBy === 'default' ? 'selected' : ''}>${escapeHtml(I18n.t('sort_default'))}</option>
            <option value="lvl_asc" ${filters.sortBy === 'lvl_asc' ? 'selected' : ''}>${escapeHtml(I18n.t('sort_lvl_asc'))}</option>
            <option value="lvl_desc" ${filters.sortBy === 'lvl_desc' ? 'selected' : ''}>${escapeHtml(I18n.t('sort_lvl_desc'))}</option>
            <option value="downloads" ${filters.sortBy === 'downloads' ? 'selected' : ''}>${escapeHtml(I18n.t('sort_downloads'))}</option>
            <option value="title" ${filters.sortBy === 'title' ? 'selected' : ''}>${escapeHtml(I18n.t('sort_title'))}</option>
          </select>

          <div class="view-mode-toggle" role="group" aria-label="View Mode">
            <button type="button"
                    class="view-mode-btn ${filters.viewMode === 'grid' ? 'active' : ''}"
                    data-view-mode="grid">
              ${escapeHtml(I18n.t('view_grid'))}
            </button>
            <button type="button"
                    class="view-mode-btn ${filters.viewMode === 'list' ? 'active' : ''}"
                    data-view-mode="list">
              ${escapeHtml(I18n.t('view_list'))}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * اختيار مجموعة مسائل عشوائية (مع إعطاء الأولوية للمجموعات غير المكتملة) وفتحها للتدريب
   */
  function pickRandomPracticeSet() {
    const { resources, completed } = Store.getState();
    if (resources.length === 0) return;

    const uncompleted = resources.filter((r) => !completed.includes(Number(r.id)));
    const pool = uncompleted.length > 0 ? uncompleted : resources;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen && PreviewPage) {
      PreviewPage.selectResource(chosen.id, 'problem');
    }
  }

  function renderFilters() {
    renderProgressDashboard();

    const chipsWrap = DOM.qs('#topicFilters');
    const levelSelect = DOM.qs('#levelFilter');
    const searchInput = DOM.qs('#searchInput');

    const { resources, topics, filters, lang } = Store.getState();

    if (chipsWrap) {
      const availableTopics = ['all'];
      resources.forEach((item) => {
        if (!availableTopics.includes(item.t)) {
          availableTopics.push(item.t);
        }
      });

      chipsWrap.innerHTML = availableTopics
        .map((topicKey) => {
          const isActive = filters.topic === topicKey;
          const label = topicKey === 'all' ? I18n.t('filter_all') : topics[topicKey]?.[lang] || topicKey;
          return `
            <button type="button"
                    class="filter-chip${isActive ? ' active' : ''}"
                    data-filter-topic="${escapeHtml(topicKey)}">
              ${escapeHtml(label)}
            </button>
          `;
        })
        .join('');
    }

    if (levelSelect) {
      const currentLevel = filters.level;
      const optionsHtml = [
        `<option value="all">${escapeHtml(I18n.t('level_all'))}</option>`,
        ...[1, 2, 3].map(
          (lvl) => `<option value="${lvl}">${escapeHtml(Catalog.LEVELS[lvl]?.[lang] || `Level ${lvl}`)}</option>`
        )
      ].join('');

      levelSelect.innerHTML = optionsHtml;
      levelSelect.value = currentLevel;
    }

    if (searchInput) {
      searchInput.placeholder = I18n.t('search_placeholder');
      if (searchInput.value !== filters.query) {
        searchInput.value = filters.query;
      }
    }
  }

  function renderGrid() {
    const container = DOM.qs('#sectionsContainer');
    if (!container) return;

    const { topics, filters, lang } = Store.getState();
    const filteredList = CurriculumService.getFilteredResources();
    const counts = Downloads.getAllCounts();

    container.classList.toggle('is-list-view', filters.viewMode === 'list');

    const countEl = DOM.qs('#count');
    if (countEl) {
      const countFormatter = I18n.t('n_sets');
      countEl.textContent = typeof countFormatter === 'function' ? countFormatter(filteredList.length) : '';
    }

    const emptyEl = DOM.qs('#empty');
    if (emptyEl) {
      emptyEl.hidden = filteredList.length > 0;
    }

    if (filteredList.length === 0) {
      container.innerHTML = '';
      return;
    }

    const grouped = {};
    filteredList.forEach((item) => {
      if (!grouped[item.t]) grouped[item.t] = [];
      grouped[item.t].push(item);
    });

    const order = Settings.TOPIC_DISPLAY_ORDER;
    const sortedTopicKeys = Object.keys(grouped).sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    container.innerHTML = sortedTopicKeys
      .map((topicKey) => {
        const topicTitle = topics[topicKey]?.[lang] || topicKey;
        const items = grouped[topicKey];
        const cardsHtml = items.map((item) => CardComponent.renderCard(item, counts)).join('');

        return `
          <div class="topic-group">
            <h3 class="topic-title">
              <span>${escapeHtml(topicTitle)}</span>
              <span class="topic-count-badge">${items.length}</span>
            </h3>
            <div class="grid ${filters.viewMode === 'list' ? 'grid-list-mode' : ''}">${cardsHtml}</div>
          </div>
        `;
      })
      .join('');

    Effects?.observeRevealElements();
  }

  function setTopicFilter(topicKey) {
    Store.setState((s) => {
      s.filters.topic = topicKey || 'all';
    });
    renderFilters();
    renderGrid();
  }

  function setLevelFilter(levelVal) {
    Store.setState((s) => {
      s.filters.level = levelVal || 'all';
    });
    renderGrid();
  }

  function setStatusFilter(statusKey) {
    Store.setState((s) => {
      s.filters.status = statusKey || 'all';
    });
    renderFilters();
    renderGrid();
  }

  function setSortBy(sortVal) {
    Store.setState((s) => {
      s.filters.sortBy = sortVal || 'default';
    });
    renderGrid();
  }

  function setViewMode(mode) {
    const valid = mode === 'list' ? 'list' : 'grid';
    Storage.setString(Settings.STORAGE_KEYS.VIEW_MODE, valid);
    Store.setState((s) => {
      s.filters.viewMode = valid;
    });
    renderFilters();
    renderGrid();
  }

  function setSearchQuery(query) {
    Store.setState((s) => {
      s.filters.query = query || '';
    });
    renderGrid();
  }

  function bindInputs() {
    const levelSelect = DOM.qs('#levelFilter');
    if (levelSelect && !levelSelect.dataset.bound) {
      levelSelect.dataset.bound = 'true';
      levelSelect.addEventListener('change', (e) => setLevelFilter(e.target.value));
    }

    const searchInput = DOM.qs('#searchInput');
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => setSearchQuery(e.target.value));
    }
  }

  function render() {
    bindInputs();
    renderFilters();
    renderGrid();
  }

  SPhOH.FilesPage = Object.freeze({
    render,
    renderFilters,
    renderGrid,
    setTopicFilter,
    setLevelFilter,
    setStatusFilter,
    setSortBy,
    setViewMode,
    setSearchQuery,
    pickRandomPracticeSet
  });
})(window);
