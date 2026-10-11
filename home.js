(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const themeStorageKey = "rc-theme";
  const themeColors = {
    light: "#f6f3ec",
    dark: "#13120f"
  };

  initScrollTop();
  initTheme();
  initNav();
  initAsides();
  initReveal();
  initEmail();
  initYear();
  initCvLock();
  initMeadow();

  /* ---------- Always open at the meadow ---------- */

  function initScrollTop() {
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    window.addEventListener("load", toTop, { once: true });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        toTop();
      }
    });
  }

  /* ---------- Theme ---------- */

  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const themeColorNode = document.querySelector('meta[name="theme-color"]');

    applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch (_error) {
        // Storage can be unavailable (private mode); the toggle still works for this visit.
      }
    });

    function applyTheme(theme) {
      const isDark = theme === "dark";
      root.dataset.theme = theme;
      if (themeColorNode) {
        themeColorNode.setAttribute("content", themeColors[theme]);
      }
      if (toggle) {
        toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
        toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      }
    }
  }

  /* ---------- Navigation ---------- */

  function initNav() {
    const nav = document.getElementById("siteNav");
    if (!nav) {
      return;
    }

    let ticking = false;
    const update = () => {
      const shown = window.scrollY > 120;
      nav.classList.toggle("is-scrolled", shown);
      if (!shown) {
        nav.dispatchEvent(new CustomEvent("nav:hide"));
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Section asides fade under their sticky titles ---------- */

  function initAsides() {
    const pairs = Array.from(document.querySelectorAll(".section__aside"))
      .map((aside) => ({ aside, title: aside.parentElement && aside.parentElement.querySelector("h2") }))
      .filter((pair) => pair.title);
    if (!pairs.length) {
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      for (const { aside, title } of pairs) {
        // The natural gap is the aside's 10px margin; fade out as the title slides over it.
        const gap = aside.getBoundingClientRect().top - title.getBoundingClientRect().bottom;
        const opacity = clamp((gap + 6) / 16, 0, 1);
        aside.style.opacity = opacity >= 1 ? "" : opacity.toFixed(3);
      }
    };

    const schedule = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) {
      return;
    }

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        entering.forEach((entry, index) => {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 70}ms`);
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Small details ---------- */

  function initEmail() {
    const link = document.getElementById("emailLink");
    if (link && link.dataset.user && link.dataset.domain) {
      link.href = `mailto:${link.dataset.user}@${link.dataset.domain}`;
    }
  }

  function initYear() {
    const yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  /* ---------- CV (temporarily parked) ---------- */

  function initCvLock() {
    const button = document.getElementById("cvLocked");
    const notice = document.getElementById("cvNotice");
    if (!button || !notice) {
      return;
    }

    let hideTimer = 0;

    const hide = () => {
      notice.hidden = true;
      button.setAttribute("aria-expanded", "false");
    };

    const nav = document.getElementById("siteNav");
    if (nav) {
      nav.addEventListener("nav:hide", hide);
    }

    const noticeText = notice.querySelector(".cv-notice__text");
    const defaultText = noticeText ? noticeText.textContent : "";
    const knocks = [];
    let eggRunning = false;

    const show = (text) => {
      if (noticeText) {
        noticeText.textContent = text || defaultText;
      }
      notice.hidden = false;
      button.setAttribute("aria-expanded", "true");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, 4200);
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (eggRunning) {
        return;
      }

      // Knock five times in quick succession and someone answers the door.
      const now = performance.now();
      knocks.push(now);
      while (knocks.length && now - knocks[0] > 2200) {
        knocks.shift();
      }
      if (knocks.length >= 5) {
        knocks.length = 0;
        hide();
        if (reduceMotion.matches) {
          show("Seriously. Do not disturb.");
          return;
        }
        eggRunning = true;
        playDoNotDisturb(button, event).finally(() => {
          eggRunning = false;
        });
        return;
      }

      button.classList.remove("is-nudged");
      void button.offsetWidth;
      button.classList.add("is-nudged");
      show();
    });

    document.addEventListener("click", (event) => {
      if (!notice.hidden && !notice.contains(event.target)) {
        hide();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !notice.hidden) {
        hide();
        button.focus();
      }
    });
  }

  /* ---------- Easter egg: do not disturb ----------
   * Knock five times on the parked CV and its caretaker comes to the door,
   * kicks your cursor across the room, and slams it shut again.
   */

  const DND_SVG = `
    <svg class="dnd__scene" viewBox="0 0 150 130" width="150" height="130">
      <defs>
        <filter id="dndWobble" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence class="dnd__turbulence" type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="1" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
      <g filter="url(#dndWobble)">
        <path class="dnd__ground" d="M30 104.5 H120" />
        <rect class="dnd__room" x="54" y="26" width="40" height="78" />
        <path class="dnd__frame" d="M51.5 104.5 V23.5 H96.5 V104.5" />
        <g class="dnd__mascot">
          <rect class="dnd__nub" x="53" y="76" width="6" height="7" />
          <rect class="dnd__nub" x="89" y="76" width="6" height="7" />
          <rect class="dnd__leg dnd__kick" x="60" y="91" width="4" height="10" />
          <rect class="dnd__leg" x="66.5" y="91" width="4" height="10" />
          <rect class="dnd__leg" x="77.5" y="91" width="4" height="10" />
          <rect class="dnd__leg" x="84" y="91" width="4" height="10" />
          <rect class="dnd__body" x="57" y="68" width="34" height="24" rx="1.5" />
          <rect class="dnd__eye" x="65" y="75" width="3.4" height="6" />
          <rect class="dnd__eye" x="79.6" y="75" width="3.4" height="6" />
          <path class="dnd__brow" d="M62.5 71.5 L69 74.2 M85.5 71.5 L79 74.2" />
        </g>
        <g class="dnd__door">
          <rect class="dnd__panel" x="54" y="26" width="40" height="78" />
          <path class="dnd__inset" d="M59 32 H89 V58 H59 Z M59 64 H89 V98 H59 Z" />
          <circle class="dnd__knob" cx="86" cy="66" r="2" />
          <g class="dnd__tag">
            <path class="dnd__string" d="M86 66 L80 74 M86 66 L92 74" />
            <rect class="dnd__card" x="74" y="73.5" width="24" height="13" rx="1.5" />
            <text class="dnd__text" x="86" y="79.2">DO NOT</text>
            <text class="dnd__text" x="86" y="84.6">DISTURB</text>
          </g>
        </g>
        <g class="dnd__slam">
          <path d="M100 40 L108 36 M101 56 L110 56 M100 72 L108 76" />
        </g>
        <g class="dnd__bubble">
          <path class="dnd__bubble-shape" d="M98 38 Q98 28 110 28 H132 Q142 28 142 38 Q142 48 132 48 H112 L104 55 L106 47 Q98 46 98 38 Z" />
          <text class="dnd__grawlix" x="120" y="41.5">#@$%!</text>
        </g>
      </g>
    </svg>`;

  const CURSOR_SVG = `
    <svg viewBox="0 0 16 24" width="16" height="24">
      <path d="M1 1 L1 18.5 L5.4 14.4 L8.3 21.4 L11.2 20.2 L8.3 13.3 L14.2 13.3 Z" />
    </svg>`;

  async function playDoNotDisturb(button, event) {
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const run = (node, frames, options) => node.animate(frames, { fill: "forwards", ...options }).finished;

    const rect = button.getBoundingClientRect();
    const left = Math.round(clamp(rect.left + rect.width / 2 - 74, 4, window.innerWidth - 154));
    const top = Math.round(rect.bottom - 16);
    const fromPointer = event.clientX > 0 || event.clientY > 0;
    const px = fromPointer ? event.clientX : rect.left + rect.width / 2;
    const py = fromPointer ? event.clientY : rect.top + rect.height / 2;
    const hasCursor = fromPointer && window.matchMedia("(hover: hover)").matches;

    const stage = document.createElement("div");
    stage.className = "dnd";
    stage.setAttribute("aria-hidden", "true");
    stage.style.left = `${left}px`;
    stage.style.top = `${top}px`;
    stage.innerHTML = DND_SVG;
    document.body.appendChild(stage);

    const q = (selector) => stage.querySelector(selector);
    const door = q(".dnd__door");
    const mascot = q(".dnd__mascot");
    const kick = q(".dnd__kick");
    const brow = q(".dnd__brow");
    const bubble = q(".dnd__bubble");
    const slam = q(".dnd__slam");
    const tag = q(".dnd__tag");
    const turbulence = q(".dnd__turbulence");

    // The same 8 fps line boil as the meadow.
    let seed = 1;
    const boil = window.setInterval(() => {
      seed = (seed % 3) + 1;
      turbulence.setAttribute("seed", String(seed));
    }, 125);

    let cursor = null;
    if (hasCursor) {
      cursor = document.createElement("div");
      cursor.className = "dnd-cursor";
      cursor.style.left = `${px}px`;
      cursor.style.top = `${py}px`;
      cursor.innerHTML = CURSOR_SVG;
      document.body.appendChild(cursor);
      root.classList.add("dnd-kicked");
    }

    try {
      await run(stage, [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], {
        duration: 220,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      });
      tag.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(9deg)" }, { transform: "rotate(-5deg)" }, { transform: "rotate(0deg)" }], {
        duration: 700
      });
      await wait(260);

      // The door creaks open...
      await run(door, [{ transform: "scaleX(1)" }, { transform: "scaleX(0.14)" }], {
        duration: 320,
        easing: "cubic-bezier(0.3, 0, 0.2, 1)"
      });

      // ...someone steps out, not pleased.
      await run(mascot, [{ transform: "translate(0px, 0px)" }, { transform: "translate(26px, 0px)" }], {
        duration: 240,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      });
      brow.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: "forwards" });
      bubble.animate(
        [
          { opacity: 0, transform: "scale(0.4)" },
          { opacity: 1, transform: "scale(1.08)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        { duration: 300, fill: "forwards", easing: "ease-out" }
      );
      await run(
        mascot,
        [
          { transform: "translate(26px, 0px)" },
          { transform: "translate(24.5px, 0px)" },
          { transform: "translate(27.5px, 0px)" },
          { transform: "translate(24.5px, 0px)" },
          { transform: "translate(26px, 0px)" }
        ],
        { duration: 380 }
      );
      await wait(160);

      // Leap up beside the cursor, so the kicking foot ends up right on it.
      // The kick leg hangs from (62, 91) and is 10 units long; swung 78° it
      // points left and slightly down, so its tip lands at about (52.2, 93.1).
      const targetX = px - left;
      const targetY = py - top;
      const kickX = clamp(targetX - 52.2 + 2, -40, 60);
      const kickY = clamp(targetY - 93.1, -112, 0);
      const apexY = Math.min(kickY - 14, -20);
      bubble.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" });
      await run(
        mascot,
        [
          { transform: "translate(26px, 0px)" },
          { transform: "translate(27px, 3px)", offset: 0.12 },
          { transform: `translate(${(26 + kickX) / 2 + 4}px, ${apexY}px)`, offset: 0.62 },
          { transform: `translate(${kickX + 5}px, ${kickY}px)` }
        ],
        { duration: 340, easing: "cubic-bezier(0.25, 0.8, 0.3, 1)" }
      );

      // Wind-up: pull the leg back...
      await run(kick, [{ transform: "rotate(0deg)" }, { transform: "rotate(-28deg)" }], {
        duration: 150,
        easing: "cubic-bezier(0.3, 0, 0.3, 1)"
      });
      // ...and swing through, lunging into it.
      mascot.animate([{ transform: `translate(${kickX + 5}px, ${kickY}px)` }, { transform: `translate(${kickX}px, ${kickY}px)` }], {
        duration: 80,
        fill: "forwards",
        easing: "ease-out"
      });
      await run(kick, [{ transform: "rotate(-28deg)" }, { transform: "rotate(84deg)" }, { transform: "rotate(78deg)" }], {
        duration: 110,
        easing: "cubic-bezier(0.5, 0, 0.2, 1)"
      });

      burst(px, py);
      speedLines(px, py);
      if (cursor) {
        launchCursor(cursor, px, py);
      }

      // Hold the follow-through for a beat, then drop back down.
      await wait(320);
      kick.animate([{ transform: "rotate(78deg)" }, { transform: "rotate(0deg)" }], { duration: 200, fill: "forwards" });
      await run(mascot, [{ transform: `translate(${kickX}px, ${kickY}px)` }, { transform: "translate(26px, 0px)" }], {
        duration: 280,
        easing: "cubic-bezier(0.5, 0, 0.75, 0.4)"
      });
      // A little landing squash.
      await run(
        mascot,
        [
          { transform: "translate(26px, 0px)" },
          { transform: "translate(26px, 1.5px)" },
          { transform: "translate(26px, 0px)" }
        ],
        { duration: 140 }
      );
      await wait(120);
      await run(mascot, [{ transform: "translate(26px, 0px)" }, { transform: "translate(0px, 0px)" }], {
        duration: 200,
        easing: "ease-in"
      });
      await run(door, [{ transform: "scaleX(0.14)" }, { transform: "scaleX(1)" }], {
        duration: 110,
        easing: "cubic-bezier(0.7, 0, 1, 0.6)"
      });
      slam.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0 }], { duration: 520, fill: "forwards" });
      tag.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-24deg)" },
          { transform: "rotate(16deg)" },
          { transform: "rotate(-8deg)" },
          { transform: "rotate(3deg)" },
          { transform: "rotate(0deg)" }
        ],
        { duration: 1100, easing: "ease-out" }
      );
      await run(
        stage,
        [
          { transform: "translateX(0px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(-2px)" },
          { transform: "translateX(1px)" },
          { transform: "translateX(0px)" }
        ],
        { duration: 300 }
      );

      root.classList.remove("dnd-kicked");
      await wait(900);
      await run(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 320 });
    } finally {
      window.clearInterval(boil);
      root.classList.remove("dnd-kicked");
      stage.remove();
      if (cursor) {
        cursor.remove();
      }
    }
  }

  /* The kicked cursor sails left across the screen, spinning, with a short trail
   * of ghost copies so it's easy to follow. */
  function launchCursor(cursor, x, y) {
    const distance = x + 80;
    const duration = clamp(distance * 0.8, 780, 1150);
    const frames = [
      { transform: "translate(0px, 0px) rotate(0deg)" },
      { transform: `translate(${-distance * 0.45}px, -46px) rotate(-300deg)`, offset: 0.4 },
      { transform: `translate(${-distance}px, 10px) rotate(-640deg)` }
    ];
    const options = { duration, fill: "forwards", easing: "cubic-bezier(0.22, 0.6, 0.36, 1)" };

    const ghosts = [0.34, 0.2, 0.1].map((opacity, index) => {
      const ghost = cursor.cloneNode(true);
      ghost.classList.add("dnd-cursor--ghost");
      ghost.style.opacity = String(opacity);
      document.body.appendChild(ghost);
      ghost.animate(frames, { ...options, delay: 34 * (index + 1) });
      return ghost;
    });

    cursor.animate(frames, options).finished.then(() => {
      cursor.style.visibility = "hidden";
    });
    window.setTimeout(() => ghosts.forEach((ghost) => ghost.remove()), duration + 200);
  }

  /* Three quick ink dashes flying off the point of impact. */
  function speedLines(x, y) {
    const lines = document.createElement("div");
    lines.className = "dnd-speed";
    lines.style.left = `${x}px`;
    lines.style.top = `${y}px`;
    lines.setAttribute("aria-hidden", "true");
    lines.innerHTML =
      '<svg viewBox="0 0 40 24" width="40" height="24"><path d="M14 4 H38 M8 12 H36 M16 20 H34" /></svg>';
    document.body.appendChild(lines);
    lines
      .animate(
        [
          { transform: "translate(-6px, -50%) scaleX(0.3)", opacity: 0 },
          { transform: "translate(0px, -50%) scaleX(1)", opacity: 1, offset: 0.3 },
          { transform: "translate(14px, -50%) scaleX(0.6)", opacity: 0 }
        ],
        { duration: 460, easing: "ease-out", fill: "forwards" }
      )
      .finished.then(() => lines.remove());
  }

  /* A little ink impact star where the kick lands. */
  function burst(x, y) {
    const star = document.createElement("div");
    star.className = "dnd-burst";
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.setAttribute("aria-hidden", "true");
    star.innerHTML =
      '<svg viewBox="-12 -12 24 24" width="24" height="24"><path d="M0 -10 V-4 M7 -7 L3 -3 M10 0 H4 M7 7 L3 3 M0 10 V4 M-7 7 L-3 3 M-10 0 H-4 M-7 -7 L-3 -3" /></svg>';
    document.body.appendChild(star);
    star
      .animate(
        [
          { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1.3)", opacity: 0 }
        ],
        { duration: 420, easing: "ease-out", fill: "forwards" }
      )
      .finished.then(() => star.remove());
  }

  /* ---------- Firefly meadow ----------
   * A sketchbook drawing: watercolour washes painted once per size, ink lines
   * that "boil" (are redrawn with fresh wobble a few times a second, like
   * hand-drawn animation), and fireflies driven by the Kuramoto model. Each
   * firefly is a phase oscillator that flashes when its phase wraps around and
   * is pulled toward the phases of its neighbours, so local clusters
   * synchronise first and the whole meadow follows.
   */

  function initMeadow() {
    const frame = document.getElementById("meadow");
    const canvas = document.getElementById("meadowCanvas");
    if (!frame || !canvas || !canvas.getContext) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const TAU = Math.PI * 2;
    const CONFIG = {
      areaPerFly: 11000,
      minFlies: 26,
      maxFlies: 64,
      frequency: 0.4,
      frequencySpread: 0.022,
      localCoupling: 0.34,
      globalCoupling: 0.04,
      couplingRadius: 0.2,
      pointerRadius: 100,
      scatterRadius: 170,
      boilFps: 8,
      boilVariants: 3,
      maxDpr: 2
    };

    // Light: ink and watercolour on cream paper. Dark: chalk and gouache on dark paper.
    const PALETTES = {
      light: {
        ink: [44, 39, 33],
        spark: [176, 120, 30],
        skyTop: [168, 186, 206],
        skyLow: [238, 186, 146],
        far: [168, 176, 196],
        mid: [138, 160, 128],
        near: [112, 138, 88],
        sun: [244, 190, 132],
        moon: [0, 0, 0],
        washAlpha: 1
      },
      dark: {
        ink: [226, 219, 202],
        spark: [246, 224, 140],
        skyTop: [26, 36, 64],
        skyLow: [44, 50, 78],
        far: [38, 48, 76],
        mid: [30, 40, 60],
        near: [24, 32, 46],
        sun: [0, 0, 0],
        moon: [190, 200, 235],
        washAlpha: 1
      }
    };

    const PENS = {
      line: { width: 1.25, alpha: 0.88 },
      double: { width: 0.7, alpha: 0.42 },
      hatch: { width: 0.75, alpha: 0.5 },
      fine: { width: 0.6, alpha: 0.4 }
    };

    const random = mulberry32(20261011);
    const noise = makeNoise(5);
    const pointer = { x: 0, y: 0, active: false };
    const glowSprite = makeGlowSprite();
    const ridges = {
      far: makeRidge(11, 0.56, 0.22, 2.3, 5),
      mid: makeRidge(29, 0.7, 0.16, 1.9, 5),
      near: makeRidge(47, 0.85, 0.11, 1.5, 4)
    };

    let width = 0;
    let height = 0;
    let scale = 1;
    let profiles = { far: [], mid: [], near: [] };
    let washes = { light: null, dark: null };
    let ink = {};
    let trees = [];
    let blades = [];
    let stems = [];
    let flies = [];
    let time = 0;
    let lastFrame = 0;
    let nightMix = targetNightMix();
    let isVisible = true;
    let rafId = 0;
    let washTimer = 0;
    let order = 0;
    let meanPhase = 0;
    let datacenter = null;
    let ledFlicker = [];
    let lastBoil = -1;
    let train = null;
    let tracked = 0;
    let trackLabel = ["", ""];
    // A small Clawd who spends its evenings trying to catch fireflies with a net.
    const buddy = {
      x: 0,
      dir: 1,
      state: "wander",
      timer: 1.5,
      speed: 0,
      speedChoice: 0,
      look: 1.5,
      walk: 0,
      hop: 0,
      net: -1.05,
      swing: 0,
      checked: false,
      target: null,
      caught: null,
      seed: 41,
      tagSpeed: 0,
      d: 0.12,
      goalD: 0.12
    };
    // Its friend Codex: a blue cloud with a screen for a face, carrying a jar for the catch.
    const pal = {
      x: 0,
      dir: -1,
      state: "follow",
      timer: 0,
      speed: 0,
      walk: 0,
      hop: 0,
      lid: 0,
      jar: [],
      happy: 0,
      tagSpeed: 0,
      seed: 77,
      d: 0.2,
      goalD: 0.2
    };
    let tag = null;
    let tagCooldown = 8;
    let sparks = [];

    resize();
    paintWashes();

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        resize();
        window.clearTimeout(washTimer);
        washTimer = window.setTimeout(() => {
          paintWashes();
          if (!shouldAnimate()) {
            drawStill();
          }
        }, 140);
      }).observe(frame);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          syncLoop();
        },
        { threshold: 0 }
      ).observe(frame);
    }

    new MutationObserver(() => {
      if (!shouldAnimate()) {
        nightMix = targetNightMix();
        drawStill();
      }
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    document.addEventListener("visibilitychange", syncLoop);
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", () => {
        syncLoop();
        if (!shouldAnimate()) {
          drawStill();
        }
      });
    }

    frame.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = frame.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    frame.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    frame.addEventListener("click", (event) => {
      if (!shouldAnimate()) {
        return;
      }
      const rect = frame.getBoundingClientRect();
      scatter(event.clientX - rect.left, event.clientY - rect.top);
    });

    if (shouldAnimate()) {
      syncLoop();
    } else {
      drawStill();
    }

    function shouldAnimate() {
      return !reduceMotion.matches;
    }

    function targetNightMix() {
      return root.dataset.theme === "dark" ? 1 : 0;
    }

    function syncLoop() {
      const run = shouldAnimate() && isVisible && !document.hidden;
      if (run && !rafId) {
        lastFrame = performance.now();
        rafId = window.requestAnimationFrame(tick);
      } else if (!run && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function tick(now) {
      const dt = Math.min((now - lastFrame) / 1000, 1 / 20);
      lastFrame = now;
      step(dt);
      draw();
      rafId = window.requestAnimationFrame(tick);
    }

    /* Static frame for reduced motion: let the meadow settle, then catch a few mid-flash. */
    function drawStill() {
      if (!width) {
        return;
      }
      for (let i = 0; i < 360; i += 1) {
        step(1 / 30, true);
      }
      flies.forEach((fly, index) => {
        fly.brightness = index % 3 === 0 ? 0.55 + random() * 0.45 : 0;
      });
      draw();
    }

    /* ---------- Layout ---------- */

    function resize() {
      const rect = frame.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);

      canvas.width = Math.round(nextWidth * dpr);
      canvas.height = Math.round(nextHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (width && height) {
        const sx = nextWidth / width;
        const sy = nextHeight / height;
        flies.forEach((fly) => {
          fly.x *= sx;
          fly.y *= sy;
        });
        buddy.x *= sx;
        pal.x *= sx;
      }

      width = nextWidth;
      height = nextHeight;
      scale = clamp(height / 480, 0.7, 1.4);

      for (const key of Object.keys(ridges)) {
        const points = [];
        for (let x = -6; x <= width + 6; x += 5) {
          points.push(x, ridgeY(key, x));
        }
        profiles[key] = points;
      }

      buildTrees();
      buildInk();
      buildGrass();
      populateFlies();
      if (!buddy.x) {
        buddy.x = width * 0.3;
      }
      buddy.x = clamp(buddy.x, width * 0.14, width * 0.86);
      if (!pal.x) {
        pal.x = width * 0.44;
      }
      pal.x = clamp(pal.x, width * 0.14, width * 0.86);
    }

    // Narrow screens see a slice of the same landscape rather than a squashed copy of it.
    function ridgeY(key, x) {
      return ridges[key](x / Math.max(width, 760)) * height;
    }

    function buildTrees() {
      const rnd = mulberry32(7);
      trees = [];
      const add = (u, size, kind) => {
        const x = u * width;
        const r = size * scale;
        const tall = kind === "cypress" ? r * 2.8 : kind === "pine" ? r * 2.3 : r * 1.9;
        const half = kind === "cypress" ? r * 0.5 : kind === "pine" ? r * 1.5 : r * 0.95;
        trees.push({ x, base: ridgeY("mid", x) + 1, r, kind, tall, half, seed: rnd() * 100 });
      };
      for (let u = 0.04; u < 0.3; u += 0.016 + rnd() * 0.016) {
        if (rnd() < 0.2) {
          continue;
        }
        add(u, 4.6 + rnd() * 3.6, rnd() < 0.12 ? "cypress" : "round");
      }
      for (let u = 0.585; u < 0.675; u += 0.015 + rnd() * 0.006) {
        add(u, 9 + rnd() * 3, "cypress");
      }
      add(0.84, 14, "pine");

      // A small data centre on the hill: the new world, built into the old one.
      const cx = 0.43 * width;
      const halfWidth = 32 * scale;
      const left = cx - halfWidth;
      const right = cx + halfWidth;
      const ground = (x) => ridgeY("mid", x) + 1;
      const top = Math.min(ground(left), ground(cx), ground(right)) - 15 * scale;
      datacenter = { x: cx, left, right, top, ground, half: halfWidth + 2, base: ground(cx), kind: "dc" };
      datacenter.tall = datacenter.base - top + 1;
      trees.push(datacenter);
      ledFlicker = Array.from({ length: 8 }, () => rnd());
    }

    function hiddenByTrees(x, y) {
      for (const tree of trees) {
        if (Math.abs(x - tree.x) < tree.half * 0.85 && y > tree.base - tree.tall && y < tree.base + 2) {
          return true;
        }
      }
      return false;
    }

    /* ---------- Ink ---------- */

    function buildInk() {
      const rnd = mulberry32(13);
      ink = { back: {}, front: {}, sun: {}, moon: {}, stars: {}, clouds: {} };

      const add = (layer, pen, points, wobble) => {
        if (points.length < 4) {
          return;
        }
        (ink[layer][pen] = ink[layer][pen] || []).push({ points, seed: rnd() * 500, wobble: wobble ?? 0.9 });
      };

      // Pen lines along each ridge: broken into strokes, sometimes gone over twice.
      const ridgeLine = (key, layer, hidden) => {
        const points = profiles[key];
        let stroke = [];
        let remaining = 0;
        const flush = () => {
          add(layer, "line", stroke);
          if (stroke.length > 12 && rnd() < 0.45) {
            const from = 2 * Math.floor(rnd() * (stroke.length / 6));
            const to = stroke.length - 2 * Math.floor(rnd() * (stroke.length / 6));
            const echo = [];
            for (let i = from; i < to; i += 2) {
              echo.push(stroke[i], stroke[i + 1] + 1.3);
            }
            add(layer, "double", echo, 1.1);
          }
          stroke = [];
          remaining = (70 + rnd() * 190) * scale;
        };
        remaining = (70 + rnd() * 190) * scale;
        for (let i = 0; i < points.length; i += 2) {
          const x = points[i];
          const y = points[i + 1];
          if (hidden(x, y)) {
            flush();
            continue;
          }
          stroke.push(x, y);
          remaining -= 5;
          if (remaining <= 0) {
            const lastX = x;
            const lastY = y;
            flush();
            if (rnd() < 0.5) {
              stroke.push(lastX, lastY + (rnd() - 0.5) * 1.5);
            } else {
              i += 2;
            }
          }
        }
        flush();
      };

      // Short diagonal hatching on the slopes facing away from the light (upper left).
      const hatching = (key, layer, spacing, length, hidden) => {
        for (let x = 4; x < width - 4; x += spacing * (0.7 + rnd() * 0.6)) {
          const y = ridgeY(key, x);
          const slope = (ridgeY(key, x + 4) - ridgeY(key, x - 4)) / 8;
          const shade = clamp(slope * 14 + 0.15, 0, 1);
          if (rnd() > shade || hidden(x, y + 3)) {
            continue;
          }
          const len = length * scale * (0.5 + shade * 0.7) * (0.7 + rnd() * 0.5);
          const start = 2 + rnd() * 3;
          add(layer, "hatch", [x, y + start, x - len * 0.45, y + start + len], 0.4);
        }
      };

      const hiddenFar = (x, y) => y > ridgeY("mid", x) - 0.5 || hiddenByTrees(x, y);
      const hiddenMid = (x, y) => y > ridgeY("near", x) - 0.5;
      const never = () => false;

      ridgeLine("far", "back", hiddenFar);
      ridgeLine("mid", "back", hiddenMid);
      ridgeLine("near", "front", never);
      hatching("far", "back", 9, 9, hiddenFar);
      hatching("mid", "back", 6, 11, hiddenMid);
      hatching("near", "front", 5, 13, never);

      for (const tree of trees) {
        traceTree(tree, add, rnd);
      }

      // The sun: one loose circle, half sunk behind the far hills.
      const sunX = width * 0.72;
      const sunR = 24 * scale;
      const sunY = ridgeY("far", sunX) - sunR * 0.25;
      const sun = [];
      for (let a = -0.3; a <= TAU + 0.15; a += 0.12) {
        const x = sunX + Math.cos(a) * sunR;
        const y = sunY + Math.sin(a) * sunR;
        if (y > ridgeY("far", x)) {
          add("sun", "line", sun.splice(0));
          continue;
        }
        sun.push(x, y);
      }
      add("sun", "line", sun);

      // The moon: a crescent, drawn as two arcs.
      const moonX = width * 0.8;
      const moonY = height * 0.2;
      const moonR = 13 * scale;
      const outer = [];
      const inner = [];
      for (let a = 0.6; a <= TAU - 0.6; a += 0.12) {
        outer.push(moonX + Math.cos(a + Math.PI) * moonR, moonY + Math.sin(a + Math.PI) * moonR);
      }
      for (let a = 1.05; a <= TAU - 1.05; a += 0.12) {
        inner.push(
          moonX + moonR * 0.55 + Math.cos(a + Math.PI) * moonR * 0.92,
          moonY - moonR * 0.12 + Math.sin(a + Math.PI) * moonR * 0.92
        );
      }
      add("moon", "line", outer, 0.5);
      add("moon", "line", inner, 0.5);

      // Stars: little crosses and dots, sparser toward the horizon.
      const starCount = Math.round((width * height) / 9000);
      for (let i = 0; i < starCount; i += 1) {
        const x = rnd() * width;
        const y = Math.pow(rnd(), 1.5) * height * 0.5;
        const s = (rnd() < 0.25 ? 3.2 : 1.6) * scale;
        if (Math.hypot(x - moonX, y - moonY) < moonR * 3) {
          continue;
        }
        add("stars", "fine", [x - s, y, x + s, y], 0.3);
        add("stars", "fine", [x, y - s, x, y + s], 0.3);
      }

      // Pencil wisps of cloud.
      for (let i = 0; i < 3; i += 1) {
        const x0 = width * (0.08 + rnd() * 0.6);
        const y0 = height * (0.16 + rnd() * 0.2);
        const span = width * (0.12 + rnd() * 0.14);
        for (let line = 0; line < 2 + Math.floor(rnd() * 2); line += 1) {
          const wisp = [];
          const offset = line * 4 * scale;
          const lead = rnd() * span * 0.3;
          for (let x = lead; x <= span - rnd() * span * 0.2; x += 6) {
            const u = x / span;
            wisp.push(x0 + x + offset * 2, y0 + offset - Math.sin(u * Math.PI) * 3 * scale);
          }
          add("clouds", "fine", wisp, 0.6);
        }
      }
    }

    function traceTree(tree, add, rnd) {
      const { x, base, r } = tree;

      if (tree.kind === "dc") {
        const { left, right, top, ground } = tree;
        const w = right - left;
        add("back", "line", [left, ground(left) + 1, left, top, right, top, right, ground(right) + 1], 0.35);
        add("back", "line", [left - 3 * scale, top, right + 3 * scale, top], 0.35);
        for (let i = 1; i < 6; i += 1) {
          const px = left + (w * i) / 6;
          add("back", "hatch", [px, top + 2, px, ground(px) - 1], 0.25);
        }
        // Rooftop chillers and a thin antenna mast.
        for (const ux of [left + w * 0.12, left + w * 0.42]) {
          const uw = 11 * scale;
          const uh = 4.5 * scale;
          add("back", "line", [ux, top, ux, top - uh, ux + uw, top - uh, ux + uw, top], 0.3);
          add("back", "hatch", [ux + uw * 0.3, top - uh, ux + uw * 0.3, top, ux + uw * 0.7, top - uh, ux + uw * 0.7, top], 0.2);
        }
        const mast = left + w * 0.84;
        add("back", "line", [mast, top, mast, top - 18 * scale], 0.3);
        add("back", "hatch", [mast - 3 * scale, top - 12 * scale, mast + 3 * scale, top - 12 * scale], 0.2);
        add("back", "hatch", [mast - 2 * scale, top - 16 * scale, mast + 2 * scale, top - 16 * scale], 0.2);
        return;
      }

      if (tree.kind === "cypress") {
        const h = tree.tall;
        const w = r * 0.42;
        const outline = [];
        for (let t = 0; t <= 1; t += 0.08) {
          const bulge = Math.sin(Math.pow(t, 0.8) * Math.PI) * w * 1.15;
          outline.push(x - bulge, base - t * h);
        }
        for (let t = 1; t >= 0; t -= 0.08) {
          const bulge = Math.sin(Math.pow(t, 0.8) * Math.PI) * w * 1.15;
          outline.push(x + bulge, base - t * h);
        }
        add("back", "line", outline, 0.5);
        // A zigzag scribble down the shaded side.
        const scribble = [];
        for (let t = 0.12; t < 0.85; t += 0.06) {
          const side = Math.sin(Math.pow(t, 0.8) * Math.PI) * w;
          scribble.push(x + (scribble.length % 4 === 0 ? side * 0.9 : side * 0.15), base - t * h);
        }
        add("back", "hatch", scribble, 0.3);
        return;
      }

      if (tree.kind === "pine") {
        const top = base - r * 1.6;
        add("back", "line", [x - 1, base, x - 0.5, base - r * 0.8, x + r * 0.12 - 1, top], 0.4);
        add("back", "line", [x + 1.2, base, x + 1, base - r * 0.8, x + r * 0.12 + 1, top], 0.4);
        // Scalloped umbrella canopy with a flat underside.
        const canopy = [];
        const left = x - r * 1.45;
        const right = x + r * 1.6;
        const bumps = 5;
        for (let i = 0; i <= bumps * 6; i += 1) {
          const u = i / (bumps * 6);
          const cx = lerp(left, right, u);
          const dome = Math.sin(u * Math.PI) * r * 0.55;
          const scallop = Math.abs(Math.sin(u * bumps * Math.PI)) * r * 0.22;
          canopy.push(cx, top - r * 0.08 - dome - scallop);
        }
        canopy.push(right - r * 0.2, top + r * 0.1, left + r * 0.2, top + r * 0.12, left, top - r * 0.08);
        add("back", "line", canopy, 0.5);
        for (let i = 0; i < 9; i += 1) {
          const hx = lerp(left + r * 0.35, right - r * 0.35, i / 8);
          add("back", "hatch", [hx, top + r * 0.06, hx - r * 0.12, top - r * 0.22], 0.2);
        }
        return;
      }

      // Round tree: a loose scribbled loop on a short trunk.
      const cy = base - r * 1.15;
      add("back", "line", [x, base, x + 0.3, cy + r * 0.5], 0.3);
      const loop = [];
      const turns = 1.6 + rnd() * 0.5;
      for (let a = 0; a < TAU * turns; a += 0.42) {
        const wobble = 0.78 + 0.22 * Math.sin(a * 2.7 + tree.seed);
        const shrink = 1 - (a / (TAU * turns)) * 0.35;
        loop.push(x + Math.cos(a) * r * wobble * shrink, cy + Math.sin(a) * r * 0.82 * wobble * shrink);
      }
      add("back", "line", loop, 0.45);
    }

    function buildGrass() {
      const rnd = mulberry32(17);
      blades = [];
      const clumps = Math.round(width / 8);
      for (let i = 0; i < clumps; i += 1) {
        const cx = (i + rnd()) * (width / clumps);
        const count = 2 + Math.floor(rnd() * 5);
        const front = rnd() < 0.55;
        const tallness = 0.6 + rnd() * 0.8;
        for (let j = 0; j < count; j += 1) {
          blades.push({
            x: cx + (rnd() - 0.5) * 10,
            h: ((front ? 8 : 5) + Math.pow(rnd(), 1.5) * (front ? 22 : 12)) * scale * tallness,
            lean: (rnd() - 0.5) * 0.8,
            phase: rnd() * TAU,
            drop: front ? 5 + rnd() * 16 : rnd() * 2,
            front
          });
        }
      }

      stems = [];
      const stemCount = Math.max(4, Math.round(width / 160));
      for (let i = 0; i < stemCount; i += 1) {
        stems.push({
          x: (i + 0.2 + rnd() * 0.6) * (width / stemCount),
          h: (26 + rnd() * 22) * scale,
          lean: (rnd() - 0.5) * 0.4,
          phase: rnd() * TAU,
          drop: 6 + rnd() * 10,
          kind: rnd() < 0.5 ? "puff" : "oat"
        });
      }
    }

    /* ---------- Watercolour ---------- */

    function paintWashes() {
      washes = {
        light: paintWash(PALETTES.light, false),
        dark: paintWash(PALETTES.dark, true)
      };
    }

    function paintWash(palette, isNight) {
      const wash = document.createElement("canvas");
      wash.width = width;
      wash.height = height;
      const w = wash.getContext("2d");
      const rnd = mulberry32(isNight ? 31 : 37);

      const blot = (x, y, r, color, alpha) => {
        const gradient = w.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, rgba(color, alpha));
        gradient.addColorStop(0.6, rgba(color, alpha * 0.55));
        gradient.addColorStop(1, rgba(color, 0));
        w.fillStyle = gradient;
        w.fillRect(x - r, y - r, r * 2, r * 2);
      };

      // Sky: loose blots, heavier at the top for night, a warm band low down for dusk.
      if (isNight) {
        for (let i = 0; i < 16; i += 1) {
          blot(rnd() * width, rnd() * height * 0.35, (0.18 + rnd() * 0.2) * width, palette.skyTop, 0.55);
        }
      }
      for (let i = 0; i < 9; i += 1) {
        blot(
          (0.45 + rnd() * 0.5) * width,
          height * (0.4 + rnd() * 0.14),
          (0.08 + rnd() * 0.12) * width,
          palette.skyLow,
          isNight ? 0.35 : 0.24
        );
      }

      if (isNight) {
        blot(width * 0.8, height * 0.2, 60 * scale, palette.moon, 0.12);
      } else {
        const sunX = width * 0.72;
        blot(sunX, ridgeY("far", sunX) - 8 * scale, 50 * scale, palette.sun, 0.45);
      }

      // Hills: a few translucent passes with slightly different edges, then pigment
      // pooling along the top edge, then some mottling inside.
      const layer = (key, color, alpha) => {
        for (let pass = 0; pass < 3; pass += 1) {
          const seed = rnd() * 100;
          w.beginPath();
          w.moveTo(-6, height + 2);
          for (let x = -6; x <= width + 6; x += 6) {
            w.lineTo(x, ridgeY(key, x) + (noise(seed + x * 0.02) - 0.5) * 4);
          }
          w.lineTo(width + 6, height + 2);
          w.closePath();
          w.fillStyle = rgba(color, alpha * 0.38);
          w.fill();
        }

        w.beginPath();
        for (let x = -6; x <= width + 6; x += 6) {
          const y = ridgeY(key, x) + 1;
          if (x === -6) w.moveTo(x, y);
          else w.lineTo(x, y);
        }
        w.strokeStyle = rgba(color, alpha * 0.35);
        w.lineWidth = 2.4;
        w.stroke();

        w.save();
        w.beginPath();
        w.moveTo(-6, height + 2);
        for (let x = -6; x <= width + 6; x += 12) {
          w.lineTo(x, ridgeY(key, x));
        }
        w.lineTo(width + 6, height + 2);
        w.closePath();
        w.clip();
        for (let i = 0; i < 9; i += 1) {
          const bx = rnd() * width;
          blot(bx, ridgeY(key, bx) + rnd() * 30 * scale, (30 + rnd() * 60) * scale, color, alpha * 0.18);
        }
        w.restore();
      };

      layer("far", palette.far, isNight ? 0.85 : 0.55);
      for (const tree of trees) {
        washTree(w, tree, palette.mid, isNight ? 0.85 : 0.55);
      }
      layer("mid", palette.mid, isNight ? 0.85 : 0.55);
      layer("near", palette.near, isNight ? 0.9 : 0.7);
      return wash;
    }

    function washTree(w, tree, color, alpha) {
      const { x, base, r } = tree;
      w.fillStyle = rgba(color, alpha * 0.7);
      w.beginPath();
      if (tree.kind === "dc") {
        w.fillStyle = rgba(mixColor(color, [255, 255, 255], 0.35), alpha * 0.8);
        w.moveTo(tree.left, tree.ground(tree.left));
        w.lineTo(tree.left, tree.top);
        w.lineTo(tree.right, tree.top);
        for (let px = tree.right; px >= tree.left; px -= 4) {
          w.lineTo(px, tree.ground(px));
        }
        w.closePath();
      } else if (tree.kind === "cypress") {
        w.ellipse(x, base - tree.tall * 0.45, r * 0.45, tree.tall * 0.5, 0, 0, TAU);
      } else if (tree.kind === "pine") {
        w.ellipse(x + r * 0.1, base - r * 1.95, r * 1.45, r * 0.42, 0, 0, TAU);
      } else {
        w.arc(x, base - r * 1.15, r * 0.85, 0, TAU);
      }
      w.fill();
    }

    /* ---------- Simulation ---------- */

    function populateFlies() {
      const targetCount = clamp(Math.round((width * height) / CONFIG.areaPerFly), CONFIG.minFlies, CONFIG.maxFlies);
      while (flies.length < targetCount) {
        flies.push(makeFly());
      }
      flies.length = targetCount;
    }

    function makeFly() {
      const z = 0.3 + random() * 0.7;
      const band = flyBand(z);
      const home = random();
      return {
        x: random() * width,
        y: band[0] + home * (band[1] - band[0]),
        home,
        vx: 0,
        vy: 0,
        z,
        heading: random() * TAU,
        seed: random() * 100,
        sparkAngle: random() * TAU,
        wingOffset: Math.floor(random() * 3),
        facing: random() < 0.5 ? -1 : 1,
        trail: [],
        trailClock: 0,
        memory: 0,
        phase: random() * TAU,
        omega: TAU * (CONFIG.frequency + gaussian() * CONFIG.frequencySpread),
        brightness: 0,
        startle: 0
      };
    }

    /* Distant fireflies drift over the far fields; near ones hover in the grass. */
    function flyBand(z) {
      return z < 0.6 ? [height * 0.48, height * 0.78] : [height * 0.6, height * 0.95];
    }

    function step(dt, skipMotion) {
      time += dt;
      nightMix += (targetNightMix() - nightMix) * (1 - Math.exp(-dt * 2));

      // Kuramoto order parameter: r e^{iψ} = mean(e^{iθ}).
      let sumCos = 0;
      let sumSin = 0;
      for (const fly of flies) {
        sumCos += Math.cos(fly.phase);
        sumSin += Math.sin(fly.phase);
      }
      order = Math.hypot(sumCos, sumSin) / flies.length;
      meanPhase = Math.atan2(sumSin, sumCos);
      if (!skipMotion) {
        updateTrain(dt);
      }

      const radius = Math.max(140, width * CONFIG.couplingRadius);
      const invRadius2 = 1 / (2 * radius * radius);

      for (const fly of flies) {
        let pull = 0;
        let weight = 0;
        for (const other of flies) {
          const dx = other.x - fly.x;
          const dy = other.y - fly.y;
          const w = Math.exp(-(dx * dx + dy * dy) * invRadius2);
          pull += w * Math.sin(other.phase - fly.phase);
          weight += w;
        }
        fly.dPhase =
          fly.omega +
          (CONFIG.localCoupling * pull) / weight +
          CONFIG.globalCoupling * order * Math.sin(meanPhase - fly.phase);
      }

      for (const fly of flies) {
        fly.phase = (fly.phase + fly.dPhase * dt) % TAU;
        if (fly.phase < 0) {
          fly.phase += TAU;
        }

        // A short flash: quick rise, slightly slower fade, then dark.
        const since = fly.phase;
        const until = TAU - fly.phase;
        const flash = since < until ? Math.exp(-since * 2.6) : Math.exp(-until * 8);
        fly.startle *= Math.exp(-dt * 3.5);
        fly.brightness = Math.max(flash, fly.startle);
        // How recently it lit up; fades slower than the flash and drives the pencil trail.
        fly.memory = Math.max(fly.memory * Math.exp(-dt * 1.4), fly.brightness);

        if (!skipMotion && !isHeld(fly)) {
          moveFly(fly, dt);
        }
      }

      if (!skipMotion) {
        updateTag(dt);
        updateBuddy(dt);
        updatePal(dt);
        sparks = sparks.filter((spark) => (spark.age += dt) < 0.6);
      }
    }

    function moveFly(fly, dt) {
      fly.heading += (Math.sin(time * 0.35 + fly.seed) * 0.8 + (random() - 0.5) * 1.8) * dt;
      // Fireflies tend to climb as they flash.
      const lift = fly.brightness * 7;
      const speed = 5 + 10 * fly.z;
      let ax = (Math.cos(fly.heading) * speed - fly.vx) * 1.1;
      let ay = (Math.sin(fly.heading) * speed * 0.5 - lift - fly.vy) * 1.1;

      const band = flyBand(fly.z);
      // Each firefly drifts back toward its own cruising height, so flashing
      // (which makes them climb) doesn't slowly lift the whole swarm.
      ay += (band[0] + fly.home * (band[1] - band[0]) - fly.y) * 0.12;
      if (fly.y < band[0]) ay += (band[0] - fly.y) * 0.8;
      if (fly.y > band[1]) ay -= (fly.y - band[1]) * 0.8;
      if (fly.x < width * 0.06) ax += (width * 0.06 - fly.x) * 0.8;
      if (fly.x > width * 0.94) ax -= (fly.x - width * 0.94) * 0.8;

      // Shy of the cursor.
      if (pointer.active) {
        const dx = fly.x - pointer.x;
        const dy = fly.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < CONFIG.pointerRadius && distance > 0.01) {
          const push = (1 - distance / CONFIG.pointerRadius) * 140;
          ax += (dx / distance) * push;
          ay += (dy / distance) * push;
        }
      }

      fly.vx += ax * dt;
      fly.vy += ay * dt;
      fly.x += fly.vx * dt;
      fly.y += fly.vy * dt;

      // Turn around with a little hysteresis so the drawing doesn't flicker between facings.
      if (fly.vx > 2) fly.facing = 1;
      if (fly.vx < -2) fly.facing = -1;

      fly.trailClock += dt;
      if (fly.trailClock > 0.06) {
        fly.trailClock = 0;
        fly.trail.push(fly.x, fly.y);
        if (fly.trail.length > 36) {
          fly.trail.splice(0, 2);
        }
      }
    }

    /* Startled fireflies flash once, scatter, and lose their rhythm. */
    function scatter(x, y) {
      for (const fly of flies) {
        const dx = fly.x - x;
        const dy = fly.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance > CONFIG.scatterRadius) {
          continue;
        }
        const strength = 1 - distance / CONFIG.scatterRadius;
        const angle = distance > 0.01 ? Math.atan2(dy, dx) : random() * TAU;
        fly.phase = random() * TAU;
        fly.startle = Math.max(fly.startle, 0.6 + 0.4 * strength);
        fly.vx += Math.cos(angle) * strength * 60;
        fly.vy += Math.sin(angle) * strength * 60;
        fly.heading = angle;
      }
    }

    /* ---------- Drawing ---------- */

    function draw() {
      const t = smoothstep(clamp(nightMix, 0, 1));
      const inkColor = mixColor(PALETTES.light.ink, PALETTES.dark.ink, t);
      const boil = shouldAnimate() ? Math.floor(time * CONFIG.boilFps) % CONFIG.boilVariants : 0;

      ctx.clearRect(0, 0, width, height);

      if (washes.light) {
        if (t < 0.999) {
          ctx.globalAlpha = 1 - t;
          ctx.drawImage(washes.light, 0, 0, width, height);
        }
        if (t > 0.001) {
          ctx.globalAlpha = t;
          ctx.drawImage(washes.dark, 0, 0, width, height);
        }
        ctx.globalAlpha = 1;
      }

      drawInk("clouds", boil, inkColor, 1 - t * 0.6);
      drawInk("stars", boil, inkColor, t);
      drawInk("sun", boil, inkColor, 1 - t);
      drawInk("moon", boil, inkColor, t);
      drawTrain(t);
      drawFlies((fly) => fly.z < 0.6, t, boil);
      drawInk("back", boil, inkColor, 1);
      drawDatacenterLights(t, boil);
      drawCharacters(t, boil, inkColor, true);
      drawGrass(false, inkColor, 0.55);
      drawInk("front", boil, inkColor, 1);
      drawCharacters(t, boil, inkColor, false);
      drawSparks(t);
      drawGrass(true, inkColor, 0.85);
      drawStems(inkColor);
      drawFlies((fly) => fly.z >= 0.6, t, boil);
      drawTracker(t, boil);
    }

    /* ---------- Clawd, jellyfishing for fireflies ---------- */

    const BUDDY_SIZE = 0.75;

    function buddyGround() {
      return groundAt(buddy.x, buddy.d);
    }

    /* Where the net's hoop is, given the pole angle (radians; negative is up). */
    function buddyHoop() {
      const sz = sizeAt(buddy.d);
      const k = BUDDY_SIZE * scale * sz;
      const handX = buddy.x + buddy.dir * 15 * k;
      const handY = buddyGround() - buddy.hop - 20 * k;
      const pole = 38 * k;
      const angle = buddy.net;
      return {
        handX,
        handY,
        tipX: handX + buddy.dir * Math.cos(angle) * pole,
        tipY: handY + Math.sin(angle) * pole,
        x: handX + buddy.dir * Math.cos(angle) * (pole + 8 * k),
        y: handY + Math.sin(angle) * (pole + 8 * k)
      };
    }

    function pickTarget() {
      const sz = sizeAt(buddy.d);
      let best = null;
      let bestScore = Infinity;
      for (const fly of flies) {
        if (fly.memory < 0.3 || isHeld(fly)) {
          continue;
        }
        // Reachable if it hovers above the patch of field at its own depth.
        const depth = flyDepth(fly);
        const top = groundAt(fly.x, depth) - 110 * scale * sizeAt(depth);
        if (fly.y < top || fly.y > groundAt(fly.x, depth) + 4) {
          continue;
        }
        const dx = Math.abs(fly.x - buddy.x) + Math.abs(depth - buddy.d) * 400 * scale;
        if (dx > 360 * scale || fly.x < width * 0.12 || fly.x > width * 0.88) {
          continue;
        }
        if (dx < bestScore) {
          best = fly;
          bestScore = dx;
        }
      }
      return best;
    }

    function updateBuddy(dt) {
      const sz = sizeAt(buddy.d);
      const k = BUDDY_SIZE * scale * sz;
      const minX = width * 0.14;
      const maxX = width * 0.86;
      let targetSpeed = 0;
      let restingNet = -1.05;
      let depthRate = 0.1;

      if (buddy.state === "wander") {
        buddy.timer -= dt;
        buddy.look -= dt;
        targetSpeed = buddy.speedChoice;
        // Glance around a few times a second for a firefly that just lit up.
        const target = buddy.look <= 0 ? pickTarget() : null;
        if (buddy.look <= 0) {
          buddy.look = 0.35;
        }
        if (target) {
          buddy.target = target;
          buddy.state = "chase";
          buddy.timer = 5;
        } else if (buddy.timer <= 0 && !tag && tagCooldown <= 0 && pal.state === "follow" && random() < 0.35) {
          startTag();
        } else if (buddy.timer <= 0) {
          // Stroll a bit, or stand and look around; drift toward wherever the fireflies are.
          buddy.speedChoice = random() < 0.65 ? 16 * scale * sz : 0;
          let sum = 0;
          let count = 0;
          for (const fly of flies) {
            if (fly.z >= 0.6) {
              sum += fly.x;
              count += 1;
            }
          }
          const crowd = count ? sum / count : buddy.x;
          if (Math.abs(crowd - buddy.x) > 120 * scale * sz && random() < 0.75) {
            buddy.dir = crowd > buddy.x ? 1 : -1;
            buddy.speedChoice = 22 * scale * sz;
          } else if (random() < 0.4) {
            buddy.dir *= -1;
          }
          // Sometimes wander deeper into the field, or back toward the front.
          if (random() < 0.45) {
            buddy.goalD = random() * MAX_DEPTH;
          }
          buddy.timer = 0.8 + random() * 1.6;
        }
      } else if (buddy.state === "chase") {
        const fly = buddy.target;
        buddy.timer -= dt;
        if (!fly || fly === buddy.caught || buddy.timer <= 0 || fly.x < minX - 20 || fly.x > maxX + 20) {
          buddy.state = "wander";
          buddy.timer = 1;
        } else {
          buddy.goalD = flyDepth(fly);
          depthRate = 0.35;
          const dx = fly.x - (buddy.x + buddy.dir * 30 * k);
          buddy.dir = fly.x >= buddy.x ? 1 : -1;
          targetSpeed = Math.abs(dx) > 6 ? 62 * scale * sz : 0;
          restingNet = -1.3;
          const inReach = fly.y > buddyGround() - 110 * scale * sz;
          if (Math.abs(dx) < 16 * scale * sz && inReach && Math.abs(buddy.d - flyDepth(fly)) < 0.08) {
            buddy.state = "swing";
            buddy.swing = 0;
            buddy.checked = false;
          }
        }
      } else if (buddy.state === "swing") {
        buddy.swing += dt / 0.5;
        const t = buddy.swing;
        // Leap for the high ones.
        const fly = buddy.target;
        const need = fly ? clamp(buddyGround() - fly.y - 62 * scale * sz, 0, 48 * scale * sz) : 0;
        buddy.hop = need * Math.sin(Math.min(1, t) * Math.PI);
        // Wind up over the head, then sweep forward and down: the jellyfishing swoosh.
        if (t < 0.4) {
          buddy.net = lerp(-1.3, -2.55, smoothstep(t / 0.4));
        } else {
          buddy.net = lerp(-2.55, 0.3, Math.pow(Math.min(1, (t - 0.4) / 0.35), 0.6));
        }
        if (!buddy.checked && t > 0.68) {
          buddy.checked = true;
          const hoop = buddyHoop();
          if (fly && Math.hypot(fly.x - hoop.x, fly.y - hoop.y) < 56 * scale * sz && random() < 0.8) {
            buddy.caught = fly;
          } else if (fly) {
            fly.startle = Math.max(fly.startle, 0.9);
            fly.vx += (fly.x >= buddy.x ? 1 : -1) * 30;
            fly.vy -= 30;
            fly.phase = random() * TAU;
          }
        }
        if (t >= 1) {
          buddy.state = buddy.caught ? "caught" : "miss";
          buddy.timer = buddy.caught ? 0.9 : 0.8;
        }
      } else if (buddy.state === "caught") {
        buddy.timer -= dt;
        restingNet = -1.25;
        // Two happy hops, net held up high...
        const elapsed = 0.9 - buddy.timer;
        buddy.hop = Math.abs(Math.sin(elapsed * Math.PI * 2.2)) * 7 * scale * sz;
        if (buddy.timer <= 0) {
          buddy.hop = 0;
          buddy.state = "deliver";
          buddy.timer = 6;
        }
      } else if (buddy.state === "deliver") {
        // ...then run it over to the jar.
        buddy.timer -= dt;
        restingNet = -1.2;
        const gap = pal.x - buddy.x;
        buddy.dir = gap >= 0 ? 1 : -1;
        buddy.goalD = pal.d;
        depthRate = 0.35;
        const reach = 52 * k;
        targetSpeed = Math.abs(gap) > reach ? 52 * scale * sz : 0;
        if (pal.state === "follow") {
          pal.dir = -buddy.dir;
        }
        const sameDepth = Math.abs(buddy.d - pal.d) < 0.05;
        if ((Math.abs(gap) <= reach + 2 && sameDepth && pal.state === "follow") || buddy.timer <= 0) {
          buddy.d = pal.d;
          buddy.state = "deposit";
          buddy.timer = 1;
          pal.state = "receive";
          pal.dir = -buddy.dir;
        }
      } else if (buddy.state === "deposit") {
        // Tip the net over the open jar.
        buddy.timer -= dt;
        restingNet = 0.75;
        if (buddy.caught && buddy.timer < 0.45) {
          const fly = buddy.caught;
          buddy.caught = null;
          fly.jarSlot = { dx: (random() - 0.5) * 5, dy: 2 + random() * 7 };
          pal.jar.push(fly);
        }
        if (buddy.timer <= 0) {
          spark((buddy.x + pal.x) / 2, Math.min(buddyGround(), palGround()) - 40 * k);
          pal.happy = 1;
          if (pal.jar.length >= 3) {
            buddy.state = "party";
            buddy.timer = 1.8;
            pal.state = "party";
            pal.timer = 1.8;
          } else {
            buddy.state = "wander";
            buddy.timer = 1.2;
            buddy.look = 3 + random() * 3;
            pal.state = "follow";
          }
        }
      } else if (buddy.state === "party") {
        // Jar's full: bounce until the lid pops and everyone goes free.
        buddy.timer -= dt;
        restingNet = -1.6;
        const elapsed = 1.8 - buddy.timer;
        buddy.hop = Math.abs(Math.sin(elapsed * Math.PI * 2.6)) * 9 * scale * sz;
        if (buddy.timer <= 0) {
          buddy.hop = 0;
          buddy.state = "wander";
          buddy.timer = 2;
          buddy.look = 5 + random() * 4;
        }
      } else if (buddy.state === "tag") {
        targetSpeed = buddy.tagSpeed;
        depthRate = 0.3;
        restingNet = -1.1;
      } else if (buddy.state === "miss") {
        buddy.timer -= dt;
        restingNet = 0.25;
        buddy.hop = 0;
        if (buddy.timer <= 0) {
          buddy.state = "wander";
          buddy.timer = 0.6 + random();
          buddy.look = 3 + random() * 3;
        }
      }

      if (buddy.state !== "swing") {
        buddy.net += (restingNet - buddy.net) * (1 - Math.exp(-dt * 6));
      }

      buddy.speed += (targetSpeed - buddy.speed) * (1 - Math.exp(-dt * 6));
      buddy.x += buddy.dir * buddy.speed * dt;
      buddy.d = approach(buddy.d, buddy.goalD, depthRate * dt);
      if (buddy.x < minX || buddy.x > maxX) {
        buddy.x = clamp(buddy.x, minX, maxX);
        if (buddy.state === "wander") {
          buddy.dir *= -1;
        }
      }

      // Bouncy, SpongeBob-style skip while running; a gentle walk otherwise.
      buddy.walk += dt * (2 + buddy.speed * 0.25);
      if (["chase", "wander", "deliver", "tag", "deposit"].includes(buddy.state)) {
        const bounce = buddy.speed > 30 * scale * sz ? 6 * scale * sz : buddy.speed > 1 ? 1.5 * scale * sz : 0;
        buddy.hop = Math.abs(Math.sin(buddy.walk * 1.4)) * bounce;
      }

      if (buddy.caught) {
        const hoop = buddyHoop();
        let fx = hoop.x;
        let fy = hoop.y + 3 * scale * sz;
        if (buddy.state === "deposit") {
          // Slide out of the net and down into the jar.
          const jar = jarPos();
          const u = smoothstep(clamp((0.8 - buddy.timer) / 0.35, 0, 1));
          fx = lerp(fx, jar.x, u);
          fy = lerp(fy, jar.top + 4 * k, u);
        }
        buddy.caught.x = fx;
        buddy.caught.y = fy;
        buddy.caught.vx = 0;
        buddy.caught.vy = 0;
        buddy.caught.brightness = Math.max(buddy.caught.brightness, 0.35);
      }
    }

    /* Depth into the field: 0 is the front grass, MAX_DEPTH the slope below the
     * far ridge. Things further back stand higher on screen and draw smaller. */
    const MAX_DEPTH = 0.85;
    // Codex stands about as tall as Clawd, like the two plushies.
    const PAL_SCALE = 1.15;

    function sizeAt(d) {
      return lerp(1, 0.36, d / MAX_DEPTH);
    }

    function groundAt(x, d) {
      const front = ridgeY("near", x) + 9 * scale;
      const back = ridgeY("mid", x) + 7 * scale;
      return lerp(front, back, d / MAX_DEPTH);
    }

    /* Map a firefly's own depth (z = 1 near, 0.3 far) onto the field. */
    function flyDepth(fly) {
      return clamp(((1 - fly.z) / 0.7) * MAX_DEPTH, 0, MAX_DEPTH);
    }

    function approach(value, goal, step) {
      if (Math.abs(goal - value) <= step) {
        return goal;
      }
      return value + Math.sign(goal - value) * step;
    }

    function isHeld(fly) {
      return fly === buddy.caught || pal.jar.includes(fly);
    }

    function palGround() {
      return groundAt(pal.x, pal.d);
    }

    function jarPos() {
      const k = BUDDY_SIZE * PAL_SCALE * scale * sizeAt(pal.d);
      const x = pal.x + pal.dir * 15.5 * k;
      const bottom = palGround() - pal.hop - 3.5 * k;
      return { x, bottom, top: bottom - 13 * k, half: 5.2 * k };
    }

    function spark(x, y, depth = (buddy.d + pal.d) / 2) {
      sparks.push({ x, y, age: 0, size: sizeAt(depth) });
    }

    function startTag() {
      tag = { it: random() < 0.5 ? "buddy" : "pal", timer: 8, swaps: 0, pause: 0.6 };
      buddy.state = "tag";
      pal.state = "tag";
    }

    /* Tag: the chaser runs at the runner; a touch swaps roles; after a few rounds
     * (or if it drags on) they stop and high-five. */
    function updateTag(dt) {
      if (!tag) {
        tagCooldown -= dt;
        return;
      }
      const sz = (sizeAt(buddy.d) + sizeAt(pal.d)) / 2;
      const k = BUDDY_SIZE * scale * sz;
      tag.timer -= dt;
      const chaser = tag.it === "buddy" ? buddy : pal;
      const runner = chaser === buddy ? pal : buddy;
      const gap = runner.x - chaser.x;
      const away = Math.sign(gap) || 1;
      const cornered = (away > 0 && runner.x > width * 0.83) || (away < 0 && runner.x < width * 0.17);

      if (tag.pause > 0) {
        // The one who was just tagged counts to one while the other gets a head start.
        tag.pause -= dt;
        chaser.tagSpeed = 0;
        runner.dir = cornered ? -away : away;
        runner.tagSpeed = 56 * scale * sz;
        return;
      }

      chaser.dir = away;
      chaser.goalD = runner.d;
      runner.goalD = runner.goalD ?? runner.d;
      chaser.tagSpeed = 50 * scale * sz;
      runner.dir = cornered ? -away : away;
      runner.tagSpeed = 40 * scale * sz;

      if (Math.abs(gap) < 30 * k && Math.abs(buddy.d - pal.d) < 0.08) {
        spark((runner.x + chaser.x) / 2, Math.min(buddyGround(), palGround()) - 36 * k);
        tag.it = tag.it === "buddy" ? "pal" : "buddy";
        tag.swaps += 1;
        tag.pause = 0.5;
      }

      if (tag.swaps >= 3 || tag.timer <= 0) {
        spark((buddy.x + pal.x) / 2, Math.min(buddyGround(), palGround()) - 40 * k);
        tag = null;
        tagCooldown = 14 + random() * 12;
        buddy.state = "wander";
        buddy.timer = 1.2;
        buddy.look = 2 + random() * 2;
        buddy.tagSpeed = 0;
        pal.state = "follow";
        pal.tagSpeed = 0;
        pal.happy = 1.2;
        pal.dir = buddy.x > pal.x ? 1 : -1;
        buddy.dir = -pal.dir;
      }
    }

    function updatePal(dt) {
      const sz = sizeAt(pal.d);
      const k = BUDDY_SIZE * scale * sz;
      let targetSpeed = 0;
      pal.happy = Math.max(0, pal.happy - dt);

      let depthRate = 0;
      if (pal.state === "follow") {
        // Tag along: not too far, not underfoot, at about the same depth.
        if (buddy.state !== "deliver") {
          pal.goalD = clamp(buddy.d + (pal.x > buddy.x ? 0.04 : -0.04), 0, MAX_DEPTH);
          depthRate = 0.14;
        }
        const gap = buddy.x - pal.x;
        const dist = Math.abs(gap);
        pal.timer -= dt;
        if (dist > 150 * k) {
          pal.dir = Math.sign(gap) || 1;
          targetSpeed = 26 * scale * sz;
        } else if (dist < 58 * k && buddy.state !== "deliver") {
          pal.dir = -(Math.sign(gap) || 1);
          targetSpeed = 12 * scale * sz;
        } else if (pal.timer <= 0) {
          pal.timer = 1 + random() * 2.5;
          pal.dir = random() < 0.7 ? Math.sign(gap) || 1 : -(Math.sign(gap) || 1);
        }
      } else if (pal.state === "receive") {
        pal.lid = Math.min(1, pal.lid + dt * 5);
      } else if (pal.state === "party") {
        pal.timer -= dt;
        const elapsed = 1.8 - pal.timer;
        pal.hop = Math.abs(Math.sin(elapsed * Math.PI * 2.6 + 0.9)) * 9 * scale * sz;
        if (elapsed > 1.05) {
          pal.lid = 1;
          if (pal.jar.length) {
            const jar = jarPos();
            spark(jar.x, jar.top - 4 * k);
            // Out they go, all at once, in one bright synchronised flash.
            for (const fly of pal.jar) {
              fly.vy = -(60 + random() * 40);
              fly.vx = (random() - 0.5) * 90;
              fly.startle = 1;
              fly.phase = 0.02;
              fly.jarSlot = null;
            }
            pal.jar = [];
          }
        }
        if (pal.timer <= 0) {
          pal.hop = 0;
          pal.state = "follow";
          pal.happy = 1.5;
        }
      } else if (pal.state === "tag") {
        targetSpeed = pal.tagSpeed;
        depthRate = 0.3;
      }

      if (pal.state !== "receive" && pal.state !== "party") {
        pal.lid = Math.max(0, pal.lid - dt * 3);
      }

      pal.speed += (targetSpeed - pal.speed) * (1 - Math.exp(-dt * 6));
      pal.x = clamp(pal.x + pal.dir * pal.speed * dt, width * 0.14, width * 0.86);
      pal.d = approach(pal.d, pal.goalD, depthRate * dt);
      pal.walk += dt * (2 + pal.speed * 0.25);
      if (pal.state === "follow" || pal.state === "tag") {
        const bounce = pal.speed > 30 * scale * sz ? 5 * scale * sz : pal.speed > 1 ? 1.2 * scale * sz : 0;
        pal.hop = Math.abs(Math.sin(pal.walk * 1.5)) * bounce;
      }

      // Fireflies in the jar bob about inside the glass.
      const jar = jarPos();
      pal.jar.forEach((fly, index) => {
        const wobble = Math.sin(time * 3 + index * 2) * 1.2;
        fly.x = jar.x + fly.jarSlot.dx * k + wobble;
        fly.y = jar.bottom - 3 * k - fly.jarSlot.dy * k;
        fly.vx = 0;
        fly.vy = 0;
        fly.brightness = Math.max(fly.brightness, 0.3);
      });
    }

    /* Codex: a cloud for a head with a dark screen for a face and two cyan
     * "◡ ◡" eyes, a little body with ">_" on its chest, carrying a jar. */
    function drawPal(t, boil, inkColor) {
      if (!width) {
        return;
      }
      const k = BUDDY_SIZE * PAL_SCALE * scale * sizeAt(pal.d);
      const x = pal.x;
      const y = palGround() - pal.hop;
      const dir = pal.dir;
      const ink = rgba(inkColor, 1);
      const blue = rgba(mixColor([102, 130, 238], [92, 118, 222], t), 1);
      const j = (i) => (noise(pal.seed + boil * 17.3 + i * 3.1) - 0.5) * 0.7;
      const pose = boil % 2;
      const moving = pal.speed > 1;

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.97;

      // Body parts in k units, from the ground up: stubby legs, a small torso
      // with arms, and the big cloud head on top.
      const legs = [-3.6, 3.6].map((lx, i) => {
        const lift = moving && (i + pose) % 2 === 0 ? 1.3 * k : 0;
        return { x: x + lx * k, y: y - 2.6 * k - lift, rx: 2.3 * k, ry: 2.9 * k };
      });
      const torsoY = y - 9.5 * k;
      const swing = moving ? (pose ? 0.25 : -0.25) : 0;
      const arms = [-1, 1].map((side) => ({
        x: x + side * 8.6 * k,
        y: torsoY + 0.5 * k + (side === dir ? -1.2 * k : 0),
        rx: 2.4 * k,
        ry: 3.6 * k,
        rot: side * (0.35 + (side === dir ? 0.4 : swing))
      }));
      const cx = x;
      const cy = torsoY - 14.5 * k;
      const puffs = [[0, 0, 10.5]];
      const count = 10;
      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * TAU - Math.PI / 2;
        const wobble = 0.88 + 0.12 * Math.sin(i * 2.7 + pal.seed);
        puffs.push([Math.cos(a) * 11, Math.sin(a) * 7.8, 5.6 * wobble]);
      }

      const traceBody = () => {
        ctx.beginPath();
        for (const leg of legs) {
          ctx.moveTo(leg.x + leg.rx, leg.y);
          ctx.ellipse(leg.x, leg.y, leg.rx, leg.ry, 0, 0, TAU);
        }
        for (const arm of arms) {
          ctx.moveTo(arm.x + arm.rx, arm.y);
          ctx.ellipse(arm.x, arm.y, arm.rx, arm.ry, arm.rot, 0, TAU);
        }
        ctx.moveTo(x + 7.2 * k, torsoY);
        ctx.ellipse(x + j(2), torsoY + j(3), 7.2 * k, 5.6 * k, 0, 0, TAU);
        puffs.forEach(([px, py, pr], i) => {
          const r = pr * k;
          ctx.moveTo(cx + px * k + r + j(10 + i), cy + py * k);
          ctx.arc(cx + px * k + j(10 + i), cy + py * k + j(30 + i), r, 0, TAU);
        });
      };
      // Stroke everything, then fill everything on top: one ink line around the
      // whole silhouette, no seams between the parts.
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      traceBody();
      ctx.stroke();
      ctx.fillStyle = blue;
      traceBody();
      ctx.fill();

      // ">_" printed on its chest.
      ctx.strokeStyle = "#f4f2ec";
      ctx.lineWidth = Math.max(0.7, 0.95 * k);
      ctx.beginPath();
      ctx.moveTo(x - 3 * k, torsoY - 1.6 * k);
      ctx.lineTo(x - 0.8 * k, torsoY);
      ctx.lineTo(x - 3 * k, torsoY + 1.6 * k);
      ctx.moveTo(x + 0.6 * k, torsoY + 0.2 * k);
      ctx.lineTo(x + 3.4 * k, torsoY + 0.2 * k);
      ctx.stroke();

      // The face: a dark rounded screen with two cyan crescent eyes, looking the
      // way it's walking.
      const look = dir * 1.4 * k;
      const fw = 19 * k;
      const fh = 12 * k;
      const fx = cx - fw / 2 + look;
      const fy = cy - fh / 2 + 0.6 * k;
      ctx.fillStyle = "#1f2858";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(fx + j(40), fy + j(41), fw, fh, 3 * k);
      } else {
        ctx.rect(fx, fy, fw, fh);
      }
      ctx.fill();

      ctx.strokeStyle = "#9cf0ec";
      ctx.lineWidth = Math.max(0.9, 1.2 * k);
      ctx.beginPath();
      const eyeY = fy + fh * 0.5;
      const eyeR = 2.1 * k;
      const delighted = pal.happy > 0 || pal.state === "party" || pal.state === "receive";
      for (const ex of [cx - 4 * k + look, cx + 4 * k + look]) {
        if (delighted) {
          // Happy: the crescents flip into little arches.
          ctx.moveTo(ex - eyeR, eyeY + eyeR * 0.5);
          ctx.arc(ex, eyeY + eyeR * 0.5, eyeR, Math.PI, TAU);
        } else {
          // Content: soft "◡" crescents.
          ctx.moveTo(ex + Math.cos(0.12 * Math.PI) * eyeR, eyeY - eyeR * 0.6 + Math.sin(0.12 * Math.PI) * eyeR);
          ctx.arc(ex, eyeY - eyeR * 0.6, eyeR, 0.12 * Math.PI, 0.88 * Math.PI);
        }
      }
      ctx.stroke();

      // The jar, held out on one side, with a copper lid that lifts and tilts.
      const jar = jarPos();
      ctx.fillStyle = t > 0.5 ? "rgba(205, 210, 228, 0.1)" : "rgba(251, 249, 243, 0.45)";
      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(jar.x - jar.half + j(6), jar.top, jar.half * 2, jar.bottom - jar.top, 2.5 * k);
      } else {
        ctx.rect(jar.x - jar.half, jar.top, jar.half * 2, jar.bottom - jar.top);
      }
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(jar.x - jar.half + 2 * k, jar.top + 4 * k);
      ctx.lineTo(jar.x - jar.half + 2 * k, jar.bottom - 4 * k);
      ctx.stroke();

      ctx.globalAlpha = 0.95;
      ctx.save();
      ctx.translate(jar.x - dir * jar.half, jar.top - pal.lid * 5 * k);
      ctx.rotate(-dir * pal.lid * 0.7);
      ctx.fillStyle = "rgb(186, 124, 78)";
      ctx.fillRect(dir < 0 ? -jar.half * 2 - 1 * k : -1 * k, -3 * k, jar.half * 2 + 2 * k, 3 * k);
      ctx.strokeRect(dir < 0 ? -jar.half * 2 - 1 * k : -1 * k, -3 * k, jar.half * 2 + 2 * k, 3 * k);
      ctx.restore();

      ctx.restore();
    }

    /* Painter's order: whoever is deeper in the field is drawn first. Characters
     * well back go behind the front hill's ink and grass. */
    function drawCharacters(t, boil, inkColor, back) {
      const cast = [
        { d: pal.d, draw: drawPal },
        { d: buddy.d, draw: drawBuddy }
      ].sort((a, b) => b.d - a.d);
      for (const one of cast) {
        if (one.d > 0.28 === back) {
          one.draw(t, boil, inkColor);
        }
      }
    }

    function drawSparks(t) {
      if (!sparks.length) {
        return;
      }
      ctx.save();
      ctx.strokeStyle = rgba(mixColor([185, 88, 58], [240, 200, 120], t), 1);
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      for (const s of sparks) {
        const u = s.age / 0.6;
        const inner = (3 + u * 6) * scale * s.size;
        const outer = inner + (4 - u * 2) * scale * s.size;
        ctx.globalAlpha = 1 - u;
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const a = (i / 6) * TAU - Math.PI / 2;
          ctx.moveTo(s.x + Math.cos(a) * inner, s.y + Math.sin(a) * inner);
          ctx.lineTo(s.x + Math.cos(a) * outer, s.y + Math.sin(a) * outer);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawBuddy(t, boil, inkColor) {
      if (!width) {
        return;
      }
      const sz = sizeAt(buddy.d);
      const k = BUDDY_SIZE * scale * sz;
      const ground = buddyGround();
      const x = buddy.x;
      const y = ground - buddy.hop;
      const ink = rgba(inkColor, 1);
      const orange = rgba(mixColor([217, 119, 87], [206, 112, 82], t), 1);
      const j = (i) => (noise(buddy.seed + boil * 17.3 + i * 3.1) - 0.5) * 0.8;
      const pose = boil % 2;
      const dir = buddy.dir;

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Net pole and hoop (behind the body when facing away is not a concern at this size).
      const hoop = buddyHoop();
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoop.handX + j(1), hoop.handY + j(2));
      ctx.lineTo(hoop.tipX + j(3), hoop.tipY + j(4));
      ctx.stroke();

      const angle = Math.atan2(hoop.y - hoop.handY, hoop.x - hoop.handX);
      const r = 8 * k;
      const rimA = { x: hoop.x + Math.cos(angle + Math.PI / 2) * r, y: hoop.y + Math.sin(angle + Math.PI / 2) * r };
      const rimB = { x: hoop.x - Math.cos(angle + Math.PI / 2) * r, y: hoop.y - Math.sin(angle + Math.PI / 2) * r };
      // The mesh bag droops with gravity and trails the swing a little.
      const sag = buddy.state === "swing" ? -buddy.dir * 4 * scale * sz : 0;
      const bagX = hoop.x + Math.cos(angle) * 7 * k + sag;
      const bagY = hoop.y + 13 * k;
      ctx.fillStyle = t > 0.5 ? "rgba(205, 210, 228, 0.12)" : "rgba(251, 249, 243, 0.55)";
      ctx.beginPath();
      ctx.moveTo(rimA.x, rimA.y);
      ctx.quadraticCurveTo(bagX + j(5), bagY + j(6), rimB.x, rimB.y);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.beginPath();
      for (let m = 1; m < 3; m += 1) {
        const u = m / 3;
        const sx = lerp(rimA.x, rimB.x, u);
        const sy = lerp(rimA.y, rimB.y, u);
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(lerp(sx, bagX, 0.6), lerp(sy, bagY, 0.8), bagX, bagY);
      }
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(hoop.x, hoop.y, r * 0.35, r, angle, 0, TAU);
      ctx.stroke();

      // Legs: two pairs that step out of phase while walking.
      ctx.fillStyle = orange;
      ctx.lineWidth = 0.8;
      const stepping = buddy.speed > 1 || buddy.state === "caught";
      const legXs = [-13, -7, 5, 11];
      legXs.forEach((lx, i) => {
        const lift = stepping && (i + pose) % 2 === 0 ? 1.6 * k : 0;
        const legX = x + lx * k * dir;
        const legTop = y - 10 * k;
        ctx.beginPath();
        ctx.rect(legX - 2 * k + j(10 + i), legTop, 4 * k, 10 * k - lift);
        ctx.fill();
        ctx.stroke();
      });

      // Body, side nubs (the near one holds the net), eyes.
      const bodyTop = y - 10 * k - 24 * k;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(x - 17 * k + j(20), bodyTop + j(21), 34 * k, 24 * k);
      ctx.rect(x - 21 * k + j(22), bodyTop + 8 * k, 4 * k, 7 * k);
      ctx.rect(x + 17 * k + j(23), bodyTop + 8 * k, 4 * k, 7 * k);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#2c2721";
      const look = dir * 2 * k;
      const eyeH = buddy.state === "caught" ? 3 * k : 6 * k;
      const eyeY = bodyTop + (buddy.state === "caught" ? 8 * k : 7 * k);
      ctx.fillRect(x - 8 * k + look, eyeY, 3.4 * k, eyeH);
      ctx.fillRect(x + 5 * k + look, eyeY, 3.4 * k, eyeH);

      // A frustrated scribble over its head after a miss.
      if (buddy.state === "miss") {
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        const sx = x + dir * 6 * k;
        const sy = bodyTop - 7 * k;
        for (let a = 0; a < TAU * 1.6; a += 0.6) {
          const px = sx + Math.cos(a) * 4 * k + a * 0.6 * k;
          const py = sy + Math.sin(a) * 2.5 * k;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    /* ---------- The machine layer ---------- */

    function flashAt(phase) {
      const p = ((phase % TAU) + TAU) % TAU;
      return p < TAU - p ? Math.exp(-p * 2.6) : Math.exp(-(TAU - p) * 8);
    }

    /* The data centre's status lights: random activity while the meadow is out of
     * step, a chase that pulses in time with the fireflies once they sync. */
    function drawDatacenterLights(t, boil) {
      if (!datacenter) {
        return;
      }
      if (boil !== lastBoil) {
        ledFlicker = ledFlicker.map(() => random());
      }
      const { left, right, top } = datacenter;
      const count = ledFlicker.length;
      const span = right - left;
      const y = top + 6 * scale;
      const size = 2.2 * Math.max(1, scale);
      const color = mixColor([40, 168, 120], [120, 255, 196], t);
      for (let i = 0; i < count; i += 1) {
        const x = left + span * (0.14 + (0.72 * i) / (count - 1));
        const synced = flashAt(meanPhase - i * 0.32);
        const noisy = ledFlicker[i] > 0.55 ? 0.9 : 0.15;
        const level = clamp(order * order * synced + (1 - order * order) * noisy, 0.08, 1);
        if (t > 0.3) {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = level * 0.5 * t;
          ctx.drawImage(glowSprite, x - 5, y - 5, 10, 10);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.globalAlpha = 0.35 + 0.65 * level;
        ctx.fillStyle = rgba(color, 1);
        ctx.fillRect(Math.round(x) - size / 2, Math.round(y) - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }

    /* Now and then at night, a train of satellites slides across the sky. */
    function updateTrain(dt) {
      if (train) {
        train.age += dt;
        if (train.age * train.speed > width * 1.4) {
          train = null;
        }
      } else if (nightMix > 0.7 && random() < dt / 35) {
        train = {
          y: height * (0.08 + random() * 0.16),
          angle: 0.06 + random() * 0.1,
          speed: width / (12 + random() * 6),
          spacing: 11 * scale,
          count: 8 + Math.floor(random() * 5),
          age: 0
        };
      }
    }

    function drawTrain(t) {
      if (!train || t < 0.05) {
        return;
      }
      const travel = train.age * train.speed - width * 0.1;
      const dx = Math.cos(train.angle);
      const dy = Math.sin(train.angle);
      ctx.fillStyle = "#f4f1e6";
      for (let k = 0; k < train.count; k += 1) {
        const d = travel - k * train.spacing;
        const x = d * dx;
        const y = train.y + d * dy;
        if (x < 0 || x > width) {
          continue;
        }
        ctx.globalAlpha = 0.8 * t * (1 - k / (train.count * 1.6));
        ctx.fillRect(Math.round(x), Math.round(y), 1.3, 1.3);
      }
      ctx.globalAlpha = 1;
    }

    /* A crisp machine-vision tracker on one firefly, with a live readout. */
    function drawTracker(t, boil) {
      if (!flies.length) {
        return;
      }
      let fly = flies[tracked];
      if (!fly || fly.z < 0.6 || fly.x < width * 0.1 || fly.x > width * 0.9) {
        tracked = flies.findIndex((candidate) => candidate.z >= 0.6 && candidate.x > width * 0.25 && candidate.x < width * 0.75);
        if (tracked < 0) {
          tracked = 0;
        }
        fly = flies[tracked];
      }

      if (boil !== lastBoil || !trackLabel[0]) {
        const id = String(tracked + 1).padStart(2, "0");
        trackLabel = [`FIREFLY ${id}`, `θ ${fly.phase.toFixed(2)}  r ${order.toFixed(2)}`];
      }
      lastBoil = boil;

      const color = rgba(mixColor([185, 88, 58], [232, 147, 107], t), 1);
      const box = 9 * Math.max(1, scale);
      const arm = 3.5;
      const x = Math.round(fly.x) + 0.5;
      const y = Math.round(fly.y) + 0.5;

      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "butt";
      ctx.beginPath();
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const cx = x + sx * box;
        const cy = y + sy * box;
        ctx.moveTo(cx - sx * arm, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy - sy * arm);
      }

      const flip = fly.x > width * 0.68;
      const lx = flip ? x - box - 14 : x + box + 14;
      const ly = y - box - 12;
      ctx.moveTo(flip ? x - box : x + box, y - box);
      ctx.lineTo(lx, ly + 6);
      ctx.stroke();

      ctx.font = '500 9px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
      ctx.textAlign = flip ? "right" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(trackLabel[0], lx + (flip ? -2 : 2), ly);
      ctx.globalAlpha = 0.65;
      ctx.fillText(trackLabel[1], lx + (flip ? -2 : 2), ly + 11);
      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
    }

    function drawInk(layer, boil, color, alpha) {
      const pens = ink[layer];
      if (!pens || alpha < 0.01) {
        return;
      }
      ctx.strokeStyle = rgba(color, 1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const name of Object.keys(pens)) {
        const pen = PENS[name];
        ctx.lineWidth = pen.width;
        ctx.globalAlpha = pen.alpha * alpha;
        ctx.beginPath();
        for (const stroke of pens[name]) {
          const points = stroke.points;
          const base = stroke.seed + boil * 37.3;
          for (let i = 0; i < points.length; i += 2) {
            const k = i * 0.18;
            const jx = (noise(base + k) - 0.5) * stroke.wobble * 1.4;
            const jy = (noise(base + 211 + k) - 0.5) * stroke.wobble * 2;
            if (i === 0) {
              ctx.moveTo(points[i] + jx, points[i + 1] + jy);
            } else {
              ctx.lineTo(points[i] + jx, points[i + 1] + jy);
            }
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function wind(x, phase) {
      // A slow gust rolling left to right, plus a little flutter per blade.
      return Math.sin(time * 0.6 - x * 0.006) * 0.13 + Math.sin(time * 1.7 + x * 0.03 + phase) * 0.04;
    }

    function pointerBend(x, baseY) {
      if (!pointer.active) {
        return 0;
      }
      const dx = x - pointer.x;
      if (Math.abs(dx) > 80 || pointer.y < baseY - 90) {
        return 0;
      }
      return Math.sign(dx) * (1 - Math.abs(dx) / 80) * 0.45;
    }

    function drawGrass(front, color, alpha) {
      ctx.strokeStyle = rgba(color, 1);
      ctx.globalAlpha = alpha;
      ctx.lineWidth = front ? 1 : 0.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const blade of blades) {
        if (blade.front !== front) {
          continue;
        }
        const base = ridgeY("near", blade.x) + blade.drop;
        const sway = blade.lean + wind(blade.x, blade.phase) + pointerBend(blade.x, base);
        const tipX = blade.x + sway * blade.h;
        const tipY = base - blade.h * (1 - Math.min(0.4, Math.abs(sway) * 0.3));
        ctx.moveTo(blade.x, base);
        ctx.quadraticCurveTo(blade.x + sway * blade.h * 0.3, base - blade.h * 0.55, tipX, tipY);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawStems(color) {
      ctx.strokeStyle = rgba(color, 1);
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const stem of stems) {
        const base = ridgeY("near", stem.x) + stem.drop;
        const sway = stem.lean + wind(stem.x, stem.phase) * 1.3 + pointerBend(stem.x, base);
        const tipX = stem.x + sway * stem.h;
        const tipY = base - stem.h * (1 - Math.min(0.3, Math.abs(sway) * 0.2));
        ctx.moveTo(stem.x, base);
        ctx.quadraticCurveTo(stem.x + sway * stem.h * 0.3, base - stem.h * 0.6, tipX, tipY);

        if (stem.kind === "puff") {
          // A dandelion clock: a few short spokes.
          const r = 5 * scale;
          for (let k = 0; k < 9; k += 1) {
            const a = (k / 9) * TAU + stem.phase;
            ctx.moveTo(tipX + Math.cos(a) * 1.5, tipY + Math.sin(a) * 1.5);
            ctx.lineTo(tipX + Math.cos(a) * r, tipY + Math.sin(a) * r);
          }
        } else {
          // Wild oat: little seeds hanging off the tip.
          const angle = Math.atan2(tipX - stem.x, base - tipY);
          for (let k = 0; k < 3; k += 1) {
            const along = k * 4 * scale;
            const sx = tipX - Math.sin(angle) * along;
            const sy = tipY + Math.cos(angle) * along;
            const side = k % 2 === 0 ? 1 : -1;
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(sx + side * 3 * scale, sy + 1 * scale, sx + side * 2.5 * scale, sy + 5 * scale);
          }
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawFlies(include, t, boil) {
      const isNight = t > 0.5;
      const inkColor = rgba(mixColor(PALETTES.light.ink, PALETTES.dark.ink, t), 1);
      const sparkColor = rgba(mixColor(PALETTES.light.spark, PALETTES.dark.spark, t), 1);
      const lanternIdle = mixColor([246, 232, 180], [120, 118, 96], t);
      const lanternLit = mixColor([248, 204, 72], [255, 236, 150], t);
      const wingFill = isNight ? "rgba(205, 210, 228, 0.16)" : "rgba(251, 249, 243, 0.72)";

      // Dotted pencil trails where a firefly has just flown with its light on.
      ctx.setLineDash([1.3, 3.4]);
      ctx.lineCap = "round";
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = isNight ? sparkColor : inkColor;
      for (const fly of flies) {
        if (!include(fly) || fly.memory < 0.06 || fly.trail.length < 6) {
          continue;
        }
        ctx.globalAlpha = fly.memory * (isNight ? 0.5 : 0.4) * fly.z;
        ctx.beginPath();
        ctx.moveTo(fly.trail[0], fly.trail[1]);
        for (let i = 2; i < fly.trail.length; i += 2) {
          ctx.lineTo(fly.trail[i], fly.trail[i + 1]);
        }
        ctx.lineTo(fly.x, fly.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      for (const fly of flies) {
        if (!include(fly)) {
          continue;
        }
        const b = fly.brightness;
        const near = fly.z >= 0.6;
        const depth = 0.45 + 0.55 * fly.z;
        const length = (near ? 11 : 6) * depth * scale;
        const tilt = clamp(Math.atan2(fly.vy, Math.abs(fly.vx) + 0.5), -0.6, 0.6);
        const tailX = fly.x - fly.facing * Math.cos(tilt) * length * 0.36;
        const tailY = fly.y - Math.sin(tilt) * length * 0.36;

        // Watercolour bloom around the lantern. On paper it tints; on dark paper it glows.
        if (b > 0.03) {
          const r = (6 + (isNight ? 15 : 18) * b) * depth * scale;
          ctx.globalCompositeOperation = isNight ? "lighter" : "multiply";
          ctx.globalAlpha = Math.min(1, b * (isNight ? 0.85 : 1.05));
          ctx.drawImage(glowSprite, tailX - r, tailY - r, r * 2, r * 2);
          ctx.globalCompositeOperation = "source-over";
        }

        ctx.save();
        ctx.translate(fly.x, fly.y);
        ctx.scale(fly.facing, 1);
        ctx.rotate(tilt);
        ctx.globalAlpha = isNight ? 0.8 : 0.9;
        ctx.strokeStyle = inkColor;
        ctx.fillStyle = inkColor;
        if (near) {
          drawBug(length, (boil + fly.wingOffset) % 3, b, lanternIdle, lanternLit, wingFill);
        } else {
          drawDistantBug(length, (boil + fly.wingOffset) % 3, b, lanternLit);
        }
        ctx.restore();

        // At the peak of a flash, a few sketched sparkle ticks around the lantern.
        if (b > 0.55) {
          const k = (b - 0.55) / 0.45;
          const inner = (near ? 4.5 : 3) * depth * scale;
          const outer = inner + (2 + 4 * k) * depth * scale;
          ctx.globalAlpha = k * 0.9;
          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          for (let i = 0; i < 4; i += 1) {
            const a = fly.sparkAngle + (i * TAU) / 4;
            ctx.moveTo(tailX + Math.cos(a) * inner, tailY + Math.sin(a) * inner);
            ctx.lineTo(tailX + Math.cos(a) * outer, tailY + Math.sin(a) * outer);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    /* A firefly in local coordinates: head toward +x, lantern at -x. The wings take
     * one of three poses, stepped at the boil rate like hand-drawn animation. */
    function drawBug(length, pose, b, lanternIdle, lanternLit, wingFill) {
      const L = length;
      const flap = [0.22, 0.62, 0.42][pose];

      // Body: tapered abdomen, rounded thorax shield, small head, two legs.
      ctx.beginPath();
      ctx.ellipse(-L * 0.04, L * 0.02, L * 0.25, L * 0.115, 0.06, 0, TAU);
      ctx.moveTo(L * 0.31, 0);
      ctx.ellipse(L * 0.19, -L * 0.005, L * 0.12, L * 0.105, 0, 0, TAU);
      ctx.moveTo(L * 0.4, 0);
      ctx.arc(L * 0.33, L * 0.005, L * 0.065, 0, TAU);
      ctx.fill();

      ctx.lineWidth = 0.45;
      ctx.beginPath();
      ctx.moveTo(L * 0.36, -L * 0.04);
      ctx.quadraticCurveTo(L * 0.43, -L * 0.2, L * 0.53, -L * 0.21);
      ctx.moveTo(L * 0.37, -L * 0.01);
      ctx.quadraticCurveTo(L * 0.47, -L * 0.1, L * 0.57, -L * 0.08);
      ctx.moveTo(L * 0.14, L * 0.09);
      ctx.lineTo(L * 0.08, L * 0.21);
      ctx.moveTo(L * 0.23, L * 0.09);
      ctx.lineTo(L * 0.27, L * 0.2);
      ctx.stroke();

      // The lantern: pale when resting, warm yellow while it flashes.
      ctx.fillStyle = rgba(mixColor(lanternIdle, lanternLit, Math.min(1, b * 1.4)), 1);
      ctx.beginPath();
      ctx.ellipse(-L * 0.36, L * 0.03, L * 0.165, L * 0.125, 0.15, 0, TAU);
      ctx.fill();
      ctx.stroke();

      // Wings over the back, translucent so the body shows through.
      ctx.fillStyle = wingFill;
      ctx.beginPath();
      traceWing(L * 0.14, -L * 0.06, L * 0.6, 0.32 + flap, L * 0.2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      traceWing(L * 0.1, -L * 0.04, L * 0.52, 0.12 + flap * 0.7, L * 0.17);
      ctx.fill();
      ctx.stroke();
    }

    function drawDistantBug(length, pose, b, lanternLit) {
      const L = length;
      const lift = [0.5, 1.1, 0.8][pose];
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-L * 0.05, -L * 0.05);
      ctx.lineTo(-L * 0.3, -L * 0.3 * lift);
      ctx.moveTo(L * 0.05, -L * 0.05);
      ctx.lineTo(-L * 0.05, -L * 0.35 * lift);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, L * 0.3, L * 0.13, 0, 0, TAU);
      ctx.fill();
      if (b > 0.15) {
        ctx.fillStyle = rgba(lanternLit, Math.min(1, b * 1.3));
        ctx.beginPath();
        ctx.arc(-L * 0.36, 0, L * 0.16, 0, TAU);
        ctx.fill();
      }
    }

    /* A teardrop wing from (x, y), swept back and up by `angle` radians. */
    function traceWing(x, y, length, angle, breadth) {
      const dx = -Math.cos(angle);
      const dy = -Math.sin(angle);
      const tipX = x + dx * length;
      const tipY = y + dy * length;
      const midX = x + dx * length * 0.55;
      const midY = y + dy * length * 0.55;
      const px = -dy * breadth;
      const py = dx * breadth;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(midX + px, midY + py, tipX, tipY);
      ctx.quadraticCurveTo(midX - px, midY - py, x, y);
    }

    /* ---------- Shapes ---------- */

    function makeGlowSprite() {
      const size = 64;
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const spriteCtx = sprite.getContext("2d");
      const c = size / 2;
      const gradient = spriteCtx.createRadialGradient(c, c, 0, c, c, c);
      gradient.addColorStop(0, "rgba(250, 206, 70, 1)");
      gradient.addColorStop(0.22, "rgba(247, 198, 70, 0.62)");
      gradient.addColorStop(0.55, "rgba(242, 192, 72, 0.2)");
      gradient.addColorStop(1, "rgba(236, 186, 72, 0)");
      spriteCtx.fillStyle = gradient;
      spriteCtx.fillRect(0, 0, size, size);
      return sprite;
    }

    /* Smooth 1D value noise in [0, 1]. */
    function makeNoise(seed) {
      const rnd = mulberry32(seed);
      const lattice = Array.from({ length: 512 }, () => rnd());
      return (x) => {
        const i = Math.floor(x);
        const f = x - i;
        const u = f * f * (3 - 2 * f);
        return lerp(lattice[i & 511], lattice[(i + 1) & 511], u);
      };
    }

    /* Fractal value noise for ridgelines: base height, amplitude, frequency, octaves. */
    function makeRidge(seed, base, amplitude, frequency, octaves) {
      const ridgeNoise = makeNoise(seed);
      return (u) => {
        let value = 0;
        let amp = 1;
        let freq = frequency;
        let norm = 0;
        for (let o = 0; o < octaves; o += 1) {
          value += amp * ridgeNoise(u * freq + o * 13.7 + 50);
          norm += amp;
          amp *= 0.5;
          freq *= 2.1;
        }
        return base - amplitude * ((value / norm) * 2 - 1);
      };
    }
  }

  /* ---------- Helpers ---------- */

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function rgba(color, alpha) {
    return `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${alpha})`;
  }

  function gaussian() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
  }

  /* Small seeded PRNG so the meadow's layout is the same on every visit. */
  function mulberry32(seed) {
    let state = seed >>> 0;
    return function () {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
})();
