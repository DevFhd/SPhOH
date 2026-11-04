# SPhOH — Saudi Physics Olympiad Hub (Refactored Modular Architecture)

**منصة تدريبية تعاونية لطلاب أولمبياد الفيزياء في المملكة العربية السعودية وحول العالم.**  
**A collaborative learning hub for physics Olympiad students in Saudi Arabia and beyond.**

---

## 🏗️ المعمارية الجديدة للمشروع (Modular Architecture)

تمت إعادة هيكلة المشروع بالكامل وفق مبدأ **فصل المسؤوليات (Separation of Concerns)** و**عدم تكرار الكود (DRY)** ليكون سهل الصيانة والتوسع المستقبلي:

1. **إلغاء تكرار الهيدر والفوتر عبر الصفحات (`layout.component.js`):**
   - بدلاً من تكرار كود `<header>` و`<footer>` في 6 ملفات HTML، يقوم المكوّن `assets/js/components/layout.component.js` بتركيب الشريط العلوي والتذييل تلقائياً وتحديد الرابط النشط لكل صفحة.
2. **تقسيم JavaScript إلى طبقات مستقلة (`assets/js/`):**
   - `config/` — إعدادات النظام (`settings.js`) والبيانات المرجعية (`catalog.js`).
   - `i18n/` — قواميس الترجمة الكاملة باللغتين العربية والإنجليزية (`locales.js`).
   - `core/` — أدوات التعامل الآمن مع DOM (`dom.js`) والتخزين المحلي (`storage.js`).
   - `services/` — مخزن الحالة المركزي (`state.service.js`)، خدمة الترجمة (`i18n.service.js`)، خدمة المظهر (`theme.service.js`)، خدمة التحميلات (`download.service.js`)، وخدمة إدارة المناهج الجاهزة للربط مع أي قاعدة بيانات (`curriculum.service.js`).
   - `components/` — المكونات المشتركة (`layout.component.js`، `card.component.js`، `toast.component.js`).
   - `pages/` — وحدات التحكم المستقلة لكل صفحة (`home.page.js`، `files.page.js`، `preview.page.js`، `about.page.js`، `contact.page.js`، `admin.page.js`).
   - `app.js` — المنسق الرئيسي للتطبيق وتفويض الأحداث (Event Delegation).
   - `main.js` — نسخة مجمّعة تلقائياً (Bundled Fallback) لضمان التوافق الخلفي الكامل.
3. **تقسيم CSS إلى طبقات معيارية (`assets/css/`):**
   - `base/` — متغيرات التصميم والألوان (`variables.css`)، تصفير المتصفح (`reset.css`)، والتايبوغرافي (`typography.css`).
   - `layout/` — الشبكات والحاويات (`grid.css`)، الشريط العلوي (`navbar.css`)، والتذييل (`footer.css`).
   - `components/` — الأزرار (`buttons.css`)، الأوسمة (`badges.css`)، البطاقات (`cards.css`)، النماذج (`forms.css`)، والإشعارات (`toast.css`).
   - `pages/` — ملف تنسيق مستقل لكل صفحة (`home.css`, `files.css`, `preview.css`, `about.css`, `contact.css`, `admin.css`).

---

## 📂 هيكلية ملفات المشروع (Project Directory Tree)

```text
SPhOH/
├── index.html                          # الصفحة الرئيسية (Hero, Stats, Pillars, Featured, FAQ)
├── files.html                          # مكتبة المسائل والحلول مع البحث الفوري والفلاتر
├── preview.html                        # قارئ المناهج والحلول المدمج مع وضع التركيز (Focus Mode)
├── about.html                          # من نحن، دليل المستويات، وأعضاء الفريق
├── contact.html                        # صفحة التواصل والمجتمع (نموذج الملاحظات، تيليجرام، البريد)
├── admin.html                          # لوحة تحكم المشرف المخفية (Lowercase URL support)
├── Admin.html                          # لوحة تحكم المشرف المخفية (Uppercase URL support)
├── Admin/
│   └── index.html                      # دعم المسار النظيف (/Admin)
├── README.md                           # توثيق المشروع والهيكلية المعمارية
├── data/
│   └── resources.json                  # بيانات المناهج والحلول النموذجية
├── assets/
│   ├── css/
│   │   ├── style.css                   # نقطة الدخول الموحدة للتنسيقات (@import)
│   │   ├── base/
│   │   │   ├── variables.css           # Design Tokens & Light/Dark Themes
│   │   │   ├── reset.css               # Global Reset & Accessibility
│   │   │   └── typography.css          # Headings, Fonts & RTL/LTR Rules
│   │   ├── layout/
│   │   │   ├── grid.css                # Containers, Sections & Responsive Grids
│   │   │   ├── navbar.css              # Sticky Header, Links & Theme/Lang Controls
│   │   │   └── footer.css              # Site Footer
│   │   ├── components/
│   │   │   ├── buttons.css             # Button Variants & States
│   │   │   ├── badges.css              # Topic Tags, Difficulty Pips & Counters
│   │   │   ├── cards.css               # Curriculum Cards, Stat Cards & Pillar Cards
│   │   │   ├── forms.css               # Inputs, Selects & Search Fields
│   │   │   └── toast.css               # Toast Notifications
│   │   └── pages/
│   │       ├── home.css                # Hero, Physics Sketch & FAQ Accordion
│   │       ├── files.css               # Filter Toolbar & Topic Groups
│   │       ├── preview.css             # PDF Reader & Focus Mode
│   │       ├── about.css               # About Grid & Team List
│   │       ├── contact.css             # Contact & Telegram Cards
│   │       └── admin.css               # Admin Gate, Drawer & Quick Toggles
│   ├── js/
│   │   ├── config/
│   │   │   ├── settings.js             # إعدادات المنصة وكلمة مرور المشرف (ADMIN_PASSWORD)
│   │   │   ├── catalog.js              # الأقسام، المستويات، الفريق، الأسئلة الشائعة، والبيانات الاحتياطية
│   │   │   └── mathjax.js              # إعدادات عرض معادلات LaTeX
│   │   ├── i18n/
│   │   │   └── locales.js              # قواميس الترجمة (AR / EN)
│   │   ├── core/
│   │   │   ├── dom.js                  # دوال DOM وتعقيم النصوص والنسخ للحافظة
│   │   │   └── storage.js              # غلاف آمن لـ localStorage و sessionStorage
│   │   ├── services/
│   │   │   ├── state.service.js        # إدارة الحالة المركزية (Store)
│   │   │   ├── i18n.service.js         # خدمة الترجمة واتجاه الصفحة
│   │   │   ├── theme.service.js        # خدمة المظهر الفاتح/الداكن
│   │   │   ├── download.service.js     # خدمة عدادات التحميل
│   │   │   ├── curriculum.service.js   # خدمة بيانات المناهج ومسارات PDF
│   │   │   └── math.service.js         # تنسيق معادلات LaTeX في المحتوى الديناميكي
│   │   ├── components/
│   │   │   ├── toast.component.js      # مكوّن الإشعارات
│   │   │   ├── layout.component.js     # مكوّن الهيدر والفوتر الموحد
│   │   │   └── card.component.js       # مكوّن بطاقة المنهج والأوسمة
│   │   ├── pages/
│   │   │   ├── home.page.js            # منطق الصفحة الرئيسية
│   │   │   ├── files.page.js           # منطق صفحة المكتبة والفلاتر
│   │   │   ├── preview.page.js         # منطق القارئ المدمج
│   │   │   ├── about.page.js           # منطق صفحة من نحن
│   │   │   ├── contact.page.js         # منطق صفحة التواصل
│   │   │   └── admin.page.js           # منطق لوحة التحكم المخفية
│   │   ├── app.js                      # نقطة الدخول الرئيسية للتطبيق
│   │   └── main.js                     # حزمة مجمّعة للتوافق الخلفي
│   └── icons/                          # أيقونات الموقع وملف الهوية
└── PDFs/
    ├── ar/                             # ملفات المسائل والحلول باللغة العربية
    └── en/                             # ملفات المسائل والحلول باللغة الإنجليزية
```

---

## 📚 فهرس المناهج المتوفرة (Resource Catalog)

| ID | القسم (`t`) | المستوى (`l`) | العنوان (EN / AR) | ملف المسائل (`file`) | ملف الحلول (`solution`) |
| --- | --- | --- | --- | --- | --- |
| `1` | `kin` | `1` | Kinematics I Problem Set / الكينماتيكا (الحركة) I | `Kinematics_I` | `Kinematics_I_Solutions` (AR + EN) |
| `8` | `kin` | `2` | Kinematics II Problem Set / الكينماتيكا (الحركة) II | `Kinematics_II` | — |
| `9` | `mech` | `2` | Dynamics I Problem Set / مجموعة مسائل الديناميكا I | `Dynamics_I` | — |
| `3` | `mech` | `2` | Fluids I Problem Set / مجموعة مسائل ميكانيكا الموائع I | `Fluids_I` | `Fluids_I_Solutions` (AR + EN) |
| `4` | `math` | `1` | Units Conversion & Dimensional Analysis / تحويل الوحدات والتحليل البعدي | `Units_Conversion_and_Dimensional_Analysis` | `Units_Conversion_and_Dimensional_Analysis_Solutions` (AR + EN) |
| `5` | `math` | `1` | Trigonometry I Problem Set / مجموعة مسائل حساب المثلثات I | `Trigonometry_I` | `Trigonometry_I_Solutions` (AR + EN) |
| `2` | `math` | `2` | Vectors Problem Set / مجموعة مسائل المتجهات | `Vectors` | `Vectors_Solutions` (AR + EN) |
| `6` | `math` | `2` | Algebra I Problem Set / مجموعة مسائل الجبر I | `Algebra_I` | `Algebra_I_Solutions` (AR + EN) |
| `7` | `coll` | `1` | NSMO Collection I / مجموعة نسمو I | `NSMO_Collection_I` | — |
| `10` | `coll` | `2` | NSMO Collection II / مجموعة نسمو II | `NSMO_Collection_II` (`ar` only) | — |

---

## 🧮 كتابة معادلات LaTeX

يدعم الموقع عرض معادلات LaTeX في جميع الصفحات باستخدام MathJax. استخدم `\( ... \)` للمعادلات داخل السطر و`\[ ... \]` للمعادلات المنفصلة، أو الصيغتين الشائعتين `$ ... $` و`$$ ... $$`. يدعم الإعداد أيضًا أوامر AMS مثل `\begin{aligned}`.

## 🔐 استخدام لوحة التحكم المخفية (`Admin.html` / `admin.html`)

1. **الدخول إلى اللوحة:** غيّر `index.html` في شريط عنوان المتصفح إلى `Admin.html` أو `admin.html` أو `/Admin`.
2. **تغيير كلمة المرور:** افتح الملف `assets/js/config/settings.js` وعدّل قيمة `ADMIN_PASSWORD` (القيمة الافتراضية: `00000000`).
3. **إضافة المناهج وتفعيل الحلول:** يمكنك إضافة منهج جديد، أو إنشاء قسم فيزيائي جديد، أو تفعيل/إلغاء الحل العربي أو الإنجليزي لأي منهج بضغطة زر واحدة، ثم تصدير ملف `resources.json` المحدث لحفظه في المستودع.
