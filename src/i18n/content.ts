// Copy y datos de la home «Taller» (ES/EN).
// Los pares [es, en] se leen con `pick(par, lang)`; las banderas van con astro-icon:
//   <Icon name={flagIcon(code)} />   (circle-flags:<code> o tabler:tools para proyectos propios)
// Las portadas viven en public/assets/images/projects/<id>/portada.webp.

export type Lang = "es" | "en";
export type Pair = readonly [es: string, en: string];
export type Country = "pe" | "mx" | "cl" | "pr" | "ar" | "own";

export const LANGS: readonly Lang[] = ["es", "en"];
export const pick = (pair: Pair, lang: Lang): string => pair[lang === "en" ? 1 : 0];
export const homePath = (lang: Lang) => (lang === "en" ? "/en/" : "/");

export const IMG = (id: string) => `/assets/images/projects/${id}/portada.webp`;
export const flagIcon = (c: Country) => (c === "own" ? "tabler:tools" : `circle-flags:${c}`);
export const PLACE: Record<Country, Pair> = {
  pe: ["Perú", "Peru"],
  mx: ["México", "Mexico"],
  cl: ["Chile", "Chile"],
  pr: ["Puerto Rico", "Puerto Rico"],
  ar: ["Argentina", "Argentina"],
  own: ["Proyecto propio", "Side project"],
};

const es = {
  mast: "Taller de interfaces · Ed. 2026",
  navServices: "Servicios",
  navWork: "Trabajo",
  navProcess: "Proceso",
  navAbout: "Sobre mí",
  navContact: "Contacto",
  menu: "Menú",
  close: "Cerrar",
  skip: "Saltar al contenido",
  avail: "Disponible",
  toDark: "Oscuro",
  toLight: "Claro",
  themeLabel: "Cambiar tema",
  langLabel: "Idioma",
  heroRole: "Desarrollador front-end — Web & Mobile",
  heroPlace: "Lima, Perú",
  deckA: "Diseño y construyo webs y apps que se sienten ",
  deckEm: "hechas a mano",
  deckB: ": rápidas, precisas y con un poco de juego.",
  ctaWork: "Ver trabajo",
  ctaCV: "Descargar CV",
  ctaTalk: "Escríbeme",
  fig1: "Fig. 1 — Las piezas son tuyas: arrástralas y lánzalas.",
  scroll: "Desliza",
  fig2: "Fig. 2 — Jairo Vera, Lima",
  s1: "Servicios",
  sTitleA: "Qué puedo hacer",
  sTitleEm: "por ti.",
  audBiz: "Tengo un negocio",
  audTeam: "Busco un dev para mi equipo",
  forBiz: "Para — ",
  forTeam: "Con — ",
  f1: "Proyecto insignia",
  fTitleA: "calcula",
  fTitleEm: "cuánto",
  fLead: "Mi propio producto: 27 calculadoras de sueldo, beneficios e impuestos para Perú y México, en producción. Lo diseñé, lo construí y lo mantengo.",
  fFig: "Fig. 3 — calculacuánto en 21 segundos",
  fPlay: "Reproducir",
  fPause: "Pausar",
  fSoundOn: "Activar sonido",
  fSoundOff: "Silenciar",
  fVideoLabel: "Video de demostración de calculacuánto",
  fBody: "Cada resultado muestra su desglose paso a paso con parámetros oficiales, y el número que ves en pantalla está fijado por una prueba automatizada: S/ 5,000 con ONP dan S/ 4,120.00, en la app y en la prueba.",
  fBuilt: "Cómo está hecho",
  fStatus: "Estado",
  fLive: "En producción",
  fVisit: "Visitar calculacuanto.com",
  s2: "Trabajo seleccionado",
  pTitleA: "Catorce proyectos,",
  pTitleEm: "cuatro países.",
  pLead: "Sitios, plataformas y herramientas reales, para negocios y equipos en Perú, México, Chile y Puerto Rico.",
  lType: "Tipo",
  lStack: "Stack",
  lPlace: "País",
  visit: "Visitar sitio",
  indexTitle: "Índice completo",
  indexLead: "Pasa el cursor para ver cada proyecto",
  figPre: "Fig.",
  figHome: "Portada de",
  s3: "Proceso",
  prTitleA: "Instrucciones",
  prTitleEm: "de montaje.",
  prLead: "Un proceso claro de principio a fin, con un stack que elijo según lo que necesita cada proyecto. Sin piezas sobrantes.",
  s4: "Sobre mí",
  aTitleA: "Ingeniero de sistemas,",
  aTitleEm: "front-end por vocación.",
  fig7: "Fig. 8 — En el taller",
  bioCap: "S",
  bioRest:
    "oy Jairo. Me dedico a construir interfaces rápidas, responsivas y bien cuidadas. Disfruto el detalle técnico tanto como el diseño, y siempre estoy aprendiendo algo nuevo. He trabajado en remoto con equipos de Perú, México, Chile y Puerto Rico.",
  cvTitle: "Descargar currículum",
  cvMeta: "PDF · 1 página · 2026",
  expTitle: "Experiencia",
  eduTitle: "Formación",
  s5: "Colofón",
  stTitleA: "Herramientas",
  stTitleEm: "del taller.",
  s6: "Contacto",
  cTitle: "Hablemos",
  cLead: "Estoy disponible para nuevos proyectos web y móviles. Cuéntame tu idea y conversemos cómo darle vida.",
  cTimeA: "Ahora mismo son las",
  cTimeB: "en Lima.",
  foot: "Diseñado y construido a mano.",
  top: "Volver arriba",
};

export type Dict = typeof es;

const en: Dict = {
  mast: "Interface workshop · Ed. 2026",
  navServices: "Services",
  navWork: "Work",
  navProcess: "Process",
  navAbout: "About",
  navContact: "Contact",
  menu: "Menu",
  close: "Close",
  skip: "Skip to content",
  avail: "Available",
  toDark: "Dark",
  toLight: "Light",
  themeLabel: "Toggle theme",
  langLabel: "Language",
  heroRole: "Front-end developer — Web & Mobile",
  heroPlace: "Lima, Peru",
  deckA: "I design and build websites and apps that feel ",
  deckEm: "handmade",
  deckB: ": fast, precise and a little playful.",
  ctaWork: "See the work",
  ctaCV: "Download CV",
  ctaTalk: "Get in touch",
  fig1: "Fig. 1 — The pieces are yours: drag them, throw them.",
  scroll: "Scroll",
  fig2: "Fig. 2 — Jairo Vera, Lima",
  s1: "Services",
  sTitleA: "What I can do",
  sTitleEm: "for you.",
  audBiz: "I run a business",
  audTeam: "I need a dev for my team",
  forBiz: "For — ",
  forTeam: "With — ",
  f1: "Flagship project",
  fTitleA: "calcula",
  fTitleEm: "cuánto",
  fLead: "My own product: 27 salary, benefits and tax calculators for Peru and Mexico, live in production. I designed it, built it and maintain it.",
  fFig: "Fig. 3 — calculacuánto in 21 seconds",
  fPlay: "Play",
  fPause: "Pause",
  fSoundOn: "Sound on",
  fSoundOff: "Mute",
  fVideoLabel: "calculacuánto demo video",
  fBody: "Every result shows its step-by-step breakdown with official parameters, and the number on screen is pinned by an automated test: S/ 5,000 with ONP gives S/ 4,120.00, in the app and in the test.",
  fBuilt: "How it's built",
  fStatus: "Status",
  fLive: "Live",
  fVisit: "Visit calculacuanto.com",
  s2: "Selected work",
  pTitleA: "Fourteen projects,",
  pTitleEm: "four countries.",
  pLead: "Real sites, platforms and tools for businesses and teams in Peru, Mexico, Chile and Puerto Rico.",
  lType: "Type",
  lStack: "Stack",
  lPlace: "Country",
  visit: "Visit site",
  indexTitle: "Full index",
  indexLead: "Hover to preview each project",
  figPre: "Fig.",
  figHome: "Homepage of",
  s3: "Process",
  prTitleA: "Assembly",
  prTitleEm: "instructions.",
  prLead: "A clear process from start to finish, with a stack chosen for what each project needs. No leftover pieces.",
  s4: "About",
  aTitleA: "Systems engineer,",
  aTitleEm: "front-end by calling.",
  fig7: "Fig. 8 — In the workshop",
  bioCap: "I",
  bioRest:
    "'m Jairo. I build fast, responsive, carefully crafted interfaces. I enjoy the technical detail as much as the design, and I'm always learning something new. I've worked remotely with teams in Peru, Mexico, Chile and Puerto Rico.",
  cvTitle: "Download résumé",
  cvMeta: "PDF · 1 page · 2026",
  expTitle: "Experience",
  eduTitle: "Education",
  s5: "Colophon",
  stTitleA: "Tools of",
  stTitleEm: "the workshop.",
  s6: "Contact",
  cTitle: "Let's talk",
  cLead: "I'm available for new web and mobile projects. Tell me about your idea and let's figure out how to bring it to life.",
  cTimeA: "Right now it's",
  cTimeB: "in Lima.",
  foot: "Designed and built by hand.",
  top: "Back to top",
};

export const DICT: Record<Lang, Dict> = { es, en };

/** Fila de servicio: [título, texto negocio, línea negocio, texto equipo, línea equipo] */
export type Service = Record<Lang, readonly [title: string, biz: string, bizFor: string, team: string, teamWith: string]>;
export const SERVICES: readonly Service[] = [
  {
    es: ["Sitios web", "Una web rápida y clara que explique lo que haces y convierta visitas en clientes. Lista para Google desde el primer día.", "Estudios jurídicos · Consultorios · Contables", "Front-end en Astro, Next.js y React: componentes limpios, accesibles y fáciles de mantener.", "Astro · Next.js · React · TypeScript"],
    en: ["Websites", "A fast, clear website that explains what you do and turns visitors into clients. Search-ready from day one.", "Law firms · Clinics · Accountants", "Front-end in Astro, Next.js and React: clean, accessible components that are easy to maintain.", "Astro · Next.js · React · TypeScript"],
  },
  {
    es: ["Apps móviles", "Tu servicio en el bolsillo de tus clientes, en iOS y Android, con una sola base de código.", "Servicios · Reservas · Operaciones en campo", "React Native con arquitectura offline-first, integración de APIs y debugging.", "React Native · iOS · Android"],
    en: ["Mobile apps", "Your service in your clients' pockets, on iOS and Android, from a single codebase.", "Services · Bookings · Field operations", "React Native with offline-first architecture, API integration and debugging.", "React Native · iOS · Android"],
  },
  {
    es: ["Landings y sistemas", "Páginas de campaña que venden y paneles a medida para gestionar citas, reseñas o facturas.", "Campañas · Citas · Facturación", "Dashboards, portales administrativos y flujos complejos con Next.js y Tailwind.", "Next.js · Tailwind · APIs"],
    en: ["Landings & systems", "Campaign pages that sell and custom dashboards to manage bookings, reviews or invoices.", "Campaigns · Bookings · Invoicing", "Dashboards, admin portals and complex flows with Next.js and Tailwind.", "Next.js · Tailwind · APIs"],
  },
  {
    es: ["Rendimiento y SEO", "Que tu web cargue al instante y aparezca cuando te buscan.", "Velocidad · Posicionamiento", "Core Web Vitals, SEO técnico y animaciones con GSAP que no castigan el rendimiento.", "Lighthouse · GSAP · Core Web Vitals"],
    en: ["Performance & SEO", "A site that loads instantly and shows up when people search for you.", "Speed · Search ranking", "Core Web Vitals, technical SEO and GSAP animations that don't hurt performance.", "Lighthouse · GSAP · Core Web Vitals"],
  },
];

export interface Featured {
  id: string;
  title: string;
  host: string;
  url: string;
  flag: Country;
  tags: string;
  type: Pair;
  sum: Pair;
}
export const FEATURED: readonly Featured[] = [
  { id: "tatem", title: "Tatem", host: "tatem.mx", url: "https://tatem.mx/", flag: "mx", tags: "Next.js · Astro · Tailwind", type: ["Plataforma web", "Web platform"], sum: ["Portal y plataforma administrativa para hoteles: reseñas con Google Maps y autofacturación.", "Portal and admin platform for hotels: Google Maps reviews and self-invoicing."] },
  { id: "mdpsolutions", title: "MDP Solutions", host: "mdpsolutions.com.pe", url: "https://www.mdpsolutions.com.pe/", flag: "pe", tags: "Astro · Tailwind · GSAP", type: ["Sitio corporativo B2B", "B2B corporate site"], sum: ["Sitio B2B de servicios VoIP, redes y seguridad TI, con animaciones GSAP.", "B2B site for VoIP, networking and IT security services, with GSAP animations."] },
  { id: "ubilex", title: "Ubilex", host: "ubilex.pe", url: "https://www.ubilex.pe/", flag: "pe", tags: "Astro · Tailwind · Cloudflare", type: ["Web de servicios legales", "Legal services site"], sum: ["Web de asesoría legal con Calendly integrado para la gestión de citas.", "Legal advisory site with built-in Calendly for appointment booking."] },
  { id: "generadoroverlay", title: "Overlays CSS", host: "htmlcssoverlay.xyz", url: "https://www.htmlcssoverlay.xyz/", flag: "own", tags: "Next.js · React · shadcn", type: ["Herramienta propia", "Own tool"], sum: ["Herramienta gratuita para generar overlays en CSS. Nació de un problema propio.", "Free tool for generating CSS overlays. Born from a problem of my own."] },
];

export interface IndexEntry {
  id: string;
  title: string;
  type: Pair;
  flag: Country;
  stack: string;
  url: string | null;
}
/** Proyecto insignia: producto propio con sección y video propios en la home */
export const FLAGSHIP = {
  id: "calculacuanto",
  title: "calculacuánto",
  host: "calculacuanto.com",
  url: "https://calculacuanto.com/",
  flag: "own" as Country,
  countries: ["pe", "mx"] as const satisfies readonly Country[],
  type: ["Producto propio · Hub de calculadoras", "Own product · Calculator hub"] as Pair,
  tags: "Next.js 16 · React 19 · TypeScript · Tailwind 4 · Vitest",
  places: ["Perú y México", "Peru and Mexico"] as Pair,
  video: {
    src1080: "/assets/videos/calculacuanto/demo-1080.mp4",
    src720: "/assets/videos/calculacuanto/demo-720.mp4",
    poster1080: "/assets/videos/calculacuanto/poster-1080.webp",
    poster720: "/assets/videos/calculacuanto/poster-720.webp",
    duration: "0:21",
  },
  /** Cifras verificadas en el repo el 1-nov-2026 (registry y `vitest run`) */
  stats: [
    { value: "27", label: ["calculadoras", "calculators"] as Pair },
    { value: "2", label: ["países: Perú y México", "countries: Peru and Mexico"] as Pair },
    { value: "1,267", label: ["pruebas en verde", "passing tests"] as Pair },
  ],
  built: [
    {
      term: ["Motor", "Engine"] as Pair,
      def: [
        "Un registry central del que salen las 27 calculadoras con sus rutas, sitemap, breadcrumbs y JSON-LD.",
        "A central registry that generates all 27 calculators with their routes, sitemap, breadcrumbs and JSON-LD.",
      ] as Pair,
    },
    {
      term: ["Rigor", "Rigor"] as Pair,
      def: [
        "Parámetros oficiales validados con Zod y cálculos puros contrastados con casos de SUNAT, SBS, MTPE, SAT, IMSS y DOF.",
        "Official parameters validated with Zod and pure calculations checked against SUNAT, SBS, MTPE, SAT, IMSS and DOF cases.",
      ] as Pair,
    },
    {
      term: ["Producto", "Product"] as Pair,
      def: [
        "Desglose paso a paso, enlaces compartibles con los datos del cálculo y metodología pública.",
        "Step-by-step breakdowns, shareable links that carry the calculation and a public methodology.",
      ] as Pair,
    },
    {
      term: ["Entrega", "Delivery"] as Pair,
      def: [
        "Next.js 16 con generación estática en Vercel; cada cambio pasa por 1,267 pruebas en Vitest.",
        "Next.js 16 statically generated on Vercel; every change runs through 1,267 Vitest tests.",
      ] as Pair,
    },
  ],
};

export const INDEX: readonly IndexEntry[] = [
  { id: "rosariozolezzi", title: "Rosario Zolezzi", type: ["Web", "Web"], flag: "pe", stack: "Astro · Tailwind · Preline", url: "https://rosariozolezzi.com/" },
  { id: "estudioshaddai", title: "Estudio Shaddai", type: ["Web", "Web"], flag: "pe", stack: "Astro · Tailwind · Cloudflare", url: "https://estudioshaddai.com/" },
  { id: "drmao", title: "Dr. Carlos Mao", type: ["Landing", "Landing"], flag: "pe", stack: "Astro · Tailwind", url: "https://drmaowebpage.vercel.app/" },
  { id: "quiebras", title: "Quiebras Ahora", type: ["Web", "Web"], flag: "pr", stack: "Astro · Tailwind · Flowbite", url: "https://www.quiebrasahora.com/" },
  { id: "tulicencialanding", title: "Tu Licencia Web", type: ["Landing", "Landing"], flag: "pr", stack: "Astro · Tailwind · React", url: "http://tulicenciapr.com/" },
  { id: "tulicenciaapp", title: "Tu Licencia App", type: ["App web", "Web app"], flag: "pr", stack: "Next.js · React · Tailwind", url: "http://app.tulicenciapr.com/" },
  { id: "drrecetas", title: "Dr. Recetas", type: ["Rediseño", "Redesign"], flag: "pr", stack: "HTML5 · JavaScript · Tailwind", url: "https://doctorrecetas.com/" },
  { id: "islanmed", title: "Islanmed", type: ["Rediseño", "Redesign"], flag: "pr", stack: "HTML5 · JavaScript · Tailwind", url: "https://islandmedpr.com/" },
  { id: "checkit", title: "CheckIt", type: ["Landing", "Landing"], flag: "pr", stack: "HTML5 · JavaScript · Tailwind", url: null },
];

/** Pasos del proceso: [[título, texto] es, [título, texto] en] */
export type Step = readonly [es: Pair, en: Pair];
export const STEPS: readonly Step[] = [
  [["Descubrimiento", "Entiendo objetivos, usuarios y alcance."], ["Discovery", "I map goals, users and scope."]],
  [["Diseño & UI", "Estructura, interfaz y prototipo."], ["Design & UI", "Structure, interface and prototype."]],
  [["Desarrollo", "Código limpio en React, Next, Astro o React Native."], ["Development", "Clean code in React, Next, Astro or React Native."]],
  [["Optimización", "Rendimiento, SEO y responsive."], ["Optimization", "Performance, SEO and responsive."]],
  [["Entrega", "Despliegue, pruebas y soporte."], ["Delivery", "Deployment, testing and support."]],
];

/** Colofón: [[término, definición] es, [término, definición] en] */
export const STACK: readonly Step[] = [
  [["Front-end", "React, Next.js, Astro, JavaScript, TypeScript, HTML5."], ["Front-end", "React, Next.js, Astro, JavaScript, TypeScript, HTML5."]],
  [["Mobile", "React Native para iOS y Android, offline-first."], ["Mobile", "React Native for iOS and Android, offline-first."]],
  [["Estilos y movimiento", "Tailwind CSS, Sass, CSS3, BEM, GSAP."], ["Styling & motion", "Tailwind CSS, Sass, CSS3, BEM, GSAP."]],
  [["Herramientas", "GitHub, Bitbucket, Postman, Figma, Vite."], ["Tools", "GitHub, Bitbucket, Postman, Figma, Vite."]],
];

export interface CvEntry {
  dates: Pair;
  role: Pair;
  org: string;
  flag: Country | null;
}
export const EXP: readonly CvEntry[] = [
  { dates: ["Nov 2024 — Presente", "Nov 2024 — Present"], role: ["Desarrollador Front-End", "Front-End Developer"], org: "Tatem", flag: "mx" },
  { dates: ["Sept 2024 — Presente", "Sep 2024 — Present"], role: ["Desarrollador Mobile · React Native", "Mobile Developer · React Native"], org: "NCAS Tech", flag: "cl" },
  { dates: ["Nov 2023 — Sept 2024", "Nov 2023 — Sep 2024"], role: ["Desarrollador Front-End", "Front-End Developer"], org: "Smart Hiring", flag: "pr" },
  { dates: ["Sept 2023 — Oct 2023", "Sep 2023 — Oct 2023"], role: ["Desarrollador Web · Angular", "Web Developer · Angular"], org: "Vision Games Corporation", flag: "pe" },
  { dates: ["Abr 2023 — Jul 2023", "Apr 2023 — Jul 2023"], role: ["Desarrollador Web Frontend Jr.", "Jr. Frontend Web Developer"], org: "VEVIG", flag: "pe" },
  { dates: ["Mar 2022 — Dic 2022", "Mar 2022 — Dec 2022"], role: ["Practicante · Ing. de Sistemas", "Intern · Systems Engineering"], org: "Grupo Peruano de Capitales", flag: "pe" },
];
export const EDU: readonly CvEntry[] = [
  { dates: ["2017 — 2023 · Titulado 2026", "2017 — 2023 · Graduated 2026"], role: ["Ing. de Sistemas Computacionales", "Computer Systems Engineering"], org: "Universidad Privada del Norte", flag: "pe" },
  { dates: ["May 2023", "May 2023"], role: ["Innovación y Transformación Digital", "Innovation & Digital Transformation"], org: "Universidad Andrés Bello", flag: "cl" },
  { dates: ["2022 — 2023", "2022 — 2023"], role: ["ReactJS · JavaScript · Ciberseguridad", "ReactJS · JavaScript · Cybersecurity"], org: "CoderHouse", flag: "ar" },
  { dates: ["2022", "2022"], role: ["Design Thinking", "Design Thinking"], org: "Instituto Europeo de Postgrado", flag: null },
  { dates: ["Certificado", "Certificate"], role: ["Inglés A2+", "English A2+"], org: "Euroidiomas", flag: null },
];

export const CV_URL = "/CV_FrankJairoVeraChamorro_2026.pdf";
export const CV_DOWNLOAD = "Jairo_Vera_CV_2026.pdf";
export const CONTACT = {
  email: "fj.verachamorro@gmail.com",
  phone: "+51 965 816 742",
  whatsapp: "https://wa.me/51965816742",
  linkedin: "https://www.linkedin.com/in/frank-jairo-vera/",
  github: "https://github.com/JairoVera01",
} as const;

/** Anclas de la home, en el orden del masthead (n = numeral de su SectionHead).
 *  "Trabajo" abre en el proyecto insignia, que precede al resto del trabajo. */
export const NAV = [
  { id: "servicios", key: "navServices", n: "01" },
  { id: "calculacuanto", key: "navWork", n: "02" },
  { id: "proceso", key: "navProcess", n: "04" },
  { id: "sobre-mi", key: "navAbout", n: "05" },
  { id: "contacto", key: "navContact", n: "07" },
] as const satisfies readonly { id: string; key: keyof Dict; n: string }[];
