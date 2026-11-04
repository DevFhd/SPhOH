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
    const rad = (angle * Math.PI) / 180;

    const realRange = (velocity * velocity * Math.sin(2 * rad)) / gravity;
    const realHeight = Math.pow(velocity * Math.sin(rad), 2) / (2 * gravity);
    const flightTime = (2 * velocity * Math.sin(rad)) / gravity;

    const startX = 40;
    const groundY = 220;
    const scaleX = Math.min(360, Math.max(95, realRange * 4.4));
    const endX = Math.min(408, startX + scaleX);
    const peakX = (startX + endX) / 2;
    const peakY = Math.max(28, groundY - Math.min(182, Math.max(24, realHeight * 4.6)));
    const controlY = 2 * peakY - groundY;

    const dPath = `M${startX} ${groundY} Q${peakX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${groundY}`;

    const paths = DOM.qsa('svg path', sketchBox);
    paths.forEach((p) => {
      const dAttr = p.getAttribute('d') || '';
      if (dAttr.startsWith('M40 220 Q')) {
        if (dAttr.endsWith('Z')) {
          p.setAttribute('d', `${dPath} Z`);
        } else {
          p.setAttribute('d', dPath);
          p.id = 'simTrajectoryPath';
        }
      }
    });

    const lines = DOM.qsa('svg line', sketchBox);
    if (lines.length >= 6) {
      lines[2]?.setAttribute('x2', peakX.toFixed(1));
      lines[2]?.setAttribute('y1', peakY.toFixed(1));
      lines[2]?.setAttribute('y2', peakY.toFixed(1));

      lines[3]?.setAttribute('x1', peakX.toFixed(1));
      lines[3]?.setAttribute('x2', peakX.toFixed(1));
      lines[3]?.setAttribute('y2', peakY.toFixed(1));
    }

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
    const rad = (angle * Math.PI) / 180;
    const realRange = (velocity * velocity * Math.sin(2 * rad)) / gravity;
    const realHeight = Math.pow(velocity * Math.sin(rad), 2) / (2 * gravity);

    const startX = 40;
    const groundY = 220;
    const scaleX = Math.min(360, Math.max(95, realRange * 4.4));
    const endX = Math.min(408, startX + scaleX);
    const peakX = (startX + endX) / 2;
    const peakY = Math.max(28, groundY - Math.min(182, Math.max(24, realHeight * 4.6)));
    const controlY = 2 * peakY - groundY;

    const duration = 1050;
    const startTime = performance.now();

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
