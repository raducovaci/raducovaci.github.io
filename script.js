(function () {
  const DETAILS = {
    "academic-research": {
      tone: "blue",
      kicker: "Current research",
      title: "Academic Research",
      meta: "Master's thesis · University of Turin · 2024-ongoing",
      summary: "I design an ecological group-interaction study that aligns fNIRS, video, audio, and LLM annotations to identify moments of social coordination.",
      pointsTitle: "What it shows",
      points: [
        "Carries a project from paradigm design to analysis and writing.",
        "Connects model-derived annotations with physiological synchrony.",
        "Works across psychology, neuroscience, and computational methods."
      ],
      skillsTitle: "Strengths in practice",
      skills: [
        ["Research design", "Ecological, multi-participant paradigms."],
        ["Multimodal analysis", "Time-aligned behavioral and physiological data."],
        ["Scientific writing", "Clear narratives for complex methods."]
      ],
      facts: [
        ["Role", "Master's thesis researcher"],
        ["Supervisor", "Prof. Diano"],
        ["Status", "In progress"]
      ]
    },
    "masters-thesis": {
      tone: "blue",
      kicker: "Master's thesis",
      title: "Modern LLMs for social synchrony research",
      meta: "University of Turin · Prof. Diano · 2024-2026",
      summary: "The thesis asks whether multimodal LLMs can flag socially salient moments in natural group interaction—and whether those moments align with fNIRS synchrony.",
      notice: {
        label: "Current status",
        text: "The manuscript is still in preparation; the final PDF will be added when it becomes public."
      },
      pointsTitle: "Research logic",
      points: [
        "Capture synchronized fNIRS, video, and audio during group role-play.",
        "Turn clips into structured social annotations with repeated LLM calls.",
        "Compare model and human judgments with physiological synchrony."
      ],
      sectionsTitle: "Workflow",
      sections: [
        {
          title: "Design and acquisition",
          meta: "Completed",
          text: "Ecological four-player paradigm with synchronized recordings."
        },
        {
          title: "Annotation and validation",
          meta: "In progress",
          text: "Structured outputs, reliability checks, and model-human agreement."
        },
        {
          title: "Alignment and analysis",
          meta: "Next",
          text: "Time-align annotations with fNIRS and synchrony metrics."
        },
        {
          title: "Interpretation and writing",
          meta: "Final step",
          text: "Integrate results, limitations, figures, and discussion."
        }
      ],
      skillsTitle: "Strengths in practice",
      skills: [
        ["Paradigm design", "Ecological multi-participant research."],
        ["LLM workflows", "Prompts, schemas, repeated calls, and validation."],
        ["Data integration", "Behavioral and physiological signals on one timeline."]
      ],
      facts: [
        ["Period", "2024-2026"],
        ["Data", "fNIRS, video, audio"],
        ["Output", "Thesis and related manuscript work"]
      ]
    },
    "psychology-traineeship": {
      tone: "rose",
      kicker: "Clinical experience",
      title: "Psychology Traineeship",
      meta: "Molinette Hospital · Breast Unit oncology day hospital · 2026",
      summary: "A supervised six-month placement in psycho-oncology, supporting assessment where emotional, medical, and treatment factors meet.",
      pointsTitle: "What I practiced",
      points: [
        "Psychological interviews and history taking under supervision.",
        "Test and questionnaire administration, scoring, and interpretation.",
        "Clear, sensitive communication in a hospital setting."
      ],
      skillsTitle: "Clinical strengths",
      skills: [
        ["Interviewing", "Structured assessment with attention to context."],
        ["Psychometrics", "Careful administration and scoring."],
        ["Clinical judgment", "Integrating psychological and medical information."]
      ],
      facts: [
        ["Setting", "Oncology day hospital"],
        ["Focus", "Psycho-oncology"],
        ["Supervisor", "Dr. Stanizzo"]
      ]
    },
    "student-research-assistant": {
      tone: "blue",
      kicker: "Research experience",
      title: "Student Research Assistant",
      meta: "University research projects · 2024",
      summary: "Supported a published visual-awareness study and an early placebo/fNIRS pilot, gaining practical experience with participants and protocols.",
      pointsTitle: "What I contributed",
      points: [
        "Recruited and coordinated participants.",
        "Ran time-sensitive experimental sessions consistently.",
        "Helped refine the feasibility of an early placebo protocol."
      ],
      skillsTitle: "Research strengths",
      skills: [
        ["Participant care", "Clear instructions and reliable scheduling."],
        ["Protocol fidelity", "Consistent execution across sessions."],
        ["Lab reliability", "Attention to timing, flow, and data quality."]
      ],
      facts: [
        ["Role", "Research assistant"],
        ["Projects", "Visual awareness and placebo"],
        ["Period", "2024"]
      ]
    },
    "visual-perception": {
      tone: "blue",
      kicker: "Published project",
      title: "Reverse-breaking continuous flash suppression",
      meta: "Consciousness and Cognition 129 (2025), 103830",
      summary: "The study introduced reverse-bCFS to measure how long an initially visible face takes to disappear from awareness.",
      pointsTitle: "My contribution",
      points: [
        "Recruited and coordinated volunteers.",
        "Administered psychophysics sessions consistently.",
        "Contributed to data collection—not study design or manuscript leadership."
      ],
      skillsTitle: "What I practiced",
      skills: [
        ["Psychophysics", "Participant-facing visual-awareness experiments."],
        ["Data quality", "Consistent timing and instructions."],
        ["Research teamwork", "Reliable execution within a larger project."]
      ],
      facts: [
        ["Paradigms", "bCFS and reverse-bCFS"],
        ["Focus", "Visual awareness"],
        ["Role", "Recruitment and sessions"]
      ]
    },
    "placebo-effect": {
      tone: "blue",
      kicker: "Pilot project",
      title: "Placebo-effect experiment",
      meta: "Under Prof. Piedimonte · 2024",
      summary: "An early pain/placebo pilot combining controlled electrical stimulation with fNIRS acquisition.",
      notice: {
        label: "Outcome",
        text: "The project was cancelled after initial piloting; the experience listed here is limited to the work completed."
      },
      pointsTitle: "My contribution",
      points: [
        "Helped refine experimental flow and participant feasibility.",
        "Recruited volunteers and supported initial pilot sessions.",
        "Coordinated stimulation and fNIRS recording."
      ],
      skillsTitle: "What it added",
      skills: [
        ["Pilot testing", "Finding practical constraints early."],
        ["Protocol refinement", "Improving flow before full recruitment."],
        ["Acquisition", "Coordinating stimulation and fNIRS."]
      ],
      facts: [
        ["Status", "Cancelled pilot"],
        ["Methods", "Stimulation and fNIRS"],
        ["Area", "Pain and placebo"]
      ]
    },
    "medical-internship": {
      tone: "rose",
      kicker: "Clinical experience",
      title: "Medical Student Internship",
      meta: "Emergency Department · Ospedale Santa Chiara, Trento · 2019-2020",
      summary: "A supervised emergency-department placement focused on first-contact assessment and the practical rhythm of frontline care.",
      pointsTitle: "What I practiced",
      points: [
        "Patient triage, interviewing, and medical history taking.",
        "Concise clinical documentation and report writing.",
        "Basic supervised procedures, including blood draws and suturing."
      ],
      skillsTitle: "Clinical strengths",
      skills: [
        ["Triage", "Recognising urgency and patient flow."],
        ["Documentation", "Clear, concise clinical notes."],
        ["Composure", "Working carefully in a fast clinical setting."]
      ],
      facts: [
        ["Setting", "Emergency Department"],
        ["Hospital", "Santa Chiara, Trento"],
        ["Role", "Medical student intern"]
      ]
    },
    "fnirs-paper": {
      tone: "blue",
      kicker: "Research output",
      title: "Higher-order models for fNIRS hyperscanning",
      meta: "Manuscript in preparation · ESCAN 2026 abstract",
      summary: "This work examines group-level neural coordination beyond dyads, using four-player role-play to compare passive and active social interaction.",
      pointsTitle: "Why it matters",
      points: [
        "Moves from pairwise synchrony to higher-order group structure.",
        "Combines intersubject correlation, homological scaffolds, and O-information.",
        "Contrasts passive redundancy with richer active-group dynamics."
      ],
      skillsTitle: "Strengths in practice",
      skills: [
        ["Higher-order analysis", "Topology and information-theoretic measures."],
        ["Ecological neuroscience", "Complex interaction rather than simplified dyads."],
        ["Communication", "Conference abstract and manuscript framing."]
      ],
      facts: [
        ["Status", "Manuscript in preparation"],
        ["Conference", "ESCAN 2026"],
        ["Role", "Author and contributor"]
      ],
      document: {
        title: "fNIRS hyperscanning abstract PDF",
        href: "assets/docs/public/fnirs-hyperscanning-abstract.pdf",
        viewLabel: "View abstract",
        downloadLabel: "Download PDF"
      }
    },
    "bachelors-thesis": {
      tone: "sand",
      kicker: "Research output",
      title: "The predictive brain",
      meta: "Bachelor's dissertation · University of Turin · 2024",
      summary: "A literature-based account of depression through predictive processing and allostasis, connecting brain, body, and behavior.",
      pointsTitle: "Why it matters",
      points: [
        "Integrates predictive processing, interoception, and active inference.",
        "Connects theory with large-scale networks and visceromotor circuitry.",
        "Frames depression as maladaptive predictive regulation."
      ],
      skillsTitle: "Strengths in practice",
      skills: [
        ["Literature synthesis", "Computational, physiological, and clinical evidence."],
        ["Theoretical reasoning", "A broad literature shaped into one argument."],
        ["Translational framing", "Theory linked to testable hypotheses."]
      ],
      facts: [
        ["Degree", "BSc Psychological Sciences"],
        ["Year", "2024"],
        ["Format", "Literature-based dissertation"]
      ],
      document: {
        title: "Bachelor's dissertation PDF",
        href: "assets/docs/public/bachelor-thesis-predictive-brain.pdf",
        viewLabel: "View thesis",
        downloadLabel: "Download PDF"
      }
    },
    "research-interests": {
      tone: "sand",
      kicker: "Research direction",
      title: "Questions that organize the work",
      meta: "Prediction · body regulation · cognition",
      summary: "I am interested in how living systems predict, integrate signals, and turn uncertainty into adaptive behavior.",
      pointsTitle: "Core questions",
      points: [
        "How does prediction regulate perception and the body?",
        "Where does cognition begin beyond neurons?",
        "How do expectations shape pain and placebo effects?",
        "Which circuits could make predictive coding testable?"
      ],
      sectionsTitle: "Reference anchors",
      sections: [
        {
          title: "Interoceptive predictions in the brain",
          meta: "Barrett and Simmons, 2015",
          text: "The brain as an active regulator of bodily state.",
          href: "https://doi.org/10.1038/nrn3950",
          linkLabel: "Open paper"
        },
        {
          title: "The Computational Boundary of a 'Self'",
          meta: "Michael Levin, 2019",
          text: "Cognition, bioelectricity, and agency beyond neurons.",
          href: "https://doi.org/10.3389/fpsyg.2019.02688",
          linkLabel: "Open paper"
        },
        {
          title: "Placebo Analgesia: A Predictive Coding Perspective",
          meta: "Büchel et al., 2014",
          text: "Pain as inference shaped by expectation.",
          href: "https://doi.org/10.1016/j.neuron.2014.02.042",
          linkLabel: "Open paper"
        },
        {
          title: "Canonical Microcircuits for Predictive Coding",
          meta: "Bastos et al., 2012",
          text: "Predictive coding grounded in cortical circuitry.",
          href: "https://doi.org/10.1016/j.neuron.2012.10.038",
          linkLabel: "Open paper"
        }
      ],
      facts: [
        ["Direction", "Cognitive and affective neuroscience"],
        ["Bridge", "Prediction and body regulation"],
        ["Scale", "Circuit to social behavior"]
      ]
    },
    "hobbies-passions": {
      tone: "teal",
      kicker: "Outside work",
      title: "Hobbies and interests",
      meta: "Strategy · AI · space · biotechnology",
      summary: "My interests outside research still revolve around complex systems, intelligence, and strategy.",
      pointsTitle: "Personal anchors",
      points: [
        "Follow interpretability, reasoning, and model behavior in AI.",
        "Play chess and ranked strategy games competitively.",
        "Keep a long-running curiosity about space and biotechnology."
      ],
      sections: [
        {
          title: "AI and intelligence",
          meta: "Interpretability and model behavior",
          text: "A reference I return to: tracing intermediate representations in language models.",
          href: "https://www.anthropic.com/research/tracing-thoughts-language-model",
          linkLabel: "Open article"
        },
        {
          title: "Competitive games",
          meta: "Chess, TFT, League of Legends, Minesweeper",
          text: "Chess blitz top 3%; Diamond in TFT and League; top 100 on Minesweeper.online."
        }
      ],
      facts: [
        ["Chess", "Top 3% blitz"],
        ["TFT / LoL", "Diamond"],
        ["Minesweeper", "Top 100 online"]
      ]
    }
  };

  const root = document.documentElement;
  const workspace = document.getElementById("cvWorkspace");
  const panel = document.getElementById("detailPanel");
  const scrim = document.getElementById("detailScrim");
  const closeButton = document.getElementById("detailClose");
  const themeToggle = document.getElementById("themeToggle");
  const themeColorNode = document.querySelector('meta[name="theme-color"]');
  const yearNode = document.getElementById("year");
  const kickerNode = document.getElementById("detailKicker");
  const titleNode = document.getElementById("detailTitle");
  const metaNode = document.getElementById("detailMeta");
  const bodyNode = document.getElementById("detailBody");
  const actionsNode = document.getElementById("detailActions");
  const sections = Array.from(document.querySelectorAll(".cv-section"));
  const hotspots = Array.from(document.querySelectorAll("[data-detail]"));
  const skillEvidenceItems = Array.from(document.querySelectorAll(".cv-skill-evidence"));
  const skillEvidenceStatus = document.getElementById("skillEvidenceStatus");
  const hotspotTones = ["blue", "sage", "rose", "sand", "violet", "coral", "teal"];
  const themeStorageKey = "rc-theme";
  const themeColors = {
    light: "#f2f0ea",
    dark: "#0d1211"
  };
  const themeSoakDuration = 560;
  const skillEvidenceDelay = 650;
  let activeId = null;
  let activeTrigger = null;
  let activeSkillEvidence = null;
  let activeEvidenceTargets = [];
  let skillEvidenceTimer = null;
  let themeSoakTimer = null;

  initThemeToggle();
  initYear();
  initSectionToggles();
  initHotspots();
  initSkillEvidence();

  function initThemeToggle() {
    if (!themeToggle) {
      return;
    }

    setTheme(root.dataset.theme === "dark" ? "dark" : "light", false);

    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme, true);
      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch (_error) {
        // Ignore storage failures; the live toggle should still work.
      }
    });
  }

  function setTheme(theme, shouldAnimate) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    const isDark = normalizedTheme === "dark";

    root.dataset.theme = normalizedTheme;
    if (themeColorNode) {
      themeColorNode.setAttribute("content", themeColors[normalizedTheme]);
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    if (!shouldAnimate || prefersReducedMotion()) {
      root.classList.remove("is-theme-soaking");
      return;
    }

    window.clearTimeout(themeSoakTimer);
    root.classList.remove("is-theme-soaking");
    void root.offsetWidth;
    root.classList.add("is-theme-soaking");
    themeSoakTimer = window.setTimeout(() => {
      root.classList.remove("is-theme-soaking");
    }, themeSoakDuration);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initYear() {
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  function initSectionToggles() {
    sections.forEach((section, index) => {
      const heading = section.querySelector("h2");
      const body = section.querySelector(".cv-section__body");
      if (!heading || !body) {
        return;
      }

      const bodyId = body.id || (heading.id || "cv-section-" + index) + "-content";
      const inner = document.createElement("div");
      const button = document.createElement("button");
      const label = document.createElement("span");
      const icon = document.createElement("span");

      body.id = bodyId;
      inner.className = "cv-section__body-inner";
      while (body.firstChild) {
        inner.appendChild(body.firstChild);
      }
      body.appendChild(inner);

      button.type = "button";
      button.className = "section-toggle";
      button.setAttribute("aria-controls", bodyId);
      button.setAttribute("aria-expanded", "true");
      label.className = "section-toggle__label";
      while (heading.firstChild) {
        label.appendChild(heading.firstChild);
      }
      icon.className = "section-toggle__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"></path></svg>';
      button.append(label, icon);
      heading.appendChild(button);
      section.classList.add("is-collapsible");

      button.addEventListener("click", () => {
        const isCollapsed = section.classList.toggle("is-collapsed");
        button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
        body.setAttribute("aria-hidden", isCollapsed ? "true" : "false");
        inner.toggleAttribute("inert", isCollapsed);
      });
    });
  }

  function initHotspots() {
    if (!workspace || !panel || hotspots.length === 0) {
      return;
    }

    hotspots.forEach((hotspot) => {
      if (!hotspot.hasAttribute("aria-label")) {
        hotspot.setAttribute("aria-label", hotspot.textContent.trim().replace(/\s+/g, " "));
      }
      hotspot.setAttribute("aria-expanded", "false");

      hotspot.addEventListener("click", () => {
        const id = hotspot.getAttribute("data-detail");
        if (id) {
          activeTrigger = hotspot;
          openDetail(id, true, getHotspotTone(hotspot));
        }
      });
    });

    closeButton.addEventListener("click", closeDetail);
    if (scrim) {
      scrim.addEventListener("click", closeDetail);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDetail();
        return;
      }

      if (event.key === "Tab" && workspace.classList.contains("is-detail-open")) {
        keepFocusInPanel(event);
      }
    });

    document.addEventListener("click", (event) => {
      if (!workspace.classList.contains("is-detail-open")) {
        return;
      }
      if (panel.contains(event.target) || event.target.closest("[data-detail]")) {
        return;
      }
      closeDetail();
    });
  }

  function initSkillEvidence() {
    if (skillEvidenceItems.length === 0) {
      return;
    }

    skillEvidenceItems.forEach((item) => {
      item.addEventListener("pointerenter", () => scheduleSkillEvidence(item));
      item.addEventListener("pointerleave", () => {
        if (document.activeElement !== item) {
          clearSkillEvidence(item);
        }
      });
      item.addEventListener("focus", () => activateSkillEvidence(item));
      item.addEventListener("blur", () => clearSkillEvidence(item));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        clearSkillEvidence();
      }
    });

    document.addEventListener("click", (event) => {
      if (!activeSkillEvidence || !event.target.closest(".section-toggle")) {
        return;
      }
      const item = activeSkillEvidence;
      window.requestAnimationFrame(() => activateSkillEvidence(item));
    });
  }

  function scheduleSkillEvidence(item) {
    cancelSkillEvidenceTimer();
    if (activeSkillEvidence && activeSkillEvidence !== item) {
      clearSkillEvidence();
    }
    skillEvidenceTimer = window.setTimeout(
      () => activateSkillEvidence(item),
      skillEvidenceDelay
    );
  }

  function activateSkillEvidence(item) {
    if (!item) {
      return;
    }

    clearSkillEvidence();
    activeSkillEvidence = item;
    item.classList.add("is-skill-evidence-active");

    const evidenceIds = (item.getAttribute("data-evidence") || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const evidenceTone = getSkillEvidenceTone(item);
    const targets = new Set();

    evidenceIds.forEach((id) => {
      document.querySelectorAll('[data-detail="' + id + '"]').forEach((hotspot) => {
        const collapsedSection = hotspot.closest(".cv-section.is-collapsed");
        const sectionToggle = collapsedSection && collapsedSection.querySelector(".section-toggle");
        const marker = hotspot.querySelector(".cv-hotspot__marker");
        targets.add(sectionToggle || marker || hotspot);
      });
    });

    activeEvidenceTargets = Array.from(targets);
    activeEvidenceTargets.forEach((target) => {
      target.style.setProperty("--skill-evidence-bg", evidenceTone.bg);
      target.style.setProperty("--skill-evidence-color", evidenceTone.ink);
      target.classList.add("is-skill-evidence-source");
    });

    if (skillEvidenceStatus) {
      const skillName = item.textContent.trim().replace(/\s+/g, " ");
      const evidenceLabel = item.getAttribute("data-evidence-label") || "related CV evidence";
      skillEvidenceStatus.textContent = skillName + ". Evidence highlighted: " + evidenceLabel + ".";
    }
  }

  function clearSkillEvidence(item) {
    cancelSkillEvidenceTimer();
    if (item && activeSkillEvidence && item !== activeSkillEvidence) {
      return;
    }

    if (activeSkillEvidence) {
      activeSkillEvidence.classList.remove("is-skill-evidence-active");
    }
    activeEvidenceTargets.forEach((target) => {
      target.classList.remove("is-skill-evidence-source");
      target.style.removeProperty("--skill-evidence-bg");
      target.style.removeProperty("--skill-evidence-color");
    });
    activeSkillEvidence = null;
    activeEvidenceTargets = [];

    if (skillEvidenceStatus) {
      skillEvidenceStatus.textContent = "";
    }
  }

  function cancelSkillEvidenceTimer() {
    if (skillEvidenceTimer !== null) {
      window.clearTimeout(skillEvidenceTimer);
      skillEvidenceTimer = null;
    }
  }

  function getSkillEvidenceTone(item) {
    const block = item.closest(".cv-skill-block");
    if (!block) {
      return {
        bg: "var(--track-bridge)",
        ink: "var(--track-bridge-ink)"
      };
    }

    if (block.classList.contains("cv-skill-block--blue")) {
      return {
        bg: "var(--blue)",
        ink: "var(--blue-ink)"
      };
    }
    if (block.classList.contains("cv-skill-block--rose")) {
      return {
        bg: "var(--rose)",
        ink: "var(--rose-ink)"
      };
    }
    if (block.classList.contains("cv-skill-block--sand")) {
      return {
        bg: "var(--sand)",
        ink: "var(--sand-ink)"
      };
    }

    return {
      bg: "var(--track-bridge)",
      ink: "var(--track-bridge-ink)"
    };
  }

  function getHotspotTone(hotspot) {
    return hotspotTones.find((tone) =>
      hotspot.classList.contains("cv-hotspot--" + tone)
    );
  }

  function openDetail(id, shouldFocusPanel, hotspotTone) {
    const detail = DETAILS[id];
    if (!detail || !workspace || !panel) {
      return;
    }

    activeId = id;
    panel.setAttribute("data-tone", hotspotTone || detail.tone || "blue");
    panel.setAttribute("aria-hidden", "false");
    if (scrim) {
      scrim.setAttribute("aria-hidden", "false");
    }
    workspace.classList.add("is-detail-open");
    document.body.classList.add("is-panel-open");

    updateHotspotState(id);
    renderDetail(detail);
    bodyNode.scrollTop = 0;

    if (shouldFocusPanel) {
      window.setTimeout(() => panel.focus({ preventScroll: true }), 60);
    }
  }

  function closeDetail() {
    if (!workspace || !workspace.classList.contains("is-detail-open")) {
      return;
    }

    const triggerToRestore = activeTrigger;
    activeId = null;
    activeTrigger = null;
    workspace.classList.remove("is-detail-open");
    panel.setAttribute("aria-hidden", "true");
    if (scrim) {
      scrim.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("is-panel-open");
    updateHotspotState(null);

    if (triggerToRestore && document.contains(triggerToRestore)) {
      window.setTimeout(() => triggerToRestore.focus({ preventScroll: true }), 40);
    }
  }

  function keepFocusInPanel(event) {
    const focusable = Array.from(
      panel.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
    ).filter((element) => element.offsetParent !== null);

    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateHotspotState(id) {
    hotspots.forEach((hotspot) => {
      hotspot.setAttribute(
        "aria-expanded",
        id && hotspot.getAttribute("data-detail") === id ? "true" : "false"
      );
    });
  }

  function renderDetail(detail) {
    kickerNode.textContent = detail.kicker || "";
    titleNode.textContent = detail.title || "";
    metaNode.textContent = detail.meta || "";
    panel.setAttribute("data-layout", "standard");

    replaceChildren(bodyNode);
    renderOverview(detail);
    renderDetailFacts(detail);
    renderNotice(detail);
    renderPoints(detail);
    renderDetailSkills(detail);
    renderDetailSections(detail);
    renderActions(detail);
  }

  function renderOverview(detail) {
    const paragraphs = detail.summary
      ? [detail.summary]
      : detail.paragraphs || [];

    if (paragraphs.length === 0) {
      return;
    }

    const section = document.createElement("section");
    section.className = "detail-overview";
    paragraphs.forEach((text, index) => {
      const paragraph = document.createElement("p");
      paragraph.className = index === 0 ? "detail-lede" : "";
      paragraph.textContent = text;
      section.appendChild(paragraph);
    });
    bodyNode.appendChild(section);
  }

  function renderNotice(detail) {
    if (!detail.notice) {
      return;
    }

    const notice = document.createElement("section");
    const label = document.createElement("strong");
    const text = document.createElement("p");
    notice.className = "detail-notice";
    label.textContent = detail.notice.label || "Note";
    text.textContent = detail.notice.text || "";
    notice.append(label, text);
    bodyNode.appendChild(notice);
  }

  function renderPoints(detail) {
    const points = detail.points || detail.bullets || [];
    if (points.length === 0) {
      return;
    }

    const section = makeDetailBlock(detail.pointsTitle || "Key points", "detail-points");
    const list = document.createElement("ul");
    points.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      list.appendChild(item);
    });
    section.appendChild(list);
    bodyNode.appendChild(section);
  }

  function renderDetailSections(detail) {
    if (!detail.sections || detail.sections.length === 0) {
      return;
    }

    const section = makeDetailBlock(detail.sectionsTitle || "Related context", "detail-section-list");
    detail.sections.forEach((entry) => {
      const article = document.createElement("article");
      const title = document.createElement("h4");
      article.className = "detail-section-item";
      title.textContent = entry.title || "";
      article.appendChild(title);

      if (entry.meta) {
        const meta = document.createElement("p");
        meta.className = "detail-section-meta";
        meta.textContent = entry.meta;
        article.appendChild(meta);
      }

      if (entry.text) {
        const text = document.createElement("p");
        text.className = "detail-section-text";
        text.textContent = entry.text;
        article.appendChild(text);
      }

      if (entry.href) {
        const link = document.createElement("a");
        link.className = "detail-section-link";
        link.href = entry.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = entry.linkLabel || "Open source";
        article.appendChild(link);
      }

      section.appendChild(article);
    });
    bodyNode.appendChild(section);
  }

  function renderDetailSkills(detail) {
    if (!detail.skills || detail.skills.length === 0) {
      return;
    }

    const section = makeDetailBlock(detail.skillsTitle || "Relevant skills", "detail-skills");
    const list = document.createElement("ul");

    detail.skills.forEach((skill) => {
      const item = document.createElement("li");
      const normalized = normalizeSkill(skill);

      if (normalized.label) {
        const keyword = document.createElement("strong");
        keyword.className = "detail-skill-keyword";
        keyword.textContent = normalized.label;
        item.append(keyword, document.createTextNode(normalized.description));
      } else {
        item.textContent = normalized.description;
      }

      list.appendChild(item);
    });

    section.appendChild(list);
    bodyNode.appendChild(section);
  }

  function normalizeSkill(skill) {
    if (Array.isArray(skill)) {
      return {
        label: skill[0],
        description: skill[1] ? " " + skill[1] : ""
      };
    }

    const text = String(skill);
    const separatorIndex = text.indexOf(":");
    if (separatorIndex > 0) {
      return {
        label: text.slice(0, separatorIndex),
        description: text.slice(separatorIndex + 1)
      };
    }

    return {
      label: "",
      description: text
    };
  }

  function renderDetailFacts(detail) {
    if (!detail.facts || detail.facts.length === 0) {
      return;
    }

    const section = makeDetailBlock(detail.factsTitle || "At a glance", "detail-fact-block");
    const list = document.createElement("dl");
    list.className = "detail-facts";

    detail.facts.forEach(([label, value]) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const definition = document.createElement("dd");
      row.className = "detail-fact";
      term.textContent = label;
      definition.textContent = value;
      row.append(term, definition);
      list.appendChild(row);
    });

    section.appendChild(list);
    bodyNode.appendChild(section);
  }

  function makeDetailBlock(title, className) {
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    section.className = "detail-block " + className;
    heading.textContent = title;
    section.appendChild(heading);
    return section;
  }

  function renderResearchMap(detail) {
    const map = document.createElement("section");
    const intro = document.createElement("p");
    const prompt = document.createElement("p");
    const topics = document.createElement("div");
    const hub = document.createElement("span");
    const focus = document.createElement("article");
    const buttons = [];

    map.className = "research-map";
    intro.className = "research-map__intro";
    intro.textContent = detail.intro || "";
    prompt.className = "research-map__prompt";
    prompt.textContent = "Choose a question";
    topics.className = "research-map__topics";
    topics.setAttribute("aria-label", "Research questions");
    hub.className = "research-map__hub";
    hub.setAttribute("aria-hidden", "true");
    focus.id = "researchTopicFocus";
    focus.className = "research-focus";
    focus.setAttribute("aria-live", "polite");

    (detail.topics || []).forEach((topic, index) => {
      const button = document.createElement("button");
      const number = document.createElement("span");
      const label = document.createElement("strong");
      const question = document.createElement("span");

      button.type = "button";
      button.className = "research-topic research-topic--" + (topic.tone || "blue");
      button.setAttribute("aria-controls", focus.id);
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      number.className = "research-topic__number";
      number.textContent = String(index + 1).padStart(2, "0");
      label.className = "research-topic__label";
      label.textContent = topic.label;
      question.className = "research-topic__question";
      question.textContent = topic.question;
      button.append(number, label, question);
      button.addEventListener("click", () => {
        renderResearchTopic(topic, buttons, button, focus);
      });
      buttons.push(button);
      topics.appendChild(button);
    });

    topics.appendChild(hub);
    map.append(intro, prompt, topics, focus);
    bodyNode.appendChild(map);

    if (detail.topics && detail.topics.length > 0) {
      renderResearchTopic(detail.topics[0], buttons, buttons[0], focus);
    }
  }

  function renderResearchTopic(topic, buttons, activeButton, focus) {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", button === activeButton ? "true" : "false");
    });

    replaceChildren(focus);
    focus.setAttribute("data-topic-tone", topic.tone || "blue");

    const eyebrow = document.createElement("p");
    const title = document.createElement("h3");
    const citation = document.createElement("p");
    const takeaway = document.createElement("p");
    const footer = document.createElement("div");
    const link = document.createElement("a");

    eyebrow.className = "research-focus__eyebrow";
    eyebrow.textContent = topic.field;
    title.textContent = topic.paper;
    citation.className = "research-focus__citation";
    citation.textContent = topic.authors + " · " + topic.year;
    takeaway.className = "research-focus__takeaway";
    takeaway.textContent = topic.takeaway;
    footer.className = "research-focus__footer";
    link.className = "research-focus__link";
    link.href = topic.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open paper ↗";

    if (topic.source) {
      const source = document.createElement("span");
      source.className = "research-focus__source";
      source.textContent = topic.source;
      footer.appendChild(source);
    }

    footer.appendChild(link);
    focus.append(eyebrow, title, citation, takeaway, footer);
  }

  function renderHobbies(detail) {
    const board = document.createElement("section");
    const aiCard = document.createElement("article");
    const aiIcon = document.createElement("span");
    const aiContent = document.createElement("div");
    const aiEyebrow = document.createElement("p");
    const aiTitle = document.createElement("h3");
    const aiText = document.createElement("p");
    const aiLink = document.createElement("a");
    const gamesTitle = document.createElement("p");
    const games = document.createElement("ul");

    board.className = "hobby-board";
    aiCard.className = "hobby-ai";
    aiIcon.className = "hobby-ai__icon";
    aiIcon.textContent = "AI";
    aiIcon.setAttribute("aria-hidden", "true");
    aiContent.className = "hobby-ai__content";
    aiEyebrow.className = "hobby-board__eyebrow";
    aiEyebrow.textContent = detail.ai.eyebrow;
    aiTitle.textContent = detail.ai.title;
    aiText.className = "hobby-ai__text";
    aiText.textContent = detail.ai.text;
    aiLink.className = "hobby-ai__link";
    aiLink.href = detail.ai.href;
    aiLink.target = "_blank";
    aiLink.rel = "noopener noreferrer";
    aiLink.textContent = detail.ai.linkLabel;
    aiContent.append(aiEyebrow, aiTitle, aiText, aiLink);
    aiCard.append(aiIcon, aiContent);

    gamesTitle.className = "hobby-board__eyebrow";
    gamesTitle.textContent = "Competitive games";
    games.className = "hobby-games";
    games.setAttribute("aria-label", "Competitive gaming achievements");

    (detail.games || []).forEach((game) => {
      const item = document.createElement("li");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("span");
      const achievement = document.createElement("strong");
      const context = document.createElement("span");

      item.className = "hobby-game";
      icon.className = "hobby-game__icon";
      icon.textContent = game.icon;
      icon.setAttribute("aria-hidden", "true");
      content.className = "hobby-game__content";
      title.className = "hobby-game__title";
      title.textContent = game.title;
      achievement.className = "hobby-game__achievement";
      achievement.textContent = game.achievement;
      context.className = "hobby-game__context";
      context.textContent = game.context;
      content.append(title, achievement, context);
      item.append(icon, content);
      games.appendChild(item);
    });

    board.append(aiCard, gamesTitle, games);

    if (detail.more && detail.more.length > 0) {
      const more = document.createElement("p");
      more.className = "hobby-board__more";
      more.textContent = "Also curious about · " + detail.more.join(" · ");
      board.appendChild(more);
    }

    bodyNode.appendChild(board);
  }

  function renderThesisProgress(detail) {
    const progress = document.createElement("section");
    const status = document.createElement("article");
    const statusTop = document.createElement("div");
    const statusLabel = document.createElement("strong");
    const eta = document.createElement("span");
    const statusMessage = document.createElement("p");
    const summary = document.createElement("p");
    const summaryLabel = document.createElement("strong");
    const skillsSection = document.createElement("section");
    const skillsTitle = document.createElement("h3");
    const skills = document.createElement("div");
    const pipelineSection = document.createElement("section");
    const pipelineTitle = document.createElement("h3");
    const pipeline = document.createElement("ol");
    const evidence = document.createElement("p");

    progress.className = "thesis-progress";
    status.className = "thesis-status";
    statusTop.className = "thesis-status__top";
    statusLabel.className = "thesis-status__label";
    statusLabel.textContent = detail.status.label;
    eta.className = "thesis-status__eta";
    eta.textContent = detail.status.eta;
    statusMessage.className = "thesis-status__message";
    statusMessage.textContent = detail.status.message;
    summary.className = "thesis-status__summary";
    summaryLabel.textContent = "The project · ";
    summary.append(summaryLabel, document.createTextNode(detail.summary));
    statusTop.append(statusLabel, eta);
    status.append(statusTop, statusMessage, summary);

    skillsSection.className = "thesis-progress__section";
    skillsTitle.className = "thesis-progress__title";
    skillsTitle.textContent = "What this work demonstrates";
    skills.className = "thesis-skills";

    (detail.skills || []).forEach(([label, description]) => {
      const skill = document.createElement("article");
      const dot = document.createElement("span");
      const content = document.createElement("div");
      const skillLabel = document.createElement("strong");
      const skillDescription = document.createElement("p");

      skill.className = "thesis-skill";
      dot.className = "thesis-skill__dot";
      dot.setAttribute("aria-hidden", "true");
      skillLabel.textContent = label;
      skillDescription.textContent = description;
      content.append(skillLabel, skillDescription);
      skill.append(dot, content);
      skills.appendChild(skill);
    });

    skillsSection.append(skillsTitle, skills);

    pipelineSection.className = "thesis-progress__section";
    pipelineTitle.className = "thesis-progress__title";
    pipelineTitle.textContent = "From paradigm to manuscript";
    pipeline.className = "thesis-pipeline";

    (detail.pipeline || []).forEach((stage) => {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      const content = document.createElement("div");
      const heading = document.createElement("div");
      const title = document.createElement("strong");
      const stageStatus = document.createElement("span");
      const description = document.createElement("p");

      item.className = "thesis-stage thesis-stage--" + stage.status;
      marker.className = "thesis-stage__marker";
      marker.textContent = stage.step;
      content.className = "thesis-stage__content";
      heading.className = "thesis-stage__heading";
      title.textContent = stage.title;
      stageStatus.className = "thesis-stage__status";
      stageStatus.textContent = stage.statusLabel;
      description.textContent = stage.detail;
      heading.append(title, stageStatus);
      content.append(heading, description);
      item.append(marker, content);
      pipeline.appendChild(item);
    });

    pipelineSection.append(pipelineTitle, pipeline);
    evidence.className = "thesis-evidence";
    evidence.textContent = detail.evidence;
    progress.append(status, skillsSection, pipelineSection, evidence);
    bodyNode.appendChild(progress);
  }

  function renderActions(detail) {
    replaceChildren(actionsNode);
    actionsNode.classList.toggle(
      "detail-actions--document",
      Boolean(detail.document)
    );

    if (!detail.document) {
      return;
    }

    actionsNode.appendChild(
      makeActionLink({
        href: detail.document.href,
        label: detail.document.viewLabel || "Open PDF",
        icon: "open",
        target: "_blank"
      })
    );

    actionsNode.appendChild(
      makeActionLink({
        href: detail.document.href,
        label: detail.document.downloadLabel || "Download",
        icon: "download",
        download: true
      })
    );

  }

  function makeActionLink({ href, label, icon, target, download }) {
    const link = document.createElement("a");
    link.className = "detail-action";
    link.href = href;
    if (target) {
      link.target = target;
      link.rel = "noopener noreferrer";
    }
    if (download) {
      link.setAttribute("download", "");
    }
    link.innerHTML = getIcon(icon) + "<span></span>";
    link.querySelector("span").textContent = label;
    return link;
  }

  function getIcon(name) {
    if (name === "download") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.75v10.5m0 0 3.25-3.25M12 14.25 8.75 11"></path><path d="M5 16.25v2.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-2.5"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h9v9"></path><path d="M17 7 7 17"></path><path d="M6.5 5.5h-1v13h13v-1"></path></svg>';
  }

  function replaceChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
})();
