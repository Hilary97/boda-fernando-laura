const data = window.INVITATION_DATA || {
  copy: {},
  images: {},
  location: {},
  whatsapp: {},
  envelope: {},
  music: {},
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
  const mapUrls = {
    venue: data.location?.mapsUrl,
    ceremony: data.location?.ceremonyMapsUrl,
  };

  document.querySelectorAll("[data-map-link]").forEach((link) => {
    const url = mapUrls[link.dataset.mapLink || "venue"];

    // Hide buttons without a configured URL instead of linking nowhere.
    if (!url) {
      link.hidden = true;
      return;
    }

    link.hidden = false;
    link.href = url;
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

const initInvitationMusic = () => {
  const audio = document.querySelector("[data-music-audio]");
  const button = document.querySelector("[data-music-toggle]");
  const icon = button?.querySelector("[data-music-icon]");
  const text = button?.querySelector("[data-music-text]");
  const config = data.music || {};
  const labels = {
    play: "Reproducir música",
    pause: "Pausar música",
    unavailable: "Música no disponible",
    loading: "Preparando música",
    ...config.labels,
  };
  const buttonText = {
    play: "Música",
    pause: "Pausar",
    unavailable: "Sin música",
    loading: "Cargando",
    ...config.buttonText,
  };
  const hasSource = Boolean(config.enabled && config.src);
  let isAvailable = false;
  let attemptedPlayback = false;

  if (!audio || !button || button.dataset.musicInitialized === "true") {
    return { playFromUserGesture: () => Promise.resolve(false) };
  }

  button.dataset.musicInitialized = "true";

  const setButtonCopy = (state) => {
    const isPlaying = state === "pause";
    const isLoading = state === "loading";
    const isUnavailable = state === "unavailable";

    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute("aria-label", labels[state]);
    button.disabled = isUnavailable || isLoading;
    button.hidden = !hasSource && isUnavailable;
    button.classList.toggle("is-playing", isPlaying);
    button.classList.toggle("is-unavailable", isUnavailable);

    if (icon) {
      icon.textContent = isPlaying ? "❚❚" : "♪";
    }

    if (text) {
      text.textContent = buttonText[state];
    }
  };

  const setAvailableState = (available) => {
    isAvailable = available;

    if (!hasSource || !available) {
      setButtonCopy("unavailable");
      return;
    }

    setButtonCopy(audio.paused ? "play" : "pause");
  };

  if (!hasSource) {
    setAvailableState(false);
    return { playFromUserGesture: () => Promise.resolve(false), setAvailableState };
  }

  audio.src = config.src;
  audio.loop = config.loop !== false;
  audio.volume = Number.isFinite(config.volume) ? config.volume : 0.72;
  button.hidden = false;
  setButtonCopy("loading");

  const safelyPlay = () => {
    attemptedPlayback = true;

    if (!hasSource) {
      setAvailableState(false);
      return Promise.resolve(false);
    }

    const playResult = audio.play();

    if (!playResult || typeof playResult.then !== "function") {
      setAvailableState(true);
      return Promise.resolve(true);
    }

    return playResult
      .then(() => {
        setAvailableState(true);
        return true;
      })
      .catch(() => {
        setAvailableState(false);
        return false;
      });
  };

  const playFromUserGesture = () => {
    try {
      return safelyPlay();
    } catch (error) {
      setAvailableState(false);
      return Promise.resolve(false);
    }
  };

  button.addEventListener("click", () => {
    if (!isAvailable && attemptedPlayback) return;

    if (audio.paused) {
      playFromUserGesture();
      return;
    }

    audio.pause();
  });

  audio.addEventListener("canplay", () => setAvailableState(true));
  audio.addEventListener("playing", () => setButtonCopy("pause"));
  audio.addEventListener("pause", () => setButtonCopy(isAvailable ? "play" : "unavailable"));
  audio.addEventListener("ended", () => setButtonCopy("play"));
  audio.addEventListener("error", () => setAvailableState(false));

  audio.load();

  return { playFromUserGesture, setAvailableState };
};

let invitationMusic = null;

const scrollInvitationToStart = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const maybePlayEnvelopeAudio = () => {
  try {
    const audioResult = invitationMusic?.playFromUserGesture?.();

    if (audioResult && typeof audioResult.catch === "function") {
      audioResult.catch(() => {});
    }
  } catch (error) {
    // Music should never block opening the invitation.
  }
};

const initEnvelopeIntro = () => {
  const root = document.querySelector("[data-envelope-intro]");
  const invitation = document.querySelector("[data-invitation-content]");

  if (!root || !invitation || !window.gsap) {
    document.body.classList.remove("envelope-intro-pending", "envelope-intro-opening");
    invitation?.removeAttribute("aria-hidden");
    return null;
  }

  const elements = {
    shell: root.querySelector("[data-envelope-shell]"),
    flap: root.querySelector("[data-envelope-flap]"),
    card: root.querySelector("[data-envelope-card]"),
    seal: root.querySelector("[data-envelope-seal]"),
    button: root.querySelector("[data-envelope-open]"),
  };

  if (Object.values(elements).some((element) => !element)) {
    document.body.classList.remove("envelope-intro-pending", "envelope-intro-opening");
    invitation.removeAttribute("aria-hidden");
    return null;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motion = {
    buttonFadeDuration: 0.28,
    sealDuration: 0.48,
    flapDuration: 0.88,
    cardDuration: 0.95,
    envelopeExitDuration: 0.72,
    coverFadeDuration: 0.62,
    reducedFadeDuration: 0.28,
    flapOpenRotationX: -165,
    ...data.envelope?.motion,
  };
  let isOpening = false;
  let timeline = null;

  const revealInvitation = () => {
    invitation.removeAttribute("aria-hidden");
    document.body.classList.remove("envelope-intro-pending", "envelope-intro-opening");
    root.setAttribute("aria-hidden", "true");
    scrollInvitationToStart();

    window.requestAnimationFrame(() => {
      scrollInvitationToStart();

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  };

  const finishIntro = () => {
    revealInvitation();
    gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    timeline?.kill();
  };

  const openInvitation = () => {
    if (isOpening) return;

    isOpening = true;
    elements.button.disabled = true;
    scrollInvitationToStart();
    document.body.classList.add("envelope-intro-opening");
    maybePlayEnvelopeAudio();

    if (prefersReducedMotion) {
      gsap.to(root, {
        autoAlpha: 0,
        duration: motion.reducedFadeDuration,
        ease: "power1.out",
        overwrite: "auto",
        onComplete: finishIntro,
      });
      return;
    }

    timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finishIntro,
    });

    timeline
      .to(elements.button, {
        autoAlpha: 0,
        y: 10,
        duration: motion.buttonFadeDuration,
        overwrite: "auto",
      })
      .to(
        elements.seal,
        {
          autoAlpha: 0,
          scale: 0.24,
          rotation: 28,
          duration: motion.sealDuration,
          ease: "back.in(1.6)",
        },
        "<0.06",
      )
      .to(
        elements.flap,
        {
          rotationX: motion.flapOpenRotationX,
          z: 18,
          duration: motion.flapDuration,
          ease: "power3.inOut",
        },
        ">-0.12",
      )
      .set(elements.flap, { zIndex: 1 }, ">-0.18")
      .to(
        elements.card,
        {
          yPercent: -58,
          scale: 1.08,
          z: 62,
          duration: motion.cardDuration,
          ease: "back.out(1.35)",
        },
        "<",
      )
      .to(
        elements.shell,
        {
          y: 90,
          scale: 0.92,
          autoAlpha: 0,
          duration: motion.envelopeExitDuration,
          ease: "power3.in",
        },
        ">-0.08",
      )
      .to(
        root,
        {
          autoAlpha: 0,
          duration: motion.coverFadeDuration,
          ease: "power2.inOut",
        },
        "<0.12",
      );
  };

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  scrollInvitationToStart();
  gsap.set(invitation, { autoAlpha: 1 });
  gsap.set(elements.card, { yPercent: 8, scale: 0.96, z: 0 });
  gsap.set(elements.flap, { rotationX: 0, z: 0, transformOrigin: "50% 0%" });
  gsap.set(elements.seal, { transformOrigin: "50% 50%" });
  elements.button.addEventListener("click", openInvitation, { once: true });

  return { openInvitation };
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
    filter: "blur(8px)",
    transformOrigin: "50% 50%",
  });
  gsap.set(elements.subtitle, { autoAlpha: 0, y: 34, filter: "blur(4px)" });
  gsap.set(elements.kicker, { autoAlpha: 0, y: 18 });
  gsap.set(elements.heroFrame, {
    autoAlpha: 0,
    yPercent: 8,
    scale: 0.82,
    filter: "blur(4px)",
  });
  gsap.set(elements.imageCards, {
    autoAlpha: 0,
    y: 40,
    scale: 0.9,
    filter: "blur(4px)",
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
        filter: "blur(7px)",
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
      { autoAlpha: 0, scale: 3.1, z: 520, filter: "blur(4px)", duration: 1.45 },
      "transition",
    )
    .to(
      [elements.subtitle, elements.kicker],
      { autoAlpha: 0, y: -28, filter: "blur(3px)", duration: 0.9 },
      "transition+=0.15",
    )
    .to(
      elements.heroFrame,
      {
        autoAlpha: 0,
        yPercent: -8,
        scale: 1.18,
        filter: "blur(3px)",
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
        filter: "blur(3px)",
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
        filter: "blur(8px)",
        duration: 0.55,
      },
      0.45,
    )
    .to(
      elements.preludeCopyItems,
      { y: -20, filter: "blur(5px)", stagger: 0.035, duration: 0.42 },
      0.5,
    )
    .to(
      elements.preludeBackground,
      {
        autoAlpha: 0.18,
        scale: 1.16,
        filter: "blur(4px) saturate(0.7) brightness(0.42)",
        duration: 0.4,
      },
      0.6,
    );

  return pinnedPreludeTimeline;
};

const getCinematicPanelItems = (panel) =>
  gsap.utils.toArray(
    panel.querySelectorAll(
      ".section-copy, .detail-card, .rsvp-panel, .gallery-preview",
    ),
  );

// Reveals panel items one at a time in the same spot, so tall content fits one viewport.
const buildSequencedPanelTimeline = (panel, panelItems) => {
  panel.classList.add("is-sequenced");

  gsap.set(panelItems, {
    autoAlpha: 0,
    y: 48,
    scale: 0.92,
    filter: "blur(6px)",
    transformOrigin: "50% 55%",
  });

  const panelTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: panel,
      start: "top top",
      end: `+=${panelItems.length * 120}%`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  panelItems.forEach((item, index) => {
    panelTimeline
      .to(item, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
      })
      .to(item, { scale: 1.02, y: -4, duration: 0.8 })
      .to(item, {
        autoAlpha: 0,
        y: -42,
        scale: 1.08,
        filter: "blur(6px)",
        duration: index === panelItems.length - 1 ? 1.05 : 0.8,
      });
  });

  return panelTimeline;
};

const buildCinematicPanelTimeline = (panel) => {
  const panelItems = getCinematicPanelItems(panel);

  if (panelItems.length === 0) return null;

  if (panel.hasAttribute("data-panel-sequence")) {
    return buildSequencedPanelTimeline(panel, panelItems);
  }

  gsap.set(panelItems, {
    autoAlpha: 0.18,
    y: 48,
    scale: 0.92,
    filter: "blur(6px)",
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
      filter: "blur(6px)",
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
    filter: "blur(5px)",
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

const fillTemplate = (template, values) =>
  String(template ?? "").replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);

// Shows the placeholder card while an image is missing and removes it once it loads.
const bindImagePlaceholder = (image, container) => {
  image.addEventListener("error", () => container.classList.add("is-placeholder"));
  image.addEventListener("load", () => container.classList.remove("is-placeholder"));
};

const initGallery = () => {
  const section = document.querySelector(".gallery-section");
  const images = data.gallery?.images || [];

  if (!section) return null;

  if (images.length === 0) {
    // Removed (not just hidden) so the pinned panel timeline is never created for it.
    section.remove();
    return null;
  }

  const copy = data.copy || {};
  const total = images.length;
  const placeholderText = copy.galleryPlaceholder || "";
  const items = Array.from(section.querySelectorAll(".gallery-item"));
  const lightbox = document.querySelector("[data-gallery-lightbox]");
  const closeButton = lightbox?.querySelector("[data-gallery-close]");
  const prevButton = lightbox?.querySelector("[data-gallery-prev]");
  const nextButton = lightbox?.querySelector("[data-gallery-next]");
  const figure = lightbox?.querySelector("[data-gallery-figure]");
  const lightboxImage = lightbox?.querySelector("[data-gallery-image]");
  const counter = lightbox?.querySelector("[data-gallery-counter]");

  if (!lightbox || !closeButton || !prevButton || !nextButton || !figure || !lightboxImage || !counter) {
    return null;
  }

  const swipeThreshold = 40;
  const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAnimate = () => Boolean(window.gsap) && !getReducedMotion();
  let currentIndex = 0;
  let isOpen = false;
  let lastTrigger = null;
  let renderToken = 0;
  let touchStart = null;

  items.forEach((item, index) => {
    const image = item.querySelector("img");
    const entry = images[index];

    if (!entry) {
      item.hidden = true;
      return;
    }

    item.dataset.placeholder = placeholderText;
    item.setAttribute(
      "aria-label",
      fillTemplate(copy.galleryOpenLabel, { current: index + 1, total }),
    );
    bindImagePlaceholder(image, item);
    image.src = entry.src;
    image.alt = entry.alt || "";

    if (index === items.length - 1 && total > items.length) {
      const badge = document.createElement("span");
      badge.className = "gallery-item__more";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = `+${total - items.length}`;
      item.append(badge);
    }

    item.addEventListener("click", () => openLightbox(index, item));
  });

  lightbox.setAttribute("aria-label", copy.galleryLightboxLabel || lightbox.getAttribute("aria-label"));
  closeButton.setAttribute("aria-label", copy.galleryCloseLabel || "");
  prevButton.setAttribute("aria-label", copy.galleryPrevLabel || "");
  nextButton.setAttribute("aria-label", copy.galleryNextLabel || "");
  figure.dataset.placeholder = placeholderText;
  bindImagePlaceholder(lightboxImage, figure);

  if (total < 2) {
    prevButton.hidden = true;
    nextButton.hidden = true;
  }

  const wrapIndex = (index) => (index + total) % total;

  const preloadNeighbors = (index) => {
    [wrapIndex(index + 1), wrapIndex(index - 1)].forEach((neighbor) => {
      const preloader = new Image();
      preloader.src = images[neighbor].src;
    });
  };

  const renderImage = (index, animate) => {
    const token = ++renderToken;

    const apply = () => {
      if (token !== renderToken) return;

      const entry = images[index];

      figure.classList.remove("is-placeholder");
      lightboxImage.alt = entry.alt || "";
      lightboxImage.src = entry.src;

      if (lightboxImage.complete && lightboxImage.naturalWidth > 0) {
        figure.classList.remove("is-placeholder");
      }

      counter.textContent = fillTemplate(copy.galleryCounter, {
        current: index + 1,
        total,
      });
      preloadNeighbors(index);

      if (animate) {
        gsap.to(figure, { autoAlpha: 1, duration: 0.25, ease: "power1.out", overwrite: true });
      }
    };

    if (animate) {
      gsap.to(figure, {
        autoAlpha: 0,
        duration: 0.14,
        ease: "power1.in",
        overwrite: true,
        onComplete: apply,
      });
      return;
    }

    apply();
  };

  const goTo = (index) => {
    currentIndex = wrapIndex(index);
    renderImage(currentIndex, canAnimate());
  };

  function openLightbox(index, trigger) {
    if (isOpen) return;

    isOpen = true;
    lastTrigger = trigger;
    currentIndex = wrapIndex(index);
    lightbox.hidden = false;
    document.body.classList.add("gallery-open");

    if (window.gsap) {
      gsap.killTweensOf([lightbox, figure]);
      gsap.set(figure, { clearProps: "opacity,visibility" });
    }

    renderImage(currentIndex, false);

    if (canAnimate()) {
      gsap.fromTo(
        lightbox,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out", overwrite: true },
      );
      gsap.fromTo(
        figure,
        { scale: 0.96 },
        { scale: 1, duration: 0.35, ease: "power2.out", clearProps: "transform" },
      );
    } else if (window.gsap) {
      gsap.set(lightbox, { clearProps: "opacity" });
    }

    closeButton.focus({ preventScroll: true });
  }

  const closeLightbox = () => {
    if (!isOpen) return;

    isOpen = false;
    renderToken += 1;
    document.body.classList.remove("gallery-open");

    const finish = () => {
      lightbox.hidden = true;

      if (window.gsap) {
        gsap.set(lightbox, { clearProps: "opacity" });
        gsap.set(figure, { clearProps: "opacity,visibility,transform" });
      }
    };

    if (canAnimate()) {
      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.in",
        overwrite: true,
        onComplete: finish,
      });
    } else {
      finish();
    }

    lastTrigger?.focus({ preventScroll: true });
  };

  const trapFocus = (event) => {
    const focusable = Array.from(lightbox.querySelectorAll("button")).filter(
      (button) => !button.hidden && !button.disabled,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!lightbox.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      goTo(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      goTo(currentIndex + 1);
    } else if (event.key === "Tab") {
      trapFocus(event);
    }
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => goTo(currentIndex - 1));
  nextButton.addEventListener("click", () => goTo(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("button, figure, .gallery-lightbox__counter")) return;

    closeLightbox();
  });

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      touchStart = null;

      if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;

      goTo(currentIndex + (deltaX < 0 ? 1 : -1));
    },
    { passive: true },
  );

  return { open: openLightbox, close: closeLightbox };
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
      ".cinematic-panel .section-copy, .cinematic-panel .detail-card, .cinematic-panel .rsvp-panel, .cinematic-panel .gallery-preview",
    ),
    revealItems: gsap.utils.toArray(".scroll-reveal"),
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    initReducedMotionState(elements);
  } else {
    // Pinned triggers must be created in document order, so split panels around the scene.
    const isBeforeScene = (panel) =>
      Boolean(elements.scene) &&
      Boolean(
        panel.compareDocumentPosition(elements.scene) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      );
    const panelsBeforeScene = elements.cinematicPanels.filter(isBeforeScene);
    const panelsAfterScene = elements.cinematicPanels.filter(
      (panel) => !isBeforeScene(panel),
    );

    initPinnedPreludeTransition(elements);
    initCinematicPanels(panelsBeforeScene);
    buildCinematicTimeline(elements);
    initCinematicPanels(panelsAfterScene);
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
initGallery();
initAnimations();
invitationMusic = initInvitationMusic();
initEnvelopeIntro();
