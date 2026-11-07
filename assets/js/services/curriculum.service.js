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

    // وصف المستخدم غير الفارغ يُحترم دائماً مهما كان طوله؛ التوليد الذكي للوصف الغائب فقط.
    copy.desc = {
      ar: currentAr || fallbackDesc.ar,
      en: currentEn || fallbackDesc.en
    };

    return copy;
  }

  function getDisplayDescription(resource, targetLang) {
    if (!resource) return '';
    const lang = targetLang || Store.getState().lang;
    const text = String(resource.desc?.[lang] || '').trim();
    if (text) return text;
    return generateSmartDescription(resource)[lang] || '';
  }

  /**
   * استخراج جذع الملف للغة محددة (يدعم `file: { ar, en }` ويمنع `[object Object]`)
   * @param {Object} resource
   * @param {'ar'|'en'} [targetLang]
   * @returns {string}
   */
  function getFileStemForLang(resource, targetLang) {
    if (!resource) return '';
    const lang = targetLang === 'ar' || targetLang === 'en' ? targetLang : Store.getState().lang;
    const raw = resource.file;
    if (raw && typeof raw === 'object') {
      const value = raw[lang] !== undefined ? raw[lang] : raw.en !== undefined ? raw.en : raw.ar;
      return value ? String(value) : '';
    }
    return raw ? String(raw) : '';
  }

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function validTitleValue(value) {
    return isNonEmptyString(value);
  }

  /**
   * التحقق الصارم من مخطط قائمة الموارد القادمة من JSON أو التخزين أو الاستيراد.
   * @param {*} payload
   * @returns {{ok: boolean, empty: boolean, resources: Array, errors: string[]}}
   */
  /**
   * مستويات المنهج المعتمدة مستخرجة من `Catalog.LEVELS` (مصدر واحد للحقيقة).
   * @returns {number[]}
   */
  function getLevelOrder() {
    return Object.keys(Catalog.LEVELS)
      .map(Number)
      .filter((level) => Number.isInteger(level))
      .sort((a, b) => a - b);
  }

  function validateResourcesPayload(payload) {
    const errors = [];
    const validLevels = getLevelOrder();

    if (!Array.isArray(payload)) {
      return { ok: false, empty: false, resources: [], errors: ['payload is not an array'] };
    }
    if (payload.length === 0) {
      return { ok: false, empty: true, resources: [], errors: ['payload is empty'] };
    }

    const seenIds = new Set();

    payload.forEach((item, index) => {
      const at = `entry #${index + 1}`;
      if (!isPlainObject(item)) {
        errors.push(`${at}: not an object`);
        return;
      }

      const id = Number(item.id);
      if (!Number.isInteger(id) || id <= 0) {
        errors.push(`${at}: invalid id`);
      } else if (seenIds.has(id)) {
        errors.push(`${at}: duplicate id ${id}`);
      } else {
        seenIds.add(id);
      }

      if (!isNonEmptyString(item.t) || !/^[a-z0-9_]+$/i.test(item.t.trim())) {
        errors.push(`${at}: invalid topic key`);
      }

      const level = Number(item.l);
      if (!validLevels.includes(level)) {
        errors.push(`${at}: invalid level`);
      }

      const fileOk =
        isNonEmptyString(item.file) ||
        (isPlainObject(item.file) &&
          (isNonEmptyString(item.file.ar) || isNonEmptyString(item.file.en)));
      if (!fileOk) {
        errors.push(`${at}: invalid file stem`);
      }

      if (!isPlainObject(item.title) || !validTitleValue(item.title.ar) || !validTitleValue(item.title.en)) {
        errors.push(`${at}: title must include ar and en strings`);
      }

      if (item.desc !== undefined) {
        if (
          !isPlainObject(item.desc) ||
          (item.desc.ar !== undefined && typeof item.desc.ar !== 'string') ||
          (item.desc.en !== undefined && typeof item.desc.en !== 'string')
        ) {
          errors.push(`${at}: invalid desc`);
        }
      }

      if (item.solution !== undefined && item.solution !== null && item.solution !== true) {
        if (typeof item.solution === 'string') {
          if (!isNonEmptyString(item.solution)) errors.push(`${at}: invalid solution stem`);
        } else if (isPlainObject(item.solution)) {
          ['ar', 'en'].forEach((langKey) => {
            const value = item.solution[langKey];
            if (value !== undefined && value !== null && value !== true && !isNonEmptyString(value)) {
              errors.push(`${at}: invalid solution.${langKey}`);
            }
          });
        } else {
          errors.push(`${at}: invalid solution`);
        }
      }

      if (item.langs !== undefined) {
        if (
          !Array.isArray(item.langs) ||
          item.langs.length === 0 ||
          item.langs.some((langKey) => langKey !== 'ar' && langKey !== 'en') ||
          new Set(item.langs).size !== item.langs.length
        ) {
          errors.push(`${at}: invalid langs`);
        }
      }
    });

    return {
      ok: errors.length === 0,
      empty: false,
      resources: errors.length === 0 ? payload : [],
      errors
    };
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

    const saved = saveTopics(topics);
    Store.notify();
    return saved ? cleanKey : null;
  }

  /**
   * حفظ تعريفات المواضيع (المخصصة) مع التحقق من نجاح التخزين.
   * @param {Object} topics
   * @returns {boolean}
   */
  function saveTopics(topics) {
    const copy = JSON.parse(JSON.stringify(topics || {}));
    const ok = Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_TOPICS, copy);
    if (ok) {
      Store.setState((s) => {
        s.topics = copy;
      });
    }
    return ok;
  }

  /**
   * الموارد المخصصة: `null` عند غياب المفتاح، و`[]` عند وجود قائمة فارغة صريحة.
   * @returns {Array|null}
   */
  function getCustomResources() {
    const saved = Storage.getJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, null);
    if (!Array.isArray(saved)) return null;
    if (saved.length === 0) return [];
    return saved.map(normalizeResource);
  }

  /**
   * حفظ قائمة الموارد، مع إرجاع نجاح التخزين والاحتفاظ بالبيانات في الذاكرة عند الفشل.
   * @param {Array} list
   * @returns {boolean} نجاح الكتابة إلى localStorage
   */
  function saveAll(list) {
    const normalized = (Array.isArray(list) ? list : []).map(normalizeResource);
    const ok = Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, normalized);
    Store.setState((s) => {
      s.resources = normalized;
      if (ok) s.dataSource = 'custom';
    });
    return ok;
  }

  async function fetchRepoResources() {
    const response = await fetch(Settings.LINKS.RESOURCES_JSON, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const validation = validateResourcesPayload(data);
    if (!validation.ok) {
      throw new Error(`invalid resources.json: ${validation.errors[0] || 'unknown error'}`);
    }
    return validation.resources.map(normalizeResource);
  }

  async function resetToDefaults() {
    Storage.remove(Settings.STORAGE_KEYS.CUSTOM_RESOURCES);
    Storage.remove(Settings.STORAGE_KEYS.CUSTOM_TOPICS);
    Storage.remove(Settings.STORAGE_KEYS.NEXT_ID);

    const defaultTopics = JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS));

    let resources = Catalog.FALLBACK_RESOURCES.map(normalizeResource);
    let dataSource = 'fallback';

    try {
      resources = await fetchRepoResources();
      dataSource = 'json';
    } catch (err) {
      console.warn('[SPhOH] resetToDefaults(): could not re-fetch data/resources.json, keeping FALLBACK_RESOURCES.', err);
      resources = Catalog.FALLBACK_RESOURCES.map(normalizeResource);
      dataSource = 'fallback';
    }

    Store.setState((s) => {
      s.topics = defaultTopics;
      s.resources = resources;
      s.dataSource = dataSource;
    });
    return resources;
  }

  async function initResources() {
    loadTopics();

    const custom = getCustomResources();
    if (custom !== null) {
      Storage.setJSON(Settings.STORAGE_KEYS.CUSTOM_RESOURCES, custom);
      Store.setState((s) => {
        s.resources = custom;
        s.dataSource = 'custom';
      });
      return custom;
    }

    try {
      const data = await fetchRepoResources();

      const savedAfterFetch = getCustomResources();
      if (savedAfterFetch !== null) {
        Store.setState((s) => {
          s.resources = savedAfterFetch;
          s.dataSource = 'custom';
        });
        return savedAfterFetch;
      }

      Store.setState((s) => {
        s.resources = data;
        s.dataSource = 'json';
      });
      return data;
    } catch (err) {
      console.warn(
        '[SPhOH] initResources(): fetch of data/resources.json failed, falling back to the embedded catalog.',
        err
      );
      const savedFallback = getCustomResources();
      const fallback =
        savedFallback !== null ? savedFallback : Catalog.FALLBACK_RESOURCES.map(normalizeResource);
      Store.setState((s) => {
        s.resources = fallback;
        s.dataSource = savedFallback !== null ? 'custom' : 'fallback';
      });
      return fallback;
    }
  }

  const BLOCKED_SCHEME_RE = /^(?:javascript|data|vbscript|file|blob):/i;
  const SAFE_PDF_RELATIVE_RE = /^PDFs\/(?:ar|en)\/[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/;
  const SAFE_PDF_ROOT_RE = /^\/PDFs\/(?:ar|en)\/[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/;
  const SAFE_STEM_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

  /**
   * يُعيد `true` فقط للمسارات النسبية المسموحة داخل PDFs/ar أو PDFs/en.
   * @param {string} raw
   * @returns {boolean}
   */
  function isSafePdfPath(raw) {
    if (!raw || raw.includes('\\') || raw.startsWith('//') || /\.\./.test(raw)) return false;
    if (BLOCKED_SCHEME_RE.test(raw) || /[?#]/.test(raw)) return false;
    return SAFE_PDF_RELATIVE_RE.test(raw) || SAFE_PDF_ROOT_RE.test(raw);
  }

  /**
   * تطبيع جذع ملف PDF: قصّ الفراغات، حذف `.pdf` ولاحقة اللغة، وتحويل
   * الفراغات إلى شرطات سفلية. المصدر الوحيد للقاعدة المستخدمة في الحفظ والمعاينة.
   * @param {unknown} raw
   * @returns {string}
   */
  function normalizeStem(raw) {
    return String(raw === null || raw === undefined ? '' : raw)
      .trim()
      .replace(/\.pdf$/i, '')
      .replace(/_(AR|ENG)$/i, '')
      .replace(/\s+/g, '_');
  }

  function buildResourcePath(fileStem, targetLang) {
    if (fileStem === null || fileStem === undefined) return null;
    const raw = String(fileStem).trim();
    if (!raw) return null;

    // رفض البروتوكولات الخطرة والمسارات الملتوية قبل أي معالجة
    if (BLOCKED_SCHEME_RE.test(raw)) return null;
    if (raw.startsWith('//') || raw.includes('\\')) return null;
    if (/(^|\/)\.\.(\/|$)/.test(raw)) return null;

    const lang = targetLang === 'ar' || targetLang === 'en' ? targetLang : Store.getState().lang;

    // رابط خارجي مطلق (https/http) يبقى مسموحاً كما كان
    if (/^https?:\/\//i.test(raw)) return raw;

    // قائمة بيضاء صارمة لأي مسار يشير إلى PDFs/
    if (/^\/?PDFs\//i.test(raw)) return isSafePdfPath(raw) ? raw : null;

    // أي مسار آخر يحتوي على شرطة مائلة أو يبدأ بنقطة مرفوض
    if (/\//.test(raw) || raw.startsWith('.')) return null;

    const canonicalStem = Catalog.LEGACY_FILE_ALIASES[raw] || raw.replace(/\.pdf$/i, '');
    if (!SAFE_STEM_RE.test(canonicalStem) || canonicalStem.includes('..')) return null;

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

    return buildResourcePath(getFileStemForLang(resource, lang), lang);
  }

  function getSolutionStemForLang(resource, targetLang) {
    if (!resource) return '';
    const lang = targetLang === 'ar' || targetLang === 'en' ? targetLang : Store.getState().lang;
    const raw =
      resource.solution !== undefined
        ? resource.solution
        : resource.solutions || resource.solutionFile || resource.solution_file || resource.answer || '';

    const fallbackStem = getFileStemForLang(resource, lang);
    if (raw === true) {
      return fallbackStem ? `${fallbackStem}_Solutions` : '';
    }
    if (raw && typeof raw === 'object') {
      const val = raw[lang];
      if (val === true) return fallbackStem ? `${fallbackStem}_Solutions` : '';
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
    return resources.find((item) => Number(item.id) === numericId) || null;
  }

  /**
   * النص القابل للبحث لمورد واحد (العنوانان + الوصفان + جذع الملف باللغتين).
   * جذع الملف قد يكون كائناً `{ ar, en }`، لذا يُسطَّح دائماً إلى نص.
   * @param {Object} item
   * @returns {string}
   */
  function getSearchableText(item) {
    const stems = [];
    if (typeof item?.file === 'string') {
      stems.push(item.file);
    } else if (item?.file && typeof item.file === 'object') {
      stems.push(item.file.ar, item.file.en);
    }
    return [
      item?.title?.en,
      item?.title?.ar,
      item?.desc?.en,
      item?.desc?.ar,
      ...stems
    ]
      .map((value) => String(value || ''))
      .join(' ')
      .toLowerCase();
  }

  /**
   * البحث الموحّد عن الموارد (المكتبة + لوحة الأوامر + استوديو الإدارة).
   * @param {string} query نص البحث الحر
   * @param {Object} [filters] { topic, level, status, requireNoSolution }
   * @returns {Array} الموارد المطابقة بترتيب المصدر
   */
  function searchResources(query, filters = {}) {
    const { resources, bookmarks, completed } = Store.getState();
    const list = Array.isArray(resources) ? resources : [];
    const q = String(query || '').trim().toLowerCase();
    const topic = filters.topic || 'all';
    const level = filters.level || 'all';
    const status = filters.status || 'all';

    return list.filter((item) => {
      if (topic !== 'all' && item.t !== topic) return false;
      if (level !== 'all' && String(item.l) !== String(level)) return false;

      const idNum = Number(item.id);
      if (status === 'bookmarked' && !bookmarks.includes(idNum)) return false;
      if (status === 'completed' && !completed.includes(idNum)) return false;
      if (status === 'pending' && completed.includes(idNum)) return false;

      if (filters.requireNoSolution) {
        const hasAnySolution =
          Boolean(getSolutionStemForLang(item, 'ar')) || Boolean(getSolutionStemForLang(item, 'en'));
        if (hasAnySolution) return false;
      }

      return !q || getSearchableText(item).includes(q);
    });
  }

  function getFilteredResources() {
    const { filters, lang } = Store.getState();
    const counts = Downloads ? Downloads.getAllCounts() : {};
    const filtered = searchResources(filters.query, filters);

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
    if (!item) return false;

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

    return saveAll(resources);
  }

  function toggleSolutionForLang(id, targetLang) {
    const { resources } = Store.getState();
    const item = findById(id);
    if (!item) return false;

    let hasAr = Boolean(getSolutionStemForLang(item, 'ar'));
    let hasEn = Boolean(getSolutionStemForLang(item, 'en'));

    if (targetLang === 'ar') hasAr = !hasAr;
    if (targetLang === 'en') hasEn = !hasEn;

    const stemAr = getFileStemForLang(item, 'ar');
    const stemEn = getFileStemForLang(item, 'en');
    const solAr = hasAr && stemAr ? `${stemAr}_Solutions` : null;
    const solEn = hasEn && stemEn ? `${stemEn}_Solutions` : null;

    if (solAr && solEn && solAr === solEn) {
      item.solution = solAr;
    } else if (!solAr && !solEn) {
      item.solution = null;
    } else {
      item.solution = { ar: solAr, en: solEn };
    }

    return saveAll(resources);
  }

  function moveResource(id, direction) {
    const { resources } = Store.getState();
    const list = resources.slice();
    const idx = list.findIndex((r) => Number(r.id) === Number(id));
    if (idx === -1) return false;

    const targetIdx = idx + Number(direction);
    if (targetIdx < 0 || targetIdx >= list.length) return false;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    return saveAll(list);
  }

  /**
   * عدّاد تصاعدي لا يعيد استخدام معرف محذوف (يُحفظ في localStorage).
   * @returns {number}
   */
  function getNextId() {
    const stored = Number(Storage.getString(Settings.STORAGE_KEYS.NEXT_ID, '0'));
    const { resources } = Store.getState();
    const existingMax = resources.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0);
    const catalogMax = Catalog.FALLBACK_RESOURCES.reduce(
      (max, item) => Math.max(max, Number(item.id || 0)),
      0
    );
    const base = Math.max(Number.isFinite(stored) ? stored : 0, existingMax, catalogMax);
    const next = base + 1;
    Storage.setString(Settings.STORAGE_KEYS.NEXT_ID, String(next));
    return next;
  }

  function upsertResource(payload, editingId = null) {
    const { resources } = Store.getState();
    const list = resources.slice();
    const original = editingId !== null
      ? list.find((item) => Number(item.id) === Number(editingId))
      : null;

    const cleanStem = normalizeStem(payload.fileStem);
    if (!cleanStem || !SAFE_STEM_RE.test(cleanStem) || cleanStem.includes('..')) return false;

    // يحافظ تعديل مورد ثنائي الجذع على الشكل `{ ar, en }` ويحدّث لغة الواجهة فقط.
    const originalFile = original && original.file;
    const keepPerLangStem =
      originalFile && typeof originalFile === 'object' && !Array.isArray(originalFile);

    const solStem = `${cleanStem}_Solutions`;
    let solutionField = null;
    if (payload.solutionMode === 'both') solutionField = solStem;
    else if (payload.solutionMode === 'ar') solutionField = { en: null, ar: solStem };
    else if (payload.solutionMode === 'en') solutionField = { en: solStem, ar: null };

    const draft = {
      t: payload.topic,
      l: Number(payload.level || 1),
      file: keepPerLangStem
        ? { ...originalFile, [Store.getState().lang]: cleanStem }
        : cleanStem,
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
      list.push({ id: getNextId(), ...draft });
    }

    return saveAll(list);
  }

  function deleteResource(id) {
    const { resources } = Store.getState();
    const filtered = resources.filter((item) => Number(item.id) !== Number(id));
    return saveAll(filtered);
  }

  SPhOH.CurriculumService = Object.freeze({
    generateSmartDescription,
    getDisplayDescription,
    getFileStemForLang,
    validateResourcesPayload,
    loadTopics,
    addTopic,
    saveTopics,
    getCustomResources,
    saveAll,
    resetToDefaults,
    initResources,
    normalizeStem,
    buildResourcePath,
    isSafePdfPath,
    getNextId,
    hasProblemForLang,
    getProblemPdfPath,
    getSolutionStemForLang,
    getSolutionPdfPath,
    findById,
    getLevelOrder,
    getSearchableText,
    searchResources,
    getFilteredResources,
    toggleProblemForLang,
    toggleSolutionForLang,
    moveResource,
    upsertResource,
    deleteResource
  });
})(window);
