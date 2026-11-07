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
  const { Catalog, Store, I18n, Downloads, CardComponent, Effects, CurriculumService, DOM } = SPhOH;
  const { escapeHtml } = DOM;

  let simAnimFrame = null;
  let simElapsedMs = 0;
  let simLastTs = 0;
  let simRunning = false;
  let simPaused = false;
  let simGeometry = null;
  let simMotionQuery = null;

  const SIM_ANIMATION_MS = 1050;

  /**
   * يحترم `prefers-reduced-motion`: تُستبدل الحركة بلقطة ثابتة عند قمة المسار.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    if (!simMotionQuery) {
      try {
        simMotionQuery =
          typeof global.matchMedia === 'function'
            ? global.matchMedia('(prefers-reduced-motion: reduce)')
            : null;
      } catch (_) {
        simMotionQuery = null;
      }
    }
    return Boolean(simMotionQuery && simMotionQuery.matches);
  }

  /**
   * حساب هندسة المسار بمقياس موحّد للمحورين للحفاظ على النسب الفيزيائية الحقيقية.
   * مساحة الرسم: x من 40 إلى 420، وy من 24 (قمة المحور) إلى 220 (خط الأرض).
   */
  function getSimulatorGeometry() {
    const { angle, velocity, gravity } = Store.getState().simulator;
    const rad = (angle * Math.PI) / 180;

    // حساب فيزيائي موحّد واحد يُستخدم للرسم وللجسيم المتحرك معاً.
    const range = (velocity * velocity * Math.sin(2 * rad)) / gravity;
    const height = Math.pow(velocity * Math.sin(rad), 2) / (2 * gravity);
    const flightTime = (2 * velocity * Math.sin(rad)) / gravity;

    const startX = 40;
    const groundY = 220;
    const availableWidth = 380;   // 420 - 40
    const availableHeight = 190;  // 220 - 30 (هامش 6px أسفل قمة المحور)

    // مقياس واحد للمحورين: النسب المرسومة تطابق النسب الفيزيائية.
    // حماية من القسمة على صفر عند زاوية/سرعة حدّية.
    const safeRange = range > 0 && Number.isFinite(range) ? range : 0.001;
    const safeHeight = height > 0 && Number.isFinite(height) ? height : 0.001;
    const scale = Math.min(availableWidth / safeRange, availableHeight / safeHeight);

    const endX = startX + range * scale;
    const peakX = (startX + endX) / 2;
    const peakY = groundY - height * scale;
    const controlY = groundY - 2 * height * scale;

    const d = `M${startX} ${groundY} Q${peakX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${groundY}`;

    return { angle, velocity, gravity, range, height, flightTime, startX, groundY, endX, peakX, peakY, controlY, d };
  }

  function renderSimulatorControls(sketchBox) {
    let controlsWrap = DOM.qs('#simControlsPanel', sketchBox);
    if (!controlsWrap) {
      controlsWrap = document.createElement('div');
      controlsWrap.id = 'simControlsPanel';
      controlsWrap.className = 'sim-controls-panel';
      sketchBox.appendChild(controlsWrap);
    }

    const { angle, velocity, gravity } = Store.getState().simulator;

    const launchKey = simPaused ? 'sim_resume_btn' : simRunning ? 'sim_pause_btn' : 'sim_launch_btn';
    const angleText = `${angle}°`;
    const velocityText = `${velocity} m/s`;

    controlsWrap.innerHTML = `
      <div class="sim-controls-header">
        <button type="button"
                class="btn btn-primary btn-sm sim-launch-btn"
                id="simLaunchBtn"
                aria-pressed="${simRunning && !simPaused ? 'true' : 'false'}">
          ${escapeHtml(I18n.t(launchKey))}
        </button>
      </div>
      <div class="sim-sliders-grid">
        <label class="sim-slider-field" for="simAngleInput">
          <span>${escapeHtml(I18n.t('sim_angle_lbl'))}: <output id="simAngleVal" for="simAngleInput">${angleText}</output></span>
          <input type="range"
                 id="simAngleInput"
                 min="15" max="75" step="1"
                 value="${angle}"
                 aria-label="${escapeHtml(I18n.t('sim_angle_lbl'))}"
                 aria-valuetext="${escapeHtml(angleText)}">
        </label>
        <label class="sim-slider-field" for="simVelInput">
          <span>${escapeHtml(I18n.t('sim_vel_lbl'))}: <output id="simVelVal" for="simVelInput">${velocityText}</output></span>
          <input type="range"
                 id="simVelInput"
                 min="12" max="32" step="1"
                 value="${velocity}"
                 aria-label="${escapeHtml(I18n.t('sim_vel_lbl'))}"
                 aria-valuetext="${escapeHtml(velocityText)}">
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

    return controlsWrap;
  }

  function updateSimulatorView(forceControls = false) {
    const sketchBox = DOM.qs('.sketch');
    if (!sketchBox) return;

    const sim = getSimulatorGeometry();

    const mainPath = DOM.qs('#simTrajectoryPath', sketchBox);
    const glowPath = DOM.qs('#simTrajectoryGlow', sketchBox);
    if (mainPath) mainPath.setAttribute('d', sim.d);
    if (glowPath) glowPath.setAttribute('d', sim.d);

    const guideH = DOM.qs('#simPeakGuideH', sketchBox);
    if (guideH) {
      guideH.setAttribute('x1', String(sim.startX));
      guideH.setAttribute('x2', sim.peakX.toFixed(1));
      guideH.setAttribute('y1', sim.peakY.toFixed(1));
      guideH.setAttribute('y2', sim.peakY.toFixed(1));
    }

    const guideV = DOM.qs('#simPeakGuideV', sketchBox);
    if (guideV) {
      guideV.setAttribute('x1', sim.peakX.toFixed(1));
      guideV.setAttribute('x2', sim.peakX.toFixed(1));
      guideV.setAttribute('y1', String(sim.groundY));
      guideV.setAttribute('y2', sim.peakY.toFixed(1));
    }

    const capEl = DOM.qs('.cap', sketchBox);
    if (capEl) {
      capEl.innerHTML = `
        <span class="sim-metric-pill"><b>R</b> = ${sim.range.toFixed(1)} m</span>
        <span class="sim-metric-pill"><b>H</b> = ${sim.height.toFixed(1)} m</span>
        <span class="sim-metric-pill"><b>T</b> = ${sim.flightTime.toFixed(2)} s</span>
      `;
    }

    // إعادة بناء اللوحة فقط عند تغيير اللغة/التهيئة، وليس أثناء سحب المؤشر
    if (forceControls || !DOM.qs('#simControlsPanel', sketchBox)) {
      renderSimulatorControls(sketchBox);
    } else {
      const angleVal = DOM.qs('#simAngleVal', sketchBox);
      const velVal = DOM.qs('#simVelVal', sketchBox);
      const angleInput = DOM.qs('#simAngleInput', sketchBox);
      const velInput = DOM.qs('#simVelInput', sketchBox);

      if (angleVal) angleVal.textContent = `${sim.angle}°`;
      if (velVal) velVal.textContent = `${sim.velocity} m/s`;
      if (angleInput) {
        if (angleInput.value !== String(sim.angle)) angleInput.value = String(sim.angle);
        angleInput.setAttribute('aria-valuetext', `${sim.angle}°`);
      }
      if (velInput) {
        if (velInput.value !== String(sim.velocity)) velInput.value = String(sim.velocity);
        velInput.setAttribute('aria-valuetext', `${sim.velocity} m/s`);
      }
    }
  }

  function getOrCreateParticle(svg) {
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
    return particle;
  }

  /** موضع الجسيم على نفس منحنى المسار المرسوم (Bézier التربيعي = قطع مكافئ). */
  function placeParticle(particle, geom, t) {
    const oneMinusT = 1 - t;
    const cx = oneMinusT * oneMinusT * geom.startX + 2 * oneMinusT * t * geom.peakX + t * t * geom.endX;
    const cy = oneMinusT * oneMinusT * geom.groundY + 2 * oneMinusT * t * geom.controlY + t * t * geom.groundY;
    particle.setAttribute('cx', cx.toFixed(1));
    particle.setAttribute('cy', cy.toFixed(1));
  }

  function updateSimulatorButton() {
    const btn = DOM.qs('#simLaunchBtn');
    if (!btn) return;
    const key = simPaused ? 'sim_resume_btn' : simRunning ? 'sim_pause_btn' : 'sim_launch_btn';
    btn.textContent = I18n.t(key);
    btn.setAttribute('aria-pressed', String(simRunning && !simPaused));
  }

  function pauseProjectileAnimation() {
    if (!simRunning || simPaused) return;
    cancelAnimationFrame(simAnimFrame);
    simAnimFrame = null;
    simPaused = true;
    Store.setState((s) => {
      s.simulator.isAnimating = false;
    });
    updateSimulatorButton();
  }

  function resumeProjectileAnimation() {
    if (!simRunning || !simPaused) return;
    simPaused = false;
    simLastTs = 0;
    Store.setState((s) => {
      s.simulator.isAnimating = true;
    });
    updateSimulatorButton();
    simAnimFrame = requestAnimationFrame(simStep);
  }

  function simStep(now) {
    if (!simRunning || simPaused) return;
    if (!simLastTs) simLastTs = now;
    // سقف 64ms يمنع القفزة بعد عودة التبويب من الخلفية.
    simElapsedMs += Math.min(64, Math.max(0, now - simLastTs));
    simLastTs = now;

    const t = Math.min(1, simElapsedMs / SIM_ANIMATION_MS);
    const particle = DOM.qs('#simLiveParticle');
    if (particle && simGeometry) placeParticle(particle, simGeometry, t);

    if (t < 1) {
      simAnimFrame = requestAnimationFrame(simStep);
      return;
    }

    simAnimFrame = null;
    simRunning = false;
    simPaused = false;
    Store.setState((s) => {
      s.simulator.isAnimating = false;
    });
    updateSimulatorButton();
  }

  /**
   * تشغيل/إيقاف/استئناف محاكي المقذوفات.
   * @param {boolean} [forceRestart=false] `true` عند سحب المؤشر (بدء من جديد).
   */
  function launchProjectileAnimation(forceRestart = false) {
    const svg = DOM.qs('.sketch svg');
    if (!svg) return;

    if (!forceRestart) {
      if (simRunning && !simPaused) {
        pauseProjectileAnimation();
        return;
      }
      if (simRunning && simPaused) {
        resumeProjectileAnimation();
        return;
      }
    }

    cancelAnimationFrame(simAnimFrame);
    simAnimFrame = null;

    simGeometry = getSimulatorGeometry();
    simElapsedMs = 0;
    simLastTs = 0;
    simRunning = false;
    simPaused = false;

    const particle = getOrCreateParticle(svg);

    if (prefersReducedMotion()) {
      // بلا حركة: لقطة ثابتة عند قمة المسار.
      placeParticle(particle, simGeometry, 0.5);
      Store.setState((s) => {
        s.simulator.isAnimating = false;
      });
      updateSimulatorButton();
      return;
    }

    placeParticle(particle, simGeometry, 0);
    simRunning = true;
    Store.setState((s) => {
      s.simulator.isAnimating = true;
    });
    updateSimulatorButton();
    simAnimFrame = requestAnimationFrame(simStep);
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
   * خطوات المسار مرتبطة بمعرّفات موارد قائمة؛ تُحذف الخطوة تلقائياً إن حُذف
   * موردها من المكتبة بدل أن تبقى رابطاً ميتاً.
   */
  const ROADMAP_STEPS = [
    { id: 4, tag: 'roadmap_step1_tag', title: 'roadmap_step1_title', desc: 'roadmap_step1_desc' },
    { id: 9, tag: 'roadmap_step2_tag', title: 'roadmap_step2_title', desc: 'roadmap_step2_desc' },
    { id: 10, tag: 'roadmap_step3_tag', title: 'roadmap_step3_title', desc: 'roadmap_step3_desc' }
  ];

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

    const steps = ROADMAP_STEPS.filter((step) => Boolean(CurriculumService.findById(step.id)));
    if (steps.length === 0) {
      roadmapEl.remove();
      return;
    }

    const stepsHtml = steps
      .map(
        (step) => `
        <a href="preview.html?id=${step.id}&type=problem" class="roadmap-step-card" data-open-preview="${step.id}" data-preview-type="problem">
          <div class="roadmap-step-top">
            <span class="roadmap-step-num">${I18n.t(step.tag)}</span>
            <span>→</span>
          </div>
          <strong>${I18n.t(step.title)}</strong>
          <span>${I18n.t(step.desc)}</span>
        </a>`
      )
      .join('');

    roadmapEl.innerHTML = `
      <div class="roadmap-head">
        <div>
          <div class="eyebrow">${I18n.t('roadmap_eyebrow')}</div>
          <h3 class="h3 mt-xs">${I18n.t('roadmap_title')}</h3>
        </div>
      </div>
      <div class="roadmap-steps">${stepsHtml}</div>
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
    updateSimulatorView(true);
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
