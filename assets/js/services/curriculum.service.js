/**
 * @file assets/js/services/curriculum.service.js
 * @description طبقة إدارة بيانات المناهج والأقسام وحل مسارات ملفات PDF والحلول النموذجية،
 * مع توليد تلقائي ذكي للأوصاف لأي منهج بدون وصف.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Catalog, Storage, Store, Downloads } = SPhOH;

  /**
   * توليد وصف أكاديمي احترافي باللغتين العربية والإنجليزية لأي منهج لا يحتوي على وصف
   * @param {Object} item
   * @returns {{ar: string, en: string}}
   */
  function generateSmartDescription(item) {
    const topicKey = item?.t || 'kin';
    const levelNum = Number(item?.l || 1);
    const topicObj = Catalog.DEFAULT_TOPICS[topicKey] || {
      en: String(topicKey),
      ar: String(topicKey)
    };
    const levelObj = Catalog.LEVELS[levelNum] || Catalog.LEVELS[1];

    const titleAr = item?.title?.ar || item?.file || topicObj.ar;
    const titleEn = item?.title?.en || (item?.file ? String(item.file).replace(/_/g, ' ') : topicObj.en);

    // إذا كان المنهج موجوداً في الكتالوج الرسمي، نستخدم الوصف المرجعي المفصل
    const catalogMatch = Catalog.FALLBACK_RESOURCES.find(
      (r) => Number(r.id) === Number(item?.id) || r.file === item?.file
    );
    if (catalogMatch && catalogMatch.desc?.ar && catalogMatch.desc?.en) {
      return {
        ar: catalogMatch.desc.ar,
        en: catalogMatch.desc.en
      };
    }

    const baseDescAr =
      topicObj.defaultDesc?.ar ||
      `مجموعة مسائل تدريبية متخصصة في ${topicObj.ar} لتطوير مهارات التفكير التحليلي وحل المسائل الأولمبية.`;
    const baseDescEn =
      topicObj.defaultDesc?.en ||
      `Structured Olympiad problem set in ${topicObj.en} designed to develop analytical reasoning and problem-solving fluency.`;

    return {
      ar: `${titleAr} (${levelObj.ar}): ${baseDescAr}`,
      en: `${titleEn} (${levelObj.en}): ${baseDescEn}`
    };
  }

  /**
   * تطبيع بيانات المنهج وضمان وجود وصف غني باللغتين دائماً
   */
  function normalizeResource(item) {
    if (!item || typeof item !== 'object') return item;
    const copy = { ...item };

    if (typeof copy.file === 'string' && Catalog.LEGACY_FILE_ALIASES[copy.file]) {
      copy.file = Catalog.LEGACY_FILE_ALIASES[copy.file];
    }

    const fallbackDesc = generateSmartDescription(copy);
    const currentAr = String(copy.desc?.ar || '').trim();
    const currentEn = String(copy.desc?.en || '').trim();

    // ترقية الأوصاف الفارغة أو القصيرة جداً إلى الوصف الأكاديمي الكامل
    const catalogMatch = Catalog.FALLBACK_RESOURCES.find(
      (r) => Number(r.id) === Number(copy.id) || r.file === copy.file
    );

    copy.desc = {
      ar: currentAr && (!catalogMatch || currentAr.length >= 75) ? currentAr : fallbackDesc.ar,
      en: currentEn && (!catalogMatch || currentEn.length >= 75) ? currentEn : fallbackDesc.en
    };

    return copy;
  }

  function getDisplayDescription(resource, targetLang) {
    if (!resource) return '';
    const lang = targetLang || Store.getState().lang;
    const text = String(resource.desc?.[lang] || resource.desc?.ar || resource.desc?.en || '').trim();
    if (text) return text;
    return generateSmartDescription(resource)[lang];
  }

  function loadTopics() {
    const merged = JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS));
    const saved = Storage.getJSON(Settings.STORAGE_KEYS.CUSTOM_TOPICS, null);
    if (saved && typeof saved === 'object') {
      Object.keys(saved).forEach((key) => {
        merged[key] = { ...(merged[key] || {}), ...saved[key] };
      });
    }
    Store.setState((s) => {
      s.topics = merged;
    });
    return merged;
  }

  function addTopic(rawKey, arName, enName) {
    let cleanKey = String(rawKey || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    if (!cleanKey) {
      cleanKey = `topic_${Date.now().toString(36)}`;
    }

    const { topics } = Store.getState();
    topics[cleanKey] = {
      en: String(enName || arName || cleanKey).trim(),
      ar: String(arName || enName || cleanKey).trim()
    };

    Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_TOPICS, topics);
    Store.notify();
    return cleanKey;
  }

  function getCustomResources() {
    const saved = Storage.getJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, null);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map(normalizeResource);
    }
    return null;
  }

  function saveAll(list) {
    const normalized = list.map(normalizeResource);
    Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, normalized);
    Store.setState((s) => {
      s.resources = normalized;
    });
    return Promise.resolve(normalized);
  }

  function resetToDefaults() {
    Storage.remove(Settings.STORAGE_KEYS.CUSTOM_RESOURCES);
    Storage.remove(Settings.STORAGE_KEYS.CUSTOM_TOPICS);
    const defaultTopics = JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS));
    const defaultResources = Catalog.FALLBACK_RESOURCES.map(normalizeResource);

    Store.setState((s) => {
      s.topics = defaultTopics;
      s.resources = defaultResources;
    });
    return Promise.resolve(defaultResources);
  }

  async function initResources() {
    loadTopics();

    const custom = getCustomResources();
    if (custom) {
      Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, custom);
      Store.setState((s) => {
        s.resources = custom;
      });
      return custom;
    }

    if (global.__SPHOH_CANVAS_MODE__) {
      const fallback = Catalog.FALLBACK_RESOURCES.map(normalizeResource);
      Store.setState((s) => {
        s.resources = fallback;
      });
      return fallback;
    }

    try {
      const response = await fetch(Settings.LINKS.RESOURCES_JSON);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const savedAfterFetch = getCustomResources();
      if (savedAfterFetch) {
        Store.setState((s) => {
          s.resources = savedAfterFetch;
        });
        return savedAfterFetch;
      }

      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeResource);
        Store.setState((s) => {
          s.resources = normalized;
        });
        return normalized;
      }
    } catch (_) {
      const fallback = getCustomResources() || Catalog.FALLBACK_RESOURCES.map(normalizeResource);
      Store.setState((s) => {
        s.resources = fallback;
      });
      return fallback;
    }

    return Store.getState().resources;
  }

  function buildResourcePath(fileStem, targetLang) {
    if (!fileStem) return null;
    const raw = String(fileStem).trim();
    if (!raw) return null;

    const lang = targetLang || Store.getState().lang;

    if (
      /^(https?:)?\/\//i.test(raw) ||
      raw.startsWith('/') ||
      raw.startsWith('PDFs/') ||
      (/\//.test(raw) && /\.pdf$/i.test(raw))
    ) {
      return raw;
    }

    const canonicalStem = Catalog.LEGACY_FILE_ALIASES[raw] || raw.replace(/\.pdf$/i, '');
    const suffix = Settings.FILE_SUFFIX[lang] || 'ENG';
    return `PDFs/${lang}/${encodeURIComponent(`${canonicalStem}_${suffix}.pdf`)}`;
  }

  function hasProblemForLang(resource, targetLang) {
    if (!resource) return false;
    const lang = targetLang || Store.getState().lang;
    if (Array.isArray(resource.langs)) {
      return resource.langs.includes(lang);
    }
    return true;
  }

  function getProblemPdfPath(resource, targetLang) {
    if (!resource) return null;
    const lang = targetLang || Store.getState().lang;

    if (!hasProblemForLang(resource, lang)) {
      return null;
    }

    let fileStem = resource.file;
    if (fileStem && typeof fileStem === 'object') {
      fileStem = fileStem[lang];
    }

    return buildResourcePath(fileStem, lang);
  }

  function getSolutionStemForLang(resource, targetLang) {
    if (!resource) return '';
    const lang = targetLang || Store.getState().lang;
    const raw =
      resource.solution !== undefined
        ? resource.solution
        : resource.solutions || resource.solutionFile || resource.solution_file || resource.answer || '';

    if (raw === true) {
      return `${resource.file}_Solutions`;
    }
    if (raw && typeof raw === 'object') {
      const val = raw[lang];
      if (val === true) return `${resource.file}_Solutions`;
      return val || '';
    }
    return raw || '';
  }

  function getSolutionPdfPath(resource, targetLang) {
    const lang = targetLang || Store.getState().lang;
    const solStem = getSolutionStemForLang(resource, lang);
    return buildResourcePath(solStem, lang);
  }

  function findById(id) {
    const { resources } = Store.getState();
    const numericId = Number(id);
    return resources.find((item) => Number(item.id) === numericId) || resources[0] || null;
  }

  function getFilteredResources() {
    const { resources, filters, bookmarks, completed, lang } = Store.getState();
    const query = (filters.query || '').trim().toLowerCase();
    const counts = Downloads ? Downloads.getAllCounts() : {};

    const filtered = resources.filter((item) => {
      if (filters.topic !== 'all' && item.t !== filters.topic) return false;
      if (filters.level !== 'all' && String(item.l) !== String(filters.level)) return false;

      const idNum = Number(item.id);
      if (filters.status === 'bookmarked' && !bookmarks.includes(idNum)) return false;
      if (filters.status === 'completed' && !completed.includes(idNum)) return false;
      if (filters.status === 'pending' && completed.includes(idNum)) return false;

      if (query) {
        const searchableText = [
          item.title?.en || '',
          item.title?.ar || '',
          item.desc?.en || '',
          item.desc?.ar || '',
          item.file || ''
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(query)) return false;
      }

      return true;
    });

    const sortBy = filters.sortBy || 'default';
    if (sortBy === 'lvl_asc') {
      filtered.sort((a, b) => Number(a.l || 1) - Number(b.l || 1));
    } else if (sortBy === 'lvl_desc') {
      filtered.sort((a, b) => Number(b.l || 1) - Number(a.l || 1));
    } else if (sortBy === 'downloads') {
      filtered.sort((a, b) => {
        const pathA = getProblemPdfPath(a, lang);
        const pathB = getProblemPdfPath(b, lang);
        return Number(counts[pathB] || 0) - Number(counts[pathA] || 0);
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => {
        const titleA = a.title?.[lang] || a.file || '';
        const titleB = b.title?.[lang] || b.file || '';
        return titleA.localeCompare(titleB, lang);
      });
    }

    return filtered;
  }

  function toggleProblemForLang(id, targetLang) {
    const { resources } = Store.getState();
    const item = findById(id);
    if (!item) return;

    let hasAr = hasProblemForLang(item, 'ar');
    let hasEn = hasProblemForLang(item, 'en');

    if (targetLang === 'ar') hasAr = !hasAr;
    if (targetLang === 'en') hasEn = !hasEn;

    if (!hasAr && !hasEn) {
      if (targetLang === 'ar') hasEn = true;
      else hasAr = true;
    }

    if (hasAr && hasEn) {
      delete item.langs;
    } else if (hasAr) {
      item.langs = ['ar'];
    } else {
      item.langs = ['en'];
    }

    saveAll(resources);
  }

  function toggleSolutionForLang(id, targetLang) {
    const { resources } = Store.getState();
    const item = findById(id);
    if (!item) return;

    const solStem = `${item.file}_Solutions`;
    let hasAr = Boolean(getSolutionStemForLang(item, 'ar'));
    let hasEn = Boolean(getSolutionStemForLang(item, 'en'));

    if (targetLang === 'ar') hasAr = !hasAr;
    if (targetLang === 'en') hasEn = !hasEn;

    if (hasAr && hasEn) {
      item.solution = solStem;
    } else if (!hasAr && !hasEn) {
      item.solution = null;
    } else {
      item.solution = {
        en: hasEn ? solStem : null,
        ar: hasAr ? solStem : null
      };
    }

    saveAll(resources);
  }

  function moveResource(id, direction) {
    const { resources } = Store.getState();
    const list = resources.slice();
    const idx = list.findIndex((r) => Number(r.id) === Number(id));
    if (idx === -1) return;

    const targetIdx = idx + Number(direction);
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    saveAll(list);
  }

  function upsertResource(payload, editingId = null) {
    const { resources } = Store.getState();
    const list = resources.slice();

    const cleanStem = String(payload.fileStem || '')
      .trim()
      .replace(/\.pdf$/i, '')
      .replace(/_(AR|ENG)$/i, '')
      .replace(/\s+/g, '_');

    if (!cleanStem) return false;

    const solStem = `${cleanStem}_Solutions`;
    let solutionField = null;
    if (payload.solutionMode === 'both') solutionField = solStem;
    else if (payload.solutionMode === 'ar') solutionField = { en: null, ar: solStem };
    else if (payload.solutionMode === 'en') solutionField = { en: solStem, ar: null };

    const draft = {
      t: payload.topic,
      l: Number(payload.level || 1),
      file: cleanStem,
      solution: solutionField,
      title: {
        en: String(payload.titleEn || cleanStem.replace(/_/g, ' ')).trim(),
        ar: String(payload.titleAr || cleanStem).trim()
      },
      desc: {
        en: String(payload.descEn || '').trim(),
        ar: String(payload.descAr || '').trim()
      }
    };

    const autoDesc = generateSmartDescription(draft);
    if (!draft.desc.ar) draft.desc.ar = autoDesc.ar;
    if (!draft.desc.en) draft.desc.en = autoDesc.en;

    if (payload.problemLangs === 'ar') {
      draft.langs = ['ar'];
    } else if (payload.problemLangs === 'en') {
      draft.langs = ['en'];
    }

    if (editingId !== null) {
      const idx = list.findIndex((r) => Number(r.id) === Number(editingId));
      if (idx !== -1) {
        list[idx] = { id: list[idx].id, ...draft };
      }
    } else {
      const maxId = list.reduce((max, r) => Math.max(max, Number(r.id || 0)), 0);
      list.push({ id: maxId + 1, ...draft });
    }

    saveAll(list);
    return true;
  }

  function deleteResource(id) {
    const { resources } = Store.getState();
    const filtered = resources.filter((item) => Number(item.id) !== Number(id));
    saveAll(filtered);
  }

  SPhOH.CurriculumService = Object.freeze({
    generateSmartDescription,
    getDisplayDescription,
    loadTopics,
    addTopic,
    getCustomResources,
    saveAll,
    resetToDefaults,
    initResources,
    buildResourcePath,
    hasProblemForLang,
    getProblemPdfPath,
    getSolutionStemForLang,
    getSolutionPdfPath,
    findById,
    getFilteredResources,
    toggleProblemForLang,
    toggleSolutionForLang,
    moveResource,
    upsertResource,
    deleteResource
  });
})(window);
