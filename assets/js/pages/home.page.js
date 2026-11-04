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
  const { Catalog, Store, I18n, Downloads, CardComponent, Effects, DOM, MathTypeset } = SPhOH;
  const { escapeHtml } = DOM;

  let simAnimFrame = null;

  function getProjectileGeometry({ angle, velocity, gravity }) {
    const rad = (angle * Math.PI) / 180;
    const realRange = (velocity * velocity * Math.sin(2 * rad)) / gravity;
    const realHeight = Math.pow(velocity * Math.sin(rad), 2) / (2 * gravity);
    const flightTime = (2 * velocity * Math.sin(rad)) / gravity;

    const startX = 44;
    const groundY = 220;
    const rangePixels = 360 * (1 - Math.exp(-realRange / 55));
    const heightPixels = 172 * (1 - Math.exp(-realHeight / 24));
    const endX = startX + rangePixels;
    const peakX = (startX + endX) / 2;
    const peakY = groundY - heightPixels;

    return {
      realRange,
      realHeight,
      flightTime,
      rad,
      startX,
      groundY,
      endX,
      peakX,
      peakY,
      controlY: 2 * peakY - groundY
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

    const simulation = Store.getState().simulator;
    const { angle, velocity, gravity } = simulation;
    const geometry = getProjectileGeometry(simulation);
    const {
      realRange,
      realHeight,
      flightTime,
      rad,
      startX,
      groundY,
      endX,
      peakX,
      peakY,
      controlY
    } = geometry;
    const pathData = `M${startX} ${groundY} Q${peakX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${groundY}`;
    const trajectory = DOM.qs('#simTrajectoryPath', sketchBox);
    const glow = DOM.qs('#simTrajectoryGlow', sketchBox);
    if (trajectory) trajectory.setAttribute('d', pathData);
    if (glow) glow.setAttribute('d', pathData);

    const heightGuide = DOM.qs('#simHeightGuide', sketchBox);
    if (heightGuide) {
      heightGuide.setAttribute('d', `M${peakX.toFixed(1)} ${peakY.toFixed(1)} V${groundY}`);
    }

    const rangeGuide = DOM.qs('#simRangeGuide', sketchBox);
    if (rangeGuide) {
      rangeGuide.setAttribute('d', `M${startX} ${groundY + 10} H${endX.toFixed(1)}`);
    }

    const launchVector = DOM.qs('#simLaunchVector', sketchBox);
    if (launchVector) {
      const vectorEndX = startX + 46 * Math.cos(rad);
      const vectorEndY = groundY - 46 * Math.sin(rad);
      launchVector.setAttribute('d', `M${startX} ${groundY} L${vectorEndX.toFixed(1)} ${vectorEndY.toFixed(1)}`);
    }

    const angleLabel = DOM.qs('#simAngleLabel', sketchBox);
    if (angleLabel) {
      angleLabel.textContent = `θ = ${angle}°`;
      angleLabel.setAttribute('x', String(startX + 50 * Math.cos(rad)));
      angleLabel.setAttribute('y', String(groundY - 50 * Math.sin(rad) - 5));
    }

    const rangeLabel = DOM.qs('#simRangeLabel', sketchBox);
    if (rangeLabel) {
      rangeLabel.setAttribute('x', String((startX + endX) / 2));
      rangeLabel.setAttribute('y', String(groundY + 27));
    }

    const heightLabel = DOM.qs('#simHeightLabel', sketchBox);
    if (heightLabel) {
      heightLabel.setAttribute('x', String(peakX + 6));
      heightLabel.setAttribute('y', String((peakY + groundY) / 2));
    }

    const landingPoint = DOM.qs('#simLandingPoint', sketchBox);
    if (landingPoint) landingPoint.setAttribute('cx', endX.toFixed(1));

    const capEl = DOM.qs('.cap', sketchBox);
    if (capEl) {
      capEl.innerHTML = `
        <span class="sim-metric-pill"><small>${escapeHtml(I18n.t('sim_range_lbl'))}</small><b>R</b><strong>${realRange.toFixed(1)} m</strong></span>
        <span class="sim-metric-pill"><small>${escapeHtml(I18n.t('sim_height_lbl'))}</small><b>H</b><strong>${realHeight.toFixed(1)} m</strong></span>
        <span class="sim-metric-pill"><small>${escapeHtml(I18n.t('sim_time_lbl'))}</small><b>T</b><strong>${flightTime.toFixed(2)} s</strong></span>
      `;
    }

    if (!DOM.qs('#simAngleInput', controlsWrap)) {
      controlsWrap.innerHTML = `
        <div class="sim-controls-header">
          <div class="sim-controls-title">
            <span class="sim-lab-badge"></span>
            <span class="sim-live-status"><i></i>${escapeHtml(I18n.t('sim_live_lbl'))}</span>
            <span class="sim-scale-note">${escapeHtml(I18n.t('sim_scale_lbl'))}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm sim-launch-btn" id="simLaunchBtn"></button>
        </div>
        <div class="sim-sliders-grid">
          <label class="sim-slider-field">
            <span><span class="sim-control-label"></span><output id="simAngleVal"></output></span>
            <input type="range" id="simAngleInput" min="15" max="75" step="1">
          </label>
          <label class="sim-slider-field">
            <span><span class="sim-control-label"></span><output id="simVelVal"></output></span>
            <input type="range" id="simVelInput" min="12" max="32" step="1">
          </label>
          <label class="sim-slider-field sim-gravity-field">
            <span class="sim-control-label"></span>
            <select id="simGravSelect" class="sim-grav-select">
              <option value="9.8">${escapeHtml(I18n.t('sim_earth'))}</option>
              <option value="3.7">${escapeHtml(I18n.t('sim_mars'))}</option>
              <option value="1.6">${escapeHtml(I18n.t('sim_moon'))}</option>
            </select>
          </label>
        </div>
      `;
    }

    DOM.qs('.sim-lab-badge', controlsWrap).textContent = I18n.t('sim_badge');
    DOM.qs('.sim-live-status', controlsWrap).lastChild.textContent = ` ${I18n.t('sim_live_lbl')}`;
    DOM.qs('.sim-scale-note', controlsWrap).textContent = I18n.t('sim_scale_lbl');
    DOM.qs('#simLaunchBtn', controlsWrap).textContent = I18n.t('sim_launch_btn');
    const labels = DOM.qsa('.sim-control-label', controlsWrap);
    if (labels[0]) labels[0].textContent = I18n.t('sim_angle_lbl');
    if (labels[1]) labels[1].textContent = I18n.t('sim_vel_lbl');
    if (labels[2]) labels[2].textContent = I18n.t('sim_grav_lbl');

    const angleInput = DOM.qs('#simAngleInput', controlsWrap);
    const velocityInput = DOM.qs('#simVelInput', controlsWrap);
    const gravitySelect = DOM.qs('#simGravSelect', controlsWrap);
    if (angleInput.value !== String(angle)) angleInput.value = String(angle);
    if (velocityInput.value !== String(velocity)) velocityInput.value = String(velocity);
    if (gravitySelect.value !== String(gravity)) gravitySelect.value = String(gravity);
    DOM.qs('#simAngleVal', controlsWrap).textContent = `${angle}°`;
    DOM.qs('#simVelVal', controlsWrap).textContent = `${velocity} m/s`;
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

    const geometry = getProjectileGeometry(Store.getState().simulator);
    const { startX, groundY, endX, peakX, controlY } = geometry;

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
      { label: '⚛️ IPhO • International Physics Olympiad' },
      { label: '📐', equation: String.raw`\vec{F} = \frac{d\vec{p}}{dt}` },
      { label: '🚀', equation: String.raw`R = \frac{v_0^2\sin(2\theta)}{g}` },
      { label: '⚡', equation: String.raw`\nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}` },
      { label: '🌊', equation: String.raw`P + \frac{1}{2}\rho v^2 + \rho gh = \mathrm{const}` },
      { label: '🏆 APhO • Asian Physics Olympiad' },
      { label: '🔬', equation: String.raw`L = T - V` },
      { label: '🧲', equation: String.raw`\oint_{\mathcal{C}} \vec{B}\cdot d\vec{\ell} = \mu_0\left(I_{\mathrm{enc}} + \varepsilon_0\frac{d\Phi_E}{dt}\right)` },
      { label: '🌟 EuPhO & NSMO Selections' }
    ];

    const repeated = [...items, ...items]
      .map(({ label, equation }) => {
        const content = equation
          ? `${escapeHtml(label)} <span class="marquee-equation">\\(${escapeHtml(equation)}\\)</span>`
          : escapeHtml(label);
        return `<span class="marquee-item">${content}</span>`;
      })
      .join('');

    marquee.innerHTML = `<div class="marquee-track">${repeated}</div>`;
    heroSection.insertAdjacentElement('afterend', marquee);
    MathTypeset?.typeset(marquee);
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
    SPhOH.MathTypeset?.typeset(container);
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
