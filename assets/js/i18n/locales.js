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
      sim_live_lbl: 'LIVE SIMULATION',
      sim_scale_lbl: 'ILLUSTRATIVE SCALE',
      sim_launch_btn: '▶ Launch Projectile',
      sim_angle_lbl: 'Angle θ',
      sim_vel_lbl: 'Velocity v₀',
      sim_grav_lbl: 'Gravity g',
      sim_range_lbl: 'HORIZONTAL RANGE',
      sim_height_lbl: 'MAXIMUM HEIGHT',
      sim_time_lbl: 'FLIGHT TIME',
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
      sim_live_lbl: 'محاكاة مباشرة',
      sim_scale_lbl: 'المسار بمقياس توضيحي',
      sim_launch_btn: '▶ إطلاق المقذوف',
      sim_angle_lbl: 'الزاوية θ',
      sim_vel_lbl: 'السرعة v₀',
      sim_grav_lbl: 'الجاذبية g',
      sim_range_lbl: 'المدى الأفقي',
      sim_height_lbl: 'أقصى ارتفاع',
      sim_time_lbl: 'زمن التحليق',
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
