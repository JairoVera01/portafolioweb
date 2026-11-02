// Datos estructurados (schema.org) por página. Base.astro los junta en un único @graph
// con la persona y el sitio; aquí solo vive lo propio de cada página.
import { CONTACT, FEATURED, FLAGSHIP, INDEX, IMG, homePath, type Lang } from "./content";

export const SITE = "https://jairovera.dev";
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;

type Node = Record<string, unknown>;
const abs = (path: string) => new URL(path, SITE).toString();

/** Título y descripción por página (≤ 60 y ≤ 160 caracteres) */
export const META = {
  home: {
    es: {
      title: "Jairo Vera — Desarrollador front-end en Lima · Web y móvil",
      description:
        "Diseño y construyo webs y apps que se sienten hechas a mano: rápidas, precisas y con un poco de juego. Astro, Next.js y React Native. Creador de calculacuánto.",
    },
    en: {
      title: "Jairo Vera — Front-end developer in Lima · Web & mobile",
      description:
        "I design and build websites and apps that feel handmade: fast, precise and a little playful. Astro, Next.js and React Native. Creator of calculacuánto.",
    },
  },
  projects: {
    es: {
      title: "Proyectos · Jairo Vera — Desarrollador front-end",
      description:
        "Catorce proyectos, entre ellos calculacuánto, mi propio producto: webs, landings, plataformas y apps para negocios en Perú, México y Puerto Rico.",
    },
    en: {
      title: "Projects · Jairo Vera — Front-end developer",
      description:
        "Fourteen projects, including calculacuánto, my own product: websites, landings, platforms and apps for businesses in Peru, Mexico and Puerto Rico.",
    },
  },
  contact: {
    es: {
      title: "Contacto · Jairo Vera — Desarrollador front-end",
      description:
        "¿Tienes un proyecto web o móvil en mente? Hablemos. Disponible para trabajo remoto e internacional desde Lima; respondo en menos de 24 horas.",
    },
    en: {
      title: "Contact · Jairo Vera — Front-end developer",
      description:
        "Have a web or mobile project in mind? Let's talk. Available for remote and international work from Lima; I reply in under 24 hours.",
    },
  },
  notFound: {
    es: { title: "404 · Página no encontrada · Jairo Vera", description: "Esta página no existe. Vuelve al inicio para ver el trabajo de Jairo Vera." },
    en: { title: "404 · Page not found · Jairo Vera", description: "This page doesn't exist. Head back home to see Jairo Vera's work." },
  },
} satisfies Record<string, Record<Lang, { title: string; description: string }>>;

export function personNode(lang: Lang): Node {
  const en = lang === "en";
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jairo Vera",
    alternateName: "Frank Jairo Vera Chamorro",
    jobTitle: en ? "Front-End Developer" : "Desarrollador Front-End",
    description: en
      ? "Front-end developer in Lima, Peru. Designs and builds fast, carefully crafted websites and apps with Astro, Next.js, React and React Native."
      : "Desarrollador front-end en Lima, Perú. Diseña y construye webs y apps rápidas y bien cuidadas con Astro, Next.js, React y React Native.",
    url: SITE,
    image: abs("/assets/images/port2.webp"),
    email: `mailto:${CONTACT.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Lima", addressCountry: "PE" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad Privada del Norte" },
    knowsLanguage: ["es", "en"],
    sameAs: [CONTACT.linkedin, CONTACT.github],
    knowsAbout: ["JavaScript", "TypeScript", "React", "Next.js", "Astro", "React Native", "Tailwind CSS", "three.js", "Web performance", "Technical SEO"],
  };
}

export function websiteNode(lang: Lang): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE,
    name: "Jairo Vera",
    alternateName: "jairovera.dev",
    inLanguage: lang === "en" ? "en-US" : "es-PE",
    publisher: { "@id": PERSON_ID },
  };
}

function breadcrumb(lang: Lang, name: string, path: string): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Inicio", item: abs(homePath(lang)) },
      { "@type": "ListItem", position: 2, name, item: abs(path) },
    ],
  };
}

/** Home: página de perfil + el producto propio */
export function homeSchema(lang: Lang, url: string, title: string): Node[] {
  const en = lang === "en";
  return [
    {
      "@type": "ProfilePage",
      "@id": `${url}#page`,
      url,
      name: title,
      inLanguage: en ? "en-US" : "es-PE",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
      primaryImageOfPage: abs(`/og/jairovera-${lang}.png`),
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${FLAGSHIP.url}#app`,
      name: FLAGSHIP.title,
      url: FLAGSHIP.url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "es",
      image: abs(FLAGSHIP.video.poster),
      description: en
        ? "27 salary, benefits and tax calculators for Peru and Mexico, with step-by-step breakdowns and official parameters."
        : "27 calculadoras de sueldo, beneficios e impuestos para Perú y México, con desglose paso a paso y parámetros oficiales.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "PEN" },
      creator: { "@id": PERSON_ID },
    },
  ];
}

/** /projects: colección con todos los proyectos enlazables */
export function projectsSchema(lang: Lang, url: string, title: string): Node[] {
  const items = [
    { name: FLAGSHIP.title, url: FLAGSHIP.url, image: abs(FLAGSHIP.video.poster) },
    ...FEATURED.map((p) => ({ name: p.title, url: p.url, image: abs(IMG(p.id)) })),
    ...INDEX.filter((p) => p.url).map((p) => ({ name: p.title, url: p.url as string, image: abs(IMG(p.id)) })),
  ];
  return [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name: title,
      inLanguage: lang === "en" ? "en-US" : "es-PE",
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": PERSON_ID },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "CreativeWork", name: it.name, url: it.url, image: it.image, creator: { "@id": PERSON_ID } },
        })),
      },
    },
    breadcrumb(lang, lang === "en" ? "Projects" : "Proyectos", url),
  ];
}

/** /contacto */
export function contactSchema(lang: Lang, url: string, title: string): Node[] {
  return [
    {
      "@type": "ContactPage",
      "@id": `${url}#page`,
      url,
      name: title,
      inLanguage: lang === "en" ? "en-US" : "es-PE",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
    },
    breadcrumb(lang, lang === "en" ? "Contact" : "Contacto", url),
  ];
}
