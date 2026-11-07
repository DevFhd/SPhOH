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
      langs: ['ar', 'en'],
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
