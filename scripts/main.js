const data = window.INVITATION_DATA || {
  copy: {},
  images: {},
  location: {},
  whatsapp: {},
};

const setTextContent = () => {
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const key = element.dataset.copy;
    const value = data.copy[key];

    if (!value) return;

    if (value.includes("<")) {
      element.innerHTML = value;
      return;
    }

    element.textContent = value;
  });
};

const setImageSources = () => {
  document.querySelectorAll("[data-image]").forEach((image) => {
    const key = image.dataset.image;
    const imageData = data.images[key];

    if (!imageData) return;

    if (imageData.localFallback) {
      image.addEventListener(
        "error",
        () => {
          if (image.src.endsWith(imageData.localFallback)) return;
          image.src = imageData.localFallback;
        },
        { once: true },
      );
    }

    image.src = imageData.src;

    if (!image.hasAttribute("aria-hidden")) {
      image.alt = imageData.alt || "";
    }
  });
};

const buildWhatsAppUrl = ({ number, message } = {}) => {
  if (!number || !message) return "#";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const setWhatsAppLinks = () => {
  const whatsappUrl = buildWhatsAppUrl(data.whatsapp);

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.href = whatsappUrl;
  });
};

const setMapLinks = () => {
  const mapsUrl = data.location?.mapsUrl || "#";

  document.querySelectorAll("[data-map-link]").forEach((link) => {
    link.href = mapsUrl;
  });
};

const formatCountdownValue = (value) => String(value).padStart(2, "0");

const getCountdownParts = (targetDate) => {
  const remainingMilliseconds = Math.max(targetDate.getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(remainingMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const initCountdown = () => {
  const countdown = document.querySelector("[data-countdown]");
  const targetDate = new Date(data.countdownTarget);

  if (!countdown || Number.isNaN(targetDate.getTime())) return null;

  const valueElements = {
    days: countdown.querySelector('[data-countdown-value="days"]'),
    hours: countdown.querySelector('[data-countdown-value="hours"]'),
    minutes: countdown.querySelector('[data-countdown-value="minutes"]'),
    seconds: countdown.querySelector('[data-countdown-value="seconds"]'),
  };

  const updateCountdown = () => {
    const parts = getCountdownParts(targetDate);

    Object.entries(parts).forEach(([key, value]) => {
      const element = valueElements[key];
      if (!element) return;

      element.textContent = formatCountdownValue(value);
    });
  };

  updateCountdown();
  return window.setInterval(updateCountdown, 1000);
};

const initReducedMotionState = (elements) => {
  gsap.set(
    [
      elements.preludeCopy,
      ...elements.preludeCopyItems,
      elements.title,
      elements.subtitle,
      elements.kicker,
      ...elements.revealItems,
      ...elements.cinematicPanelItems,
    ],
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      z: 0,
      filter: "blur(0px)",
      clearProps: "visibility",
    },
  );

  gsap.set(elements.scene, {
    "--scene-gradient": 1,
    "--halo-opacity": 0.22,
    "--halo-scale": 1,
    "--backdrop-opacity": 0.36,
    "--portrait-opacity": 0.76,
    "--portrait-scale": 1,
  });

  gsap.set([elements.heroFrame, ...elements.imageCards], {
    autoAlpha: 1,
    clearProps: "visibility",
  });
  gsap.set(elements.preludeBackground, {
    autoAlpha: 0.58,
    yPercent: 0,
    scale: 1.08,
  });
};

const buildCinematicTimeline = (elements) => {
  gsap.set(elements.title, {
    autoAlpha: 0,
    scale: 0.5,
    z: -260,
    filter: "blur(16px)",
    transformOrigin: "50% 50%",
  });
  gsap.set(elements.subtitle, { autoAlpha: 0, y: 34, filter: "blur(8px)" });
  gsap.set(elements.kicker, { autoAlpha: 0, y: 18 });
  gsap.set(elements.heroFrame, {
    autoAlpha: 0,
    yPercent: 8,
    scale: 0.82,
    filter: "blur(8px)",
  });
  gsap.set(elements.imageCards, {
    autoAlpha: 0,
    y: 40,
    scale: 0.9,
    filter: "blur(8px)",
  });
  gsap.set([elements.halo, elements.ring], { transformOrigin: "50% 50%" });

  const cinematicTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: elements.scene,
      start: "top top",
      end: "+=360%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  cinematicTimeline
    .addLabel("suspense")
    .to(
      elements.title,
      {
        autoAlpha: 0.16,
        scale: 0.62,
        z: -180,
        filter: "blur(12px)",
        duration: 2,
      },
      "suspense",
    )
    .to(elements.grain, { yPercent: -4, duration: 2 }, "suspense")
    .to(
      elements.backdrop,
      { autoAlpha: 0.18, scale: 1.1, duration: 2 },
      "suspense",
    );

  cinematicTimeline
    .addLabel("reveal")
    .to(
      elements.title,
      { autoAlpha: 1, scale: 1.02, z: 0, filter: "blur(0px)", duration: 2 },
      "reveal",
    )
    .to(
      elements.scene,
      {
        "--scene-gradient": 0.72,
        "--halo-opacity": 0.34,
        "--halo-scale": 1.16,
        "--texture-opacity": 0.1,
        "--backdrop-opacity": 0.34,
        "--portrait-opacity": 0.54,
        "--portrait-scale": 1,
        duration: 2,
      },
      "reveal",
    )
    .to(
      elements.heroFrame,
      {
        autoAlpha: 0.68,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.7,
      },
      "reveal",
    )
    .to(
      elements.halo,
      {
        yPercent: -6,
        scale: 1.12,
        filter: "blur(10px) saturate(0.95)",
        duration: 1.7,
      },
      "reveal",
    )
    .to(
      elements.ring,
      { scale: 1.08, rotation: 8, opacity: 0.28, duration: 1.7 },
      "reveal",
    );

  cinematicTimeline
    .addLabel("impact")
    .to(elements.kicker, { autoAlpha: 1, y: 0, duration: 0.55 }, "impact")
    .to(elements.title, { scale: 1.52, z: 150, duration: 1.55 }, "impact")
    .to(
      elements.subtitle,
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
      "impact+=0.35",
    )
    .to(
      elements.imageCards,
      {
        autoAlpha: 0.9,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.18,
        duration: 1.1,
      },
      "impact+=0.15",
    )
    .to(
      elements.scene,
      {
        "--scene-gradient": 1,
        "--halo-opacity": 0.48,
        "--halo-scale": 1.42,
        "--vignette-opacity": 0.66,
        "--backdrop-opacity": 0.48,
        duration: 1.55,
      },
      "impact",
    )
    .to(elements.halo, { yPercent: -14, scale: 1.38, duration: 1.55 }, "impact")
    .to(
      elements.ring,
      { scale: 1.28, rotation: 18, opacity: 0.34, duration: 1.55 },
      "impact",
    );

  cinematicTimeline
    .addLabel("transition")
    .to(
      elements.title,
      { autoAlpha: 0, scale: 3.1, z: 520, filter: "blur(7px)", duration: 1.45 },
      "transition",
    )
    .to(
      [elements.subtitle, elements.kicker],
      { autoAlpha: 0, y: -28, filter: "blur(6px)", duration: 0.9 },
      "transition+=0.15",
    )
    .to(
      elements.heroFrame,
      {
        autoAlpha: 0,
        yPercent: -8,
        scale: 1.18,
        filter: "blur(6px)",
        duration: 1.2,
      },
      "transition",
    )
    .to(
      elements.imageCards,
      {
        autoAlpha: 0,
        y: -26,
        scale: 1.08,
        filter: "blur(6px)",
        stagger: 0.12,
        duration: 0.95,
      },
      "transition+=0.05",
    )
    .to(
      elements.scene,
      {
        "--halo-opacity": 0.1,
        "--texture-opacity": 0.03,
        "--vignette-opacity": 0.88,
        "--backdrop-opacity": 0.16,
        duration: 1.45,
      },
      "transition",
    )
    .to(
      elements.halo,
      { scale: 1.9, yPercent: -22, duration: 1.45 },
      "transition",
    )
    .to(
      elements.ring,
      { scale: 1.7, opacity: 0, duration: 1.45 },
      "transition",
    );

  return cinematicTimeline;
};

const initPinnedPreludeTransition = (elements) => {
  const exitTargets = [
    elements.preludeCopy,
    ...elements.preludeCopyItems,
  ].filter(Boolean);

  if (
    !elements.prelude ||
    !elements.preludeBackground ||
    exitTargets.length === 0
  )
    return null;

  gsap.set(elements.preludeCopy, { transformOrigin: "50% 45%" });
  gsap.set(elements.preludeBackground, {
    yPercent: -4,
    scale: 1.12,
    autoAlpha: 0.62,
  });

  const pinnedPreludeTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: elements.prelude,
      start: "top top",
      end: "+=155%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  pinnedPreludeTimeline
    .to(
      elements.preludeBackground,
      { yPercent: 5, scale: 1.04, autoAlpha: 0.74, duration: 0.45 },
      0,
    )
    .to(elements.preludeCopy, { scale: 1.025, duration: 0.45 }, 0)
    .to(
      elements.preludeCopy,
      {
        autoAlpha: 0,
        y: -38,
        scale: 1.08,
        filter: "blur(16px)",
        duration: 0.55,
      },
      0.45,
    )
    .to(
      elements.preludeCopyItems,
      { y: -20, filter: "blur(11px)", stagger: 0.035, duration: 0.42 },
      0.5,
    )
    .to(
      elements.preludeBackground,
      {
        autoAlpha: 0.18,
        scale: 1.16,
        filter: "blur(8px) saturate(0.7) brightness(0.42)",
        duration: 0.4,
      },
      0.6,
    );

  return pinnedPreludeTimeline;
};

const getCinematicPanelItems = (panel) =>
  gsap.utils.toArray(
    panel.querySelectorAll(".section-copy, .detail-card, .rsvp-panel"),
  );

const buildCinematicPanelTimeline = (panel) => {
  const panelItems = getCinematicPanelItems(panel);

  if (panelItems.length === 0) return null;

  gsap.set(panelItems, {
    autoAlpha: 0.18,
    y: 48,
    scale: 0.92,
    filter: "blur(16px)",
    transformOrigin: "50% 55%",
  });

  const panelTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: panel,
      start: "top top",
      end: "+=220%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  panelTimeline.addLabel("reveal").to(
    panelItems,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.1,
      duration: 1.15,
    },
    "reveal",
  );

  panelTimeline.addLabel("impact").to(
    panelItems,
    {
      scale: 1.035,
      y: -6,
      stagger: 0.08,
      duration: 0.9,
    },
    "impact",
  );

  panelTimeline.addLabel("transition").to(
    panelItems,
    {
      autoAlpha: 0,
      y: -42,
      scale: 1.12,
      filter: "blur(14px)",
      stagger: 0.08,
      duration: 1.05,
    },
    "transition",
  );

  return panelTimeline;
};

const initCinematicPanels = (panels) => {
  panels.forEach((panel) => {
    buildCinematicPanelTimeline(panel);
  });
};

const initSectionReveals = (elements) => {
  const revealItems = elements.revealItems.filter(
    (item) => !item.closest(".cinematic-panel"),
  );

  if (revealItems.length === 0) return;

  gsap.set(revealItems, {
    autoAlpha: 0,
    y: 54,
    scale: 0.965,
    filter: "blur(14px)",
    transformOrigin: "50% 56%",
  });

  ScrollTrigger.batch(revealItems, {
    start: "top 84%",
    once: true,
    interval: 0.08,
    batchMax: 3,
    onEnter: (items) => {
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.18,
        ease: "power3.out",
        stagger: 0.14,
        overwrite: "auto",
        clearProps: "visibility",
      });
    },
  });
};

const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const elements = {
    prelude: document.querySelector(".prelude"),
    preludeBackground: document.querySelector(".prelude-background"),
    preludeCopy: document.querySelector(".prelude-copy"),
    preludeCopyItems: gsap.utils.toArray(".prelude-copy > *"),
    scene: document.querySelector(".cinema-scene"),
    title: document.querySelector(".cinematic-title"),
    subtitle: document.querySelector(".cinematic-subtitle"),
    kicker: document.querySelector(".kicker"),
    halo: document.querySelector(".orbital-halo"),
    ring: document.querySelector(".depth-ring"),
    grain: document.querySelector(".film-grain"),
    backdrop: document.querySelector(".scene-backdrop"),
    heroFrame: document.querySelector(".hero-frame"),
    imageCards: gsap.utils.toArray(".image-card"),
    cinematicPanels: gsap.utils.toArray(".cinematic-panel"),
    cinematicPanelItems: gsap.utils.toArray(
      ".cinematic-panel .section-copy, .cinematic-panel .detail-card, .cinematic-panel .rsvp-panel",
    ),
    revealItems: gsap.utils.toArray(".scroll-reveal"),
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    initReducedMotionState(elements);
  } else {
    const [countdownPanel, ...remainingCinematicPanels] =
      elements.cinematicPanels;

    initPinnedPreludeTransition(elements);
    initCinematicPanels([countdownPanel].filter(Boolean));
    buildCinematicTimeline(elements);
    initCinematicPanels(remainingCinematicPanels);
    initSectionReveals(elements);
    window.addEventListener("load", () => ScrollTrigger.refresh(), {
      once: true,
    });
  }
};

setTextContent();
setImageSources();
setWhatsAppLinks();
setMapLinks();
initCountdown();
initAnimations();
