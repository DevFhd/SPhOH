(function(){
'use strict';

/* =========================================================
   ADMIN CONFIGURATION — إعدادات صفحة المشرف (Admin)
   لتغيير كلمة المرور الخاصة بصفحة Admin، عدّل القيمة النصية أدناه.
   كلمة المرور الافتراضية الحالية هي ثمانية أصفار: '00000000'
   ========================================================= */
var ADMIN_PASSWORD = '00000000';

var TOPICS={
  kin:{en:'Kinematics',ar:'الكينماتيكا (الحركة)'},
  mech:{en:'Mechanics',ar:'الميكانيكا'},
  math:{en:'Mathematics',ar:'الرياضيات'},
  coll:{en:'Collections',ar:'المجموعات'},
  elec:{en:'Electricity & Magnetism',ar:'الكهرباء والمغناطيسية'},
  therm:{en:'Thermodynamics',ar:'الديناميكا الحرارية'},
  opt:{en:'Optics',ar:'البصريات'}
};

var LEVELS={
  1:{en:'Level I',ar:'المستوى الأول'},
  2:{en:'Level II',ar:'المستوى الثاني'},
  3:{en:'Challenge',ar:'تحدٍّ'}
};

var TEAM=[
  {name:'Fahad Alhajji',role:{en:'Founder & CEO',ar:'المؤسس والرئيس التنفيذي'}},
  {name:'Mohammed Linga',role:{en:'Co-Founder & CTO',ar:'شريك مؤسس والرئيس التقني'}},
  {name:'Ridha Alkhamis',role:{en:'Lead Problem Writer',ar:'كاتب الأسئلة الرئيسي'}},
  {name:'Mohammed Alturaiki',role:{en:'Lead Developer',ar:'المطور الرئيسي'}},
  {name:'Amjed Qadi',role:{en:'Problem Writer',ar:'كاتب أسئلة'}},
  {name:'Hussain Alkhamis',role:{en:'Problem Writer',ar:'كاتب أسئلة'}},
  {name:'Abdulhadi Alakhdhari',role:{en:'Problem Writer',ar:'كاتب أسئلة'}},
  {name:'Hassan Alabdullah',role:{en:'Problem Writer',ar:'كاتب أسئلة'}},
  {name:'Hassan Al Radhwan',role:{en:'LaTeX Developer',ar:'مطور LaTeX'}}
];

var FAQS=[
  {
    q:{en:'What is SPhOH?',ar:'ما هو SPhOH؟'},
    a:{
      en:'SPhOH (Saudi Physics Olympiad Hub) is a specialized training platform providing high-quality problem sets and resources for students preparing for national and international physics olympiads.',
      ar:'SPhOH هي منصة تدريبية متخصصة تقدم مجموعات مسائل وموارد عالية الجودة للطلاب المستعدين للأولمبيادات الوطنية والدولية للفيزياء.'
    }
  },
  {
    q:{en:'Are all problem sets free to download?',ar:'هل جميع مجموعات المسائل مجانية للتحميل؟'},
    a:{
      en:'Yes, all our PDFs and resources are completely free to browse online or download for students, teachers, and physics enthusiasts worldwide.',
      ar:'نعم، جميع ملفات PDF والموارد المتاحة مجانية تماماً للتصفح المباشر داخل الموقع أو التحميل للطلاب والمعلمين وشغوفي الفيزياء حول العالم.'
    }
  },
  {
    q:{en:'How can I contribute or report errors?',ar:'كيف يمكنني المساهمة أو الإبلاغ عن خطأ في المسائل؟'},
    a:{
      en:'You can submit feedback through our Google Form or email us directly on the Contact page. You can also follow our Telegram channel for updates.',
      ar:'يمكنك إرسال ملاحظاتك عبر نموذج Google أو مراسلتنا عبر البريد الإلكتروني في صفحة التواصل، كما يمكنك متابعة قناة تيليجرام للاطلاع على التحديثات.'
    }
  },
  {
    q:{en:'How do you write and compile the problems?',ar:'كيف تكتبون وتعدّون المسائل؟'},
    a:{
      en:'As Olympiad students, we write most of the problems ourselves. Some problems are also inspired by classic references such as Irodov, Physics for Scientists and Engineers, Fundamentals of Physics, and past Olympiad competitions.',
      ar:'كطلاب أولمبياد، نكتب معظم المسائل بأنفسنا. إلا أن هناك بعض المسائل المستلهمة من مراجع كلاسيكية مثل إيرودوف، والفيزياء للعلماء والمهندسين، وأساسيات الفيزياء، ومسائل الأولمبيادات السابقة.'
    }
  }
];

var FALLBACK_RESOURCES=[{"id": 1, "t": "kin", "l": 1, "file": "Kinematics_I", "solution": null, "title": {"en": "Kinematics I Problem Set", "ar": "الكينماتيكا (الحركة) I"}, "desc": {"en": "1D & 2D Kinematics, graphical analysis, free fall, and projectile motion problems.", "ar": "مسائل الحركة في بعد وبعدين، التحليل البياني، السقوط الحر والمقذوفات."}}, {"id": 8, "t": "kin", "l": 2, "file": "Kinematics_II", "solution": null, "title": {"en": "Kinematics II Problem Set", "ar": "الكينماتيكا (الحركة) II"}, "desc": {"en": "27 problems with hints: rolling motion & constraint kinematics, relative motion in moving media, and circular motion.", "ar": "27 مسألة متدرجة مع التلميحات: حركة التدحرج وكينماتيكا القيود، الحركة النسبية والأوساط المتحركة، والحركة الدائرية."}}, {"id": 3, "t": "mech", "l": 2, "file": "Fluids_I", "solution": "Fluids_I_Solutions", "title": {"en": "Fluids I Problem Set", "ar": "مجموعة مسائل ميكانيكا الموائع I"}, "desc": {"en": "Hydrostatic pressure, Pascal's principle, buoyancy, and Archimedes' principle.", "ar": "الضغط الهيدروستاتيكي، مبدأ باسكال، قوة الطفو، ومبدأ أرخميدس."}}, {"id": 4, "t": "math", "l": 1, "file": "Units_Conversion_and_Dimensional_Analysis", "solution": null, "title": {"en": "Units Conversion & Dimensional Analysis", "ar": "تحويل الوحدات والتحليل البعدي"}, "desc": {"en": "Mastering nested prefixes, conversion factors, dimensional homogeneity, and SI/CGS units.", "ar": "إتقان البادئات، معامل التحويل، تجانس الأبعاد، وتحويل الوحدات الأساسية."}}, {"id": 5, "t": "math", "l": 1, "file": "Trigonometry_I", "solution": null, "title": {"en": "Trigonometry I Problem Set", "ar": "مجموعة مسائل حساب المثلثات I"}, "desc": {"en": "Trigonometric identities, right triangles, special ratios, and physics vector applications.", "ar": "المطابقات المثلثية، المثلث قائم الزاوية، النسب الخاصة، وتطبيقات المتجهات بالفيزياء."}}, {"id": 2, "t": "math", "l": 2, "file": "Vectors", "solution": {"en": "Vectors_Solutions", "ar": null}, "title": {"en": "Vectors Problem Set", "ar": "مجموعة مسائل المتجهات"}, "desc": {"en": "Vector components, 3D unit vectors, dot products, cross products, and torque.", "ar": "مركبات المتجهات، متجه الوحدة في 3D، الضرب القياسي، الضرب الاتجاهي، والعزم."}}, {"id": 6, "t": "math", "l": 2, "file": "Algebra_I", "solution": "Algebra_I_Solutions", "title": {"en": "Algebra I Problem Set", "ar": "مجموعة مسائل الجبر I"}, "desc": {"en": "40 progressive problems: linear/quadratic equations, system derivations, and physics approximations.", "ar": "40 مسألة متدرجة: معادلات خطية وتربيعية، اشتقاقات الأنظمة، والتقريبات الفيزيائية."}}, {"id": 7, "t": "coll", "l": 1, "file": "NSMO_Collection_I", "solution": null, "title": {"en": "NSMO Collection I", "ar": "مجموعة نسمو I"}, "desc": {"en": "67 problems closely related to the National Olympiad topics in Saudi Arabia.", "ar": "67 مسألة مرتبطة مباشرة بموضوعات المرحلة الأولى من الأولمبياد الوطني للعلوم والرياضيات في المملكة."}}];

var UI={
  en:{
    nav_home:'Home',
    nav_files:'Problem Sets',
    nav_preview:'Reader / Preview',
    nav_about:'About & Team',
    nav_contact:'Contact',

    theme_dark:'Dark',
    theme_light:'Light',

    hero_eyebrow:'Saudi Physics Olympiad Hub',
    hero_title:'Solve harder problems. Think like a physicist.',
    hero_desc:'SPhOH is an open global training hub for physics enthusiasts and students preparing for national and international physics olympiads (IPhO, APhO, EuPhO, and National Selections). Browse problem sets directly inside the hub or download them as PDFs.',
    hero_cta:'Browse Problem Sets',
    hero_secondary:'About the Initiative',

    stat_sets:'Curated Problem Sets',
    stat_topics:'Core Physics & Math Areas',
    stat_bilingual:'Full AR / EN Support',
    stat_free:'Open Access & Free PDFs',

    pillars_eyebrow:'Methodology',
    pillars_title:'Built for deliberate practice',
    p1_t:'Graded Difficulty',
    p1_d:'Each problem set is marked Level I, Level II, or Challenge, so you can progress systematically at your own pace.',
    p2_t:'Olympiad Focus',
    p2_d:'Topics and problem styles mirror what students encounter in national team selections and International Physics Olympiad training.',
    p3_t:'Structured Content',
    p3_d:'Problems are carefully compiled, typeset in LaTeX, and paired with step-by-step solutions when available.',

    featured_eyebrow:'Featured Resources',
    featured_title:'Start practicing right away',
    featured_all:'View All Problem Sets →',

    about_eyebrow:'About Us',
    about_title:'Built by Olympiad students, for Olympiad students',
    about_desc:'SPhOH is a student-led training hub dedicated to advanced physics competitions worldwide. Every set is designed around deliberate practice: working on problems just beyond your current comfort zone.',
    levels_guide_title:'How Difficulty Levels Work',
    lvl1_desc:'Foundational olympiad concepts, essential mathematical tools, and national stage I preparation.',
    lvl2_desc:'Intermediate multi-step problems requiring deeper physical intuition and analytical techniques.',
    lvl3_desc:'Advanced international-level challenges (APhO / IPhO style) designed to stretch your problem-solving limits.',

    team_title:'The SPhOH Founders & Team',
    team_desc:'The SPhOH Team writes, reviews, translates, and typesets every problem set on the hub, making serious physics practice accessible in both Arabic and English.',
    team_vision:'Our vision: every capable physics student worldwide has access to high-quality practice material to compete at the highest level.',

    files_eyebrow:'Resource Library',
    files_title:'Files & Problem Sets',
    files_desc:'Browse curricula directly inside our integrated reader, or download the PDF problem sets and their official solutions.',
    translation_notice:'All problem sets are available in both Arabic and English. Files automatically open and download in your currently selected interface language.',

    filter_all:'All Topics',
    level_all:'All Levels',
    search_placeholder:'Search problem sets...',

    faq_eyebrow:'FAQ',
    faq_title:'Frequently Asked Questions',

    empty:'No matching problem sets found. Try clearing your search or filters.',
    btn_preview:'📖 Browse Curriculum',
    btn_download:'📥 Download PDF',
    pdf_toast:'The PDF for this set has not been attached yet.',
    solution_preview:'📖 Browse Solution',
    solution_download:'📥 Download Solution',
    solution_toast:'The solution for this set has not been released in this language yet.',

    preview_back:'← Back to Problem Sets',
    preview_prev:'◀ Previous',
    preview_next:'Next ▶',
    preview_tab_problem:'📘 Problem Set',
    preview_tab_solution:'✅ Official Solution',
    preview_focus_enter:'⛶ Focus Mode',
    preview_focus_exit:'✕ Exit Focus',
    open_new_tab:'Open PDF ↗',
    close_preview:'Exit Focus Mode',
    download_started:'Download recorded! Counter updated.',
    downloads_label:function(n){return '↓ '+n.toLocaleString()+(n===1?' download':' downloads');},

    n_sets:function(n){
      return 'Showing '+n+(n===1?' problem set':' problem sets');
    },

    contact_eyebrow:'Contact & Community',
    contact_title:'Get in touch with the SPhOH Team',
    contact_desc:'Found a typo in a problem set, want to suggest a new topic, or interested in contributing problems and solutions? Reach out through any of the channels below.',

    fb_title:'Have feedback, corrections, or suggestions?',
    fb_desc:'Help us improve SPhOH problem sets and platform features by filling out our quick feedback form.',
    fb_btn:'Open Feedback Form ↗',

    telegram_title:'Join the SPhOH Telegram Channel',
    telegram_desc:'Get instant updates when new problem sets, solutions, and training announcements are published.',
    telegram_btn:'Join Telegram ↗',
    telegram_footer:'Telegram Channel',

    email_title:'Contact Us by Email',
    email_desc:'For academic collaborations, error reports, or joining the problem-writing team, email us directly.',
    email_copy:'Copy Email',
    email_copied:'Email address copied to clipboard: sphohc@gmail.com',

    admin_eyebrow:'Admin Panel (Database-Ready)',
    admin_title:'Curriculum & Solution Manager',
    admin_desc:'Manage existing curricula, toggle solutions with one click, or add brand-new curricula and physics sections.',
    admin_gate_title:'Admin Authentication',
    admin_gate_desc:'Enter the admin password to unlock the panel (configurable via ADMIN_PASSWORD in assets/js/main.js).',
    admin_pass_placeholder:'Enter password...',
    admin_login_btn:'Unlock Admin Panel',
    admin_wrong_pass:'Incorrect password! Please try again.',
    admin_add_curriculum_btn:'➕ Add New Curriculum',
    admin_logout_btn:'🔒 Lock Panel',
    admin_export_json:'📥 Export resources.json',
    admin_copy_json:'📋 Copy JSON',
    admin_reset_default:'🔄 Reset to Default',
    admin_db_tools_summary:'⚙️ Database & JSON Sync Tools (Export / Backup)',
    admin_form_add_title:'➕ Add New Curriculum',
    admin_form_edit_title:'✏️ Edit Curriculum',
    admin_lbl_topic:'Topic / Section',
    admin_opt_new_topic:'➕ Create a Brand-New Topic / Section...',
    admin_lbl_new_topic_ar:'New Section Name (Arabic)',
    admin_lbl_new_topic_en:'New Section Name (English)',
    admin_lbl_new_topic_key:'Section Code (optional, e.g. modern)',
    admin_lbl_level:'Difficulty Level',
    admin_lbl_stem:'PDF File Identifier (or pick a file to auto-fill)',
    admin_lbl_pick_pdf:'📂 Pick PDF to Auto-Fill Name',
    admin_lbl_title_ar:'Curriculum Title (Arabic)',
    admin_lbl_title_en:'Curriculum Title (English)',
    admin_lbl_desc_ar:'Short Description (Arabic)',
    admin_lbl_desc_en:'Short Description (English)',
    admin_lbl_sol_mode:'Solution Status',
    admin_sol_none:'Not released yet',
    admin_sol_both:'Available in Arabic & English (AR + EN)',
    admin_sol_ar:'Available in Arabic only (AR)',
    admin_sol_en:'Available in English only (EN)',
    admin_save_btn:'💾 Save Curriculum',
    admin_cancel_edit:'Cancel',
    admin_list_title:'📚 Curricula List',
    admin_saved_toast:'Curriculum saved! Changes are immediately active.',
    admin_json_copied:'Updated JSON copied to clipboard!',
    admin_reset_toast:'Restored default curricula list.',

    foot:'Deliberate practice for physics olympiads'
  },

  ar:{
    nav_home:'الرئيسية',
    nav_files:'مجموعات المسائل',
    nav_preview:'تصفح المنهج',
    nav_about:'من نحن',
    nav_contact:'تواصل معنا',

    theme_dark:'داكن',
    theme_light:'فاتح',

    hero_eyebrow:'مركز أولمبياد الفيزياء السعودي',
    hero_title:'حلّ مسائل أصعب. فكّر كفيزيائي.',
    hero_desc:'SPhOH منصة تدريب عالمية مفتوحة للطلاب والمهتمين المستعدين للأولمبيادات الوطنية والدولية للفيزياء (IPhO, APhO, EuPhO والترشيحات الوطنية). تصفّح المناهج مباشرة داخل الموقع أو حمّلها بصيغة PDF.',
    hero_cta:'تصفّح مجموعات المسائل',
    hero_secondary:'تعرّف على المبادرة',

    stat_sets:'مجموعات مسائل متدرجة',
    stat_topics:'مجالات أساسية في الفيزياء والرياضيات',
    stat_bilingual:'دعم كامل للعربية والإنجليزية',
    stat_free:'وصول مفتوح ومجاني بالكامل',

    pillars_eyebrow:'منهجية التدريب',
    pillars_title:'منصة قائمة على التدريب المتعمد والمكثف',
    p1_t:'مستويات متدرجة',
    p1_d:'كل مجموعة مسائل مصنفة إلى: المستوى الأول، أو المستوى الثاني، أو تحدٍّ، لتتقدم بالسرعة التي تناسبك.',
    p2_t:'تركيز على الأولمبياد',
    p2_d:'المواضيع والأساليب تحاكي ما يواجهه الطلاب في ترشيحات المنتخبات الوطنية والاستعداد لأولمبياد الفيزياء الدولي.',
    p3_t:'محتوى منظم ومؤصل',
    p3_d:'مسائل مجمعة ومنسقة بعناية مع حلولها التفصيلية لتسهيل الدراسة الذاتية والمراجعة.',

    featured_eyebrow:'مختارات من المكتبة',
    featured_title:'ابدأ التدريب الآن',
    featured_all:'عرض جميع مجموعات المسائل ←',

    about_eyebrow:'من نحن',
    about_title:'مبادرة طلابية لتمكين طلاب الأولمبياد',
    about_desc:'SPhOH مورد تدريبي لمسابقات الفيزياء المتقدمة. صُممت كل مجموعة على مبدأ التدريب المتعمد: العمل على مسائل أعلى قليلاً من مستواك الحالي لبناء حدس فيزيائي ومهارات تحليلية عميقة.',
    levels_guide_title:'دليل مستويات الصعوبة في المنصة',
    lvl1_desc:'المفاهيم التأسيسية للأولمبياد، الأدوات الرياضية الأساسية، والاستعداد للمرحلة الأولى من المنافسات الوطنية.',
    lvl2_desc:'مسائل متوسطة متعددة الخطوات تتطلب حدساً فيزيائياً أعمق وتقنيات رياضية وتحليلية متقدمة.',
    lvl3_desc:'مسائل تحدٍّ بمستوى الأولمبيادات القارية والدولية (APhO / IPhO) مصممة لصقل مهارات الحل الإبداعي.',

    team_title:'مؤسسو وفريق SPhOH',
    team_desc:'يكتب فريق SPhOH مجموعات المسائل في المنصة ويراجعها ويترجمها وينظمها، بهدف جعل التدريب الجاد في الفيزياء متاحاً باللغتين العربية والإنجليزية.',
    team_vision:'رؤيتنا: أن يملك كل طالب شغوف بالفيزياء حول العالم مادة التدريب التي تمكّنه من المنافسة على أعلى مستوى.',

    files_eyebrow:'مكتبة الموارد',
    files_title:'الملفات ومجموعات المسائل',
    files_desc:'تصفّح المناهج مباشرة داخل قارئ الموقع المدمج، أو حمّل ملفات المسائل والحلول باللغتين العربية والإنجليزية.',
    translation_notice:'جميع مجموعات المسائل متوفرة باللغتين العربية والإنجليزية. يتم فتح وتصفح وتحميل الملفات تلقائياً باللغة التي اخترتها في أعلى الصفحة.',

    filter_all:'جميع المواضيع',
    level_all:'جميع المستويات',
    search_placeholder:'ابحث في عنوان أو وصف المسائل...',

    faq_eyebrow:'الأسئلة الشائعة',
    faq_title:'الأسئلة المتكررة والمعلومات العامة',

    empty:'لا توجد مجموعات مسائل مطابقة لبحثك. جرّب تغيير الفلتر أو كلمة البحث.',
    btn_preview:'📖 تصفح المنهج',
    btn_download:'📥 تحميل PDF',
    pdf_toast:'لم يُرفق ملف PDF لهذه المجموعة بعد.',
    solution_preview:'📖 تصفح الحل',
    solution_download:'📥 تحميل الحل',
    solution_toast:'لم يصدر ملف الحل لهذا المنهج بهذه اللغة حتى الآن.',

    preview_back:'→ العودة إلى مجموعات المسائل',
    preview_prev:'▶ السابق',
    preview_next:'التالي ◀',
    preview_tab_problem:'📘 كتاب المسائل',
    preview_tab_solution:'✅ الحلول النموذجية',
    preview_focus_enter:'⛶ وضع التركيز',
    preview_focus_exit:'✕ إنهاء وضع التركيز',
    open_new_tab:'فتح الملف المستقل ↗',
    close_preview:'إنهاء وضع التركيز',
    download_started:'تم تسجيل التحميل وتحديث العداد بنجاح!',
    downloads_label:function(n){return '↓ '+n.toLocaleString()+' تحميل';},

    n_sets:function(n){
      return 'يُعرض حالياً '+n+' '+(n===1?'مجموعة مسائل':(n===2?'مجموعتا مسائل':(n<=10?'مجموعات مسائل':'مجموعة مسائل')));
    },

    contact_eyebrow:'التواصل والمجتمع',
    contact_title:'تواصل مع فريق SPhOH',
    contact_desc:'هل لاحظت خطأً مطبعياً أو علمياً في إحدى المسائل، أو تود اقتراح موضوع جديد، أو ترغب في الانضمام والمساهمة بكتابة المسائل؟ يسعدنا تواصلك معنا.',

    fb_title:'لديك ملاحظات أو تصحيحات أو اقتراحات؟',
    fb_desc:'ساعدنا في تحسين مجموعات المسائل وتطوير منصة SPhOH من خلال تعبئة نموذج الملاحظات السريع.',
    fb_btn:'تعبئة نموذج الملاحظات ↗',

    telegram_title:'انضم إلى قناة SPhOH على تيليجرام',
    telegram_desc:'تابعنا للاطلاع الفوري على مجموعات المسائل الجديدة والحلول والإعلانات التدريبية.',
    telegram_btn:'انضم إلى تيليجرام ↗',
    telegram_footer:'قناة تيليجرام',

    email_title:'تواصل معنا عبر البريد الإلكتروني',
    email_desc:'للاستفسارات الأكاديمية، أو الإبلاغ عن أخطاء، أو المساهمة في إعداد المحتوى، راسل فريق SPhOH مباشرة.',
    email_copy:'نسخ البريد',
    email_copied:'تم نسخ البريد الإلكتروني: sphohc@gmail.com',

    admin_eyebrow:'لوحة تحكم مبسطة',
    admin_title:'إدارة المناهج والحلول',
    admin_desc:'تحكم في المناهج الحالية وفعّل حلولها بضغطة واحدة، أو أضف منهجاً أو قسماً فيزيائياً جديداً كلياً بكل بساطة.',
    admin_gate_title:'تسجيل دخول المشرف (Admin)',
    admin_gate_desc:'أدخل كلمة المرور',
    admin_pass_placeholder:'أدخل كلمة المرور...',
    admin_login_btn:'دخول إلى لوحة التحكم',
    admin_wrong_pass:'كلمة المرور غير صحيحة! حاول مرة أخرى.',
    admin_add_curriculum_btn:'➕ إضافة منهج جديد',
    admin_logout_btn:'🔒 قفل اللوحة',
    admin_export_json:'📥 تصدير ملف resources.json',
    admin_copy_json:'📋 نسخ JSON',
    admin_reset_default:'🔄 استعادة الافتراضي',
    admin_db_tools_summary:'⚙️ أدوات المزامنة وقاعدة البيانات (تصدير / نسخ JSON)',
    admin_form_add_title:'➕ إضافة منهج جديد',
    admin_form_edit_title:'✏️ تعديل بيانات المنهج',
    admin_lbl_topic:'القسم / الموضوع',
    admin_opt_new_topic:'➕ إضافة قسم / منهج جديد كلياً...',
    admin_lbl_new_topic_ar:'اسم القسم الجديد (بالعربية)',
    admin_lbl_new_topic_en:'اسم القسم الجديد (بالإنجليزية)',
    admin_lbl_new_topic_key:'رمز القسم (اختياري، مثل: modern)',
    admin_lbl_level:'مستوى الصعوبة',
    admin_lbl_stem:'الاسم الأساسي لملف PDF (أو اختر ملفاً للتعبئة التلقائية)',
    admin_lbl_pick_pdf:'📂 اختيار ملف PDF لتعبئة الاسم تلقائياً',
    admin_lbl_title_ar:'اسم المنهج (بالعربية)',
    admin_lbl_title_en:'اسم المنهج (بالإنجليزية)',
    admin_lbl_desc_ar:'وصف مختصر للمنهج (بالعربية)',
    admin_lbl_desc_en:'وصف مختصر للمنهج (بالإنجليزية)',
    admin_lbl_sol_mode:'حالة الحل النموذجي',
    admin_sol_none:'لم يصدر حل بعد',
    admin_sol_both:'متوفر بالعربية والإنجليزية (AR + EN)',
    admin_sol_ar:'متوفر بالعربية فقط (AR)',
    admin_sol_en:'متوفر بالإنجليزية فقط (EN)',
    admin_save_btn:'💾 حفظ المنهج',
    admin_cancel_edit:'إلغاء',
    admin_list_title:'📚 قائمة المناهج الحالية',
    admin_saved_toast:'تم حفظ المنهج وتحديث الموقع فوراً!',
    admin_json_copied:'تم نسخ بيانات JSON المحدثة!',
    admin_reset_toast:'تمت استعادة البيانات الافتراضية.',

    foot:'تدريب مكثف لأولمبياد الفيزياء'
  }
};

/* State */
var P=FALLBACK_RESOURCES.slice();
var SUFFIX={ar:'AR',en:'ENG'};
var activeTopic='all';
var activeLevel='all';
var searchQuery='';
var DEFAULT_TOPICS=JSON.parse(JSON.stringify(TOPICS));
var countsKey='sphoh-download-counts-v1';
var customResourcesKey='sphoh-custom-resources-v1';
var customTopicsKey='sphoh-custom-topics-v1';
var adminUnlockKey='sphoh-admin-unlocked';
var editingResourceId=null;
var isAdminFormOpen=false;

// Preview page state
var currentPreviewId=8; // Default to Kinematics II in preview
var currentPreviewType='problem';
var isFocusMode=false;
var readerZoom=100;

// In-memory download counter store synced with localStorage
var memoryCounts={};
try{
  var rawSaved=localStorage.getItem(countsKey);
  if(rawSaved){
    var parsed=JSON.parse(rawSaved);
    if(parsed&&typeof parsed==='object')memoryCounts=parsed;
  }
}catch(e){}

var lang='ar';
try{
  var savedLang=localStorage.getItem('sphoh-lang');
  if(savedLang==='en'||savedLang==='ar')lang=savedLang;
}catch(e){}

var theme='auto';
try{
  var savedTheme=localStorage.getItem('sphoh-theme');
  if(savedTheme==='light'||savedTheme==='dark')theme=savedTheme;
}catch(e){}

/* Helpers */
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};

function tt(k){
  return UI[lang]&&UI[lang][k]!==undefined ? UI[lang][k] : k;
}

function escapeHtml(str){
  return String(str||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function getCounts(){
  try{
    var stored=localStorage.getItem(countsKey);
    if(stored){
      var obj=JSON.parse(stored);
      if(obj&&typeof obj==='object'){
        Object.keys(obj).forEach(function(k){
          memoryCounts[k]=Math.max(Number(memoryCounts[k]||0),Number(obj[k]||0));
        });
      }
    }
  }catch(e){}
  return memoryCounts;
}

function incrementCount(key){
  if(!key)return 0;
  var counts=getCounts();
  counts[key]=Number(counts[key]||0)+1;
  memoryCounts[key]=counts[key];
  try{
    localStorage.setItem(countsKey,JSON.stringify(memoryCounts));
  }catch(e){}

  $$('[data-count-for]').forEach(function(badge){
    if(badge.getAttribute('data-count-for')===key){
      badge.textContent=tt('downloads_label')(memoryCounts[key]);
      badge.classList.remove('is-bumped');
      void badge.offsetWidth;
      badge.classList.add('is-bumped');
      setTimeout(function(){badge.classList.remove('is-bumped');},600);
    }
  });

  return memoryCounts[key];
}

/* =========================================================
   DATABASE-READY SERVICE LAYER (CurriculumDB)
   طبقة بيانات موحدة جاهزة للربط مع أي قاعدة بيانات مستقبلاً
   (مثل Supabase / Firebase / REST API / SQL)
   ========================================================= */
var CurriculumDB={
  loadTopics:function(){
    try{
      var raw=localStorage.getItem(customTopicsKey);
      if(raw){
        var savedTopics=JSON.parse(raw);
        if(savedTopics&&typeof savedTopics==='object'){
          Object.keys(savedTopics).forEach(function(k){
            TOPICS[k]=savedTopics[k];
          });
        }
      }
    }catch(e){}
    return TOPICS;
  },
  addTopic:function(key,arName,enName){
    var cleanKey=String(key||'').trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
    if(!cleanKey){
      cleanKey='topic_'+Date.now().toString(36);
    }
    TOPICS[cleanKey]={
      en:String(enName||arName||cleanKey).trim(),
      ar:String(arName||enName||cleanKey).trim()
    };
    try{
      localStorage.setItem(customTopicsKey,JSON.stringify(TOPICS));
    }catch(e){}
    return cleanKey;
  },
  getCustomResources:function(){
    try{
      var raw=localStorage.getItem(customResourcesKey);
      if(raw){
        var arr=JSON.parse(raw);
        if(Array.isArray(arr)&&arr.length>0)return arr;
      }
    }catch(e){}
    return null;
  },
  saveAll:function(list){
    // مستقبلاً: استبدل localStorage بطلب API (مثل fetch('/api/curricula', {method:'POST', ...}))
    P=list.slice();
    try{
      localStorage.setItem(customResourcesKey,JSON.stringify(P));
    }catch(e){}
    return Promise.resolve(P);
  },
  resetAll:function(){
    try{
      localStorage.removeItem(customResourcesKey);
      localStorage.removeItem(customTopicsKey);
    }catch(e){}
    TOPICS=JSON.parse(JSON.stringify(DEFAULT_TOPICS));
    P=FALLBACK_RESOURCES.slice();
    return Promise.resolve(P);
  }
};

CurriculumDB.loadTopics();

function getCustomResources(){
  return CurriculumDB.getCustomResources();
}

function saveCustomResources(list){
  return CurriculumDB.saveAll(list);
}

/* Resource Paths & Easy Solution Resolution */
function loadResources(){
  var custom=getCustomResources();
  if(custom){
    P=custom;
    return Promise.resolve(P);
  }
  if(window.__SPHOH_CANVAS_MODE__){
    return Promise.resolve(P);
  }
  return fetch('data/resources.json')
    .then(function(r){
      if(!r.ok)throw new Error('HTTP '+r.status);
      return r.json();
    })
    .then(function(data){
      var savedAfterFetch=getCustomResources();
      if(savedAfterFetch){
        P=savedAfterFetch;
      }else if(Array.isArray(data)&&data.length>0){
        P=data;
      }
    })
    .catch(function(){
      var savedFallback=getCustomResources();
      P=savedFallback||FALLBACK_RESOURCES.slice();
    });
}

function buildResourcePath(file,targetLang){
  if(!file)return null;
  file=String(file).trim();
  if(!file)return null;
  var l=targetLang||lang;

  if(/^(https?:)?\/\//i.test(file)||file.charAt(0)==='/'||file.indexOf('PDFs/')===0||(/\//.test(file)&&/\.pdf$/i.test(file))){
    return file;
  }

  file=file.replace(/\.pdf$/i,'');
  return 'PDFs/'+l+'/'+encodeURIComponent(file+'_'+SUFFIX[l]+'.pdf');
}

function buildPdfPath(p){
  if(!p)return null;
  var f=p.file;
  if(f&&typeof f==='object')f=f[lang];
  return buildResourcePath(f,lang);
}

function solutionFileForLang(p,targetLang){
  if(!p)return '';
  var l=targetLang||lang;
  var raw=p.solution!==undefined?p.solution:(p.solutions||p.solutionFile||p.solution_file||p.answer||'');
  if(raw===true){
    return p.file+'_Solutions';
  }
  if(raw&&typeof raw==='object'){
    var val=raw[l];
    if(val===true)return p.file+'_Solutions';
    return val||'';
  }
  return raw||'';
}

function solutionFile(p){
  return solutionFileForLang(p,lang);
}

function buildSolutionPath(p){
  return buildResourcePath(solutionFile(p),lang);
}

function findResourceById(id){
  var numId=Number(id);
  for(var i=0;i<P.length;i++){
    if(Number(P[i].id)===numId)return P[i];
  }
  return P[0]||null;
}

/* Theme */
function isCurrentlyDark(){
  if(theme==='auto'){
    return Boolean(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  return theme==='dark';
}

function applyTheme(){
  var root=document.documentElement;
  if(theme==='auto'){
    root.removeAttribute('data-theme');
  }else{
    root.setAttribute('data-theme',theme);
  }
  var dark=isCurrentlyDark();
  var iconEl=$('#themeIcon');
  var textEl=$('#themeText');
  if(iconEl)iconEl.textContent=dark?'🌙':'☀️';
  if(textEl)textEl.textContent=dark?tt('theme_dark'):tt('theme_light');
}

/* Problem Set Card Builder */
function renderTagsHtml(p){
  var pips='';
  for(var i=1;i<=3;i++){
    pips+='<b'+(i<=p.l?' class="on"':'')+'></b>';
  }
  var topicLabel=TOPICS[p.t]?TOPICS[p.t][lang]:p.t;
  var levelLabel=LEVELS[p.l]?LEVELS[p.l][lang]:('L'+p.l);

  return '<span class="tag" data-topic="'+escapeHtml(p.t)+'">'+escapeHtml(topicLabel)+'</span>'+
    '<span class="tag lvl" data-lvl="'+escapeHtml(p.l)+'">'+
      '<span class="pips">'+pips+'</span>'+escapeHtml(levelLabel)+
    '</span>';
}

function renderCardHtml(p,counts){
  var pdfPath=buildPdfPath(p);
  var solutionPath=buildSolutionPath(p);
  var title=p.title&&p.title[lang]?p.title[lang]:'';
  var desc=p.desc&&p.desc[lang]?p.desc[lang]:'';

  var probCount=pdfPath?Number(counts[pdfPath]||0):0;
  var solCount=solutionPath?Number(counts[solutionPath]||0):0;

  var previewProblemHref='preview.html?id='+encodeURIComponent(p.id)+'&type=problem';
  var previewSolHref='preview.html?id='+encodeURIComponent(p.id)+'&type=solution';

  var html='<article class="card">'+
    '<div class="tags">'+renderTagsHtml(p)+'</div>'+
    '<h3 class="h3">'+escapeHtml(title)+'</h3>'+
    '<p>'+escapeHtml(desc)+'</p>'+
    '<div class="card-actions-group">';

  // Problem row
  html+='<div class="action-row">';
  if(pdfPath){
    html+='<a href="'+escapeHtml(previewProblemHref)+'" class="btn btn-primary btn-sm" data-open-preview="'+escapeHtml(p.id)+'" data-preview-type="problem">'+escapeHtml(tt('btn_preview'))+'</a>'+
          '<a href="'+escapeHtml(pdfPath)+'" download class="btn btn-ghost btn-sm" data-download-key="'+escapeHtml(pdfPath)+'">'+escapeHtml(tt('btn_download'))+'</a>'+
          '<span class="download-count" data-count-for="'+escapeHtml(pdfPath)+'">'+escapeHtml(tt('downloads_label')(probCount))+'</span>';
  }else{
    html+='<button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable" data-missing-file="problem">'+escapeHtml(tt('btn_preview'))+'</button>'+
          '<button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable" data-missing-file="problem">'+escapeHtml(tt('btn_download'))+'</button>';
  }
  html+='</div>';

  // Solution row
  html+='<div class="action-row">';
  if(solutionPath){
    html+='<a href="'+escapeHtml(previewSolHref)+'" class="btn btn-primary btn-sm solution-action" data-open-preview="'+escapeHtml(p.id)+'" data-preview-type="solution">'+escapeHtml(tt('solution_preview'))+'</a>'+
          '<a href="'+escapeHtml(solutionPath)+'" download class="btn btn-ghost btn-sm solution-action" data-download-key="'+escapeHtml(solutionPath)+'">'+escapeHtml(tt('solution_download'))+'</a>'+
          '<span class="download-count" data-count-for="'+escapeHtml(solutionPath)+'">'+escapeHtml(tt('downloads_label')(solCount))+'</span>';
  }else{
    html+='<button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action" data-missing-file="solution">'+escapeHtml(tt('solution_preview'))+'</button>'+
          '<button type="button" aria-disabled="true" class="btn btn-ghost btn-sm is-unavailable solution-action" data-missing-file="solution">'+escapeHtml(tt('solution_download'))+'</button>';
  }
  html+='</div>';

  html+='</div></article>';
  return html;
}

/* =========================================================
   DEDICATED IN-SITE PREVIEW PAGE RENDERER
   ========================================================= */
function parseUrlPreviewParams(){
  try{
    var params=new URLSearchParams(window.location.search);
    var idParam=params.get('id');
    var typeParam=params.get('type');
    if(idParam)currentPreviewId=Number(idParam);
    if(typeParam==='solution'||typeParam==='problem')currentPreviewType=typeParam;
  }catch(e){}
}

function renderPreviewPage(){
  var section=$('#previewSection');
  if(!section||P.length===0)return;

  var p=findResourceById(currentPreviewId);
  if(!p)return;
  currentPreviewId=p.id;

  var pdfPath=buildPdfPath(p);
  var solPath=buildSolutionPath(p);

  if(currentPreviewType==='solution'&&!solPath){
    currentPreviewType='problem';
  }

  var activePath=currentPreviewType==='solution'?solPath:pdfPath;
  var counts=getCounts();
  var activeCount=activePath?Number(counts[activePath]||0):0;

  var selectEl=$('#previewResourceSelect');
  if(selectEl){
    selectEl.innerHTML='';
    P.forEach(function(item){
      var opt=document.createElement('option');
      opt.value=String(item.id);
      var tLabel=TOPICS[item.t]?TOPICS[item.t][lang]:item.t;
      opt.textContent=(item.title&&item.title[lang]?item.title[lang]:item.file)+' ('+tLabel+')';
      selectEl.appendChild(opt);
    });
    selectEl.value=String(p.id);
  }

  var tagsEl=$('#previewTags');
  if(tagsEl)tagsEl.innerHTML=renderTagsHtml(p);

  var baseTitle=p.title&&p.title[lang]?p.title[lang]:'';
  var docHeading=currentPreviewType==='solution'
    ?(baseTitle+' — '+(lang==='ar'?'الحلول النموذجية':'Official Solutions'))
    :baseTitle;

  var titleEl=$('#previewTitle');
  if(titleEl)titleEl.textContent=docHeading;

  var descEl=$('#previewDesc');
  if(descEl)descEl.textContent=p.desc&&p.desc[lang]?p.desc[lang]:'';

  var tabProb=$('#tabProblemBtn');
  var tabSol=$('#tabSolutionBtn');
  if(tabProb){
    tabProb.classList.toggle('active',currentPreviewType==='problem');
  }
  if(tabSol){
    tabSol.classList.toggle('active',currentPreviewType==='solution');
    tabSol.classList.toggle('is-disabled-tab',!solPath);
  }

  var shell=$('#filePreviewDialog');
  var focusBtn=$('#previewFocusBtn');
  var closeBtn=$('#previewCloseBtn');
  if(shell)shell.classList.toggle('is-focus-mode',isFocusMode);
  if(focusBtn)focusBtn.textContent=isFocusMode?tt('preview_focus_exit'):tt('preview_focus_enter');
  if(closeBtn){
    closeBtn.hidden=!isFocusMode;
    closeBtn.setAttribute('aria-label',tt('close_preview'));
  }

  var dlBtn=$('#previewDownloadBtn');
  var dlBadge=$('#previewDownloadBadge');
  var extLink=$('#previewExternalLink');

  if(dlBtn&&activePath){
    dlBtn.href=activePath;
    dlBtn.setAttribute('data-download-key',activePath);
    dlBtn.textContent=currentPreviewType==='solution'?tt('solution_download'):tt('btn_download');
  }
  if(dlBadge&&activePath){
    dlBadge.setAttribute('data-count-for',activePath);
    dlBadge.textContent=tt('downloads_label')(activeCount);
  }
  if(extLink&&activePath){
    extLink.href=activePath;
    extLink.textContent=tt('open_new_tab');
  }

  var bodyEl=$('#previewBody');
  if(bodyEl&&activePath){
    if(window.__SPHOH_CANVAS_PAGES__&&window.__SPHOH_CANVAS_PAGES__[activePath]){
      renderCanvasSheetViewer(bodyEl,activePath,docHeading);
    }else{
      bodyEl.innerHTML='';
      var frame=document.createElement('iframe');
      frame.src=activePath;
      frame.title=docHeading;
      bodyEl.appendChild(frame);
    }
  }
}

function renderCanvasSheetViewer(bodyEl,activePath,docHeading){
  var pageInfo=window.__SPHOH_CANVAS_PAGES__[activePath];
  var imgs=pageInfo.images||[];
  var totalPages=pageInfo.total||imgs.length;

  bodyEl.innerHTML=
    '<div class="canvas-reader-bar">'+
      '<span>📄 '+escapeHtml(activePath)+' ('+(lang==='ar'?'إجمالي الصفحات: ':'Total pages: ')+totalPages+')</span>'+
      '<div class="canvas-reader-controls">'+
        '<button type="button" class="reader-icon-btn" data-zoom-dir="-">−</button>'+
        '<span id="readerZoomLabel">'+readerZoom+'%</span>'+
        '<button type="button" class="reader-icon-btn" data-zoom-dir="+">+</button>'+
      '</div>'+
    '</div>'+
    '<div class="canvas-pages-scroller" id="canvasPagesScroller"></div>';

  var scroller=$('#canvasPagesScroller',bodyEl);
  var sheetWidth=Math.round(740*(readerZoom/100));
  imgs.forEach(function(src,idx){
    var wrap=document.createElement('div');
    wrap.className='canvas-page-sheet';
    wrap.style.width=sheetWidth+'px';
    var img=document.createElement('img');
    img.src=src;
    img.alt=docHeading+' - Page '+(idx+1);
    wrap.appendChild(img);
    scroller.appendChild(wrap);
  });
}

function syncSimUrlBar(pageKey){
  var urlInput=$('#simBrowserUrlInput');
  if(!urlInput)return;
  var map={
    home:'index.html',
    files:'files.html',
    preview:'preview.html',
    about:'about.html',
    contact:'contact.html',
    admin:'Admin.html'
  };
  var fname=map[pageKey]||'index.html';
  urlInput.value='https://devfhd.github.io/SPhOH/'+fname;
}

function switchCanvasView(targetPage){
  $$('[data-page-view]').forEach(function(v){
    v.hidden=v.getAttribute('data-page-view')!==targetPage;
  });
  $$('.links a[data-nav-page]').forEach(function(a){
    a.classList.toggle('active',a.getAttribute('data-nav-page')===targetPage);
  });
  syncSimUrlBar(targetPage);
  if(targetPage==='preview')renderPreviewPage();
  if(targetPage==='admin')renderAdminPage();
  window.scrollTo({top:0,behavior:'smooth'});
}

function openPreviewFor(id,type){
  var p=findResourceById(id);
  if(!p)return;

  if(type==='solution'&&!buildSolutionPath(p)){
    toast(tt('solution_toast'));
    return;
  }

  currentPreviewId=Number(p.id);
  currentPreviewType=type==='solution'?'solution':'problem';

  var previewView=$('[data-page-view="preview"]');
  if(previewView){
    switchCanvasView('preview');
    return;
  }

  if($('#previewSection')){
    try{
      var newUrl='preview.html?id='+encodeURIComponent(currentPreviewId)+'&type='+encodeURIComponent(currentPreviewType);
      window.history.replaceState({},'',newUrl);
    }catch(e){}
    renderPreviewPage();
    window.scrollTo({top:0,behavior:'smooth'});
    return;
  }

  window.location.href='preview.html?id='+encodeURIComponent(currentPreviewId)+'&type='+encodeURIComponent(currentPreviewType);
}

/* =========================================================
   HIDDEN ADMIN PAGE RENDERER & LOGIC
   ========================================================= */
function isAdminUnlocked(){
  try{
    return sessionStorage.getItem(adminUnlockKey)==='1';
  }catch(e){
    return false;
  }
}

function setAdminUnlocked(val){
  try{
    if(val)sessionStorage.setItem(adminUnlockKey,'1');
    else sessionStorage.removeItem(adminUnlockKey);
  }catch(e){}
}

function updateStemPathHint(){
  var stemInput=$('#adminFileStem');
  var hintEl=$('#adminStemHint');
  if(!stemInput||!hintEl)return;
  var stem=(stemInput.value||'New_Curriculum_I').trim().replace(/\.pdf$/i,'').replace(/_(AR|ENG)$/i,'')||'New_Curriculum_I';
  hintEl.innerHTML=
    '<div>📘 <b>PDFs/ar/'+escapeHtml(stem)+'_AR.pdf</b> | <b>PDFs/en/'+escapeHtml(stem)+'_ENG.pdf</b></div>'+
    '<div>✅ <b>PDFs/ar/'+escapeHtml(stem)+'_Solutions_AR.pdf</b> | <b>PDFs/en/'+escapeHtml(stem)+'_Solutions_ENG.pdf</b></div>';
}

function toggleNewTopicBox(){
  var topicSel=$('#adminTopic');
  var newBox=$('#adminNewTopicBox');
  if(!topicSel||!newBox)return;
  var isNew=topicSel.value==='__new__';
  newBox.hidden=!isNew;
  var arIn=$('#adminNewTopicAr');
  var enIn=$('#adminNewTopicEn');
  if(arIn)arIn.required=isNew;
  if(enIn)enIn.required=isNew;
}

function openAdminFormDrawer(isEdit){
  isAdminFormOpen=true;
  var drawer=$('#adminFormModalCard');
  if(drawer)drawer.hidden=false;
  var heading=$('#adminFormHeading');
  if(heading)heading.textContent=isEdit?tt('admin_form_edit_title'):tt('admin_form_add_title');
  if(drawer)drawer.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function renderAdminPage(){
  var gate=$('#adminLoginGate');
  var dash=$('#adminDashboard');
  if(!gate||!dash)return;

  var unlocked=isAdminUnlocked();
  gate.hidden=unlocked;
  dash.hidden=!unlocked;

  var passInput=$('#adminPasswordInput');
  if(passInput)passInput.placeholder=tt('admin_pass_placeholder');

  if(!unlocked)return;

  var drawer=$('#adminFormModalCard');
  if(drawer)drawer.hidden=!isAdminFormOpen;

  var heading=$('#adminFormHeading');
  if(heading)heading.textContent=editingResourceId!==null?tt('admin_form_edit_title'):tt('admin_form_add_title');

  // Populate Topic Select in Admin Form + Option to Create Brand-New Topic
  var topicSel=$('#adminTopic');
  if(topicSel){
    var curTopic=topicSel.value||'kin';
    topicSel.innerHTML='';
    Object.keys(TOPICS).forEach(function(k){
      var opt=document.createElement('option');
      opt.value=k;
      opt.textContent=TOPICS[k][lang]+' ('+k+')';
      topicSel.appendChild(opt);
    });
    var newOpt=document.createElement('option');
    newOpt.value='__new__';
    newOpt.textContent=tt('admin_opt_new_topic');
    topicSel.appendChild(newOpt);
    topicSel.value=(TOPICS[curTopic]||curTopic==='__new__')?curTopic:'kin';
    toggleNewTopicBox();
  }

  // Populate Level Select in Admin Form
  var lvlSel=$('#adminLevel');
  if(lvlSel){
    var curLvl=lvlSel.value||'1';
    lvlSel.innerHTML='';
    [1,2,3].forEach(function(l){
      var opt=document.createElement('option');
      opt.value=String(l);
      opt.textContent=LEVELS[l][lang]+' (Level '+l+')';
      lvlSel.appendChild(opt);
    });
    lvlSel.value=curLvl;
  }

  updateStemPathHint();

  // Render Existing Curricula List with 1-Click Solution Toggles
  var listEl=$('#adminResourcesList');
  if(!listEl)return;
  listEl.innerHTML='';

  P.forEach(function(p){
    var hasArSol=Boolean(solutionFileForLang(p,'ar'));
    var hasEnSol=Boolean(solutionFileForLang(p,'en'));
    var titleText=(p.title&&p.title[lang]?p.title[lang]:p.file);
    var otherTitle=(p.title&&p.title[lang==='ar'?'en':'ar']?p.title[lang==='ar'?'en':'ar']:'');

    var row=document.createElement('div');
    row.className='admin-item';
    row.innerHTML=
      '<div class="admin-item-head">'+
        '<div>'+
          '<div class="tags" style="margin-bottom:6px">'+renderTagsHtml(p)+'</div>'+
          '<div class="admin-item-title">'+escapeHtml(titleText)+(otherTitle?' <span style="color:var(--muted);font-weight:400;font-size:.88rem">/ '+escapeHtml(otherTitle)+'</span>':'')+'</div>'+
          '<div class="admin-item-stem">'+escapeHtml(p.file)+'</div>'+
        '</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
          '<button type="button" class="btn btn-ghost btn-sm" data-admin-edit="'+escapeHtml(p.id)+'">✏️ '+(lang==='ar'?'تعديل':'Edit')+'</button>'+
          '<button type="button" class="btn btn-danger btn-sm" data-admin-delete="'+escapeHtml(p.id)+'">🗑️ '+(lang==='ar'?'حذف':'Delete')+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="admin-sol-toggles">'+
        '<span style="font-size:.84rem;color:var(--muted);font-weight:600">'+(lang==='ar'?'تفعيل الحلول بضغطة واحدة:':'Quick Solution Toggles:')+'</span>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
          '<button type="button" class="sol-chip-btn '+(hasArSol?'is-on':'')+'" data-toggle-sol="'+escapeHtml(p.id)+'" data-sol-lang="ar">'+
            (hasArSol?'✅ ':'⬜ ')+(lang==='ar'?'الحل العربي (AR)':'Arabic Solution (AR)')+
          '</button>'+
          '<button type="button" class="sol-chip-btn '+(hasEnSol?'is-on':'')+'" data-toggle-sol="'+escapeHtml(p.id)+'" data-sol-lang="en">'+
            (hasEnSol?'✅ ':'⬜ ')+(lang==='ar'?'الحل الإنجليزي (EN)':'English Solution (EN)')+
          '</button>'+
        '</div>'+
      '</div>';

    listEl.appendChild(row);
  });
}

function toggleResourceSolutionLang(id,targetLang){
  var p=findResourceById(id);
  if(!p)return;
  var solStem=p.file+'_Solutions';
  var curAr=Boolean(solutionFileForLang(p,'ar'));
  var curEn=Boolean(solutionFileForLang(p,'en'));

  if(targetLang==='ar')curAr=!curAr;
  if(targetLang==='en')curEn=!curEn;

  if(curAr&&curEn){
    p.solution=solStem;
  }else if(!curAr&&!curEn){
    p.solution=null;
  }else{
    p.solution={
      en:curEn?solStem:null,
      ar:curAr?solStem:null
    };
  }

  saveCustomResources(P);
  applyLang();
  toast(tt('admin_saved_toast'));
}

function populateAdminFormForEdit(id){
  var p=findResourceById(id);
  if(!p)return;
  editingResourceId=Number(p.id);
  openAdminFormDrawer(true);

  var topicSel=$('#adminTopic');
  var lvlSel=$('#adminLevel');
  var stemIn=$('#adminFileStem');
  var tAr=$('#adminTitleAr');
  var tEn=$('#adminTitleEn');
  var dAr=$('#adminDescAr');
  var dEn=$('#adminDescEn');
  var solMode=$('#adminSolutionMode');
  var cancelBtn=$('#adminCancelEditBtn');

  if(topicSel){
    topicSel.value=p.t||'kin';
    toggleNewTopicBox();
  }
  if(lvlSel)lvlSel.value=String(p.l||1);
  if(stemIn)stemIn.value=p.file||'';
  if(tAr)tAr.value=(p.title&&p.title.ar)||'';
  if(tEn)tEn.value=(p.title&&p.title.en)||'';
  if(dAr)dAr.value=(p.desc&&p.desc.ar)||'';
  if(dEn)dEn.value=(p.desc&&p.desc.en)||'';

  var hasAr=Boolean(solutionFileForLang(p,'ar'));
  var hasEn=Boolean(solutionFileForLang(p,'en'));
  if(solMode){
    if(hasAr&&hasEn)solMode.value='both';
    else if(hasAr)solMode.value='ar';
    else if(hasEn)solMode.value='en';
    else solMode.value='none';
  }
  if(cancelBtn)cancelBtn.hidden=false;
  updateStemPathHint();
}

function resetAdminForm(){
  editingResourceId=null;
  isAdminFormOpen=false;
  var form=$('#adminResourceForm');
  if(form)form.reset();
  var newBox=$('#adminNewTopicBox');
  if(newBox)newBox.hidden=true;
  var drawer=$('#adminFormModalCard');
  if(drawer)drawer.hidden=true;
  updateStemPathHint();
}

/* Filters & Grid Rendering */
function renderFilters(){
  var chipsWrap=$('#topicFilters');
  var levelSelect=$('#levelFilter');
  var searchInput=$('#searchInput');

  if(chipsWrap){
    var availableTopics=['all'];
    P.forEach(function(p){
      if(availableTopics.indexOf(p.t)===-1)availableTopics.push(p.t);
    });

    chipsWrap.innerHTML='';
    availableTopics.forEach(function(tKey){
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='filter-chip'+(activeTopic===tKey?' active':'');
      btn.setAttribute('data-filter-topic',tKey);
      btn.textContent=tKey==='all'?tt('filter_all'):(TOPICS[tKey]?TOPICS[tKey][lang]:tKey);
      chipsWrap.appendChild(btn);
    });
  }

  if(levelSelect){
    var currentVal=activeLevel;
    levelSelect.innerHTML='';
    var optAll=document.createElement('option');
    optAll.value='all';
    optAll.textContent=tt('level_all');
    levelSelect.appendChild(optAll);

    [1,2,3].forEach(function(lvl){
      var opt=document.createElement('option');
      opt.value=String(lvl);
      opt.textContent=LEVELS[lvl][lang];
      levelSelect.appendChild(opt);
    });
    levelSelect.value=currentVal;
  }

  if(searchInput){
    searchInput.placeholder=tt('search_placeholder');
  }
}

function getFilteredResources(){
  var q=searchQuery.trim().toLowerCase();
  return P.filter(function(p){
    if(activeTopic!=='all'&&p.t!==activeTopic)return false;
    if(activeLevel!=='all'&&String(p.l)!==String(activeLevel))return false;
    if(q){
      var hay=(
        (p.title&&p.title.en||'')+' '+
        (p.title&&p.title.ar||'')+' '+
        (p.desc&&p.desc.en||'')+' '+
        (p.desc&&p.desc.ar||'')+' '+
        (p.file||'')
      ).toLowerCase();
      if(hay.indexOf(q)===-1)return false;
    }
    return true;
  });
}

function renderGrid(){
  var container=$('#sectionsContainer');
  if(!container)return;

  var list=getFilteredResources();
  var counts=getCounts();

  var countEl=$('#count');
  if(countEl)countEl.textContent=tt('n_sets')(list.length);

  var emptyEl=$('#empty');
  if(emptyEl)emptyEl.hidden=list.length>0;

  container.innerHTML='';
  if(list.length===0)return;

  var grouped={};
  var order=['kin','mech','math','coll','elec','therm','opt'];

  list.forEach(function(p){
    if(!grouped[p.t])grouped[p.t]=[];
    grouped[p.t].push(p);
  });

  var keys=Object.keys(grouped).sort(function(a,b){
    var ia=order.indexOf(a), ib=order.indexOf(b);
    return (ia===-1?99:ia)-(ib===-1?99:ib);
  });

  keys.forEach(function(topicKey){
    var groupEl=document.createElement('div');
    groupEl.className='topic-group';

    var titleText=TOPICS[topicKey]?TOPICS[topicKey][lang]:topicKey;
    var items=grouped[topicKey];

    var html='<h3 class="topic-title">'+
      '<span>'+escapeHtml(titleText)+'</span>'+
      '<span class="topic-count-badge">'+items.length+'</span>'+
    '</h3><div class="grid">';

    items.forEach(function(p){
      html+=renderCardHtml(p,counts);
    });

    html+='</div>';
    groupEl.innerHTML=html;
    container.appendChild(groupEl);
  });
}

function renderFeatured(){
  var container=$('#featuredContainer');
  if(!container)return;
  var counts=getCounts();
  var featured=P.slice(0,3);
  var html='';
  featured.forEach(function(p){
    html+=renderCardHtml(p,counts);
  });
  container.innerHTML=html;
}

function renderTeam(){
  var container=$('#teamContainer');
  if(!container)return;
  container.innerHTML='';
  TEAM.forEach(function(m){
    var row=document.createElement('div');
    row.className='member-item';
    var nameSpan=document.createElement('span');
    nameSpan.className='member-name';
    nameSpan.textContent=m.name;
    var roleSpan=document.createElement('span');
    roleSpan.className='member-role';
    roleSpan.textContent=m.role[lang]||m.role.en;
    row.appendChild(nameSpan);
    row.appendChild(roleSpan);
    container.appendChild(row);
  });
}

function renderFAQ(){
  var container=$('#faqContainer');
  if(!container)return;

  container.innerHTML='';

  FAQS.forEach(function(faq,index){
    var item=document.createElement('div');
    item.className='faq-item';

    var question=document.createElement('button');
    question.type='button';
    question.className='faq-question';
    question.setAttribute('aria-expanded','false');
    question.setAttribute('data-faq',String(index));

    var questionText=document.createElement('span');
    questionText.textContent=faq.q[lang];

    var icon=document.createElement('span');
    icon.className='faq-icon';
    icon.textContent='+';
    icon.setAttribute('aria-hidden','true');

    question.appendChild(questionText);
    question.appendChild(icon);

    var answer=document.createElement('div');
    answer.className='faq-answer';
    answer.hidden=true;

    var answerText=document.createElement('p');
    answerText.style.margin='0';
    answerText.textContent=faq.a[lang];

    answer.appendChild(answerText);

    item.appendChild(question);
    item.appendChild(answer);
    container.appendChild(item);
  });
}

/* Language Application */
function applyLang(){
  var root=document.documentElement;
  root.lang=lang;
  root.dir=lang==='ar'?'rtl':'ltr';

  $$('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    var value=tt(key);
    if(typeof value==='string'){
      el.textContent=value;
    }
  });

  $$('#langBtn span').forEach(function(sp){
    sp.classList.toggle('on',sp.getAttribute('data-l')===lang);
  });

  applyTheme();
  renderFilters();
  renderGrid();
  renderFeatured();
  renderPreviewPage();
  renderAdminPage();
  renderTeam();
  renderFAQ();
}

/* Toast */
var toastT;
function toast(msg){
  var t=$('#toast');
  if(!t)return;
  t.textContent=msg;
  t.hidden=false;
  clearTimeout(toastT);
  toastT=setTimeout(function(){
    t.hidden=true;
  },3200);
}

/* Event Delegation */
document.addEventListener('click',function(e){
  var navPage=e.target.closest('[data-nav-page]');
  if(navPage&&window.__SPHOH_CANVAS_MODE__){
    e.preventDefault();
    var targetPage=navPage.getAttribute('data-nav-page');
    switchCanvasView(targetPage);
    return;
  }

  var openPrev=e.target.closest('[data-open-preview]');
  if(openPrev){
    if(window.__SPHOH_CANVAS_MODE__||$('#previewSection')){
      e.preventDefault();
      openPreviewFor(
        openPrev.getAttribute('data-open-preview'),
        openPrev.getAttribute('data-preview-type')||'problem'
      );
      return;
    }
  }

  var tabBtn=e.target.closest('[data-preview-tab]');
  if(tabBtn){
    var targetType=tabBtn.getAttribute('data-preview-tab');
    var p=findResourceById(currentPreviewId);
    if(targetType==='solution'&&!buildSolutionPath(p)){
      toast(tt('solution_toast'));
      return;
    }
    currentPreviewType=targetType;
    renderPreviewPage();
    return;
  }

  var stepBtn=e.target.closest('[data-preview-step]');
  if(stepBtn&&P.length>0){
    var dir=Number(stepBtn.getAttribute('data-preview-step'));
    var idx=0;
    for(var i=0;i<P.length;i++){
      if(Number(P[i].id)===Number(currentPreviewId)){idx=i;break;}
    }
    var nextIdx=(idx+dir+P.length)%P.length;
    currentPreviewId=P[nextIdx].id;
    currentPreviewType='problem';
    renderPreviewPage();
    return;
  }

  var focusToggle=e.target.closest('#previewFocusBtn, #previewCloseBtn');
  if(focusToggle){
    isFocusMode=!isFocusMode;
    renderPreviewPage();
    return;
  }

  var zoomBtn=e.target.closest('[data-zoom-dir]');
  if(zoomBtn){
    var zDir=zoomBtn.getAttribute('data-zoom-dir');
    if(zDir==='+'&&readerZoom<140)readerZoom+=15;
    if(zDir==='-'&&readerZoom>70)readerZoom-=15;
    var zLabel=$('#readerZoomLabel');
    if(zLabel)zLabel.textContent=readerZoom+'%';
    var w=Math.round(740*(readerZoom/100));
    $$('.canvas-page-sheet').forEach(function(s){s.style.width=w+'px';});
    return;
  }

  var chip=e.target.closest('[data-filter-topic]');
  if(chip){
    activeTopic=chip.getAttribute('data-filter-topic');
    renderFilters();
    renderGrid();
    return;
  }

  var dlLink=e.target.closest('[data-download-key]');
  if(dlLink){
    var key=dlLink.getAttribute('data-download-key');
    if(window.__SPHOH_CANVAS_MODE__){
      e.preventDefault();
    }
    incrementCount(key);
    toast(tt('download_started'));
    return;
  }

  var missing=e.target.closest('[data-missing-file]');
  if(missing){
    e.preventDefault();
    toast(missing.getAttribute('data-missing-file')==='solution'
      ?tt('solution_toast')
      :tt('pdf_toast'));
    return;
  }

  var faqBtn=e.target.closest('[data-faq]');
  if(faqBtn){
    var item=faqBtn.closest('.faq-item');
    var ans=item.querySelector('.faq-answer');
    var isOpen=faqBtn.getAttribute('aria-expanded')==='true';
    item.toggleAttribute('open',!isOpen);
    ans.hidden=isOpen;
    faqBtn.setAttribute('aria-expanded',String(!isOpen));
    return;
  }

  var copyBtn=e.target.closest('#copyEmailBtn');
  if(copyBtn){
    var email='sphohc@gmail.com';
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(email).then(function(){
        toast(tt('email_copied'));
      }).catch(function(){
        fallbackCopy(email,tt('email_copied'));
      });
    }else{
      fallbackCopy(email,tt('email_copied'));
    }
    return;
  }

  /* Admin Click Actions */
  var solToggleBtn=e.target.closest('[data-toggle-sol]');
  if(solToggleBtn){
    toggleResourceSolutionLang(
      solToggleBtn.getAttribute('data-toggle-sol'),
      solToggleBtn.getAttribute('data-sol-lang')
    );
    return;
  }

  var editBtn=e.target.closest('[data-admin-edit]');
  if(editBtn){
    populateAdminFormForEdit(editBtn.getAttribute('data-admin-edit'));
    return;
  }

  var delBtn=e.target.closest('[data-admin-delete]');
  if(delBtn){
    var delId=Number(delBtn.getAttribute('data-admin-delete'));
    var nextList=P.filter(function(item){return Number(item.id)!==delId;});
    saveCustomResources(nextList);
    applyLang();
    toast(lang==='ar'?'تم حذف المنهج بنجاح.':'Curriculum removed.');
    return;
  }

  var openAddBtn=e.target.closest('#openAddCurriculumBtn');
  if(openAddBtn){
    editingResourceId=null;
    var form=$('#adminResourceForm');
    if(form)form.reset();
    toggleNewTopicBox();
    updateStemPathHint();
    openAdminFormDrawer(false);
    return;
  }

  var cancelEdit=e.target.closest('#adminCancelEditBtn, #adminCloseFormBtn');
  if(cancelEdit){
    resetAdminForm();
    return;
  }

  var lockBtn=e.target.closest('#adminLogoutBtn');
  if(lockBtn){
    setAdminUnlocked(false);
    renderAdminPage();
    return;
  }

  var exportJsonBtn=e.target.closest('#adminExportJsonBtn');
  if(exportJsonBtn){
    var jsonStr=JSON.stringify(P,null,2);
    var blob=new Blob([jsonStr],{type:'application/json;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;
    a.download='resources.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},1500);
    return;
  }

  var copyJsonBtn=e.target.closest('#adminCopyJsonBtn');
  if(copyJsonBtn){
    var jsonText=JSON.stringify(P,null,2);
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(jsonText).then(function(){
        toast(tt('admin_json_copied'));
      }).catch(function(){
        fallbackCopy(jsonText,tt('admin_json_copied'));
      });
    }else{
      fallbackCopy(jsonText,tt('admin_json_copied'));
    }
    return;
  }

  var resetDefaultBtn=e.target.closest('#adminResetDefaultBtn');
  if(resetDefaultBtn){
    CurriculumDB.resetAll();
    resetAdminForm();
    applyLang();
    toast(tt('admin_reset_toast'));
    return;
  }
});

/* Admin Forms & Simulated URL Bar Submit */
document.addEventListener('submit',function(e){
  if(e.target&&e.target.id==='adminLoginForm'){
    e.preventDefault();
    var passInput=$('#adminPasswordInput');
    var errEl=$('#adminLoginError');
    var entered=(passInput&&passInput.value)||'';
    if(entered===ADMIN_PASSWORD){
      setAdminUnlocked(true);
      if(errEl)errEl.hidden=true;
      if(passInput)passInput.value='';
      renderAdminPage();
    }else{
      if(errEl)errEl.hidden=false;
    }
    return;
  }

  if(e.target&&e.target.id==='adminResourceForm'){
    e.preventDefault();
    var tVal=($('#adminTopic')&&$('#adminTopic').value)||'kin';
    if(tVal==='__new__'){
      var newAr=($('#adminNewTopicAr')&&$('#adminNewTopicAr').value)||'';
      var newEn=($('#adminNewTopicEn')&&$('#adminNewTopicEn').value)||'';
      var newKey=($('#adminNewTopicKey')&&$('#adminNewTopicKey').value)||newEn;
      tVal=CurriculumDB.addTopic(newKey,newAr,newEn);
    }
    var lVal=Number(($('#adminLevel')&&$('#adminLevel').value)||1);
    var rawStem=(($('#adminFileStem')&&$('#adminFileStem').value)||'').trim();
    var cleanStem=rawStem.replace(/\.pdf$/i,'').replace(/_(AR|ENG)$/i,'').replace(/\s+/g,'_');
    if(!cleanStem)return;

    var titleAr=(($('#adminTitleAr')&&$('#adminTitleAr').value)||'').trim()||cleanStem;
    var titleEn=(($('#adminTitleEn')&&$('#adminTitleEn').value)||'').trim()||cleanStem.replace(/_/g,' ');
    var descAr=(($('#adminDescAr')&&$('#adminDescAr').value)||'').trim();
    var descEn=(($('#adminDescEn')&&$('#adminDescEn').value)||'').trim();
    var solMode=($('#adminSolutionMode')&&$('#adminSolutionMode').value)||'none';

    var solStem=cleanStem+'_Solutions';
    var solField=null;
    if(solMode==='both')solField=solStem;
    else if(solMode==='ar')solField={en:null,ar:solStem};
    else if(solMode==='en')solField={en:solStem,ar:null};

    if(editingResourceId!==null){
      for(var i=0;i<P.length;i++){
        if(Number(P[i].id)===Number(editingResourceId)){
          P[i]={
            id:P[i].id,
            t:tVal,
            l:lVal,
            file:cleanStem,
            solution:solField,
            title:{en:titleEn,ar:titleAr},
            desc:{en:descEn,ar:descAr}
          };
          break;
        }
      }
    }else{
      var maxId=0;
      P.forEach(function(item){if(Number(item.id)>maxId)maxId=Number(item.id);});
      P.push({
        id:maxId+1,
        t:tVal,
        l:lVal,
        file:cleanStem,
        solution:solField,
        title:{en:titleEn,ar:titleAr},
        desc:{en:descEn,ar:descAr}
      });
    }

    saveCustomResources(P);
    resetAdminForm();
    applyLang();
    toast(tt('admin_saved_toast'));
    return;
  }

  if(e.target&&e.target.id==='simBrowserUrlForm'){
    e.preventDefault();
    var urlIn=$('#simBrowserUrlInput');
    if(!urlIn)return;
    var rawUrl=urlIn.value.trim();
    var lastSeg=rawUrl.split('/').pop().split('?')[0].split('#')[0].replace(/\.html$/i,'').toLowerCase();
    var routeMap={
      '':'home',
      'index':'home',
      'sphoh':'home',
      'files':'files',
      'preview':'preview',
      'about':'about',
      'contact':'contact',
      'admin':'admin'
    };
    var target=routeMap[lastSeg];
    if(target){
      switchCanvasView(target);
    }else{
      toast(lang==='ar'?'الرابط غير معروف. غيّر index إلى Admin للوصول لصفحة المشرف.':'Unknown route. Change index to Admin to open the Admin page.');
    }
    return;
  }
});

document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='adminFileStem'){
    updateStemPathHint();
  }
});

document.addEventListener('change',function(e){
  if(e.target&&e.target.id==='adminTopic'){
    toggleNewTopicBox();
  }
  if(e.target&&e.target.id==='adminPdfFilePicker'){
    var files=e.target.files;
    if(files&&files[0]){
      var fname=files[0].name.replace(/\.pdf$/i,'').replace(/_Solutions(_(AR|ENG))?$/i,'').replace(/_(AR|ENG)$/i,'');
      var stemIn=$('#adminFileStem');
      if(stemIn){
        stemIn.value=fname;
        updateStemPathHint();
      }
      var titleEnIn=$('#adminTitleEn');
      if(titleEnIn&&!titleEnIn.value){
        titleEnIn.value=fname.replace(/_/g,' ');
      }
    }
  }
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&isFocusMode){
    isFocusMode=false;
    renderPreviewPage();
  }
});

function fallbackCopy(text,msg){
  var ta=document.createElement('textarea');
  ta.value=text;
  ta.style.position='fixed';
  ta.style.opacity='0';
  document.body.appendChild(ta);
  ta.select();
  try{document.execCommand('copy');}catch(e){}
  document.body.removeChild(ta);
  toast(msg||tt('email_copied'));
}

/* Filter & Preview Select Listeners */
var levelFilterEl=$('#levelFilter');
if(levelFilterEl){
  levelFilterEl.addEventListener('change',function(e){
    activeLevel=e.target.value;
    renderGrid();
  });
}

var searchInputEl=$('#searchInput');
if(searchInputEl){
  searchInputEl.addEventListener('input',function(e){
    searchQuery=e.target.value||'';
    renderGrid();
  });
}

var previewSelectEl=$('#previewResourceSelect');
if(previewSelectEl){
  previewSelectEl.addEventListener('change',function(e){
    currentPreviewId=Number(e.target.value);
    currentPreviewType='problem';
    renderPreviewPage();
  });
}

/* Language & Theme Buttons */
var langBtnEl=$('#langBtn');
if(langBtnEl){
  langBtnEl.addEventListener('click',function(){
    lang=lang==='ar'?'en':'ar';
    try{localStorage.setItem('sphoh-lang',lang);}catch(e){}
    applyLang();
  });
}

var themeBtnEl=$('#themeBtn');
if(themeBtnEl){
  themeBtnEl.addEventListener('click',function(){
    theme=isCurrentlyDark()?'light':'dark';
    try{localStorage.setItem('sphoh-theme',theme);}catch(e){}
    applyTheme();
  });
}

/* Initialize */
parseUrlPreviewParams();
applyTheme();
applyLang();
loadResources().then(applyLang);

})();
