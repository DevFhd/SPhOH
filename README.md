# SPhOH — Saudi Physics Olympiad Hub

**منصة تدريبية ثنائية اللغة (AR/EN) لطلاب أولمبياد الفيزياء في المملكة العربية السعودية وحول العالم.**  
**A bilingual training hub for physics Olympiad students in Saudi Arabia and beyond.**

الموقع ثابت بالكامل: HTML + CSS + Vanilla JavaScript، بلا framework وبلا bundler وبلا `package.json`، ويعمل مباشرة على GitHub Pages. الوحدات تُسجَّل على `window.SPhOH` بصيغة `IIFE` ومُجمَّدة بـ`Object.freeze`.

---

## التشغيل المحلي

```bash
python -m http.server 8000
# افتح http://localhost:8000
```

يجب تقديم الموقع عبر HTTP؛ لأن `fetch('data/resources.json')` يفشل على `file://` فيسقط التطبيق بصمت إلى `Catalog.FALLBACK_RESOURCES`، ولن تظهر تعديلات `resources.json`.

- رابط القارئ المباشر: `preview.html?id=<resourceId>&type=problem|solution`
- الإدارة: `Admin.html` (المسار النظيف `/Admin` يوجّه إليها عبر `Admin/index.html`).
- كلمة المرور الافتراضية: `00000000` في `Settings.ADMIN_PASSWORD` داخل `assets/js/config/settings.js`.

لا يوجد أمر build أو test أو lint. التحقق يدوي عبر تشغيل الخادم وتجربة الصفحات في **اللغتين والثيمين**، مع `node tools/check-parity.mjs` للفحص الآلي.

---

## المعمارية

### ترتيب تحميل السكربتات

- الصفحات العامة الخمس (`index.html`, `files.html`, `preview.html`, `about.html`, `contact.html`): **21 سكربتاً** بنفس الترتيب مع `defer`.
- `Admin.html`: **22 سكربتاً** = نفس القائمة + `pages/admin.page.js` قبل `app.js`.
- `Admin/index.html`: صفحة توجيه بلا سكربتات.

```
config/settings → config/catalog → i18n/locales → core/dom → core/storage
→ services/state → services/i18n → services/theme → services/download
→ services/curriculum → components/toast → services/progress → services/effects
→ components/layout → components/card
→ pages/home → pages/files → pages/preview → pages/about → pages/contact
→ [admin: pages/admin.page.js]
→ app.js
```

أي ملف JS جديد يُضاف إلى الصفحات العامة الخمس وإلى `Admin.html` في الموضع نفسه، مع إبقاء `Admin/index.html` صفحة توجيه. الوحدة لا تستخدم إلا وحدات `SPhOH.*` المحمّلة قبلها.

### دورة الإقلاع

`app.js` هو المنسّق الوحيد، ويعمل تلقائياً عند `DOMContentLoaded`:

`Layout.mount()` → `PreviewPage.parseUrlParams()` → `bindGlobalEvents()` → `bindStorageSync()` → `Effects.init()` → `refreshAllViews()` → `await CurriculumService.initResources()` → `refreshAllViews()` مرة ثانية فقط إن اختلفت الموارد عن بيانات `FALLBACK_RESOURCES`.

كل وحدات الصفحات تُحمَّل في كل صفحة عامة، لذا يجب أن يتوقف `render()` عند غياب الماركب. `admin.page.js` يُحمَّل في `Admin.html` فقط، و`app.js` يستدعيه بـ`AdminPage?.render()`.

### تفويض الأحداث

كل التفاعل (`click`, `input`, `change`, `submit`, `keydown`) مُفوَّض من `app.js`. لا تُربط مستمعات داخل وحدات الصفحات. لإضافة سلوك: أضف `data-*` في الماركب ثم فرعاً في `bindGlobalEvents()`، أو استخدم `registerAction` لحقول ثابتة المعرّف مثل `#searchInput` و`#previewResourceSelect`.

لتحديث الواجهات من وحدة خارج `app.js`، أطلق `document.dispatchEvent(new Event('sphoh:refresh'))` بدل استدعاء `SPhOH.App` صعوداً؛ `app.js` يسمع الحدث ويستدعي `refreshAllViews()`.

### اللغة والثيم

- كل نص مرئي موجود في `Locales.en` و`Locales.ar` معاً (246 مفتاحاً لكل لغة، والمجموعتان متطابقتان).
- `I18n.applyDocumentLang()` يطبّق `data-i18n` على `textContent`، وكذلك `data-i18n-placeholder` → `placeholder`، و`data-i18n-aria-label` → `aria-label`، و`data-i18n-title` → `title`، و`data-i18n-alt` → `alt`.
- **`data-i18n*` يعمل فقط على الماركب الموجود قبل `applyDocumentLang()`** (HTML الثابت، والهيدر/الفوتر الذي يحقنه `Layout.mount()`). أي ماركب يُولَّد داخل `render()` يجب أن يستدعي `I18n.t('key')` مباشرةً، ويجب تحديث نص `<option>` في كل render حتى لا يتجمّد على لغة الإنشاء.
- كل صفحة تحمّل في `<head>` الملف الخارجي `assets/js/early-init.js` (سكربت حاجب قبل الـCSS) يضبط `lang` و`dir` و`data-theme` من `localStorage` قبل أول رسم، بما يطابق `I18n.applyDocumentLang()` و`Theme.applyTheme()`. ولا يوجد أي `<script>` مضمّن لأن سياسة CSP تمنعه.
- الصفحات العامة الخمس تحمّل `assets/js/analytics.js` (حاجب) قبل محمّل `gtag.js` غير المتزامن؛ `Admin.html` لا يحمّل أي سكربت تحليلات.

---

## هيكل المشروع

```text
SPhOH/
├── index.html / files.html / preview.html / about.html / contact.html
├── Admin.html                  # لوحة الإدارة (22 سكربتاً)
├── Admin/index.html            # توجيه نظيف إلى ../Admin.html
├── data/resources.json         # مصدر بيانات الموارد
├── tools/check-parity.mjs      # فحص تطابق اختياري (Node 18+)
├── assets/
│   ├── css/
│   │   ├── style.css           # نقطة الدخول (@import)
│   │   ├── base/               # variables, reset, typography
│   │   ├── layout/             # grid, navbar, footer
│   │   ├── components/         # buttons, badges, cards, forms, toast, animations
│   │   └── pages/              # home, files, preview, about, contact, admin
│   └── js/
│       ├── config/             # settings.js, catalog.js
│       ├── i18n/               # locales.js
│       ├── core/               # dom.js, storage.js
│       ├── services/           # state, i18n, theme, download, curriculum, progress, effects
│       ├── components/         # toast, layout, card
│       ├── pages/              # home, files, preview, about, contact, admin
│       └── app.js              # المنسّق الرئيسي
└── PDFs/ar/, PDFs/en/          # ملفات PDF — ممنوع حذفها أو إعادة تسميتها
```

`assets/css/pages/admin.css` لا يُستورد في `style.css`؛ `Admin.html` وحده يربطه عبر `<link>`. وبالمثل `assets/js/pages/admin.page.js` لا يُحمَّل خارج `Admin.html`.

---

## نموذج بيانات الموارد

`data/resources.json` هو المصدر، و`Catalog.FALLBACK_RESOURCES` نسخة احتياطية مطابقة يجب إبقاؤها متزامنة.

| الحقل | المعنى |
| --- | --- |
| `id` | رقم فريد، يُستخدم في روابط القارئ والمفضلة |
| `t` | مفتاح الموضوع ضمن `Catalog.DEFAULT_TOPICS` (`kin`, `mech`, `math`, `coll`, `elec`, `therm`, `opt`) |
| `l` | المستوى `1`–`3` |
| `file` | جذر اسم ملف PDF بلا لاحقة لغة وبلا `.pdf` (قد يكون `{ ar, en }`) |
| `solution` | `null` أو جذر نصي أو `true` (= `<file>_Solutions`) أو `{ ar, en }` |
| `title` | `{ ar, en }` |
| `desc` | `{ ar, en }`؛ أي قيمة غير فارغة يحفظها `normalizeResource()` كما هي حرفياً؛ الوصف المولّد من الكتالوج لا يُستخدم إلا حين يكون الوصف فارغاً |
| `langs` | اختياري؛ غيابه = اللغتان، أو `["ar"]`/`["en"]` لتقييد ملف المسائل |

**مسارات PDF تُشتق ولا تُخزَّن:** `PDFs/<lang>/<stem>_<AR|ENG>.pdf`.

```text
PDFs/ar/<stem>_AR.pdf            PDFs/en/<stem>_ENG.pdf
PDFs/ar/<stem>_Solutions_AR.pdf  PDFs/en/<stem>_Solutions_ENG.pdf
```

`Catalog.LEGACY_FILE_ALIASES` يحوّل `NSMO_II` إلى `NSMO_Collection_II` عند التطبيع.

سياسة المسارات (أمنية): يُرفض `javascript:` و`data:` و`vbscript:` و`file:` و`blob:` وأي `\` أو `//` بادئ أو مقطع `..`؛ وقيمة `PDFs/…` تُقبل فقط إن طابقت `^/?PDFs/(ar|en)/[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$`؛ وروابط `http(s)://` تمر كما هي.

`validateResourcesPayload()` يتحقق من المخطط في `fetch('data/resources.json')` وفي الاستيراد الإداري معاً، والمصفوفة الفارغة لا تكتب فوق البيانات الحالية أبداً.

---

## استوديو الإدارة

الاستوديو يكتب إلى `localStorage` فقط، وليس إلى `data/resources.json`:

- `sphoh-custom-resources-v1` — قائمة الموارد بعد أي إضافة/تعديل/حذف/إعادة ترتيب.
- `sphoh-custom-topics-v1` — تعريفات المواضيع المخصصة.
- `sphoh-next-id-v1` — عدّاد `nextId` تصاعدي، فلا يُعاد استخدام معرّف محذوف.

`CurriculumService.initResources()` يفحص `getCustomResources()` أولاً؛ فإن وُجد يتجاوز JSON في كل تحميل. ويفرّق بين «المفتاح غائب» (`null` → جلب JSON) و«مصفوفة فارغة» (`[]` → مكتبة فارغة)، ويسجّل `dataSource` (`fallback` | `json` | `custom`). للنشر: **Export JSON** ثم استبدال `data/resources.json` والالتزام. **Export Full Backup** يصدّر `topics` و`app` و`version` مع الموارد، وصندوق الاستيراد يقبل المصفوفة الخام أو الحزمة كاملة. **Reset to defaults** يمسح المفاتيح الثلاثة ويعيد جلب `data/resources.json` بـ`cache: 'no-store'`.

كل عملية حفظ تتحقق من القيمة المنطقية المعادة من `Storage.setJSON`/`setString`؛ عند فشل التخزين تظهر `admin_storage_error` في الإدارة أو `storage_error` لتبديل المفضلة/الإنجاز، ويُعكس التبديل في الذاكرة كي لا تختلف عن `localStorage`، وتبقى البيانات قابلة للتصدير. الحذف/Reset/الاستيراد يأخذ لقطة تراجع قبل التنفيذ ويعرض **Undo** لمدة 10 ثوانٍ في الـtoast.

بعد استخدام الإدارة، المتصفح نفسه يتجاهل تعديلات `resources.json`؛ امسح المفاتيح أو استخدم نافذة خاصة عند الاختبار.

المصادقة من جهة العميل فقط؛ `ADMIN_PASSWORD` نص صريح وعلم الفتح في `sessionStorage` (`1|<timestamp>` بصلاحية 8 ساعات)، وخمس محاولات فاشلة تُفعّل قفلاً مؤقتاً 30 ثانية. وليست حماية حقيقية.

---

## أداة التحقق من التطابق

```bash
node tools/check-parity.mjs
```

تتحقق الأداة (قراءة فقط) من:

1. 21 سكربتاً بالترتيب في الصفحات العامة، و22 في `Admin.html`، وصفر في `Admin/index.html`، مع استثناء السكربتين المساعدين `early-init.js` و`analytics.js` من العدّ، ووجود `defer` على كل سكربت وحدة.
2. تطابق مجموع مفاتيح `Locales.en` و`Locales.ar` (246 مفتاحاً لكل لغة)، ووجود كل مفتاح `data-i18n*` — بما فيها `data-i18n-placeholder` و`data-i18n-aria-label` و`data-i18n-title` و`data-i18n-alt` — في اللغتين، وأن تكون مفاتيح الدوال (`progress_stats`, `downloads_label`, `n_sets`, `admin_lockout`) دوالَّ في اللغتين.
3. **خلو الإنجليزية من العربية**: لا حرف عربي `[؀-ۿ]` في أي قيمة من `Locales.en`، ولا في النص/السمات الثابتة في HTML، ولا في نصوص واجهة JavaScript (مع استثناء مقصود للمعتطيات ثنائية اللغة مثل `ar:` و`*Ar =`).
4. تطابق `Catalog.FALLBACK_RESOURCES` مع `data/resources.json`.
5. وجود كل مسار PDF مُعلن، والإبلاغ عن اليتيمة كتحذيرات.
6. **سلامة القيود الصارمة**: مجلد `PDFs/**` نظيف في git، وقيم ألوان الثيم في `variables.css` والخطوط الثلاثة و`theme-color` لم تتغير في الصفحات الست.
7. تطابق `Settings.LINKS` مع `contact.html`، ومعرّف GA مع `analytics.js` والصفحات العامة دون `Admin.html`، وسجل الموضوعات بين `Catalog.DEFAULT_TOPICS` و`Settings.TOPIC_DISPLAY_ORDER` وخرائط أيقونات `CardComponent`.
8. عدم تحميل `admin.page.js`/`admin.css` خارج `Admin.html`، وغياب `main.js`.
9. **رؤوس الأمان**: وجود `meta CSP` صالح في كل صفحة، وغياب أي `<script>` مضمّن، وسماح الصفحات العامة بـ`googletagmanager.com` و`google-analytics.com` في `script-src` و`img-src` و`connect-src` وعدم سماح `Admin.html` بهما، وموقع `early-init.js` قبل الـCSS.
10. **حصانة المنهج (sandbox)**: رفض المسارات الخطرة (C1)، و`[]` مقابل `null` (C6)، والجذوع لكل لغة وحفظ الجذع الآخر عند التعديل (C12)، والتحقق الصارم من الحِزمة (C3)، وحفظ الوصف القصير (C15)، و`findById` يعيد `null` (C11)، وتصاعد `nextId` (C7)، و`dataSource` والفشل الآمن للكتابة (C4).
11. **إتاحة الوصول (المرحلة هـ)**: رابط التخطي و`<main id="main" tabindex="-1">` في كل صفحة، وتبويبات القارئ بمعمارية ARIA (مع أسهم/Home/End)، و`aria-pressed` للفلاتر، و`aria-live` لعدّاد المكتبة، ومدخلات الملفات `.sr-only`، وإدارة التركيز للوحة الأوامر ودرج الإدارة، ولوحة ألوان من نسختين مع `auto` محسوم في JS ومفاتيح `early-init.js` مطابقة لـ`Settings`، ورموز `--danger-*`، وأهداف لمس 44px داخل `@media (pointer: coarse)` فقط، واحترام `prefers-reduced-motion`.
12. **ربط قابلية الصيانة**: وجود إجراءات البحث في المكتبة واختيار مورد القارئ، وفصل زر إغلاق لوحة الأوامر عن خلفيتها، وحدث `sphoh:refresh`، ومعالجة فشل التخزين، وتنظيم جذع الملف المشترك، والمعاينة غير التفاعلية في الإدارة، وحل معرّفات مسار التعلم عند الرسم.

---

## ملفات PDF اليتيمة — لا تُحذف

ستة ملفات موجودة في المستودع ولا يشير إليها `resources.json` (نحو 1.2 MiB):

```text
PDFs/en/Trig_I_ENG_Solutions.pdf
PDFs/ar/Trig_I_AR_Solutions.pdf
PDFs/ar/Vectors_I_Solutions_AR.pdf
PDFs/ar/Kinematics_II_AR_Solutions.pdf
PDFs/ar/Units_I_Solutions_AR.pdf
PDFs/ar/NSMO_II_AR.pdf
```

**ممنوع حذفها أو إعادة تسميتها أو نقلها.** أداة `check-parity` تعرضها كتحذيرات فقط. لا تنسخ أنماط أسمائها غير المنتظمة.

---

## قيود التصميم

- الهوية البصرية `Precision Physics Lab` ثابتة: الألوان في `assets/css/base/variables.css`، الخطوط `Alexandria` / `IBM Plex Sans Arabic` / `IBM Plex Mono`، و`theme-color: #f6f3ec`.
- لوحة الألوان معرّفة مرتين فقط: `:root` (فاتح، افتراضي) و`:root[data-theme="dark"]` (داكن). لا يوجد بلوك `prefers-color-scheme`؛ الوضع `auto` يُحسم في JS (`early-init.js` قبل الرسم و`Theme.applyTheme()` عبر `matchMedia`) ويُكتب دائماً كـ`data-theme` صريح.
- `--danger-bg`/`--danger-fg` ألوان دلالية للحذف، و`.btn-danger` يستخدمها بدل ألوان موضوع الكينماتيكا.
- RTL عبر `[dir="rtl"]` وتخطيطات direction-aware؛ اختبر الاتجاهين.
- لا bundler ولا build وقت التشغيل. لا تُعِد إنشاء `assets/js/main.js`؛ أُزيل بعد ترحيل منطق المحاكي إلى `home.page.js`.

---

## إتاحة الوصول (a11y)

- رابط «تخطَّ إلى المحتوى الرئيسي» يحقنه `layout.component.js` قبل الهيدر ويظهر عند التركيز فقط، و`<main id="main" tabindex="-1">` هدفه في الصفحات الست.
- `.sr-only` في `reset.css` يخفي بصرياً مع إبقاء العنصر قابلاً للتركيز — يُستخدم لمدخلي PDF/JSON في الإدارة بدل `[hidden]`، ويظهر التركيز على الزر الحاوي عبر `.btn:focus-within`.
- تبويبات القارئ بمعمارية ARIA كاملة (`role="tab"`/`tabpanel`، `aria-selected`، roving `tabindex`، أسهم تراعي RTL وHome/End)، وفلاتر المكتبة `aria-pressed`، وعدّاد النتائج `aria-live="polite"`.
- لوحة الأوامر تحفظ مصدر التركيز وتعيده عند الإغلاق وتحدّث `aria-expanded`؛ درج الإدارة ينقل التركيز إلى `#adminTopic` ويعيده إلى زر الفتح، ويُغلق بـEsc.
- أهداف اللمس ≥44px تحت `pointer: coarse`، و`prefers-reduced-motion: reduce` يوقف الحركة، وحقل كلمة المرور له `<label>` مرئي ورسالة خطأ `role="alert"` مرتبطة بـ`aria-describedby`.
