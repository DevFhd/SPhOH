(function(){

'use strict';

var TOPICS={
  kin:{en:'Kinematics',ar:'الحركة'},
  mech:{en:'Mechanics',ar:'الميكانيكا'},
  math:{en:'Mathematics',ar:'الرياضيات'},
  coll:{en:'Collections',ar:'المجموعات'},
  elec:{en:'Electricity',ar:'الكهرباء'},
  therm:{en:'Thermodynamics',ar:'الديناميكا الحرارية'},
  opt:{en:'Optics',ar:'البصريات'}
};

var LEVELS={
  1:{en:'Level I',ar:'المستوى الأول'},
  2:{en:'Level II',ar:'المستوى الثاني'},
  3:{en:'Challenge',ar:'تحدٍّ'}
};

var FAQS=[
  {
    q:{
      en:'What is SPhOH?',
      ar:'ما هو SPhOH؟'
    },
    a:{
      en:'SPhOH (Physics Olympiad Hub) is a specialized training platform providing high-quality problem sets and resources for students preparing for national and international physics olympiads.',
      ar:'SPhOH هي منصة تدريبية متخصصة تقدم مجموعات مسائل وموارد عالية الجودة للطلاب المستعدين للأولمبيادات الوطنية والدولية للفيزياء.'
    }
  },
  {
    q:{
      en:'Are all problem sets free to download?',
      ar:'هل جميع مجموعات المسائل مجانية للتحميل؟'
    },
    a:{
      en:'Yes, all our PDFs and resources are completely free for students, teachers, and physics enthusiasts worldwide.',
      ar:'نعم، جميع ملفات PDF والموارد المتاحة مجانية تماماً للطلاب والمعلمين وشغوفي الفيزياء حول العالم.'
    }
  },
  {
    q:{
      en:'How can I contribute or report errors?',
      ar:'كيف يمكنني المساهمة أو الإبلاغ عن خطأ في المسائل؟'
    },
    a:{
      en:'You can submit feedback through our Google Form in the contact section. You can also follow our Telegram channel for updates.',
      ar:'يمكنك إرسال ملاحظاتك عبر نموذج Google في قسم التواصل، كما يمكنك متابعة قناة تيليجرام للاطلاع على التحديثات.'
    }
  },
  {
    q:{
      en:'How did you get your problems?',
      ar:'كيف تكتبون مسائلكم؟'
    },
    a:{
      en:'As Olympiad students, we write most of the problems by ourselves. However, some problems have been inspired by famous resources: Irodov, Physics for Scientists and Engineers, Fundamentals of Physics, and previous Olympiad problems.',
      ar:'كطلاب أولمبياد، نكتب معظم المسائل بأنفسنا. إلا أن هناك بعض المسائل المستلهمة من مصادر مشهورة: إيرودوف، والفيزياء للعلماء والمهندسين، وأساسيات الفيزياء، ومسائل الأولمبيادات السابقة.'
    }
  }
];

var UI={
  en:{
    nav_home:'Home',
    nav_about:'About Us',
    nav_files:'Files',
    nav_faq:'FAQ',
    nav_contact:'Contact',

    hero_eyebrow:'Physics Olympiad Hub',
    hero_title:'Solve harder problems. Think like a physicist.',
    hero_desc:'SPhOH is an open global training hub for physics enthusiasts and students preparing for national and international physics olympiads (IPhO, APhO, EuPhO, and National Selections). Download and preview curated problem sets.',
    hero_cta:'Browse problem sets',

    about_eyebrow:'About Us',
    about_title:'Built for deliberate practice',
    about_desc:'SPhOH is a dedicated training hub for advanced physics competitions worldwide. Every set is designed around deliberate practice: working on problems just beyond your current level.',

    p1_t:'Graded difficulty',
    p1_d:'Each problem set is marked Level I, Level II or Challenge, so you can climb at your own pace.',
    p2_t:'Olympiad Focus',
    p2_d:'Topics and styles mirror what students meet in national team selection and International Physics Olympiad preparation.',
    p3_t:'Structured Content',
    p3_d:'Problems carefully compiled and formatted for straightforward studying and reference.',

    team_title:'The SPhOH Founders & Team',
    team_desc:'The SPhOH Team writes, checks, and organizes every problem set on the hub, with the goal of making serious physics practice accessible in both Arabic and English.',
    team_vision:'Our vision: every capable physics student worldwide has access to high-quality practice material to compete at the highest level.',

    files_eyebrow:'Files',
    files_title:'Files & Problem Sets',

    translation_notice:'Translations have recently been completed. The files will now download or open in the language you have selected.',

    faq_eyebrow:'FAQ',
    faq_title:'Frequently Asked Questions',

    empty:'No problem sets found.',
    btn_preview:'👁️ Preview PDF',
    btn_download:'📥 Download PDF',
    pdf_toast:'The PDF for this set has not been attached yet.',

    n_sets:function(n){
      return n+(n===1?' problem set':' problem sets');
    },

    contact_eyebrow:'Contact',
    contact_title:'Get in touch',
    contact_desc:'Found a mistake, want to suggest a topic, or interested in contributing problems? Write to the SPhOH Team.',

    fb_title:'Have feedback or suggestions?',
    fb_desc:'Help us improve SPhOH by filling out our feedback form.',
    fb_btn:'Open Feedback Form ↗',

    telegram_title:'Join the SPhOH Telegram Channel',
    telegram_desc:'Get updates about new problem sets, resources, and announcements. Join our Telegram community to stay connected with SPhOH.',
    telegram_btn:'Join Telegram ↗',
    telegram_footer:'Telegram Channel',

    c_name:'Name',
    c_email:'Email',
    c_msg:'Message',
    c_send:'Send message',

    e_name:'Please enter your name.',
    e_email:'Please enter a valid email address.',
    e_msg:'Please write a message.',

    c_ok:'Your message is complete, but sending is not connected on this page yet.',
    foot:'Deliberate practice for physics olympiads'
  },

  ar:{
    nav_home:'الرئيسية',
    nav_about:'من نحن',
    nav_files:'الملفات',
    nav_faq:'الأسئلة الشائعة',
    nav_contact:'تواصل',

    hero_eyebrow:'مركز أولمبياد الفيزياء',
    hero_title:'حلّ مسائل أصعب. فكّر كفيزيائي.',
    hero_desc:'SPhOH منصة تدريب عالمية مفتوحة للطلاب والمهتمين المستعدين للأولمبيادات الوطنية والدولية للفيزياء (IPhO, APhO, EuPhO والترشيحات الوطنية). تصفح وعاين وحمّل مجموعات المسائل المتقدمة.',
    hero_cta:'تصفّح مجموعات المسائل',

    about_eyebrow:'من نحن',
    about_title:'منصة قائمة على التدريب المكثف',
    about_desc:'SPhOH مورد تدريبي لمسابقات الفيزياء المتقدمة. صُممت كل مجموعة على مبدأ التدريب المكثف: العمل على مسائل أعلى قليلاً من مستواك الحالي.',

    p1_t:'مستويات متدرجة',
    p1_d:'كل مجموعة مسائل مصنفة: المستوى الأول أو الثاني أو تحدٍّ، لتتقدم بالسرعة التي تناسبك.',
    p2_t:'تركيز على الأولمبياد',
    p2_d:'المواضيع والأساليب تتبع ما يواجهه الطلاب في ترشيحات المنتخبات الوطنية والاستعداد لأولمبياد الفيزياء الدولي.',
    p3_t:'محتوى منظم',
    p3_d:'مسائل مجمعة ومنسقة بعناية لتسهيل الدراسة والمراجعة.',

    team_title:'مؤسسو وفريق SPhOH',
    team_desc:'يكتب فريق SPhOH مجموعات المسائل في المنصة ويراجعها وينظمها، بهدف جعل التدريب الجاد في الفيزياء متاحاً باللغتين العربية والإنجليزية.',
    team_vision:'رؤيتنا: أن يملك كل طالب شغوف بالفيزياء حول العالم مادة التدريب التي تمكّنه من المنافسة على أعلى مستوى.',

    files_eyebrow:'الملفات',
    files_title:'الملفات ومجموعات المسائل',

    translation_notice:'تمت ترجمة المسائل حديثاً. سيتم الآن عرض وتحميل الملفات بناءً على اللغة التي اخترتها (عربية أو إنجليزية).',

    faq_eyebrow:'الأسئلة الشائعة',
    faq_title:'الأسئلة المتكررة والمعلومات العامة',

    empty:'لا توجد مجموعات مسائل حالياً.',
    btn_preview:'👁️ معاينة PDF',
    btn_download:'📥 تحميل PDF',
    pdf_toast:'لم يُرفق ملف PDF لهذه المجموعة بعد.',

    n_sets:function(n){
      return n+' '+(n===1?'مجموعة':(n===2?'مجموعتان':(n<=10?'مجموعات':'مجموعة')));
    },

    contact_eyebrow:'تواصل',
    contact_title:'تواصل معنا',
    contact_desc:'وجدت خطأً، أو تريد اقتراح موضوع، أو ترغب في المساهمة بمسائل؟ اكتب إلى فريق SPhOH.',

    fb_title:'لديك ملاحظات أو اقتراحات؟',
    fb_desc:'ساعدنا في تطوير منصة SPhOH من خلال تعبئة نموذج الملاحظات.',
    fb_btn:'تعبئة نموذج الملاحظات ↗',

    telegram_title:'انضم إلى قناة SPhOH على تيليجرام',
    telegram_desc:'تابعنا للاطلاع على مجموعات المسائل الجديدة والموارد والإعلانات. انضم إلى مجتمعنا على تيليجرام لتبقى على تواصل مع SPhOH.',
    telegram_btn:'انضم إلى تيليجرام ↗',
    telegram_footer:'قناة تيليجرام',

    c_name:'الاسم',
    c_email:'البريد الإلكتروني',
    c_msg:'الرسالة',
    c_send:'إرسال الرسالة',

    e_name:'يرجى إدخال اسمك.',
    e_email:'يرجى إدخال بريد إلكتروني صحيح.',
    e_msg:'يرجى كتابة رسالة.',

    c_ok:'رسالتك مكتملة، لكن الإرسال غير مفعّل في هذه الصفحة بعد.',
    foot:'تدريب مكثف لأولمبياد الفيزياء'
  }
};


/* Problem sets (loaded from data/resources.json) */

var P=[];
var SUFFIX={ar:'AR',en:'ENG'};

function loadResources(){
  return fetch('data/resources.json')
    .then(function(r){
      if(!r.ok)throw new Error('HTTP '+r.status);
      return r.json();
    })
    .then(function(data){
      P=data;
    })
    .catch(function(err){
      console.error('Failed to load resources.json',err);
    });
}

function buildPdfPath(p){
  return 'PDFs/'+lang+'/'+encodeURIComponent(p.file+'_'+SUFFIX[lang]+'.pdf');
}

/* Settings */

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

var $=function(s,r){
  return (r||document).querySelector(s);
};

var $$=function(s,r){
  return Array.prototype.slice.call((r||document).querySelectorAll(s));
};

function tt(k){
  return UI[lang][k];
}

/* Theme */

function applyTheme(){
  var root=document.documentElement;

  if(theme==='auto'){
    root.removeAttribute('data-theme');

    var isDark=window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    $('#themeIcon').textContent=isDark?'🌙':'☀️';
    $('#themeText').textContent=isDark?'Dark':'Light';
  }else{
    root.setAttribute('data-theme',theme);

    var isDark=theme==='dark';

    $('#themeIcon').textContent=isDark?'🌙':'☀️';
    $('#themeText').textContent=isDark?'Dark':'Light';
  }
}

/* Language */

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
    sp.classList.toggle(
      'on',
      sp.getAttribute('data-l')===lang
    );
  });

  renderGrid();
  renderFAQ();

  var statusEl=$('#status');

  if(statusEl){
    statusEl.textContent='';
    statusEl.className='status';
  }

  ['name','email','message'].forEach(function(k){
    var el=$('#e_'+k);
    if(el)el.textContent='';
  });
}

/* Problem set cards */

function tags(p){
  var pips='';

  for(var i=1;i<=3;i++){
    pips+='<b'+(i<=p.l?' class="on"':'')+'></b>';
  }

  return '<span class="tag" data-topic="'+p.t+'">'+
    TOPICS[p.t][lang]+
    '</span>'+
    '<span class="tag lvl" data-lvl="'+p.l+'">'+
    '<span class="pips">'+pips+'</span>'+
    LEVELS[p.l][lang]+
    '</span>';
}

function renderGrid(){
  var list=P;

  $('#count').textContent=tt('n_sets')(list.length);
  $('#empty').hidden=list.length>0;

  var container=$('#sectionsContainer');
  container.innerHTML='';

  if(list.length===0)return;

  var grouped={};

  list.forEach(function(p){
    if(!grouped[p.t])grouped[p.t]=[];
    grouped[p.t].push(p);
  });

  Object.keys(grouped).forEach(function(topicKey){
    var groupEl=document.createElement('div');
    groupEl.className='topic-group';

    var titleText=TOPICS[topicKey]
      ?TOPICS[topicKey][lang]
      :topicKey;

    var html='<h3 class="topic-title"><span>'+
      titleText+
      '</span></h3>';

    html+='<div class="grid">';

    grouped[topicKey].forEach(function(p){
      var pdfPath=p.file?buildPdfPath(p):null;

      html+='<article class="card">'+
        '<div class="tags">'+tags(p)+'</div>'+
        '<h3 class="h3">'+p.title[lang]+'</h3>'+
        '<p>'+p.desc[lang]+'</p>'+
        '<div class="actions">';

      if(pdfPath){
        html+='<a href="'+pdfPath+'" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">'+
          tt('btn_preview')+
          '</a>'+
          '<a href="'+pdfPath+'" download class="btn btn-ghost btn-sm">'+
          tt('btn_download')+
          '</a>';
      }else{
        html+='<button type="button" class="btn btn-ghost btn-sm" data-pdf="'+p.id+'">'+
          tt('btn_preview')+
          '</button>';
      }

      html+='</div></article>';
    });

    html+='</div>';

    groupEl.innerHTML=html;
    container.appendChild(groupEl);
  });
}

/* FAQ */

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
    question.setAttribute('data-faq',index);

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

/* Toast */

var toastT;

function toast(msg){
  var t=$('#toast');

  t.textContent=msg;
  t.hidden=false;

  clearTimeout(toastT);

  toastT=setTimeout(function(){
    t.hidden=true;
  },3200);
}

/* Navigation */

function go(id){
  var el=document.getElementById(id);

  if(el){
    el.scrollIntoView({
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ?'auto'
        :'smooth',
      block:'start'
    });
  }
}

document.addEventListener('click',function(e){

  var a=e.target.closest('[data-go]');

  if(a){
    e.preventDefault();
    go(a.getAttribute('data-go'));
    return;
  }

  var d=e.target.closest('[data-pdf]');

  if(d){
    toast(tt('pdf_toast'));
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
  }
});

/* Language button */

$('#langBtn').addEventListener('click',function(){
  lang=lang==='ar'?'en':'ar';

  try{
    localStorage.setItem('sphoh-lang',lang);
  }catch(e){}

  applyLang();
});

/* Theme button */

$('#themeBtn').addEventListener('click',function(){
  var isDark;

  if(theme==='auto'){
    isDark=window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }else{
    isDark=theme==='dark';
  }

  theme=isDark?'light':'dark';

  try{
    localStorage.setItem('sphoh-theme',theme);
  }catch(e){}

  applyTheme();
});


/* Active navigation link */

if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id=entry.target.id;

        $$('.links a').forEach(function(a){
          a.classList.toggle(
            'active',
            a.getAttribute('data-go')===id
          );
        });
      }
    });
  },{
    rootMargin:'-45% 0px -50% 0px'
  });

  ['home','about','files','faq','contact'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)io.observe(el);
  });
}

/* Initialize */

applyTheme();
loadResources().then(applyLang);

})();
