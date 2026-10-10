window.INVITATION_DATA = {
  copy: {
    envelopeEyebrow: "Estás invitado",
    envelopeNames: "Fernando & Laura",
    envelopeDate: "26 Diciembre 2026",
    envelopeButtonText: "Abrir invitación",
    envelopeSealInitials: "F & L",
    introEyebrow: "Invitación de boda",
    quinceName: "Fernando & Laura",
    introTitle: "Nos casamos",
    introText:
      "Antes de revelar la celebración, la pantalla respira en silencio. Desliza lentamente: el movimiento abre nuestra historia.",
    storyIntroEyebrow: "Nuestra historia",
    storyIntroText:
      "Después de 6 años caminando juntos, hemos decidido unir nuestras vidas en matrimonio ante Dios, por lo que nos complace que seas partícipe de este momento.",
    countdownEyebrow: "La fecha se acerca",
    countdownTitle: "Cuenta regresiva",
    countdownDateText: "Sábado 26 de Diciembre · 12:00 PM",
    countdownDaysLabel: "Días",
    countdownHoursLabel: "Horas",
    countdownMinutesLabel: "Minutos",
    countdownSecondsLabel: "Segundos",
    storyKicker: "Nuestra boda",
    storyTitle: "Todo amor comienza con un <em>sí.</em>",
    storySubtitle:
      "Desliza para descubrir una experiencia pensada con tiempo, profundidad y ritmo para celebrar nuestro encuentro.",
    galleryEyebrow: "Nuestra galería",
    galleryTitle: "Momentos juntos",
    galleryHint: "Toca una foto para ver la galería completa.",
    galleryOpenLabel: "Ver foto {current} de {total}",
    galleryLightboxLabel: "Galería de fotos",
    galleryCloseLabel: "Cerrar galería",
    galleryPrevLabel: "Foto anterior",
    galleryNextLabel: "Foto siguiente",
    galleryCounter: "{current} / {total}",
    galleryPlaceholder: "Foto próximamente",
    venueEyebrow: "Dónde será",
    venueTitle: "Nos vemos para celebrar juntos.",
    venueIntro:
      "La ceremonia y recepción tendrán un escenario íntimo y elegante para compartir la noche con quienes más queremos.",
    venueNameLabel: "Lugar",
    venueName: "Terraza Bonanza",
    venueAddress: "Av. Celebración 123, Ciudad de México",
    venueMapButtonLabel: "Ver ubicación",
    venueTimeLabel: "Ceremonia",
    venueTime: "Templo San Felipe Apóstol · 12:00 PM",
    venueNote:
      "Te esperamos con unos minutos de anticipación para iniciar juntos esta historia.",
    rsvpEyebrow: "Confirma tu asistencia",
    rsvpTitle: "Tu presencia hará este día inolvidable.",
    rsvpText:
      "Ayúdanos a preparar cada detalle confirmando tu asistencia por WhatsApp antes del 11 de Diciembre. ",
    rsvpButtonLabel: "Confirmar por WhatsApp",
    closingEyebrow: "Gracias",
    closingTitle:
      "Porque la felicidad solo esta completa cuando se comparte con personas especiales.",
    dateLine: "Fernando & Laura · 26 Diciembre 2026",
    closingText:
      "Gracias por formar parte de nuestra celebración. Cada detalle está pensado para compartir una noche llena de amor, música y recuerdos.",
  },
  music: {
    // Add the final track at this path to enable automatic playback after opening.
    enabled: true,
    src: "assets/music/invitacion.mp3",
    loop: true,
    volume: 0.72,
    labels: {
      play: "Reproducir música",
      pause: "Pausar música",
      unavailable: "Música no disponible",
      loading: "Preparando música",
    },
    buttonText: {
      play: "Música",
      pause: "Pausar",
      unavailable: "Sin música",
      loading: "Cargando",
    },
  },
  envelope: {
    audioEnabled: false,
    motion: {
      buttonFadeDuration: 0.28,
      sealDuration: 0.48,
      flapDuration: 0.88,
      cardDuration: 0.95,
      envelopeExitDuration: 0.72,
      coverFadeDuration: 0.62,
      reducedFadeDuration: 0.28,
      flapOpenRotationX: -165,
    },
  },
  // Edit this ISO date/time to update the live countdown target.
  countdownTarget: "2026-12-26T12:00:00-06:00",
  location: {
    // Update this Google Maps URL when the final venue location changes.
    mapsUrl: "https://maps.app.goo.gl/JrZkD9xNMxhPR6eL6",
    // Google Maps URL for the ceremony card. The button stays hidden while empty.
    ceremonyMapsUrl: "https://maps.app.goo.gl/cydgiYPCm3rymVoC7?g_st=ic",
  },
  whatsapp: {
    number: "3334659074",
    message: "Hola, confirmo mi asistencia a la boda de Fernando y Laura.",
  },
  gallery: {
    // The first 3 images are the previews shown in the section; the lightbox shows all of them.
    // Add or remove entries to change the count. Replace a photo by keeping the same file name.
    images: [
      {
        src: "assets/images/gallery/galeria-01.jpg",
        alt: "Fotografía de la pareja 1",
      },
      {
        src: "assets/images/gallery/galeria-02.jpg",
        alt: "Fotografía de la pareja 2",
      },
      {
        src: "assets/images/gallery/galeria-03.jpg",
        alt: "Fotografía de la pareja 3",
      },
      {
        src: "assets/images/gallery/galeria-04.jpg",
        alt: "Fotografía de la pareja 4",
      },
      {
        src: "assets/images/gallery/galeria-05.jpg",
        alt: "Fotografía de la pareja 5",
      },
      {
        src: "assets/images/gallery/galeria-06.jpg",
        alt: "Fotografía de la pareja 6",
      },
      {
        src: "assets/images/gallery/galeria-07.jpg",
        alt: "Fotografía de la pareja 7",
      },
      {
        src: "assets/images/gallery/galeria-08.jpg",
        alt: "Fotografía de la pareja 8",
      },
    ],
  },
  images: {
    // Local assets are the single source of truth for the prototype images.
    // Replace these files or update these paths when final client photos arrive.
    hero: {
      src: "assets/images/foto3.jpeg",
      alt: "Retrato elegante de pareja de novios",
    },
    dress: {
      src: "assets/images/foto4.jpeg",
      alt: "Detalle elegante de boda",
    },
    flowers: {
      src: "assets/images/foto5.jpeg",
      alt: "Arreglo floral para celebración de boda",
    },
    venue: {
      src: "assets/images/foto2.jpeg",
      alt: "Salón elegante para boda",
    },
    venueCard: {
      src: "assets/images/lugar.jpg",
      alt: "Jardín y terraza del lugar de la celebración",
    },
    scheduleCard: {
      src: "assets/images/horario.jpg",
      alt: "Iglesia con campanario rodeada de palmeras",
    },
    // Blurred background for the "Nuestra historia" section.
    storyBackground: {
      src: "assets/images/gallery/galeria-08.jpg",
      alt: "",
    },
    preludeBackground: {
      src: "assets/images/foto1.jpeg",
      alt: "",
    },
  },
};
