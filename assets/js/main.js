/**
 * @file assets/js/main.js
 * @description حزمة موحدة (Auto-generated Bundle) لجميع وحدات SPhOH للتوافق الخلفي والعمل في وضع الملف الواحد.
 */


/* === assets/js/config/settings.js === */
/**
 * @file assets/js/config/settings.js
 * @description الإعدادات العامة للمنصة، مفاتيح التخزين المحلي، وإعدادات استوديو الإدارة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  SPhOH.Settings = Object.freeze({
    /**
     * كلمة المرور الخاصة باستوديو الإدارة (Admin.html / admin.html)
     * لتغيير كلمة المرور، عدّل القيمة النصية أدناه.
     */
    ADMIN_PASSWORD: '00000000',

    /** اللغة الافتراضية والسمة الافتراضية */
    DEFAULT_LANG: 'ar',
    DEFAULT_THEME: 'auto',
    DEFAULT_PREVIEW_ID: 8,

    /** لواحق ملفات PDF لكل لغة */
    FILE_SUFFIX: Object.freeze({
      ar: 'AR',
      en: 'ENG'
    }),

    /** مفاتيح التخزين في المتصفح (localStorage / sessionStorage) */
    STORAGE_KEYS: Object.freeze({
      LANG: 'sphoh-lang',
      THEME: 'sphoh-theme',
      DOWNLOAD_COUNTS: 'sphoh-download-counts-v1',
      CUSTOM_RESOURCES: 'sphoh-custom-resources-v1',
      CUSTOM_TOPICS: 'sphoh-custom-topics-v1',
      ADMIN_UNLOCKED: 'sphoh-admin-unlocked',
      BOOKMARKS: 'sphoh-bookmarks-v1',
      COMPLETED: 'sphoh-completed-v1',
      VIEW_MODE: 'sphoh-view-mode-v1',
      SCRATCHPAD: 'sphoh-scratchpad-v1'
    }),

    /** الروابط الخارجية وبيانات التواصل */
    LINKS: Object.freeze({
      TELEGRAM: 'https://t.me/sphohc',
      FEEDBACK_FORM: 'https://forms.gle/5dETrhbTAqVMkgGv7',
      EMAIL: 'sphohc@gmail.com',
      RESOURCES_JSON: 'data/resources.json',
      GA_MEASUREMENT_ID: 'G-018KWMJE3F'
    }),

    /** ترتيب عرض الأقسام في صفحة المكتبة */
    TOPIC_DISPLAY_ORDER: Object.freeze([
      'kin',
      'mech',
      'math',
      'coll',
      'elec',
      'therm',
      'opt'
    ])
  });
})(window);


/* === assets/js/config/catalog.js === */
/**
 * @file assets/js/config/catalog.js
 * @description البيانات الثابتة للمنصة: الأقسام، المستويات، أعضاء الفريق، الأسئلة الشائعة، والبيانات الاحتياطية مع أوصاف شاملة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  const DEFAULT_TOPICS = {
    kin: {
      en: 'Kinematics',
      ar: 'الكينماتيكا (الحركة)',
      defaultDesc: {
        en: 'Structured Olympiad problems covering motion analysis, trajectories, relative velocity, and kinematic constraints.',
        ar: 'مجموعة مسائل أولمبياد متدرجة تغطي تحليل الحركة، المسارات، السرعة النسبية، والقيود الحركية.'
      }
    },
    mech: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      defaultDesc: {
        en: "Comprehensive problems on Newton's laws, equilibrium, coupled systems, work-energy, momentum, and fluid statics.",
        ar: 'مسائل تدريبية متكاملة في قوانين نيوتن، الاتزان، الأنظمة المترابطة، الطاقة والزخم، وميكانيكا الموائع.'
      }
    },
    math: {
      en: 'Mathematics',
      ar: 'الرياضيات',
      defaultDesc: {
        en: 'Essential mathematical methods for physicists: dimensional analysis, algebra, trigonometry, vectors, and approximations.',
        ar: 'الأدوات والأساليب الرياضية الأساسية للفيزيائيين: التحليل البعدي، الجبر، حساب المثلثات، المتجهات، والتقريبات.'
      }
    },
    coll: {
      en: 'Collections',
      ar: 'المجموعات',
      defaultDesc: {
        en: 'Full-length multi-topic problem collections designed to simulate national and regional physics Olympiad selection exams.',
        ar: 'تجميعات مسائل شاملة متعددة المواضيع مصممة لمحاكاة اختبارات الفرز والتصفيات في الأولمبيادات الوطنية والدولية.'
      }
    },
    elec: {
      en: 'Electricity & Magnetism',
      ar: 'الكهرباء والمغناطيسية',
      defaultDesc: {
        en: "Olympiad problem set on electrostatics, Gauss's law, DC/AC circuits, Lorentz force, and electromagnetic induction.",
        ar: 'مجموعة مسائل أولمبياد في الكهرباء الساكنة، قانون غاوس، دوائر التيار، القوة المغناطيسية، والحث الكهرومغناطيسي.'
      }
    },
    therm: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      defaultDesc: {
        en: 'Olympiad problem set on kinetic theory of gases, laws of thermodynamics, heat engines, and entropy.',
        ar: 'مجموعة مسائل أولمبياد في النظرية الحركية للغازات، قوانين الديناميكا الحرارية، الدورات الحرارية، والإنتروبي.'
      }
    },
    opt: {
      en: 'Optics',
      ar: 'البصريات',
      defaultDesc: {
        en: "Olympiad problem set on geometrical optics, Snell's law, lenses, mirrors, interference, and diffraction.",
        ar: 'مجموعة مسائل أولمبياد في البصريات الهندسية، قانون سنيل، العدسات والمرايا، والتداخل والحيود الموجي.'
      }
    }
  };

  const LEVELS = {
    1: { en: 'Level I', ar: 'المستوى الأول' },
    2: { en: 'Level II', ar: 'المستوى الثاني' },
    3: { en: 'Challenge', ar: 'تحدٍّ' }
  };

  const TEAM = [
    { name: 'Fahad Alhajji', role: { en: 'Founder & CEO', ar: 'المؤسس والرئيس التنفيذي' } },
    { name: 'Mohammed Linga', role: { en: 'Co-Founder & CTO', ar: 'شريك مؤسس والرئيس التقني' } },
    { name: 'Ridha Alkhamis', role: { en: 'Lead Problem Writer', ar: 'كاتب الأسئلة الرئيسي' } },
    { name: 'Mohammed Alturaiki', role: { en: 'Lead Developer', ar: 'المطور الرئيسي' } },
    { name: 'Amjed Qadi', role: { en: 'Problem Writer', ar: 'كاتب أسئلة' } },
    { name: 'Hussain Alkhamis', role: { en: 'Problem Writer', ar: 'كاتب أسئلة' } },
    { name: 'Abdulhadi Alakhdhari', role: { en: 'Problem Writer', ar: 'كاتب أسئلة' } },
    { name: 'Hassan Alabdullah', role: { en: 'Problem Writer', ar: 'كاتب أسئلة' } },
    { name: 'Hassan Al Radhwan', role: { en: 'LaTeX Developer', ar: 'مطور LaTeX' } }
  ];

  const FAQS = [
    {
      q: { en: 'What is SPhOH?', ar: 'ما هو SPhOH؟' },
      a: {
        en: 'SPhOH (Saudi Physics Olympiad Hub) is a specialized training platform providing high-quality problem sets and resources for students preparing for national and international physics olympiads.',
        ar: 'SPhOH هي منصة تدريبية متخصصة تقدم مجموعات مسائل وموارد عالية الجودة للطلاب المستعدين للأولمبيادات الوطنية والدولية للفيزياء.'
      }
    },
    {
      q: { en: 'Are all problem sets free to download?', ar: 'هل جميع مجموعات المسائل مجانية للتحميل؟' },
      a: {
        en: 'Yes, all our PDFs and resources are completely free to browse online or download for students, teachers, and physics enthusiasts worldwide.',
        ar: 'نعم، جميع ملفات PDF والموارد المتاحة مجانية تماماً للتصفح المباشر داخل الموقع أو التحميل للطلاب والمعلمين وشغوفي الفيزياء حول العالم.'
      }
    },
    {
      q: { en: 'How can I contribute or report errors?', ar: 'كيف يمكنني المساهمة أو الإبلاغ عن خطأ في المسائل؟' },
      a: {
        en: 'You can send feedback through our Google Form or by email; both options are on the Contact page. You can also follow our Telegram channel for updates.',
        ar: 'يمكنك إرسال ملاحظاتك عبر نموذج Google أو مراسلتنا عبر البريد الإلكتروني في صفحة التواصل، كما يمكنك متابعة قناة تيليجرام للاطلاع على التحديثات.'
      }
    },
    {
      q: { en: 'How do you write and compile the problems?', ar: 'كيف تكتبون وتعدّون المسائل؟' },
      a: {
        en: 'As Olympiad students, we write most of the problems ourselves. Some problems are also inspired by classic references such as Irodov, Physics for Scientists and Engineers, Fundamentals of Physics, and past Olympiad competitions.',
        ar: 'كطلاب أولمبياد، نكتب معظم المسائل بأنفسنا. إلا أن هناك بعض المسائل المستلهمة من مراجع كلاسيكية مثل إيرودوف، والفيزياء للعلماء والمهندسين، وأساسيات الفيزياء، ومسائل الأولمبيادات السابقة.'
      }
    }
  ];

  const FALLBACK_RESOURCES = [
    {
      id: 1,
      t: 'kin',
      l: 1,
      file: 'Kinematics_I',
      solution: 'Kinematics_I_Solutions',
      title: { en: 'Kinematics I Problem Set', ar: 'الكينماتيكا (الحركة) I' },
      desc: {
        en: '25 progressive problems with hints and official solutions: 1D & 2D kinematic equations, 3D vector displacement, graphical motion analysis, free fall, and projectile motion.',
        ar: '25 مسألة متدرجة مع التلميحات والحلول النموذجية: معادلات الحركة في بعد وبعدين، الإزاحة المتجهة في 3D، التحليل البياني للحركة، السقوط الحر، وحركة المقذوفات.'
      }
    },
    {
      id: 8,
      t: 'kin',
      l: 2,
      file: 'Kinematics_II',
      solution: null,
      title: { en: 'Kinematics II Problem Set', ar: 'الكينماتيكا (الحركة) II' },
      desc: {
        en: '26 advanced problems with hints: rolling motion without slipping, pulley & geometric constraint kinematics, relative motion in moving media, and circular motion.',
        ar: '26 مسألة متقدمة مع التلميحات: حركة التدحرج دون انزلاق، كينماتيكا القيود الهندسية والبكرات، الحركة النسبية والأوساط المتحركة، والحركة الدائرية.'
      }
    },
    {
      id: 9,
      t: 'mech',
      l: 2,
      file: 'Dynamics_I',
      solution: null,
      title: { en: 'Dynamics I Problem Set', ar: 'مجموعة مسائل الديناميكا I' },
      desc: {
        en: "44 progressive problems with hints on Newton's laws: static equilibrium and cable tension, coupled multi-body pulley systems, and static/kinetic friction on inclines.",
        ar: '44 مسألة متدرجة مع التلميحات في قوانين نيوتن: الاتزان الساكن وشد الكابلات، الأنظمة المترابطة متعددة الأجسام والبكرات، والاحتكاك السكوني والحركي على المستويات المائلة.'
      }
    },
    {
      id: 3,
      t: 'mech',
      l: 2,
      file: 'Fluids_I',
      solution: 'Fluids_I_Solutions',
      title: { en: 'Fluids I Problem Set', ar: 'مجموعة مسائل ميكانيكا الموائع I' },
      desc: {
        en: "20 structured problems with hints and official solutions: density & unit conversions, hydrostatic pressure, Pascal's principle, hydraulic lifts, buoyancy, and Archimedes' principle.",
        ar: '20 مسألة متدرجة مع التلميحات والحلول النموذجية: تحويلات الكثافة، الضغط الهيدروستاتيكي، مبدأ باسكال والمكابس الهيدروليكية، قوة الطفو، ومبدأ أرخميدس للأجسام الطافية والمغمورة.'
      }
    },
    {
      id: 4,
      t: 'math',
      l: 1,
      file: 'Units_Conversion_and_Dimensional_Analysis',
      solution: 'Units_Conversion_and_Dimensional_Analysis_Solutions',
      title: { en: 'Units Conversion & Dimensional Analysis', ar: 'تحويل الوحدات والتحليل البعدي' },
      desc: {
        en: '29 foundational problems (MCQ & Free-Response) with official solutions: nested SI/CGS prefixes, multi-step conversion factors, dimensional homogeneity, and scaling laws.',
        ar: '29 مسألة تأسيسية (اختيار من متعدد ومقالية) مع الحلول النموذجية: إتقان البادئات المركبة، معاملات التحويل بين أنظمة الوحدات (SI/CGS)، تجانس الأبعاد، واشتقاق العلاقات الفيزيائية.'
      }
    },
    {
      id: 5,
      t: 'math',
      l: 1,
      file: 'Trigonometry_I',
      solution: 'Trigonometry_I_Solutions',
      title: { en: 'Trigonometry I Problem Set', ar: 'مجموعة مسائل حساب المثلثات I' },
      desc: {
        en: '24 problems with hints and official solutions: trigonometric identities, right-triangle geometry, special angles, triangle similarity, and physical force/inclined-plane applications.',
        ar: '24 مسألة متدرجة مع التلميحات والحلول النموذجية: المتطابقات المثلثية، هندسة المثلث قائم الزاوية، الزوايا الخاصة، تشابه المثلثات، والتطبيقات الفيزيائية لتحليل القوى والمستويات المائلة.'
      }
    },
    {
      id: 2,
      t: 'math',
      l: 2,
      file: 'Vectors',
      solution: 'Vectors_Solutions',
      title: { en: 'Vectors Problem Set', ar: 'مجموعة مسائل المتجهات' },
      desc: {
        en: '27 progressive problems with hints and official solutions: 2D & 3D vector components, unit vectors, vector addition/subtraction, scalar dot product (work), and vector cross product (torque).',
        ar: '27 مسألة متدرجة مع التلميحات والحلول النموذجية: مركبات المتجهات في المستوي والفراغ (2D/3D)، متجهات الوحدة، جمع وطرح المتجهات، الضرب القياسي (الشغل)، والضرب الاتجاهي (العزم).'
      }
    },
    {
      id: 6,
      t: 'math',
      l: 2,
      file: 'Algebra_I',
      solution: 'Algebra_I_Solutions',
      title: { en: 'Algebra I Problem Set', ar: 'مجموعة مسائل الجبر I' },
      desc: {
        en: '40 progressive problems with hints and official solutions: pure algebraic manipulations, symbolic variable isolation, systems of equations, and multi-step physics formula derivations.',
        ar: '40 مسألة متدرجة مع التلميحات والحلول النموذجية: المهارات الجبرية الأساسية، عزل المتغيرات الرمزية، حل أنظمة المعادلات، واشتقاق الصيغ الفيزيائية متعددة الخطوات.'
      }
    },
    {
      id: 7,
      t: 'coll',
      l: 1,
      file: 'NSMO_Collection_I',
      solution: null,
      title: { en: 'NSMO Collection I', ar: 'مجموعة نسمو I' },
      desc: {
        en: '67 comprehensive problems with hints tailored for Stage 1 of the National Science & Mathematics Olympiad (NSMO): covering unit conversions, vectors, 1D/2D kinematics, and fluid statics.',
        ar: '67 مسألة شاملة مع التلميحات مخصصة للاستعداد للمرحلة الأولى من الأولمبياد الوطني للعلوم والرياضيات (نسمو): تغطي تحويل الوحدات، المتجهات، الكينماتيكا، وميكانيكا الموائع.'
      }
    },
    {
      id: 10,
      t: 'coll',
      l: 2,
      file: 'NSMO_Collection_II',
      langs: ['ar'],
      solution: null,
      title: { en: 'NSMO Collection II', ar: 'مجموعة نسمو II' },
      desc: {
        en: 'Second NSMO volume: 80 progressive problems with hints on dimensional analysis, advanced constraint kinematics (Kinematics II), and Newtonian multi-body dynamics (Dynamics I).',
        ar: 'المجلد الثاني من مجموعة نسمو: 80 مسألة متدرجة مع التلميحات في التحليل البعدي، وكينماتيكا القيود المتقدمة (الكينماتيكا II)، وديناميكا الأنظمة المترابطة وقوانين نيوتن (الديناميكا I).'
      }
    }
  ];

  const LEGACY_FILE_ALIASES = {
    NSMO_II: 'NSMO_Collection_II'
  };

  SPhOH.Catalog = {
    DEFAULT_TOPICS,
    LEVELS,
    TEAM,
    FAQS,
    FALLBACK_RESOURCES,
    LEGACY_FILE_ALIASES
  };
})(window);


/* === assets/js/i18n/locales.js === */
/**
 * @file assets/js/i18n/locales.js
 * @description قواميس الترجمة الكاملة للواجهة باللغتين العربية والإنجليزية (شاملة المزايا التفاعلية الجديدة).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  SPhOH.Locales = {
    en: {
      nav_home: 'Home',
      nav_files: 'Problem Sets',
      nav_preview: 'Reader / Preview',
      nav_about: 'About & Team',
      nav_contact: 'Contact',
      nav_cmd_k: 'Quick Search',

      theme_dark: 'Dark',
      theme_light: 'Light',

      hero_eyebrow: 'Saudi Physics Olympiad Hub • Interactive Platform',
      hero_title: 'Solve harder problems. Think like a physicist.',
      hero_desc:
        'SPhOH is an open global training hub for physics enthusiasts and students preparing for national and international physics olympiads (IPhO, APhO, EuPhO, and National Selections). Browse problem sets directly inside the hub, track your training progress, or download PDFs.',
      hero_cta: 'Browse Problem Sets',
      hero_secondary: 'About the Initiative',

      sim_badge: '⚡ Interactive Physics Lab',
      sim_launch_btn: '▶ Launch Projectile',
      sim_angle_lbl: 'Angle θ',
      sim_vel_lbl: 'Velocity v₀',
      sim_grav_lbl: 'Gravity g',
      sim_earth: 'Earth (9.8)',
      sim_mars: 'Mars (3.7)',
      sim_moon: 'Moon (1.6)',

      stat_sets: 'Curated Problem Sets',
      stat_topics: 'Library Sections',
      stat_bilingual: 'Full AR / EN Support',
      stat_free: 'Open Access & Free PDFs',

      pillars_eyebrow: 'Methodology & Architecture',
      pillars_title: 'Built for deliberate Olympiad practice',
      p1_t: 'Graded Difficulty Progression',
      p1_d: 'Each problem set is marked Level I, Level II, or Challenge, so you can progress systematically from foundational concepts to IPhO-level mastery.',
      p2_t: 'Authentic Olympiad Focus',
      p2_d: 'Topics and multi-step analytical styles mirror what students encounter in national team selections and International Physics Olympiad training.',
      p3_t: 'LaTeX Typeset & Official Solutions',
      p3_d: 'Problems are carefully compiled, typeset in publication-grade LaTeX, and paired with step-by-step official solutions.',

      featured_eyebrow: 'Featured Curricula',
      featured_title: 'Start practicing right away',
      featured_all: 'View All Problem Sets →',

      about_eyebrow: 'About Us',
      about_title: 'Built by Olympiad students, for Olympiad students',
      about_desc:
        'SPhOH is a student-led training hub dedicated to advanced physics competitions worldwide. Every set is designed around deliberate practice: working on problems just beyond your current comfort zone.',
      levels_guide_title: 'How Difficulty Levels Work',
      lvl1_desc:
        'Foundational olympiad concepts, essential mathematical tools, and preparation for the first stage of the national olympiad.',
      lvl2_desc:
        'Intermediate multi-step problems requiring deeper physical intuition and analytical techniques.',
      lvl3_desc:
        'Advanced international-level challenges (APhO / IPhO style) designed to stretch your problem-solving limits.',

      team_title: 'The SPhOH Founders & Team',
      team_desc:
        'The SPhOH Team writes, reviews, translates, and typesets every problem set on the hub, making serious physics practice accessible in both Arabic and English.',
      team_vision:
        'Our vision: every capable physics student worldwide has access to high-quality practice material to compete at the highest level.',

      files_eyebrow: 'Interactive Resource Library',
      files_title: 'Files & Problem Sets',
      files_desc:
        'Browse curricula directly inside our integrated reader, track your completed sets, bookmark favorites, or download PDFs and official solutions.',
      translation_notice:
        'Most problem sets are available in both Arabic and English. Files open and download in your selected interface language whenever it is available.',

      progress_title: 'Your Training Progress',
      progress_stats: (done, total, pct) => `${done} of ${total} sets completed (${pct}%)`,
      status_all: 'All Sets',
      status_saved: '★ Bookmarked',
      status_completed: '✓ Completed',
      status_pending: '⏳ In Progress',

      sort_default: 'Sort: Default',
      sort_lvl_asc: 'Level: I → III',
      sort_lvl_desc: 'Level: III → I',
      sort_downloads: 'Most Downloaded',
      sort_title: 'Alphabetical',
      view_grid: '⊞ Grid',
      view_list: '☰ List',

      bookmark_add: '☆ Save',
      bookmark_remove: '★ Saved',
      complete_add: '○ Mark Done',
      complete_remove: '✓ Completed',
      toast_bookmarked: 'Added to your bookmarked sets ★',
      toast_unbookmarked: 'Removed from bookmarks',
      toast_completed: 'Great job! Problem set marked as completed 🎉',
      toast_uncompleted: 'Marked as in progress',

      filter_all: 'All Topics',
      level_all: 'All Levels',
      search_placeholder: 'Search problem sets (or press ⌘K)...',

      faq_eyebrow: 'FAQ',
      faq_title: 'Frequently Asked Questions',

      empty: 'No matching problem sets found. Try clearing your search or filters.',
      btn_preview: '📖 Browse Curriculum',
      btn_download: '📥 Download PDF',
      pdf_toast: 'This set is not available in this language yet.',
      solution_preview: '📖 Browse Solution',
      solution_download: '📥 Download Solution',
      solution_toast: 'The solution for this set has not been released in this language yet.',

      preview_back: '← Back to Problem Sets',
      preview_prev: '◀ Previous',
      preview_next: 'Next ▶',
      preview_tab_problem: '📘 Problem Set',
      preview_tab_solution: '✅ Official Solution',
      preview_focus_enter: '⛶ Focus Mode',
      preview_focus_exit: '✕ Exit Focus',
      open_new_tab: 'Open PDF ↗',
      close_preview: 'Exit Focus Mode',
      download_started: 'Download recorded! Counter updated.',
      downloads_label: (n) => `↓ ${Number(n || 0).toLocaleString()}${n === 1 ? ' download' : ' downloads'}`,

      n_sets: (n) => `Showing ${n}${n === 1 ? ' problem set' : ' problem sets'}`,

      cmd_placeholder: 'Search curricula, topics, or actions...',
      cmd_empty: 'No matching curricula or commands found.',
      cmd_group_curricula: 'Problem Sets & Curricula',
      cmd_group_actions: 'Quick Actions & Navigation',
      cmd_act_theme: 'Toggle Dark / Light Theme',
      cmd_act_lang: 'Switch Language (AR / EN)',
      cmd_act_files: 'Open Problem Sets Library',
      cmd_act_about: 'Open About & Team Page',
      cmd_act_contact: 'Open Contact & Community Page',
      cmd_hint_esc: 'ESC to close',

      contact_eyebrow: 'Contact & Community',
      contact_title: 'Get in touch with the SPhOH Team',
      contact_desc:
        'Found a typo in a problem set, want to suggest a new topic, or interested in contributing problems and solutions? Reach out through any of the channels below.',

      fb_title: 'Have feedback, corrections, or suggestions?',
      fb_desc: 'Help us improve SPhOH problem sets and platform features by filling out our quick feedback form.',
      fb_btn: 'Open Feedback Form ↗',

      telegram_title: 'Join the SPhOH Telegram Channel',
      telegram_desc: 'Get instant updates when new problem sets, solutions, and training announcements are published.',
      telegram_btn: 'Join Telegram ↗',
      telegram_footer: 'Telegram Channel',

      email_title: 'Contact Us by Email',
      email_desc: 'For academic collaborations, error reports, or joining the problem-writing team, email us directly.',
      email_copy: 'Copy Email',
      email_copied: 'Email address copied to clipboard: sphohc@gmail.com',

      admin_eyebrow: 'Admin Panel',
      admin_title: 'Curriculum & Solution Manager',
      admin_desc:
        'Manage existing curricula, toggle solutions with one click, or add new curricula and new sections.',
      admin_gate_title: 'Admin Authentication',
      admin_gate_desc:
        'Enter the admin password to unlock the panel (configurable via ADMIN_PASSWORD in assets/js/config/settings.js).',
      admin_pass_placeholder: 'Enter password...',
      admin_login_btn: 'Unlock Admin Panel',
      admin_wrong_pass: 'Incorrect password! Please try again.',
      admin_add_curriculum_btn: '➕ Add New Curriculum',
      admin_logout_btn: '🔒 Lock Panel',
      admin_export_json: '📥 Export resources.json',
      admin_copy_json: '📋 Copy JSON',
      admin_reset_default: '🔄 Reset to Default',
      admin_db_tools_summary: '⚙️ Export & Backup Tools (resources.json)',
      admin_form_add_title: '➕ Add New Curriculum',
      admin_form_edit_title: '✏️ Edit Curriculum',
      admin_lbl_topic: 'Topic / Section',
      admin_opt_new_topic: '➕ Create a Brand-New Topic / Section...',
      admin_lbl_new_topic_ar: 'New Section Name (Arabic)',
      admin_lbl_new_topic_en: 'New Section Name (English)',
      admin_lbl_new_topic_key: 'Section Code (optional, e.g. modern)',
      admin_lbl_level: 'Difficulty Level',
      admin_lbl_stem: 'PDF File Identifier (or pick a file to auto-fill)',
      admin_lbl_pick_pdf: '📂 Pick PDF to Auto-Fill Name',
      admin_lbl_title_ar: 'Curriculum Title (Arabic)',
      admin_lbl_title_en: 'Curriculum Title (English)',
      admin_lbl_desc_ar: 'Short Description (Arabic)',
      admin_lbl_desc_en: 'Short Description (English)',
      admin_lbl_sol_mode: 'Solution Status',
      admin_sol_none: 'Not released yet',
      admin_sol_both: 'Available in Arabic & English (AR + EN)',
      admin_sol_ar: 'Available in Arabic only (AR)',
      admin_sol_en: 'Available in English only (EN)',
      admin_save_btn: '💾 Save Curriculum',
      admin_cancel_edit: 'Cancel',
      admin_list_title: '📚 Curricula List',
      admin_saved_toast: 'Curriculum saved! Changes are immediately active.',
      admin_deleted_toast: 'Curriculum removed.',
      admin_json_copied: 'Updated JSON copied to clipboard!',
      admin_reset_toast: 'Restored default curricula list.',
      admin_btn_edit: '✏️ Edit',
      admin_btn_delete: '🗑️ Delete',
      admin_quick_toggles: 'Quick Solution Toggles:',
      admin_sol_ar_chip: 'Arabic Solution (AR)',
      admin_sol_en_chip: 'English Solution (EN)',

      foot: 'Deliberate practice for physics olympiads'
    },

    ar: {
      nav_home: 'الرئيسية',
      nav_files: 'مجموعات المسائل',
      nav_preview: 'تصفح المنهج',
      nav_about: 'من نحن',
      nav_contact: 'تواصل معنا',
      nav_cmd_k: 'بحث سريع',

      theme_dark: 'داكن',
      theme_light: 'فاتح',

      hero_eyebrow: 'مركز أولمبياد الفيزياء السعودي • منصة تدريبية تفاعلية',
      hero_title: 'حلّ مسائل أصعب. فكّر كفيزيائي.',
      hero_desc:
        'SPhOH منصة تدريب مفتوحة للطلاب والمهتمين بالفيزياء الذين يستعدون للأولمبيادات الوطنية والدولية (IPhO وAPhO وEuPhO والتصفيات الوطنية). تصفّح المناهج مباشرة داخل الموقع، وتتبّع تقدمك التدريبي، أو حمّلها بصيغة PDF.',
      hero_cta: 'تصفّح مجموعات المسائل',
      hero_secondary: 'تعرّف على المبادرة',

      sim_badge: '⚡ مختبر الفيزياء التفاعلي',
      sim_launch_btn: '▶ إطلاق المقذوف',
      sim_angle_lbl: 'الزاوية θ',
      sim_vel_lbl: 'السرعة v₀',
      sim_grav_lbl: 'الجاذبية g',
      sim_earth: 'الأرض (9.8)',
      sim_mars: 'المريخ (3.7)',
      sim_moon: 'القمر (1.6)',

      stat_sets: 'مجموعات مسائل متدرجة',
      stat_topics: 'أقسام في المكتبة',
      stat_bilingual: 'دعم كامل للعربية والإنجليزية',
      stat_free: 'وصول مفتوح ومجاني بالكامل',

      pillars_eyebrow: 'منهجية التدريب الحديثة',
      pillars_title: 'تدريب هادف يبني مهارتك خطوة بخطوة',
      p1_t: 'مستويات صعوبة متدرجة',
      p1_d: 'كل مجموعة مسائل مصنفة إلى: المستوى الأول، أو المستوى الثاني، أو تحدٍّ، لتتقدم systematically من التأسيس حتى مستوى الأولمبياد الدولي.',
      p2_t: 'تركيز عميق على الأولمبياد',
      p2_d: 'المواضيع وأساليب المسائل تحاكي ما يواجهه الطلاب في تصفيات اختيار المنتخب الوطني وفي التحضير لأولمبياد الفيزياء الدولي.',
      p3_t: 'تنضيد احترافي بلغة LaTeX وحلول نموذجية',
      p3_d: 'مسائل مجمَّعة ومنضّدة بعناية فائقة بلغة LaTeX، مع حلول تفصيلية خطوة بخطوة لتسهيل الدراسة الذاتية.',

      featured_eyebrow: 'مختارات من المكتبة',
      featured_title: 'ابدأ التدريب الآن',
      featured_all: 'عرض جميع مجموعات المسائل ←',

      about_eyebrow: 'من نحن',
      about_title: 'مبادرة طلابية لتمكين طلاب الأولمبياد',
      about_desc:
        'SPhOH مبادرة طلابية للتدريب على مسابقات الفيزياء المتقدمة. صُمّمت كل مجموعة على مبدأ التدريب الهادف: أن تعمل على مسائل أصعب قليلاً من مستواك الحالي لتبني حدساً فيزيائياً ومهارات تحليلية عميقة.',
      levels_guide_title: 'دليل مستويات الصعوبة في المنصة',
      lvl1_desc:
        'المفاهيم التأسيسية للأولمبياد، الأدوات الرياضية الأساسية، والاستعداد للمرحلة الأولى من المنافسات الوطنية.',
      lvl2_desc:
        'مسائل متوسطة متعددة الخطوات تتطلب حدساً فيزيائياً أعمق وتقنيات رياضية وتحليلية متقدمة.',
      lvl3_desc:
        'مسائل تحدٍّ بمستوى الأولمبيادات القارية والدولية (APhO / IPhO) مصممة لصقل مهارات الحل الإبداعي.',

      team_title: 'مؤسسو وفريق SPhOH',
      team_desc:
        'يكتب فريق SPhOH مجموعات المسائل في المنصة ويراجعها ويترجمها وينظمها، بهدف جعل التدريب الجاد في الفيزياء متاحاً باللغتين العربية والإنجليزية.',
      team_vision:
        'رؤيتنا: أن يملك كل طالب شغوف بالفيزياء حول العالم مادة التدريب التي تمكّنه من المنافسة على أعلى مستوى.',

      files_eyebrow: 'مكتبة الموارد التفاعلية',
      files_title: 'الملفات ومجموعات المسائل',
      files_desc:
        'تصفّح المناهج مباشرة داخل قارئ الموقع المدمج، وتتبّع مجموعاتك المكتملة والمفضلة، أو حمّل ملفات المسائل والحلول باللغتين العربية والإنجليزية.',
      translation_notice:
        'معظم مجموعات المسائل متوفرة باللغتين العربية والإنجليزية، وتُفتح الملفات وتُحمَّل تلقائياً باللغة المختارة في أعلى الصفحة متى توفرت بها.',

      progress_title: 'مؤشر إنجازك التدريبي',
      progress_stats: (done, total, pct) => `أنجزت ${done} من أصل ${total} مجموعات (${pct}%)`,
      status_all: 'الكل',
      status_saved: '★ المفضلة',
      status_completed: '✓ المكتملة',
      status_pending: '⏳ قيد الدراسة',

      sort_default: 'الترتيب: الافتراضي',
      sort_lvl_asc: 'المستوى: الأسهل أولاً',
      sort_lvl_desc: 'المستوى: الأصعب أولاً',
      sort_downloads: 'الأكثر تحميلاً',
      sort_title: 'أبجدياً',
      view_grid: '⊞ بطاقات',
      view_list: '☰ قائمة',

      bookmark_add: '☆ حفظ',
      bookmark_remove: '★ محفوظ',
      complete_add: '○ تحديد كمكتمل',
      complete_remove: '✓ مكتمل',
      toast_bookmarked: 'تمت إضافة المنهج إلى قائمة المفضلة ★',
      toast_unbookmarked: 'تمت إزالة المنهج من المفضلة',
      toast_completed: 'أحسنت! تم تسجيل المنهج كمكتمل 🎉',
      toast_uncompleted: 'تمت إعادة المنهج إلى قيد الدراسة',

      filter_all: 'جميع المواضيع',
      level_all: 'جميع المستويات',
      search_placeholder: 'ابحث في المسائل (أو اضغط ⌘K)...',

      faq_eyebrow: 'الأسئلة الشائعة',
      faq_title: 'أسئلة وأجوبة عن المنصة',

      empty: 'لا توجد مجموعات مسائل مطابقة لبحثك. جرّب تغيير الفلتر أو كلمة البحث.',
      btn_preview: '📖 تصفح المنهج',
      btn_download: '📥 تحميل PDF',
      pdf_toast: 'هذه المجموعة غير متوفرة بهذه اللغة بعد.',
      solution_preview: '📖 تصفح الحل',
      solution_download: '📥 تحميل الحل',
      solution_toast: 'لم يصدر ملف الحل لهذا المنهج بهذه اللغة حتى الآن.',

      preview_back: '→ العودة إلى مجموعات المسائل',
      preview_prev: '▶ السابق',
      preview_next: 'التالي ◀',
      preview_tab_problem: '📘 مجموعة المسائل',
      preview_tab_solution: '✅ الحلول النموذجية',
      preview_focus_enter: '⛶ وضع التركيز',
      preview_focus_exit: '✕ إنهاء وضع التركيز',
      open_new_tab: 'فتح PDF في تبويب جديد ↗',
      close_preview: 'إنهاء وضع التركيز',
      download_started: 'تم تسجيل التحميل وتحديث العداد بنجاح!',
      downloads_label: (n) => `↓ ${Number(n || 0).toLocaleString()} تحميل`,

      n_sets: (n) => {
        if (n === 1) return 'يُعرض حالياً مجموعة مسائل واحدة';
        if (n === 2) return 'يُعرض حالياً مجموعتا مسائل';
        return `يُعرض حالياً ${n} ${n <= 10 ? 'مجموعات مسائل' : 'مجموعة مسائل'}`;
      },

      cmd_placeholder: 'ابحث عن منهج، قسم فيزيائي، أو إجراء سريع...',
      cmd_empty: 'لا توجد نتائج مطابقة لبحثك.',
      cmd_group_curricula: 'المناهج ومجموعات المسائل',
      cmd_group_actions: 'أوامر التنقل والإجراءات السريعة',
      cmd_act_theme: 'تبديل المظهر (داكن / فاتح)',
      cmd_act_lang: 'تبديل لغة الواجهة (AR / EN)',
      cmd_act_files: 'الانتقال إلى مكتبة مجموعات المسائل',
      cmd_act_about: 'الانتقال إلى صفحة من نحن والفريق',
      cmd_act_contact: 'الانتقال إلى صفحة التواصل والمجتمع',
      cmd_hint_esc: 'ESC للإغلاق',

      contact_eyebrow: 'التواصل والمجتمع',
      contact_title: 'تواصل مع فريق SPhOH',
      contact_desc:
        'هل لاحظت خطأً مطبعياً أو علمياً في إحدى المسائل، أو تود اقتراح موضوع جديد، أو ترغب في الانضمام والمساهمة بكتابة المسائل؟ يسعدنا تواصلك معنا.',

      fb_title: 'لديك ملاحظات أو تصحيحات أو اقتراحات؟',
      fb_desc: 'ساعدنا في تحسين مجموعات المسائل وتطوير منصة SPhOH من خلال تعبئة نموذج الملاحظات السريع.',
      fb_btn: 'تعبئة نموذج الملاحظات ↗',

      telegram_title: 'انضم إلى قناة SPhOH على تيليجرام',
      telegram_desc: 'تابعنا للاطلاع الفوري على مجموعات المسائل الجديدة والحلول والإعلانات التدريبية.',
      telegram_btn: 'انضم إلى تيليجرام ↗',
      telegram_footer: 'قناة تيليجرام',

      email_title: 'تواصل معنا عبر البريد الإلكتروني',
      email_desc: 'للاستفسارات الأكاديمية، أو الإبلاغ عن أخطاء، أو المساهمة في إعداد المحتوى، راسل فريق SPhOH مباشرة.',
      email_copy: 'نسخ البريد',
      email_copied: 'تم نسخ البريد الإلكتروني: sphohc@gmail.com',

      admin_eyebrow: 'لوحة تحكم مبسطة',
      admin_title: 'إدارة المناهج والحلول',
      admin_desc: 'تحكم في المناهج الحالية وفعّل حلولها بضغطة واحدة، أو أضف منهجاً جديداً أو قسماً جديداً بكل سهولة.',
      admin_gate_title: 'تسجيل دخول المشرف (Admin)',
      admin_gate_desc: 'أدخل كلمة المرور للوصول إلى أدوات إدارة المناهج',
      admin_pass_placeholder: 'أدخل كلمة المرور...',
      admin_login_btn: 'دخول إلى لوحة التحكم',
      admin_wrong_pass: 'كلمة المرور غير صحيحة! حاول مرة أخرى.',
      admin_add_curriculum_btn: '➕ إضافة منهج جديد',
      admin_logout_btn: '🔒 قفل اللوحة',
      admin_export_json: '📥 تصدير ملف resources.json',
      admin_copy_json: '📋 نسخ JSON',
      admin_reset_default: '🔄 استعادة الافتراضي',
      admin_db_tools_summary: '⚙️ أدوات التصدير والنسخ الاحتياطي (resources.json)',
      admin_form_add_title: '➕ إضافة منهج جديد',
      admin_form_edit_title: '✏️ تعديل بيانات المنهج',
      admin_lbl_topic: 'القسم / الموضوع',
      admin_opt_new_topic: '➕ إنشاء قسم جديد...',
      admin_lbl_new_topic_ar: 'اسم القسم الجديد (بالعربية)',
      admin_lbl_new_topic_en: 'اسم القسم الجديد (بالإنجليزية)',
      admin_lbl_new_topic_key: 'رمز القسم (اختياري، مثل: modern)',
      admin_lbl_level: 'مستوى الصعوبة',
      admin_lbl_stem: 'الاسم الأساسي لملف PDF (أو اختر ملفاً للتعبئة التلقائية)',
      admin_lbl_pick_pdf: '📂 اختيار ملف PDF لتعبئة الاسم تلقائياً',
      admin_lbl_title_ar: 'اسم المنهج (بالعربية)',
      admin_lbl_title_en: 'اسم المنهج (بالإنجليزية)',
      admin_lbl_desc_ar: 'وصف مختصر للمنهج (بالعربية)',
      admin_lbl_desc_en: 'وصف مختصر للمنهج (بالإنجليزية)',
      admin_lbl_sol_mode: 'حالة الحل النموذجي',
      admin_sol_none: 'لم يصدر حل بعد',
      admin_sol_both: 'متوفر بالعربية والإنجليزية (AR + EN)',
      admin_sol_ar: 'متوفر بالعربية فقط (AR)',
      admin_sol_en: 'متوفر بالإنجليزية فقط (EN)',
      admin_save_btn: '💾 حفظ المنهج',
      admin_cancel_edit: 'إلغاء',
      admin_list_title: '📚 قائمة المناهج الحالية',
      admin_saved_toast: 'تم حفظ المنهج وتحديث الموقع فوراً!',
      admin_deleted_toast: 'تم حذف المنهج بنجاح.',
      admin_json_copied: 'تم نسخ بيانات JSON المحدثة!',
      admin_reset_toast: 'تمت استعادة البيانات الافتراضية.',
      admin_btn_edit: '✏️ تعديل',
      admin_btn_delete: '🗑️ حذف',
      admin_quick_toggles: 'تفعيل الحلول بضغطة واحدة:',
      admin_sol_ar_chip: 'الحل العربي (AR)',
      admin_sol_en_chip: 'الحل الإنجليزي (EN)',

      foot: 'تدريب هادف لأولمبيادات الفيزياء'
    }
  };
})(window);


/* === assets/js/core/dom.js === */
/**
 * @file assets/js/core/dom.js
 * @description دوال مساعدة للتعامل مع عناصر DOM، حماية النصوص من XSS، والنسخ إلى الحافظة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  /**
   * اختيار عنصر واحد من الصفحة
   * @param {string} selector
   * @param {ParentNode} [root=document]
   * @returns {Element|null}
   */
  function qs(selector, root = document) {
    return (root || document).querySelector(selector);
  }

  /**
   * اختيار مجموعة عناصر من الصفحة وإرجاعها كمصفوفة
   * @param {string} selector
   * @param {ParentNode} [root=document]
   * @returns {Element[]}
   */
  function qsa(selector, root = document) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  /**
   * تعقيم النصوص قبل إدراجها في HTML لمنع ثغرات XSS
   * @param {*} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * نسخ نص إلى الحافظة مع بديل متوافق لجميع المتصفحات
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // المتابعة للطريقة البديلة
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (_) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  }

  /**
   * تنزيل محتوى نصي كملف مباشرة من المتصفح
   * @param {string} filename
   * @param {string} content
   * @param {string} [mimeType='application/json;charset=utf-8']
   */
  function downloadTextFile(filename, content, mimeType = 'application/json;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  SPhOH.DOM = Object.freeze({
    qs,
    qsa,
    escapeHtml,
    copyToClipboard,
    downloadTextFile
  });
})(window);


/* === assets/js/core/storage.js === */
/**
 * @file assets/js/core/storage.js
 * @description غلاف آمن للتعامل مع localStorage و sessionStorage مع معالجة الأخطاء تلقائياً.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});

  function getString(key, fallback = null, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      const val = store.getItem(key);
      return val !== null ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setString(key, value, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      store.setItem(key, String(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function remove(key, useSession = false) {
    try {
      const store = useSession ? global.sessionStorage : global.localStorage;
      store.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function getJSON(key, fallback = null, useSession = false) {
    const raw = getString(key, null, useSession);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setJSON(key, value, useSession = false) {
    try {
      return setString(key, JSON.stringify(value), useSession);
    } catch (_) {
      return false;
    }
  }

  SPhOH.Storage = Object.freeze({
    getString,
    setString,
    remove,
    getJSON,
    setJSON
  });
})(window);


/* === assets/js/services/state.service.js === */
/**
 * @file assets/js/services/state.service.js
 * @description مخزن الحالة المركزي (Centralized State Store) لتوحيد حالة التطبيق عبر جميع الصفحات.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Catalog, Storage } = SPhOH;

  const savedLang = Storage.getString(Settings.STORAGE_KEYS.LANG, Settings.DEFAULT_LANG);
  const savedTheme = Storage.getString(Settings.STORAGE_KEYS.THEME, Settings.DEFAULT_THEME);
  const savedViewMode = Storage.getString(Settings.STORAGE_KEYS.VIEW_MODE, 'grid');
  const savedBookmarks = Storage.getJSON(Settings.STORAGE_KEYS.BOOKMARKS, []);
  const savedCompleted = Storage.getJSON(Settings.STORAGE_KEYS.COMPLETED, []);

  const state = {
    lang: savedLang === 'en' || savedLang === 'ar' ? savedLang : Settings.DEFAULT_LANG,
    theme: savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : Settings.DEFAULT_THEME,
    resources: Catalog.FALLBACK_RESOURCES.map((item) => ({ ...item })),
    topics: JSON.parse(JSON.stringify(Catalog.DEFAULT_TOPICS)),
    bookmarks: Array.isArray(savedBookmarks) ? savedBookmarks.map(Number) : [],
    completed: Array.isArray(savedCompleted) ? savedCompleted.map(Number) : [],
    filters: {
      topic: 'all',
      level: 'all',
      status: 'all', // all | bookmarked | completed | pending
      sortBy: 'default', // default | lvl_asc | lvl_desc | downloads | title
      viewMode: savedViewMode === 'list' ? 'list' : 'grid',
      query: ''
    },
    simulator: {
      angle: 53,
      velocity: 24,
      gravity: 9.8,
      isAnimating: false
    },
    commandPalette: {
      isOpen: false,
      query: ''
    },
    preview: {
      id: Settings.DEFAULT_PREVIEW_ID,
      type: 'problem',
      isFocusMode: false,
      zoom: 100
    },
    admin: {
      editingId: null,
      isFormOpen: false
    }
  };

  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    if (typeof updater === 'function') {
      updater(state);
    } else if (updater && typeof updater === 'object') {
      Object.assign(state, updater);
    }
    notify();
  }

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.add(listener);
    }
    return () => listeners.delete(listener);
  }

  function notify() {
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('[SPhOH Store Error]:', err);
      }
    });
  }

  SPhOH.Store = Object.freeze({
    getState,
    setState,
    subscribe,
    notify
  });
})(window);


/* === assets/js/services/i18n.service.js === */
/**
 * @file assets/js/services/i18n.service.js
 * @description خدمة إدارة اللغات والترجمة واتجاه الصفحة (RTL / LTR).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Locales, Storage, Store, DOM } = SPhOH;

  /**
   * جلب النص المترجم حسب المفتاح واللغة الحالية
   * @param {string} key
   * @param {string} [targetLang]
   * @returns {*}
   */
  function t(key, targetLang) {
    const lang = targetLang || Store.getState().lang;
    const dict = Locales[lang] || Locales[Settings.DEFAULT_LANG] || {};
    return dict[key] !== undefined ? dict[key] : key;
  }

  /**
   * الحصول على اللغة الحالية
   * @returns {'ar'|'en'}
   */
  function getLang() {
    return Store.getState().lang;
  }

  /**
   * تغيير اللغة وحفظها وتحديث الواجهة
   * @param {'ar'|'en'} nextLang
   */
  function setLang(nextLang) {
    const validLang = nextLang === 'en' ? 'en' : 'ar';
    Storage.setString(Settings.STORAGE_KEYS.LANG, validLang);
    Store.setState((s) => {
      s.lang = validLang;
    });
    applyDocumentLang();
  }

  /**
   * التبديل بين اللغتين العربية والإنجليزية
   */
  function toggleLang() {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
  }

  /**
   * تطبيق اللغة واتجاه الصفحة على جميع العناصر التي تحمل السمة [data-i18n]
   */
  function applyDocumentLang() {
    const lang = getLang();
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    DOM.qsa('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = t(key, lang);
      if (typeof value === 'string') {
        el.textContent = value;
      }
    });

    DOM.qsa('#langBtn [data-l]').forEach((span) => {
      span.classList.toggle('on', span.getAttribute('data-l') === lang);
    });
  }

  SPhOH.I18n = Object.freeze({
    t,
    getLang,
    setLang,
    toggleLang,
    applyDocumentLang
  });
})(window);


/* === assets/js/services/theme.service.js === */
/**
 * @file assets/js/services/theme.service.js
 * @description خدمة إدارة المظهر الموحد (فاتح / داكن / تلقائي حسب النظام).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, DOM } = SPhOH;

  function isDarkActive() {
    const { theme } = Store.getState();
    if (theme === 'auto') {
      return Boolean(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return theme === 'dark';
  }

  function applyTheme() {
    const { theme } = Store.getState();
    const root = document.documentElement;

    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    root.removeAttribute('data-palette');

    const dark = isDarkActive();
    const iconEl = DOM.qs('#themeIcon');
    const textEl = DOM.qs('#themeText');

    if (iconEl) iconEl.textContent = dark ? '🌙' : '☀️';
    if (textEl) textEl.textContent = dark ? I18n.t('theme_dark') : I18n.t('theme_light');
  }

  function toggleTheme() {
    const nextTheme = isDarkActive() ? 'light' : 'dark';
    Storage.setString(Settings.STORAGE_KEYS.THEME, nextTheme);
    Store.setState((s) => {
      s.theme = nextTheme;
    });
    applyTheme();
  }

  SPhOH.Theme = Object.freeze({
    isDarkActive,
    applyTheme,
    toggleTheme
  });
})(window);


/* === assets/js/services/download.service.js === */
/**
 * @file assets/js/services/download.service.js
 * @description خدمة تتبع عدد مرات تحميل ملفات PDF وتحديث الشارات التفاعلية.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, I18n, DOM } = SPhOH;

  const memoryCounts = {};

  function syncFromStorage() {
    const saved = Storage.getJSON(Settings.STORAGE_KEYS.DOWNLOAD_COUNTS, {});
    if (saved && typeof saved === 'object') {
      Object.keys(saved).forEach((key) => {
        memoryCounts[key] = Math.max(Number(memoryCounts[key] || 0), Number(saved[key] || 0));
      });
    }
    return memoryCounts;
  }

  function getCount(fileKey) {
    if (!fileKey) return 0;
    const all = syncFromStorage();
    return Number(all[fileKey] || 0);
  }

  function getAllCounts() {
    return syncFromStorage();
  }

  function recordDownload(fileKey) {
    if (!fileKey) return 0;
    const counts = syncFromStorage();
    counts[fileKey] = Number(counts[fileKey] || 0) + 1;
    memoryCounts[fileKey] = counts[fileKey];

    Storage.setJSON(Settings.STORAGE_KEYS.DOWNLOAD_COUNTS, memoryCounts);

    const labelFn = I18n.t('downloads_label');
    DOM.qsa('[data-count-for]').forEach((badge) => {
      if (badge.getAttribute('data-count-for') === fileKey) {
        badge.textContent = typeof labelFn === 'function' ? labelFn(memoryCounts[fileKey]) : `↓ ${memoryCounts[fileKey]}`;
        badge.classList.remove('is-bumped');
        void badge.offsetWidth;
        badge.classList.add('is-bumped');
        setTimeout(() => badge.classList.remove('is-bumped'), 600);
      }
    });

    return memoryCounts[fileKey];
  }

  syncFromStorage();

  SPhOH.Downloads = Object.freeze({
    getCount,
    getAllCounts,
    recordDownload
  });
})(window);


/* === assets/js/services/curriculum.service.js === */
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


/* === assets/js/components/toast.component.js === */
/**
 * @file assets/js/components/toast.component.js
 * @description مكوّن الإشعارات المنبثقة (Toast Notifications).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { DOM } = SPhOH;

  let hideTimer = null;

  /**
   * إظهار رسالة إشعار مؤقتة أسفل الشاشة
   * @param {string} message
   * @param {number} [duration=3200]
   */
  function show(message, duration = 3200) {
    let toastEl = DOM.qs('#toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;
    toastEl.hidden = false;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, duration);
  }

  SPhOH.Toast = Object.freeze({
    show
  });
})(window);


/* === assets/js/services/progress.service.js === */
/**
 * @file assets/js/services/progress.service.js
 * @description خدمة تتبع تقدم الطالب، المفضلة (Bookmarks)، والمجموعات المكتملة (Completed Sets).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, Toast } = SPhOH;

  function isBookmarked(id) {
    return Store.getState().bookmarks.includes(Number(id));
  }

  function isCompleted(id) {
    return Store.getState().completed.includes(Number(id));
  }

  function toggleBookmark(id) {
    const numId = Number(id);
    let added = false;

    Store.setState((s) => {
      const idx = s.bookmarks.indexOf(numId);
      if (idx === -1) {
        s.bookmarks.push(numId);
        added = true;
      } else {
        s.bookmarks.splice(idx, 1);
        added = false;
      }
      Storage.setJSON(Settings.STORAGE_KEYS.BOOKMARKS, s.bookmarks);
    });

    if (Toast) {
      Toast.show(I18n.t(added ? 'toast_bookmarked' : 'toast_unbookmarked'));
    }
    return added;
  }

  function toggleCompleted(id) {
    const numId = Number(id);
    let completedNow = false;

    Store.setState((s) => {
      const idx = s.completed.indexOf(numId);
      if (idx === -1) {
        s.completed.push(numId);
        completedNow = true;
      } else {
        s.completed.splice(idx, 1);
        completedNow = false;
      }
      Storage.setJSON(Settings.STORAGE_KEYS.COMPLETED, s.completed);
    });

    if (Toast) {
      Toast.show(I18n.t(completedNow ? 'toast_completed' : 'toast_uncompleted'));
    }
    return completedNow;
  }

  function getProgressSummary() {
    const { resources, completed, bookmarks } = Store.getState();
    const total = resources.length || 1;
    const validIds = new Set(resources.map((r) => Number(r.id)));
    const doneCount = completed.filter((id) => validIds.has(Number(id))).length;
    const savedCount = bookmarks.filter((id) => validIds.has(Number(id))).length;
    const percentage = Math.min(100, Math.round((doneCount / total) * 100));

    return {
      doneCount,
      savedCount,
      total: resources.length,
      percentage
    };
  }

  SPhOH.Progress = Object.freeze({
    isBookmarked,
    isCompleted,
    toggleBookmark,
    toggleCompleted,
    getProgressSummary
  });
})(window);


/* === assets/js/services/effects.service.js === */
/**
 * @file assets/js/services/effects.service.js
 * @description محرك التأثيرات البصرية والأنميشنز المتقدمة ونافذة البحث السريع (Command Palette ⌘K).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Store, I18n, Theme, CurriculumService, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let revealObserver = null;

  function initSpotlightCards() {
    if (document.body.dataset.spotlightBound) return;
    document.body.dataset.spotlightBound = 'true';

    document.addEventListener(
      'pointermove',
      (e) => {
        const cards = DOM.qsa('.card, .pillar-card, .stat-card, .feedback-card, .team, .sketch');
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      },
      { passive: true }
    );
  }

  function observeRevealElements() {
    const targets = DOM.qsa('.card, .pillar-card, .stat-card, .feedback-card, .faq-item, .pillar, .admin-item');

    if (!('IntersectionObserver' in global)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
      );
    }

    targets.forEach((el, idx) => {
      if (!el.classList.contains('is-revealed')) {
        el.style.setProperty('--stagger-idx', String(idx % 6));
        el.classList.add('reveal-item');
        revealObserver.observe(el);
      }
    });
  }

  function initScrollTracker() {
    if (document.body.dataset.scrollBound) return;
    document.body.dataset.scrollBound = 'true';

    const updateScrollUI = () => {
      const scrollTop = global.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

      const bar = DOM.qs('#scrollProgressBar');
      if (bar) bar.style.width = `${pct}%`;

      const topBtn = DOM.qs('#backToTopBtn');
      if (topBtn) {
        topBtn.classList.toggle('is-visible', scrollTop > 320);
      }
    };

    global.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();
  }

  function toggleCommandPalette(forceOpen) {
    const modal = DOM.qs('#cmdPaletteBackdrop');
    if (!modal) return;

    const nextState = typeof forceOpen === 'boolean' ? forceOpen : modal.hidden;
    Store.setState((s) => {
      s.commandPalette.isOpen = nextState;
      if (!nextState) s.commandPalette.query = '';
    });

    modal.hidden = !nextState;
    if (nextState) {
      const input = DOM.qs('#cmdPaletteInput');
      if (input) {
        input.value = '';
        input.placeholder = I18n.t('cmd_placeholder');
        setTimeout(() => input.focus(), 30);
      }
      renderCommandResults('');
    }
  }

  function renderCommandResults(rawQuery = '') {
    const listEl = DOM.qs('#cmdPaletteResults');
    if (!listEl) return;

    const { resources, topics, lang } = Store.getState();
    const q = rawQuery.trim().toLowerCase();

    const matchedResources = resources.filter((item) => {
      if (!q) return true;
      const hay = `${item.title?.ar || ''} ${item.title?.en || ''} ${item.desc?.ar || ''} ${item.desc?.en || ''} ${item.file || ''}`.toLowerCase();
      return hay.includes(q);
    });

    const quickActions = [
      { id: 'act-files', icon: '📚', label: I18n.t('cmd_act_files'), action: 'nav:files' },
      { id: 'act-theme', icon: '🌓', label: I18n.t('cmd_act_theme'), action: 'toggle:theme' },
      { id: 'act-lang', icon: '🌐', label: I18n.t('cmd_act_lang'), action: 'toggle:lang' },
      { id: 'act-about', icon: '👥', label: I18n.t('cmd_act_about'), action: 'nav:about' },
      { id: 'act-contact', icon: '✉️', label: I18n.t('cmd_act_contact'), action: 'nav:contact' }
    ].filter((act) => !q || act.label.toLowerCase().includes(q));

    if (matchedResources.length === 0 && quickActions.length === 0) {
      listEl.innerHTML = `<div class="cmd-empty">${escapeHtml(I18n.t('cmd_empty'))}</div>`;
      return;
    }

    let html = '';

    if (matchedResources.length > 0) {
      html += `<div class="cmd-group-title">${escapeHtml(I18n.t('cmd_group_curricula'))}</div>`;
      html += matchedResources
        .slice(0, 8)
        .map((item) => {
          const title = item.title?.[lang] || item.file;
          const topicLabel = topics[item.t]?.[lang] || item.t;
          const desc = CurriculumService.getDisplayDescription(item, lang);
          const hasSol = Boolean(CurriculumService.getSolutionPdfPath(item, lang));
          return `
            <div class="cmd-item-row">
              <a href="preview.html?id=${encodeURIComponent(item.id)}&type=problem"
                 class="cmd-item-main"
                 data-open-preview="${escapeHtml(item.id)}"
                 data-preview-type="problem"
                 data-cmd-close="true">
                <span class="cmd-item-icon">📘</span>
                <span class="cmd-item-text">
                  <strong>${escapeHtml(title)} <small style="color:var(--accent)">(${escapeHtml(topicLabel)} • L${escapeHtml(item.l)})</small></strong>
                  <small>${escapeHtml(desc)}</small>
                </span>
              </a>
              ${
                hasSol
                  ? `<a href="preview.html?id=${encodeURIComponent(item.id)}&type=solution"
                        class="btn btn-ghost btn-sm cmd-sol-pill"
                        data-open-preview="${escapeHtml(item.id)}"
                        data-preview-type="solution"
                        data-cmd-close="true">✅ ${lang === 'ar' ? 'الحل' : 'Solution'}</a>`
                  : ''
              }
            </div>
          `;
        })
        .join('');
    }

    if (quickActions.length > 0) {
      html += `<div class="cmd-group-title">${escapeHtml(I18n.t('cmd_group_actions'))}</div>`;
      html += quickActions
        .map(
          (act) => `
            <button type="button" class="cmd-action-btn" data-cmd-action="${escapeHtml(act.action)}">
              <span class="cmd-item-icon">${act.icon}</span>
              <span>${escapeHtml(act.label)}</span>
            </button>
          `
        )
        .join('');
    }

    listEl.innerHTML = html;
  }

  function handleCommandAction(actionCode) {
    toggleCommandPalette(false);
    if (actionCode === 'toggle:theme') {
      Theme.toggleTheme();
      return;
    }
    if (actionCode === 'toggle:lang') {
      I18n.toggleLang();
      SPhOH.App?.refreshAllViews();
      return;
    }
    if (actionCode.startsWith('nav:')) {
      const targetPage = actionCode.split(':')[1];
      if (global.__SPHOH_CANVAS_MODE__ && SPhOH.App?.switchCanvasView) {
        SPhOH.App.switchCanvasView(targetPage);
      } else {
        const map = { home: 'index.html', files: 'files.html', about: 'about.html', contact: 'contact.html' };
        global.location.href = map[targetPage] || 'index.html';
      }
    }
  }

  function init() {
    initSpotlightCards();
    initScrollTracker();
    observeRevealElements();
  }

  SPhOH.Effects = Object.freeze({
    init,
    observeRevealElements,
    toggleCommandPalette,
    renderCommandResults,
    handleCommandAction
  });
})(window);


/* === assets/js/components/layout.component.js === */
/**
 * @file assets/js/components/layout.component.js
 * @description مكوّن الهيكل المشترك:
 * - الهيدر الكبسولي المعماري العائم (Floating Capsule Navbar) مع زر البحث الشامل (Command Palette ⌘K)
 * - خلفية معمارية أكاديمية متزنة (Subtle Ambient Mesh)
 * - شريط تقدم القراءة العلوي وزر الصعود للأعلى
 * - نافذة البحث والأوامر السريعة (Command Palette Modal)
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, DOM } = SPhOH;

  const LOGO_SVG = `
    <svg class="logo-atom-svg" width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <ellipse class="atom-orbit orbit-1" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2"/>
      <ellipse class="atom-orbit orbit-2" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2" transform="rotate(60 16 16)"/>
      <ellipse class="atom-orbit orbit-3" cx="16" cy="16" rx="13" ry="5.5" stroke="currentColor" stroke-width="2" transform="rotate(120 16 16)"/>
      <circle class="atom-core" cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  `;

  const TELEGRAM_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.7 3.4a1.5 1.5 0 0 0-1.6-.2L2.5 10.1c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.3c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.2-2.2 4.6 3.4c.9.5 1.5.2 1.7-.8l3-14.2c.3-1.1-.2-1.6-.9-1.4ZM8 12.7l9.8-6.2c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.1L8 12.7Z"/>
    </svg>
  `;

  function detectActivePage() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage) return bodyPage;

    const path = (global.location.pathname || '').split('/').pop().toLowerCase();
    if (path.includes('files')) return 'files';
    if (path.includes('preview')) return 'files';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('admin')) return 'admin';
    return 'home';
  }

  function renderNavbar(activePage) {
    const navItems = [
      { page: 'home', href: 'index.html', i18n: 'nav_home' },
      { page: 'files', href: 'files.html', i18n: 'nav_files' },
      { page: 'about', href: 'about.html', i18n: 'nav_about' },
      { page: 'contact', href: 'contact.html', i18n: 'nav_contact' }
    ];

    const linksHtml = navItems
      .map(
        (item) =>
          `<a href="${item.href}" class="${activePage === item.page ? 'active' : ''}" data-nav-page="${item.page}" data-i18n="${item.i18n}"></a>`
      )
      .join('');

    return `
      <div class="scroll-progress-track" aria-hidden="true">
        <div class="scroll-progress-bar" id="scrollProgressBar"></div>
      </div>
      <div class="wrap nav-row">
        <a class="logo" href="index.html" data-nav-page="home" aria-label="SPhOH">
          <span class="logo-mark-box">${LOGO_SVG}</span>
          <span class="logo-text">SPhOH</span>
          <span class="logo-badge">OLYMPIAD</span>
        </a>

        <nav class="links" aria-label="Main Navigation">
          ${linksHtml}
        </nav>

        <div class="nav-controls">
          <button class="cmd-trigger-btn" id="cmdPaletteBtn" type="button" aria-label="Quick Search (Ctrl+K)">
            <span>🔍</span>
            <span class="cmd-trigger-label" data-i18n="nav_cmd_k"></span>
            <kbd class="cmd-kbd">⌘K</kbd>
          </button>

          <button class="theme-btn" id="themeBtn" type="button" aria-label="Toggle Theme">
            <span id="themeIcon">🌙</span>
            <span id="themeText">داكن</span>
          </button>

          <button class="lang" id="langBtn" type="button" aria-label="Switch language / تبديل اللغة">
            <span data-l="ar">AR</span>
            <span data-l="en">EN</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const displayYear = year >= 2026 ? year : 2026;
    return `
      <div class="wrap">
        <div class="footer-brand-cluster">
          <span class="footer-copy">© ${displayYear} SPhOH</span>
          <span class="footer-dot">•</span>
          <span class="footer-tag" data-i18n="foot"></span>
        </div>

        <div class="footer-right">
          <a class="telegram-link"
             href="${Settings.LINKS.TELEGRAM}"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Join the SPhOH Telegram channel">
            ${TELEGRAM_SVG}
            <span data-i18n="telegram_footer"></span>
          </a>
        </div>
      </div>
    `;
  }

  function renderCommandPaletteModal() {
    return `
      <div class="cmd-backdrop" id="cmdPaletteBackdrop" hidden>
        <div class="cmd-dialog" role="dialog" aria-modal="true" aria-label="Command Palette">
          <div class="cmd-header">
            <span class="cmd-search-icon" aria-hidden="true">🔍</span>
            <input type="search"
                   id="cmdPaletteInput"
                   class="cmd-input"
                   autocomplete="off"
                   placeholder="Search curricula, topics, or actions...">
            <button type="button" class="cmd-esc-btn" id="cmdPaletteCloseBtn" data-i18n="cmd_hint_esc">ESC</button>
          </div>
          <div class="cmd-results" id="cmdPaletteResults"></div>
        </div>
      </div>
    `;
  }

  function mount() {
    const activePage = detectActivePage();

    if (!DOM.qs('.aurora-bg')) {
      const aurora = document.createElement('div');
      aurora.className = 'aurora-bg';
      aurora.setAttribute('aria-hidden', 'true');
      aurora.innerHTML = `
        <div class="aurora-orb orb-1"></div>
        <div class="aurora-orb orb-2"></div>
        <div class="aurora-orb orb-3"></div>
        <div class="aurora-grid-overlay"></div>
      `;
      document.body.prepend(aurora);
    }

    const headerEl = DOM.qs('header.nav');
    if (headerEl) {
      headerEl.innerHTML = renderNavbar(activePage);
    }

    const footerEl = DOM.qs('footer.foot');
    if (footerEl) {
      footerEl.innerHTML = renderFooter();
    }

    if (!DOM.qs('#cmdPaletteBackdrop')) {
      const wrap = document.createElement('div');
      wrap.innerHTML = renderCommandPaletteModal();
      document.body.appendChild(wrap.firstElementChild);
    }

    if (!DOM.qs('#backToTopBtn')) {
      const topBtn = document.createElement('button');
      topBtn.id = 'backToTopBtn';
      topBtn.type = 'button';
      topBtn.className = 'back-to-top-fab';
      topBtn.setAttribute('aria-label', 'Back to top');
      topBtn.textContent = '↑';
      document.body.appendChild(topBtn);
    }

    if (!DOM.qs('#toast')) {
      const toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.hidden = true;
      document.body.appendChild(toastEl);
    }
  }

  SPhOH.Layout = Object.freeze({
    mount,
    renderNavbar,
    renderFooter
  });
})(window);


/* === assets/js/components/card.component.js === */
/**
 * @file assets/js/components/card.component.js
 * @description مكوّن بناء بطاقة المنهج المعمارية ثنائية الطبقة (Two-Tone Architectural Bento Card)
 * مع شريط تخصص علوي ملون، رقم تسلسلي أكاديمي، وصف كامل دائماً، ودرج إجراءات سفلي.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Catalog, Store, I18n, CurriculumService, Progress, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  const TOPIC_ICONS = {
    kin: '🚀',
    mech: '⚙️',
    math: '📐',
    coll: '🏆',
    elec: '⚡',
    therm: '🔥',
    opt: '🔭'
  };

  function renderTags(resource) {
    const { lang, topics } = Store.getState();
    const level = Number(resource.l || 1);

    let pipsHtml = '';
    for (let i = 1; i <= 3; i += 1) {
      pipsHtml += `<b${i <= level ? ' class="on"' : ''}></b>`;
    }

    const icon = TOPIC_ICONS[resource.t] || '⚛️';
    const topicLabel = topics[resource.t]?.[lang] || resource.t;
    const levelLabel = Catalog.LEVELS[level]?.[lang] || `L${level}`;

    return `
      <span class="tag" data-topic="${escapeHtml(resource.t)}">
        <span class="tag-icon" aria-hidden="true">${icon}</span>
        ${escapeHtml(topicLabel)}
      </span>
      <span class="tag lvl" data-lvl="${escapeHtml(level)}">
        <span class="pips">${pipsHtml}</span>${escapeHtml(levelLabel)}
      </span>
    `;
  }

  function renderCard(resource, counts = {}) {
    const lang = I18n.getLang();
    const pdfPath = CurriculumService.getProblemPdfPath(resource, lang);
    const solutionPath = CurriculumService.getSolutionPdfPath(resource, lang);

    const title = resource.title?.[lang] || resource.title?.en || resource.file || '';
    const desc = CurriculumService.getDisplayDescription(resource, lang);

    const probCount = pdfPath ? Number(counts[pdfPath] || 0) : 0;
    const solCount = solutionPath ? Number(counts[solutionPath] || 0) : 0;

    const saved = Progress ? Progress.isBookmarked(resource.id) : false;
    const done = Progress ? Progress.isCompleted(resource.id) : false;

    const serialCode = `SET #${String(resource.id || 1).padStart(2, '0')}`;

    const previewProblemHref = `preview.html?id=${encodeURIComponent(resource.id)}&type=problem`;
    const previewSolHref = `preview.html?id=${encodeURIComponent(resource.id)}&type=solution`;
    const formatDownloads = I18n.t('downloads_label');

    const problemActionsHtml = pdfPath
      ? `
        <a href="${escapeHtml(previewProblemHref)}"
           class="btn btn-primary btn-sm"
           data-open-preview="${escapeHtml(resource.id)}"
           data-preview-type="problem">${escapeHtml(I18n.t('btn_preview'))}</a>
        <a href="${escapeHtml(pdfPath)}"
           download
           class="btn btn-ghost btn-sm"
           data-download-key="${escapeHtml(pdfPath)}">${escapeHtml(I18n.t('btn_download'))}</a>
        <span class="download-count" data-count-for="${escapeHtml(pdfPath)}">${escapeHtml(formatDownloads(probCount))}</span>
      `
      : `
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable" data-missing-file="problem">${escapeHtml(I18n.t('btn_preview'))}</button>
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable" data-missing-file="problem">${escapeHtml(I18n.t('btn_download'))}</button>
      `;

    const solutionActionsHtml = solutionPath
      ? `
        <a href="${escapeHtml(previewSolHref)}"
           class="btn btn-primary btn-sm solution-action"
           data-open-preview="${escapeHtml(resource.id)}"
           data-preview-type="solution">${escapeHtml(I18n.t('solution_preview'))}</a>
        <a href="${escapeHtml(solutionPath)}"
           download
           class="btn btn-ghost btn-sm solution-action"
           data-download-key="${escapeHtml(solutionPath)}">${escapeHtml(I18n.t('solution_download'))}</a>
        <span class="download-count" data-count-for="${escapeHtml(solutionPath)}">${escapeHtml(formatDownloads(solCount))}</span>
      `
      : `
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action" data-missing-file="solution">${escapeHtml(I18n.t('solution_preview'))}</button>
        <button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action" data-missing-file="solution">${escapeHtml(I18n.t('solution_download'))}</button>
      `;

    return `
      <article class="card ${done ? 'is-completed-card' : ''} ${saved ? 'is-bookmarked-card' : ''}" data-card-topic="${escapeHtml(resource.t || 'kin')}">
        <div class="card-accent-bar" aria-hidden="true"></div>
        <div class="card-body-main">
          <div class="card-top-row">
            <div class="tags">${renderTags(resource)}</div>
            <div class="card-quick-toggles">
              <span class="card-serial-code">${escapeHtml(serialCode)}</span>
              <button type="button"
                      class="card-status-btn ${saved ? 'is-active-bookmark' : ''}"
                      data-toggle-bookmark="${escapeHtml(resource.id)}"
                      title="${escapeHtml(I18n.t(saved ? 'bookmark_remove' : 'bookmark_add'))}"
                      aria-label="${escapeHtml(I18n.t(saved ? 'bookmark_remove' : 'bookmark_add'))}">
                ${saved ? '★' : '☆'}
              </button>
              <button type="button"
                      class="card-status-btn ${done ? 'is-active-done' : ''}"
                      data-toggle-complete="${escapeHtml(resource.id)}"
                      title="${escapeHtml(I18n.t(done ? 'complete_remove' : 'complete_add'))}"
                      aria-label="${escapeHtml(I18n.t(done ? 'complete_remove' : 'complete_add'))}">
                ${done ? '✓' : '○'}
              </button>
            </div>
          </div>
          <h3 class="h3 card-title-heading mt-xs">${escapeHtml(title)}</h3>
          <p class="card-desc-text mt-xs">${escapeHtml(desc)}</p>
        </div>
        <div class="card-actions-group">
          <div class="action-row">${problemActionsHtml}</div>
          <div class="action-row">${solutionActionsHtml}</div>
        </div>
      </article>
    `;
  }

  SPhOH.CardComponent = Object.freeze({
    renderTags,
    renderCard
  });
})(window);


/* === assets/js/pages/home.page.js === */
/**
 * @file assets/js/pages/home.page.js
 * @description وحدة الصفحة الرئيسية:
 * - مختبر الفيزياء التفاعلي الحي لحركة المقذوفات (Interactive Live Projectile Simulator)
 * - مسار التعلم التفاعلي الموجه (3-Stage Guided Olympiad Roadmap)
 * - شريط المعادلات الفيزيائية المتحرك، الإحصائيات، المختارات، والأسئلة الشائعة
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Catalog, Store, I18n, Downloads, CardComponent, Effects, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let simAnimFrame = null;

  function getTrajectoryGeometry(angle, velocity, gravity) {
  const rad = (angle * Math.PI) / 180;

  const range = (velocity ** 2 * Math.sin(2 * rad)) / gravity;
  const height = (velocity ** 2 * Math.sin(rad) ** 2) / (2 * gravity);

  const startX = 28;
  const groundY = 232;

  const availableWidth = 384;
  const availableHeight = 190;

  // Use the same scale for both axes to preserve physical proportions.
  const scale = Math.min(
    availableWidth / range,
    availableHeight / height
  );

  const endX = startX + range * scale;
  const peakX = (startX + endX) / 2;
  const peakY = groundY - height * scale;
  const controlY = groundY - 2 * height * scale;

  return {
    range,
    height,
    flightTime: (2 * velocity * Math.sin(rad)) / gravity,
    startX,
    endX,
    groundY,
    peakX,
    peakY,
    controlY
  };
}

  function updateSimulatorView() {
    const sketchBox = DOM.qs('.sketch');
    if (!sketchBox) return;

    let controlsWrap = DOM.qs('#simControlsPanel', sketchBox);
    if (!controlsWrap) {
      controlsWrap = document.createElement('div');
      controlsWrap.id = 'simControlsPanel';
      controlsWrap.className = 'sim-controls-panel';
      sketchBox.appendChild(controlsWrap);
    }

    const { angle, velocity, gravity } = Store.getState().simulator;
const trajectory = getTrajectoryGeometry(angle, velocity, gravity);

const {
  range: realRange,
  height: realHeight,
  flightTime
} = trajectory;

const {
  startX,
  endX,
  groundY,
  peakX,
  controlY
} = trajectory;

const dPath = `M${startX} ${groundY} Q${peakX} ${controlY} ${endX} ${groundY}`;
const svg = DOM.qs('svg', sketchBox);

if (svg && !DOM.qs('#simAxes', svg)) {
  const axes = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );

  axes.setAttribute('id', 'simAxes');
  axes.setAttribute('fill', 'none');
  axes.setAttribute('stroke', 'currentColor');
  axes.setAttribute('stroke-width', '1.5');
  axes.setAttribute('opacity', '0.65');

  axes.innerHTML = `
    <!-- X axis -->
    <line x1="28" y1="232" x2="420" y2="232" />

    <!-- Y axis -->
    <line x1="28" y1="232" x2="28" y2="30" />

    <!-- X-axis label -->
    <text x="420" y="250"
      fill="currentColor"
      stroke="none"
      text-anchor="end"
      font-size="11">x (m)</text>

    <!-- Y-axis label -->
    <text x="15" y="30"
      fill="currentColor"
      stroke="none"
      text-anchor="middle"
      font-size="11">y (m)</text>

    <!-- Origin -->
    <text x="20" y="247"
      fill="currentColor"
      stroke="none"
      font-size="10">0</text>
  `;

  svg.insertBefore(axes, svg.firstChild);
}

const mainPath = DOM.qs('#simTrajectoryPath', sketchBox);
const glowPath = DOM.qs('#simTrajectoryGlow', sketchBox);

if (mainPath) mainPath.setAttribute('d', dPath);
if (glowPath) glowPath.setAttribute('d', dPath);
    
    const capEl = DOM.qs('.cap', sketchBox);
    if (capEl) {
      capEl.innerHTML = `
        <span class="sim-metric-pill"><b>R</b> = ${realRange.toFixed(1)} m</span>
        <span class="sim-metric-pill"><b>H</b> = ${realHeight.toFixed(1)} m</span>
        <span class="sim-metric-pill"><b>T</b> = ${flightTime.toFixed(2)} s</span>
      `;
    }

    controlsWrap.innerHTML = `
      <div class="sim-controls-header">
        <span class="sim-lab-badge">${escapeHtml(I18n.t('sim_badge'))}</span>
        <button type="button" class="btn btn-primary btn-sm sim-launch-btn" id="simLaunchBtn">
          ${escapeHtml(I18n.t('sim_launch_btn'))}
        </button>
      </div>
      <div class="sim-sliders-grid">
        <label class="sim-slider-field">
          <span>${escapeHtml(I18n.t('sim_angle_lbl'))}: <strong id="simAngleVal">${angle}°</strong></span>
          <input type="range" id="simAngleInput" min="15" max="75" step="1" value="${angle}">
        </label>
        <label class="sim-slider-field">
          <span>${escapeHtml(I18n.t('sim_vel_lbl'))}: <strong id="simVelVal">${velocity} m/s</strong></span>
          <input type="range" id="simVelInput" min="12" max="32" step="1" value="${velocity}">
        </label>
        <label class="sim-slider-field">
          <span>${escapeHtml(I18n.t('sim_grav_lbl'))}</span>
          <select id="simGravSelect" class="sim-grav-select">
            <option value="9.8" ${gravity === 9.8 ? 'selected' : ''}>${escapeHtml(I18n.t('sim_earth'))}</option>
            <option value="3.7" ${gravity === 3.7 ? 'selected' : ''}>${escapeHtml(I18n.t('sim_mars'))}</option>
            <option value="1.6" ${gravity === 1.6 ? 'selected' : ''}>${escapeHtml(I18n.t('sim_moon'))}</option>
          </select>
        </label>
      </div>
    `;
  }

  function launchProjectileAnimation() {
    const svg = DOM.qs('.sketch svg');
    if (!svg) return;

    cancelAnimationFrame(simAnimFrame);

    let particle = DOM.qs('#simLiveParticle', svg);
    if (!particle) {
      particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      particle.setAttribute('id', 'simLiveParticle');
      particle.setAttribute('r', '5.5');
      particle.setAttribute('fill', 'var(--accent)');
      particle.setAttribute('stroke', 'var(--bg)');
      particle.setAttribute('stroke-width', '2');
      svg.appendChild(particle);
    }

const { angle, velocity, gravity } = Store.getState().simulator;

const trajectory = getTrajectoryGeometry(angle, velocity, gravity);

const {
  startX,
  endX,
  groundY,
  peakX,
  controlY
} = trajectory;
    const startTime = performance.now();
    const duration = trajectory.flightTime * 1000;
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const oneMinusT = 1 - t;
      const cx = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * peakX + t * t * endX;
      const cy = oneMinusT * oneMinusT * groundY + 2 * oneMinusT * t * controlY + t * t * groundY;

      particle.setAttribute('cx', cx.toFixed(1));
      particle.setAttribute('cy', cy.toFixed(1));

      if (t < 1) {
        simAnimFrame = requestAnimationFrame(step);
      }
    }

    simAnimFrame = requestAnimationFrame(step);
  }

  function renderPhysicsMarquee() {
    const heroSection = DOM.qs('#home');
    if (!heroSection || DOM.qs('#physicsMarqueeRibbon')) return;

    const marquee = document.createElement('div');
    marquee.id = 'physicsMarqueeRibbon';
    marquee.className = 'physics-marquee';
    marquee.setAttribute('aria-hidden', 'true');

    const items = [
      '⚛️ IPhO • International Physics Olympiad',
      '📐 F = dp / dt',
      '🚀 R = v₀² sin(2θ) / g',
      '⚡ ∇ × E = −∂B / ∂t',
      '🌊 P + ½ρv² + ρgh = const',
      '🏆 APhO • Asian Physics Olympiad',
      '🔬 L = T − V',
      '🧲 ∮ B · dl = μ₀ (I + ε₀ dΦ_E/dt)',
      '🌟 EuPhO & NSMO Selections'
    ];

    const repeated = [...items, ...items]
      .map((txt) => `<span class="marquee-item">${escapeHtml(txt)}</span>`)
      .join('');

    marquee.innerHTML = `<div class="marquee-track">${repeated}</div>`;
    heroSection.insertAdjacentElement('afterend', marquee);
  }

  /**
   * مسار التعلم التفاعلي (Guided Study Roadmap) المستوحى من المنصات الأكاديمية العالمية
   */
  function renderStudyRoadmap() {
    const pillarsCards = DOM.qs('.pillars-cards');
    if (!pillarsCards) return;

    let roadmapEl = DOM.qs('#studyRoadmapStrip');
    if (!roadmapEl) {
      roadmapEl = document.createElement('div');
      roadmapEl.id = 'studyRoadmapStrip';
      roadmapEl.className = 'roadmap-strip';
      pillarsCards.insertAdjacentElement('afterend', roadmapEl);
    }

    const { lang } = Store.getState();
    const isAr = lang === 'ar';

    roadmapEl.innerHTML = `
      <div class="roadmap-head">
        <div>
          <div class="eyebrow">${isAr ? 'خريطة الطريق المقترحة' : 'Guided Learning Path'}</div>
          <h3 class="h3 mt-xs">${isAr ? 'من أين تبدأ تدريبك في SPhOH؟' : 'Where to start your SPhOH training?'}</h3>
        </div>
      </div>
      <div class="roadmap-steps">
        <a href="preview.html?id=4&type=problem" class="roadmap-step-card" data-open-preview="4" data-preview-type="problem">
          <div class="roadmap-step-top">
            <span class="roadmap-step-num">${isAr ? 'الخطوة 01 • التأسيس' : 'Step 01 • Foundation'}</span>
            <span>→</span>
          </div>
          <strong>${isAr ? 'تحويل الوحدات وحساب المثلثات والكينماتيكا I' : 'Units, Trigonometry I & Kinematics I'}</strong>
          <span>${isAr ? 'إتقان الأدوات الرياضية الأساسية وحركة المقذوفات (المستوى الأول).' : 'Master dimensional analysis, vectors, and 1D/2D motion (Level I).'}</span>
        </a>

        <a href="preview.html?id=9&type=problem" class="roadmap-step-card" data-open-preview="9" data-preview-type="problem">
          <div class="roadmap-step-top">
            <span class="roadmap-step-num">${isAr ? 'الخطوة 02 • البناء الفيزيائي' : 'Step 02 • Core Mechanics'}</span>
            <span>→</span>
          </div>
          <strong>${isAr ? 'الكينماتيكا II والديناميكا I وميكانيكا الموائع' : 'Kinematics II, Dynamics I & Fluids I'}</strong>
          <span>${isAr ? 'مسائل القيود الحركية، الأنظمة المترابطة، والطفو (المستوى الثاني).' : 'Constraint kinematics, coupled systems, and hydrostatics (Level II).'}</span>
        </a>

        <a href="preview.html?id=10&type=problem" class="roadmap-step-card" data-open-preview="10" data-preview-type="problem">
          <div class="roadmap-step-top">
            <span class="roadmap-step-num">${isAr ? 'الخطوة 03 • التنافس الوطني والدولي' : 'Step 03 • Olympiad Readiness'}</span>
            <span>→</span>
          </div>
          <strong>${isAr ? 'مجموعات نسمو (NSMO I & II) ومسائل التحدي' : 'NSMO Collections I & II'}</strong>
          <span>${isAr ? 'تجميعات شاملة تحاكي اختبارات الفرز والتصفيات الأولمبية.' : 'Comprehensive problem collections mirroring national olympiad selections.'}</span>
        </a>
      </div>
    `;
  }

  function renderStats() {
    const setsEl = DOM.qs('#statSets');
    const topicsEl = DOM.qs('#statTopics');
    if (!setsEl && !topicsEl) return;

    const { resources } = Store.getState();
    const uniqueTopics = new Set(resources.map((item) => item.t));

    if (setsEl) setsEl.textContent = String(resources.length);
    if (topicsEl) topicsEl.textContent = String(uniqueTopics.size);
  }

  function renderFeatured() {
    const container = DOM.qs('#featuredContainer');
    if (!container) return;

    const { resources } = Store.getState();
    const counts = Downloads.getAllCounts();
    const featured = resources.slice(0, 3);

    container.innerHTML = featured.map((item) => CardComponent.renderCard(item, counts)).join('');
  }

  function renderFAQ() {
    const container = DOM.qs('#faqContainer');
    if (!container) return;

    const { lang } = Store.getState();

    container.innerHTML = Catalog.FAQS.map(
      (faq, idx) => `
        <div class="faq-item">
          <button type="button" class="faq-question" aria-expanded="false" data-faq="${idx}">
            <span>${escapeHtml(faq.q[lang] || faq.q.en)}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </button>
          <div class="faq-answer" hidden>
            <p class="faq-answer-text">${escapeHtml(faq.a[lang] || faq.a.en)}</p>
          </div>
        </div>
      `
    ).join('');
  }

  function handleFaqToggle(buttonEl) {
    const item = buttonEl.closest('.faq-item');
    if (!item) return;
    const answer = DOM.qs('.faq-answer', item);
    const isOpen = buttonEl.getAttribute('aria-expanded') === 'true';

    item.toggleAttribute('open', !isOpen);
    if (answer) answer.hidden = isOpen;
    buttonEl.setAttribute('aria-expanded', String(!isOpen));
  }

  function render() {
    renderStats();
    renderPhysicsMarquee();
    updateSimulatorView();
    renderStudyRoadmap();
    renderFeatured();
    renderFAQ();
    Effects?.observeRevealElements();
  }

  SPhOH.HomePage = Object.freeze({
    render,
    renderStats,
    renderFeatured,
    renderFAQ,
    handleFaqToggle,
    updateSimulatorView,
    launchProjectileAnimation
  });
})(window);


/* === assets/js/pages/files.page.js === */
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


/* === assets/js/pages/preview.page.js === */
/**
 * @file assets/js/pages/preview.page.js
 * @description وحدة قارئ المناهج والحلول المدمج (preview.html) مع عرض الوصف الشامل والمرجع الفيزيائي ومفكرة المسودة.
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, Storage, Store, I18n, CurriculumService, Downloads, CardComponent, Toast, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let activeHelperTool = null; // null | 'formulas' | 'scratchpad'

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


/* === assets/js/pages/about.page.js === */
/**
 * @file assets/js/pages/about.page.js
 * @description وحدة صفحة من نحن والفريق (about.html).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Catalog, Store, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  function renderTeam() {
    const container = DOM.qs('#teamContainer');
    if (!container) return;

    const { lang } = Store.getState();

    container.innerHTML = Catalog.TEAM.map(
      (member) => `
        <div class="member-item">
          <span class="member-name">${escapeHtml(member.name)}</span>
          <span class="member-role">${escapeHtml(member.role[lang] || member.role.en)}</span>
        </div>
      `
    ).join('');
  }

  function render() {
    renderTeam();
  }

  SPhOH.AboutPage = Object.freeze({
    render,
    renderTeam
  });
})(window);


/* === assets/js/pages/contact.page.js === */
/**
 * @file assets/js/pages/contact.page.js
 * @description وحدة صفحة التواصل والمجتمع (contact.html).
 */
(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  const { Settings, I18n, Toast, DOM } = SPhOH;

  async function copyOfficialEmail() {
    await DOM.copyToClipboard(Settings.LINKS.EMAIL);
    Toast.show(I18n.t('email_copied'));
  }

  SPhOH.ContactPage = Object.freeze({
    copyOfficialEmail
  });
})(window);


/* === assets/js/pages/admin.page.js === */
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


/* === assets/js/app.js === */
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
