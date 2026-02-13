(function () {
  initThemeToggle();
  initCommonBits();
  initPredictiveLab();
  initRevealAnimations();

  function initThemeToggle() {
    const toggleButton = document.getElementById("themeToggle");
    if (!toggleButton) {
      return;
    }

    const root = document.documentElement;
    const storageKey = "rc-theme";
    const params = new URLSearchParams(window.location.search);
    const queryTheme = params.get("theme");

    const readStoredTheme = () => {
      try {
        return localStorage.getItem(storageKey);
      } catch (_error) {
        return null;
      }
    };

    const writeStoredTheme = (theme) => {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (_error) {
        // Ignore storage write issues.
      }
    };

    const getPreferredTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const sanitizeTheme = (value) => {
      return value === "dark" || value === "light" ? value : null;
    };

    const updateToggleLabel = (theme) => {
      const labelNode = toggleButton.querySelector(".theme-toggle__label");
      if (labelNode) {
        labelNode.textContent = theme === "dark" ? "Day" : "Night";
      }
      toggleButton.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    };

    const applyTheme = (theme, persist) => {
      root.setAttribute("data-theme", theme);
      updateToggleLabel(theme);
      if (persist) {
        writeStoredTheme(theme);
      }
    };

    const initialTheme =
      sanitizeTheme(queryTheme) || sanitizeTheme(readStoredTheme()) || getPreferredTheme();

    applyTheme(initialTheme, false);

    toggleButton.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  function initCommonBits() {
    const yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }

    const emailLink = document.querySelector(".js-email");
    if (!emailLink) {
      return;
    }

    const user = emailLink.getAttribute("data-user");
    const domain = emailLink.getAttribute("data-domain");

    if (user && domain) {
      emailLink.setAttribute("href", "mailto:" + user + "@" + domain);
      emailLink.setAttribute("title", "Email Radu Covaci");
    }
  }

  function initRevealAnimations() {
    const revealTargets = document.querySelectorAll(".reveal");
    if (revealTargets.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      revealTargets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    revealTargets.forEach((node) => observer.observe(node));
  }

  function initPredictiveLab() {
    const canvas = document.getElementById("predictiveLabCanvas");
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const precisionInput = document.getElementById("labPrecision");
    const noiseInput = document.getElementById("labNoise");
    const loadInput = document.getElementById("labLoad");
    const perturbButton = document.getElementById("labPerturb");

    const healthyButton = document.getElementById("labModeHealthy");
    const depressedButton = document.getElementById("labModeDepressed");
    const baselinePresetButton = document.getElementById("labPresetBaseline");
    const overloadPresetButton = document.getElementById("labPresetOverload");
    const recoveryPresetButton = document.getElementById("labPresetRecovery");

    const precisionValue = document.getElementById("labPrecisionValue");
    const noiseValue = document.getElementById("labNoiseValue");
    const loadValue = document.getElementById("labLoadValue");

    const confidenceOut = document.getElementById("labConfidence");
    const errorOut = document.getElementById("labError");
    const balanceOut = document.getElementById("labBalance");
    const stateOut = document.getElementById("labState");
    const guideOut = document.getElementById("labGuide");
    const tooltipOut = document.getElementById("labTooltip");

    if (
      !precisionInput ||
      !noiseInput ||
      !loadInput ||
      !perturbButton ||
      !healthyButton ||
      !depressedButton ||
      !baselinePresetButton ||
      !overloadPresetButton ||
      !recoveryPresetButton ||
      !precisionValue ||
      !noiseValue ||
      !loadValue ||
      !confidenceOut ||
      !errorOut ||
      !balanceOut ||
      !stateOut ||
      !guideOut ||
      !tooltipOut
    ) {
      return;
    }

    // The lab section is animated via `.reveal` transforms. A `position: fixed` element inside a
    // transformed ancestor anchors to that ancestor instead of the viewport, which breaks cursor
    // tracking. Keep the tooltip under `body` so `clientX/clientY` map 1:1 to `left/top`.
    if (tooltipOut.parentElement !== document.body) {
      document.body.appendChild(tooltipOut);
    }

    const presetButtons = {
      baseline: baselinePresetButton,
      overload: overloadPresetButton,
      recovery: recoveryPresetButton
    };

    const presetConfigs = {
      baseline: {
        mode: "healthy",
        precision: 74,
        noise: 38,
        load: 41,
        guide: "Baseline preset: balanced inference with moderate physiological pressure."
      },
      overload: {
        mode: "depressed",
        precision: 46,
        noise: 74,
        load: 78,
        guide: "Overload preset: rigid model with high noise and high allostatic burden."
      },
      recovery: {
        mode: "healthy",
        precision: 82,
        noise: 27,
        load: 31,
        guide: "Recovery preset: stronger precision and lower load to support adaptive updating."
      }
    };

    const nodes = [
      { key: "body", label: "Body", x: 0.13, y: 0.74, color: "#c9854e" },
      { key: "insula", label: "Insula", x: 0.32, y: 0.54, color: "#1f6d67" },
      { key: "sn", label: "Salience", x: 0.56, y: 0.34, color: "#1f3d8a" },
      { key: "dmn", label: "DMN", x: 0.81, y: 0.44, color: "#415896" },
      { key: "motor", label: "Action", x: 0.7, y: 0.72, color: "#b27c4f" }
    ];

    const edges = [
      { a: 0, b: 1, phase: 0.13 },
      { a: 1, b: 2, phase: 0.26 },
      { a: 2, b: 3, phase: 0.39 },
      { a: 1, b: 3, phase: 0.53 },
      { a: 2, b: 4, phase: 0.67 },
      { a: 4, b: 0, phase: 0.82 }
    ];

      const state = {
        width: 0,
        height: 0,
        dpr: 1,
        time: 0,
        mode: "healthy",
        preset: "baseline",
        applyingPreset: false,
        historyError: [],
        historyConfidence: [],
        pointer: {
          x: 0,
          y: 0,
          active: false,
          strength: 0
        },
        model: {
          x: 0,
          mu: 0,
          setpoint: 0,
          loadDyn: 0,
          externalShock: 0,
          errorEma: 0,
          confidenceEma: 0,
          balanceEma: 0
        }
      };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (from, to, t) => from + (to - from) * t;

    const root = document.documentElement;

    const backgroundCache = {
      canvas: document.createElement("canvas"),
      ctx: null,
      theme: root.getAttribute("data-theme") === "dark" ? "dark" : "light",
      width: 0,
      height: 0,
      dpr: 1,
      dirty: true
    };
    backgroundCache.ctx = backgroundCache.canvas.getContext("2d");

    if (backgroundCache.ctx) {
      const observer = new MutationObserver(() => {
        const nextTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        if (nextTheme !== backgroundCache.theme) {
          backgroundCache.theme = nextTheme;
          backgroundCache.dirty = true;
        }
      });
      observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }

    // The lab intentionally does not read/write URL params so the site URL stays clean.

    function setGuideMessage(message) {
      guideOut.textContent = message;
    }

    function setActivePreset(nextPreset) {
      state.preset = nextPreset || "custom";
      Object.entries(presetButtons).forEach(([key, button]) => {
        button.classList.toggle("is-active", state.preset === key);
      });
    }

    function setMode(nextMode, fromPreset) {
      state.mode = nextMode;
      healthyButton.classList.toggle("is-active", nextMode === "healthy");
      depressedButton.classList.toggle("is-active", nextMode === "depressed");
      if (!fromPreset && !state.applyingPreset) {
        setActivePreset(null);
      }
    }

      function applyPreset(name) {
        const preset = presetConfigs[name];
        if (!preset) {
          return;
        }

      state.applyingPreset = true;
      setMode(preset.mode, true);
      precisionInput.value = String(preset.precision);
      noiseInput.value = String(preset.noise);
      loadInput.value = String(preset.load);
        updateControlLabels();
        setActivePreset(name);
        state.applyingPreset = false;
        setGuideMessage(preset.guide);
        resetModel();
      }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      state.width = rect.width;
      state.height = rect.height;
      state.dpr = dpr;

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (backgroundCache.ctx) {
        backgroundCache.dirty = true;
      }
    }

    function updateControlLabels() {
      precisionValue.textContent = precisionInput.value;
      noiseValue.textContent = noiseInput.value;
      loadValue.textContent = loadInput.value;
    }

    function updateGuideFromControls() {
      const precision = Number(precisionInput.value);
      const noise = Number(noiseInput.value);
      const load = Number(loadInput.value);

      if (noise > 66 || load > 70) {
        setGuideMessage(
          "High-stress regime: low sensory precision and/or high load amplify persistent prediction error."
        );
        return;
      }

      if (precision > 74 && noise < 42 && load < 50) {
        setGuideMessage(
          "High prior-precision regime: top-down predictions dominate (stable when noise and load are low)."
        );
        return;
      }

      setGuideMessage("Intermediate regime: tweak one variable at a time to inspect causal effects.");
    }

    function initTips() {
      const targets = document.querySelectorAll("[data-lab-tip]");
      if (targets.length === 0) {
        return;
      }

      let activeTarget = null;
      let cachedWidth = 0;
      let cachedHeight = 0;
      let rafId = null;
      let pendingX = 0;
      let pendingY = 0;

      const commitTipPosition = () => {
        rafId = null;

        const margin = 8;
        const tipWidth = cachedWidth || tooltipOut.offsetWidth;
        const tipHeight = cachedHeight || tooltipOut.offsetHeight;

        let left = pendingX;
        let top = pendingY - tipHeight;

        if (left + tipWidth > window.innerWidth - margin) {
          left = pendingX - tipWidth;
        }
        if (top < margin) {
          top = pendingY;
        }

        left = clamp(left, margin, window.innerWidth - tipWidth - margin);
        top = clamp(top, margin, window.innerHeight - tipHeight - margin);

        tooltipOut.style.transform = "translate3d(" + String(left) + "px, " + String(top) + "px, 0)";
      };

      const placeTip = (clientX, clientY) => {
        pendingX = clientX;
        pendingY = clientY;
        if (rafId != null) {
          return;
        }
        rafId = window.requestAnimationFrame(commitTipPosition);
      };

      const showTip = (target, clientX, clientY) => {
        const text = target.getAttribute("data-lab-tip");
        if (!text) {
          return;
        }

        activeTarget = target;
        tooltipOut.textContent = text;
        tooltipOut.style.opacity = "1";
        tooltipOut.setAttribute("aria-hidden", "false");
        const rect = tooltipOut.getBoundingClientRect();
        cachedWidth = rect.width;
        cachedHeight = rect.height;
        placeTip(clientX, clientY);
      };

      const hideTip = () => {
        activeTarget = null;
        tooltipOut.style.opacity = "0";
        tooltipOut.setAttribute("aria-hidden", "true");
        cachedWidth = 0;
        cachedHeight = 0;
        if (rafId != null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      targets.forEach((target) => {
        target.addEventListener("pointerenter", (event) => {
          if (event.pointerType === "touch") {
            return;
          }
          showTip(target, event.clientX, event.clientY);
        });

        target.addEventListener("pointermove", (event) => {
          if (activeTarget !== target) {
            return;
          }
          placeTip(event.clientX, event.clientY);
        }, { passive: true });

        target.addEventListener("pointerleave", hideTip);

        target.addEventListener("focus", () => {
          const rect = target.getBoundingClientRect();
          showTip(target, rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
        });

        target.addEventListener("blur", hideTip);
      });
    }

    function pointerInfluenceAt(x, y, radius) {
      if (state.pointer.strength < 0.02) {
        return 0;
      }
      const dx = x - state.pointer.x;
      const dy = y - state.pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius) {
        return 0;
      }
      const normalized = 1 - distance / radius;
      return normalized * state.pointer.strength;
    }

      const randomNormal = (() => {
        let spare = null;
        return () => {
          if (spare != null) {
            const value = spare;
            spare = null;
            return value;
          }

          let u = 0;
          let v = 0;
          while (u === 0) {
            u = Math.random();
          }
          while (v === 0) {
            v = Math.random();
          }

          const magnitude = Math.sqrt(-2 * Math.log(u));
          const angle = 2 * Math.PI * v;
          spare = magnitude * Math.sin(angle);
          return magnitude * Math.cos(angle);
        };
      })();

      function resetModel() {
        state.model.x = randomNormal() * 0.04;
        state.model.mu = state.model.x + randomNormal() * 0.03;
        state.model.setpoint = 0;
        state.model.loadDyn = 0;
        state.model.externalShock = 0;
        state.model.errorEma = 0;
        state.model.confidenceEma = 0;
        state.model.balanceEma = 0;
        state.historyError.length = 0;
        state.historyConfidence.length = 0;
      }

      function getModelParams() {
        const precisionRaw = clamp(Number(precisionInput.value) / 100, 0, 1);
        const noiseRaw = clamp(Number(noiseInput.value) / 100, 0, 1);
        const baseLoad = clamp(Number(loadInput.value) / 100, 0, 1);

        let priorPrecision = 0.6 + Math.pow(precisionRaw, 2.2) * 30;
        let sigma = 0.045 + Math.pow(noiseRaw, 1.35) * 0.32;

        let learningRate = 3.2;
        let actionGain = 1.55;
        let homeoGain = 1.1;
        let recoveryRate = 0.22;
        let setpointAdaptRate = 0.06;

        if (state.mode === "depressed") {
          priorPrecision *= 1.55;
          sigma *= 1.25;
          learningRate *= 0.78;
          actionGain *= 0.85;
          recoveryRate *= 0.65;
          setpointAdaptRate *= 0.75;
        }

        const load = clamp(baseLoad + state.model.loadDyn * 0.85, 0, 1);

        learningRate *= clamp(1 - load * 0.65, 0.2, 1);
        actionGain *= clamp(1 - load * 0.55, 0.35, 1);
        homeoGain *= clamp(1 - load * 0.35, 0.5, 1);
        recoveryRate *= clamp(1 - baseLoad * 0.5, 0.35, 1);

        return {
          priorPrecision,
          sigma,
          baseLoad,
          load,
          learningRate,
          actionGain,
          homeoGain,
          recoveryRate,
          setpointAdaptRate
        };
      }

      function stepModel(dt) {
        const params = getModelParams();
        const sigma = params.sigma;
        const sensoryPrecision = 1 / Math.max(sigma * sigma, 1e-5);
        const totalPrecision = sensoryPrecision + params.priorPrecision;

        state.model.externalShock *= Math.exp(-dt / 0.8);

        const observation = state.model.x + randomNormal() * sigma + state.model.externalShock;
        const sensoryError = observation - state.model.mu;
        const priorError = state.model.setpoint - state.model.mu;

        const update =
          (sensoryPrecision * sensoryError + params.priorPrecision * priorError) / Math.max(totalPrecision, 1e-6);
        state.model.mu += dt * params.learningRate * update;

        const action = params.actionGain * (state.model.mu - state.model.x);
        const effectiveAction = action * clamp(1 - params.load * 0.6, 0.3, 1);

        state.model.x +=
          dt * (params.homeoGain * (state.model.setpoint - state.model.x) + effectiveAction) +
          randomNormal() * sigma * 0.05;

        state.model.setpoint +=
          dt *
          params.setpointAdaptRate *
          (state.model.x - state.model.setpoint) *
          clamp(1 - params.load * 0.8, 0, 1);

        const peMag = Math.abs(sensoryError);
        const actionMag = Math.abs(effectiveAction);

        state.model.loadDyn +=
          dt * (clamp(peMag, 0, 2) * 0.22 + clamp(actionMag, 0, 2) * 0.1) - dt * params.recoveryRate * state.model.loadDyn;
        state.model.loadDyn = clamp(state.model.loadDyn, 0, 1);

        const precisionWeight = clamp(params.priorPrecision / Math.max(totalPrecision, 1e-6), 0, 1);
        const confidenceRaw = clamp(Math.log1p(totalPrecision) / Math.log1p(320), 0, 1);
        const errorRaw = clamp(peMag / 0.65, 0, 1);
        const noiseNorm = clamp((sigma - 0.045) / 0.32, 0, 1);
        const load = clamp(params.baseLoad + state.model.loadDyn * 0.85, 0, 1);
        const balanceRaw = clamp(1 - load * 0.92 - clamp(actionMag * 0.22, 0, 1), 0, 1);

        const errorT = clamp(dt * 3.2, 0, 1);
        const confT = clamp(dt * 2.0, 0, 1);
        const balanceT = clamp(dt * 2.4, 0, 1);

        state.model.errorEma = lerp(state.model.errorEma, errorRaw, errorT);
        state.model.confidenceEma = lerp(state.model.confidenceEma, confidenceRaw, confT);
        state.model.balanceEma = lerp(state.model.balanceEma, balanceRaw, balanceT);

        return {
          precision: precisionWeight,
          noise: noiseNorm,
          load,
          error: state.model.errorEma,
          confidence: state.model.confidenceEma,
          balance: state.model.balanceEma
        };
      }

      function updateReadouts(signals) {
        confidenceOut.textContent = String(Math.round(signals.confidence * 100)) + "%";
        errorOut.textContent = String(Math.round(signals.error * 100)) + "%";
        balanceOut.textContent = String(Math.round(signals.balance * 100)) + "%";

        if (state.mode === "depressed") {
          if (signals.balance > 0.58 && signals.error < 0.55) {
            stateOut.textContent = "Depressed-mode regime: stabilized but rigid priors limit updating.";
          } else if (signals.balance > 0.34) {
            stateOut.textContent = "Depressed-mode regime: rigid priors with persistent prediction error.";
          } else {
            stateOut.textContent = "Depressed-mode regime: high load and noisy evidence degrade regulation.";
          }
          return;
        }

        if (signals.balance > 0.62 && signals.error < 0.44) {
          stateOut.textContent = "Adaptive regime: low error with stable regulation.";
        } else if (signals.balance > 0.38) {
          stateOut.textContent = "Transitional regime: moderate pressure with ongoing updating.";
        } else {
          stateOut.textContent = "Strained regime: high load with unstable inference/regulation.";
        }
      }

    function updateHistory(signals) {
      state.historyError.push(signals.error);
      state.historyConfidence.push(signals.confidence);

      const maxPoints = 120;
      if (state.historyError.length > maxPoints) {
        state.historyError.shift();
      }
      if (state.historyConfidence.length > maxPoints) {
        state.historyConfidence.shift();
      }
    }

    function drawBackground(isDark) {
      if (!backgroundCache.ctx) {
        // Fallback if 2D context creation failed.
        ctx.fillStyle = isDark ? "#12192a" : "#f7f7f2";
        ctx.fillRect(0, 0, state.width, state.height);
        return;
      }

      const cacheNeedsRebuild =
        backgroundCache.dirty ||
        backgroundCache.width !== state.width ||
        backgroundCache.height !== state.height ||
        backgroundCache.dpr !== state.dpr;

      if (cacheNeedsRebuild) {
        backgroundCache.width = state.width;
        backgroundCache.height = state.height;
        backgroundCache.dpr = state.dpr;
        backgroundCache.dirty = false;

        backgroundCache.canvas.width = Math.max(1, Math.floor(state.width * state.dpr));
        backgroundCache.canvas.height = Math.max(1, Math.floor(state.height * state.dpr));
        backgroundCache.ctx.setTransform(1, 0, 0, 1, 0, 0);
        backgroundCache.ctx.scale(state.dpr, state.dpr);

        const gradient = backgroundCache.ctx.createLinearGradient(0, 0, state.width, state.height);
        if (isDark) {
          gradient.addColorStop(0, "#12192a");
          gradient.addColorStop(1, "#161f32");
        } else {
          gradient.addColorStop(0, "#f7f7f2");
          gradient.addColorStop(1, "#eceff6");
        }

        backgroundCache.ctx.fillStyle = gradient;
        backgroundCache.ctx.fillRect(0, 0, state.width, state.height);

        backgroundCache.ctx.strokeStyle = isDark
          ? "rgba(164, 183, 214, 0.09)"
          : "rgba(30, 42, 66, 0.06)";
        backgroundCache.ctx.lineWidth = 1;
        const gridStep = 26;
        for (let x = 0; x <= state.width; x += gridStep) {
          backgroundCache.ctx.beginPath();
          backgroundCache.ctx.moveTo(x, 0);
          backgroundCache.ctx.lineTo(x, state.height);
          backgroundCache.ctx.stroke();
        }
        for (let y = 0; y <= state.height; y += gridStep) {
          backgroundCache.ctx.beginPath();
          backgroundCache.ctx.moveTo(0, y);
          backgroundCache.ctx.lineTo(state.width, y);
          backgroundCache.ctx.stroke();
        }
      }

      ctx.drawImage(backgroundCache.canvas, 0, 0, state.width, state.height);
    }

    function drawPointerField() {
      if (state.pointer.strength < 0.02) {
        return;
      }

      const radius = Math.min(state.width, state.height) * 0.36;
      const gradient = ctx.createRadialGradient(
        state.pointer.x,
        state.pointer.y,
        4,
        state.pointer.x,
        state.pointer.y,
        radius
      );
      gradient.addColorStop(0, "rgba(137, 164, 255, " + String(0.22 * state.pointer.strength) + ")");
      gradient.addColorStop(1, "rgba(137, 164, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(state.pointer.x, state.pointer.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawEdgeSignals(signals) {
      const predictionSpeed = 0.1 + signals.precision * 0.24;
      const errorSpeed = 0.08 + signals.noise * 0.26 + signals.load * 0.15;
      const influenceRadius = Math.min(state.width, state.height) * 0.38;
      const predFill = "rgba(31, 61, 138, " + String(0.28 + signals.precision * 0.62) + ")";
      const errFill = "rgba(193, 126, 73, " + String(0.24 + signals.error * 0.56) + ")";

      edges.forEach((edge, edgeIndex) => {
        const a = nodes[edge.a];
        const b = nodes[edge.b];

        const ax = a.x * state.width;
        const ay = a.y * state.height;
        const bx = b.x * state.width;
        const by = b.y * state.height;

        ctx.strokeStyle = "rgba(72, 93, 130, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        for (let i = 0; i < 4; i += 1) {
          const predT = (state.time * predictionSpeed + edge.phase + i * 0.23) % 1;
          const errT = 1 - ((state.time * errorSpeed + edge.phase * 0.7 + i * 0.31) % 1);

          let px = ax + (bx - ax) * predT;
          let py = ay + (by - ay) * predT;
          let ex = ax + (bx - ax) * errT;
          let ey = ay + (by - ay) * errT;

          const pInfluence = pointerInfluenceAt(px, py, influenceRadius);
          const eInfluence = pointerInfluenceAt(ex, ey, influenceRadius);

          px += Math.sin(state.time * 14 + i + edge.phase * 7) * pInfluence * 7;
          py += Math.cos(state.time * 11 + i) * pInfluence * 7;
          ex += Math.sin(state.time * 9 + i + edge.phase * 5) * eInfluence * 7;
          ey += Math.cos(state.time * 13 + i) * eInfluence * 7;

          ctx.fillStyle = predFill;
          ctx.beginPath();
          ctx.arc(px, py, 2.5 + signals.precision * 1.6 + pInfluence * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = errFill;
          ctx.beginPath();
          ctx.arc(ex, ey, 2 + signals.error * 1.8 + eInfluence * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (edgeIndex === 1 || edgeIndex === 4) {
          ctx.strokeStyle = "rgba(31, 109, 103, " + String(0.14 + signals.balance * 0.2) + ")";
          ctx.lineWidth = 2 + signals.balance * 0.75;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      });
    }

    function drawNodes(signals, isDark) {
      ctx.font = "600 12px 'Instrument Sans', sans-serif";
      ctx.textAlign = "center";
      nodes.forEach((node) => {
        const x = node.x * state.width;
        const y = node.y * state.height;
        const radius = 12 + signals.balance * 4;

        ctx.beginPath();
        ctx.fillStyle = isDark ? "rgba(20, 28, 43, 0.9)" : "rgba(255,255,255,0.9)";
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? "#d9e4f9" : "#243450";
        ctx.fillText(node.label, x, y - radius - 11);
      });
    }

    function drawHistory(isDark) {
      const historyLength = state.historyError.length;
      if (historyLength < 2) {
        return;
      }

      const chartX = 24;
      const chartY = state.height - 78;
      const chartW = state.width - 48;
      const chartH = 54;

      ctx.fillStyle = isDark ? "rgba(18, 26, 40, 0.8)" : "rgba(252, 250, 246, 0.78)";
      ctx.fillRect(chartX, chartY, chartW, chartH);
      ctx.strokeStyle = isDark ? "rgba(146, 165, 196, 0.22)" : "rgba(35, 52, 80, 0.16)";
      ctx.strokeRect(chartX, chartY, chartW, chartH);

      const drawLine = (values, color) => {
        ctx.beginPath();
        values.forEach((value, index) => {
          const x = chartX + (index / (historyLength - 1)) * chartW;
          const y = chartY + chartH - value * chartH;
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      drawLine(state.historyConfidence, "rgba(139, 161, 255, 0.9)");
      drawLine(state.historyError, "rgba(216, 150, 98, 0.88)");

      ctx.fillStyle = isDark ? "#b8c8e8" : "#415066";
      ctx.font = "600 11px 'Instrument Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("confidence", chartX + 8, chartY + 14);
      ctx.fillStyle = isDark ? "#d2aa86" : "#8a5f3d";
      ctx.fillText("error", chartX + 92, chartY + 14);
    }

      function injectPerturbation(multiplier) {
        const directionRaw =
          state.width > 0 ? clamp((state.pointer.x / state.width - 0.5) * 2, -1, 1) : Math.random() < 0.5 ? -1 : 1;
        const direction = directionRaw === 0 ? (Math.random() < 0.5 ? -1 : 1) : directionRaw;
        const magnitude = (0.22 + Math.random() * 0.32) * multiplier;
        const shock = direction * magnitude;

        // Perturb the latent bodily state and inject a short-lived sensory jolt.
        state.model.x += shock;
        state.model.externalShock += shock * 0.45;
        state.model.loadDyn = clamp(state.model.loadDyn + Math.abs(shock) * 0.08, 0, 1);
      }

    let animationFrameId = null;
    let lastFrameTimestamp = null;
    let inViewport = "IntersectionObserver" in window ? false : true;
    let pageVisible = !document.hidden;

    function frame(now) {
      const dt =
        lastFrameTimestamp == null ? 1 / 60 : clamp((now - lastFrameTimestamp) / 1000, 0, 0.05);
      lastFrameTimestamp = now;

      const frameScale = dt * 60;

      state.time += dt;
      state.pointer.strength *= Math.pow(0.92, frameScale);

      const isDark = backgroundCache.theme === "dark";
      const signals = stepModel(dt);
      updateReadouts(signals);
      updateHistory(signals);

      drawBackground(isDark);
      drawPointerField();
      drawEdgeSignals(signals);
      drawNodes(signals, isDark);
      drawHistory(isDark);

      animationFrameId = window.requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (animationFrameId != null) {
        return;
      }
      lastFrameTimestamp = null;
      animationFrameId = window.requestAnimationFrame(frame);
    }

    function stopAnimation() {
      if (animationFrameId == null) {
        return;
      }
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      lastFrameTimestamp = null;
    }

    function syncAnimation() {
      if (pageVisible && inViewport) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }

    function onInputChanged() {
      updateControlLabels();
      if (!state.applyingPreset) {
        setActivePreset(null);
      }
      updateGuideFromControls();
    }

      function setPointerFromEvent(event) {
        const rect = canvas.getBoundingClientRect();
        state.pointer.x = event.clientX - rect.left;
        state.pointer.y = event.clientY - rect.top;
        state.pointer.active = true;
        state.pointer.strength = Math.max(state.pointer.strength, 0.55);
      }

    precisionInput.addEventListener("input", onInputChanged);
    noiseInput.addEventListener("input", onInputChanged);
    loadInput.addEventListener("input", onInputChanged);

      healthyButton.addEventListener("click", () => {
        setMode("healthy", false);
        setGuideMessage("Healthy mode selected: stronger recovery and more flexible updating.");
      });

      depressedButton.addEventListener("click", () => {
        setMode("depressed", false);
        setGuideMessage("Depressed mode selected: higher prior precision with noisier evidence and slower recovery.");
      });

    baselinePresetButton.addEventListener("click", () => {
      applyPreset("baseline");
    });

    overloadPresetButton.addEventListener("click", () => {
      applyPreset("overload");
    });

    recoveryPresetButton.addEventListener("click", () => {
      applyPreset("recovery");
    });

      perturbButton.addEventListener("click", () => {
        injectPerturbation(1);
        setGuideMessage("Perturbation injected: watch short-term error spike and subsequent recovery.");
      });

      canvas.addEventListener("pointermove", setPointerFromEvent, { passive: true });
      canvas.addEventListener("pointerdown", (event) => {
        setPointerFromEvent(event);
        state.pointer.strength = 1;
        injectPerturbation(1.25);
        setGuideMessage("Local perturbation injected from canvas interaction.");
      });
      canvas.addEventListener("pointerleave", () => {
        state.pointer.active = false;
      });

    window.addEventListener("resize", resizeCanvas, { passive: true });
    document.addEventListener("visibilitychange", () => {
      pageVisible = !document.hidden;
      syncAnimation();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          inViewport = Boolean(entry && entry.isIntersecting);
          syncAnimation();
        },
        {
          threshold: 0.12
        }
      );
      observer.observe(canvas);
    }

    resizeCanvas();
    updateControlLabels();
    applyPreset("baseline");
    initTips();
    syncAnimation();
  }
})();
