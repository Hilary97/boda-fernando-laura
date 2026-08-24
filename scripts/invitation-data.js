window.INVITATION_DATA = {
  copy: {
    envelopeEyebrow: "Estás invitado",
    envelopeNames: "Roman & Sofia",
    envelopeDate: "18 abril 2026",
    envelopeButtonText: "Abrir invitación",
    envelopeSealInitials: "R & S",
    introEyebrow: "Invitación de boda",
    quinceName: "Roman & Sofia",
    introTitle: "Nos casamos",
    introText:
      "Antes de revelar la celebración, la pantalla respira en silencio. Desliza lentamente: el movimiento abre nuestra historia.",
    countdownEyebrow: "La fecha se acerca",
    countdownTitle: "Cuenta regresiva",
    countdownDateText: "Sábado 18 de abril · 7:00 PM",
    countdownDaysLabel: "Días",
    countdownHoursLabel: "Horas",
    countdownMinutesLabel: "Minutos",
    countdownSecondsLabel: "Segundos",
    storyKicker: "Nuestra boda",
    storyTitle: "Todo amor comienza con un <em>sí.</em>",
    storySubtitle:
      "Desliza para descubrir una experiencia pensada con tiempo, profundidad y ritmo para celebrar nuestro encuentro.",
    venueEyebrow: "Dónde será",
    venueTitle: "Nos vemos para celebrar juntos.",
    venueIntro:
      "La ceremonia y recepción tendrán un escenario íntimo y elegante para compartir la noche con quienes más queremos.",
    venueNameLabel: "Lugar",
    venueName: "Jardín Casa de los Jazmines",
    venueAddress: "Av. Celebración 123, Ciudad de México",
    venueMapButtonLabel: "Ver ubicación",
    venueTimeLabel: "Horario",
    venueTime: "Sábado 18 de abril · 7:00 PM",
    venueNote:
      "Te esperamos con unos minutos de anticipación para iniciar juntos esta historia.",
    rsvpEyebrow: "Confirma tu asistencia",
    rsvpTitle: "Tu presencia hará este día inolvidable.",
    rsvpText:
      "Ayúdanos a preparar cada detalle confirmando tu asistencia por WhatsApp.",
    rsvpButtonLabel: "Confirmar por WhatsApp",
    closingEyebrow: "Gracias",
    closingTitle: "Queremos vivir este momento contigo.",
    dateLine: "Roman & Sofia · 18 abril 2026",
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
  countdownTarget: "2027-04-18T19:00:00-06:00",
  location: {
    // Update this Google Maps URL when the final venue location changes.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.%20Celebraci%C3%B3n%20123%2C%20Ciudad%20de%20M%C3%A9xico",
  },
  whatsapp: {
    number: "5210000000000",
    message: "Hola, confirmo mi asistencia a la boda de Valentina y Mateo.",
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
    preludeBackground: {
      src: "assets/images/foto1.jpeg",
      alt: "",
    },
  },
};
