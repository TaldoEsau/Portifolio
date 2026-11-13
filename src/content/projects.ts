export type Project = {
  id: string;
  missionCode: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  problem: string;
  actions: string[];
  remotionBlueprint?: "gemini-pipeline" | "arduino-clip";
  results: { label: string; value: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  visibility: "public" | "partial" | "internal";
};

const RESTRICTED = "[DADO RESTRITO // AGUARDANDO DESCLASSIFICAÇÃO]";

const loveonStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Prisma",
  "Supabase",
  "3D/AR",
];

const pt: Project[] = [
  {
    id: "loveon",
    missionCode: "MISSION_01 // SECTOR_GIFT",
    title: "LoveOn — presentes digitais",
    role: "Full Stack",
    period: "2026",
    summary:
      "Páginas de presente com mapa estelar, fase da lua, 3D, AR, música e QR. Backend em Prisma/Supabase e frontend em Next.js.",
    problem:
      "O produto precisava de um wizard de criação fluido e de páginas pesadas em mídia que ainda abrissem bem no celular.",
    actions: [
      "Backend com Prisma e Supabase.",
      "Frontend em Next.js, Tailwind CSS e Framer Motion.",
      "Wizard de criação e renderização ajustada para mobile, com 3D e AR.",
    ],
    results: [
      { label: "URL de produção", value: "https://ove-on-tau.vercel.app" },
      { label: "Métricas de uso", value: RESTRICTED },
    ],
    stack: loveonStack,
    links: [
      { label: "ove-on-tau.vercel.app", href: "https://ove-on-tau.vercel.app" },
    ],
    visibility: "public",
  },
  {
    id: "imobiliaria",
    missionCode: "MISSION_02 // SECTOR_ESTATE",
    title: "Plataforma imobiliária",
    role: "Portfólio",
    period: "",
    summary:
      "Conceito de plataforma para compra, locação e agendamento de visitas presenciais com corretores. Não é um cliente publicado.",
    problem:
      "A peça mostra um produto multi-tenant de gestão e venda de imóveis, do anúncio até a visita.",
    actions: [
      "Página pública do conceito no ar.",
      "O texto do produto cobre compra, locação e visita presencial.",
    ],
    results: [
      {
        label: "URL",
        value: "https://real-estate-rho-khaki.vercel.app",
      },
    ],
    stack: [],
    links: [
      {
        label: "real-estate-rho-khaki.vercel.app",
        href: "https://real-estate-rho-khaki.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "firefly",
    missionCode: "MISSION_03 // SECTOR_TABLE",
    title: "Firefly Restaurant",
    role: "Portfólio",
    period: "",
    summary:
      "Landing de restaurante. A página apresenta uma cozinha em Noe Valley. Peça de portfólio, não um contrato de cliente.",
    problem:
      "Uma landing de casa gastronômica, com reserva e a história do cardápio na primeira dobra.",
    actions: ["Página publicada em Next.js e React."],
    results: [
      {
        label: "URL",
        value: "https://landing-page-rest-sable.vercel.app",
      },
    ],
    stack: ["Next.js", "React"],
    links: [
      {
        label: "landing-page-rest-sable.vercel.app",
        href: "https://landing-page-rest-sable.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "dama",
    missionCode: "MISSION_04 // SECTOR_OVEN",
    title: "Dama Pizzaria",
    role: "Portfólio",
    period: "",
    summary:
      "Landing da Dama Pizzaria, em Santa Fé do Sul. Publicada como peça de portfólio.",
    problem:
      "A página apresenta a casa: ambiente, forno a lenha e a cidade. Não está marcada como contrato confirmado.",
    actions: ["Landing publicada em Next.js e React."],
    results: [
      {
        label: "URL",
        value: "https://landing-page-rest-3-5nbx.vercel.app",
      },
    ],
    stack: ["Next.js", "React"],
    links: [
      {
        label: "landing-page-rest-3-5nbx.vercel.app",
        href: "https://landing-page-rest-3-5nbx.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "freestyle",
    missionCode: "MISSION_05 // SECTOR_CLOTH",
    title: "Freestyle Store",
    role: "Portfólio",
    period: "",
    summary: "Landing de loja de roupa. Peça de portfólio.",
    problem: "Uma vitrine de loja publicada como demonstração, sem cliente confirmado.",
    actions: ["Página pública no ar."],
    results: [
      { label: "URL", value: "https://loja-roupa-beige.vercel.app" },
    ],
    stack: [],
    links: [
      {
        label: "loja-roupa-beige.vercel.app",
        href: "https://loja-roupa-beige.vercel.app",
      },
    ],
    visibility: "public",
  },
];

const en: Project[] = [
  {
    id: "loveon",
    missionCode: "MISSION_01 // SECTOR_GIFT",
    title: "LoveOn — digital gifts",
    role: "Full Stack",
    period: "2026",
    summary:
      "Gift pages with a star map, moon phase, 3D, AR, music, and a QR code. Prisma/Supabase on the backend, Next.js on the frontend.",
    problem:
      "The product needed a fast creation wizard and media-heavy pages that still open cleanly on a phone.",
    actions: [
      "Backend with Prisma and Supabase.",
      "Frontend in Next.js, Tailwind CSS, and Framer Motion.",
      "Creation wizard and mobile rendering, including 3D and AR.",
    ],
    results: [
      { label: "Production URL", value: "https://ove-on-tau.vercel.app" },
      { label: "Usage metrics", value: RESTRICTED },
    ],
    stack: loveonStack,
    links: [
      { label: "ove-on-tau.vercel.app", href: "https://ove-on-tau.vercel.app" },
    ],
    visibility: "public",
  },
  {
    id: "imobiliaria",
    missionCode: "MISSION_02 // SECTOR_ESTATE",
    title: "Real-estate platform",
    role: "Portfolio",
    period: "",
    summary:
      "A concept platform for buying, renting, and booking in-person visits with agents. Not a published client.",
    problem:
      "The piece shows a multi-tenant product for managing and selling property, from the listing to the visit.",
    actions: [
      "Public concept page is live.",
      "The product copy covers buying, renting, and in-person visits.",
    ],
    results: [
      { label: "URL", value: "https://real-estate-rho-khaki.vercel.app" },
    ],
    stack: [],
    links: [
      {
        label: "real-estate-rho-khaki.vercel.app",
        href: "https://real-estate-rho-khaki.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "firefly",
    missionCode: "MISSION_03 // SECTOR_TABLE",
    title: "Firefly Restaurant",
    role: "Portfolio",
    period: "",
    summary:
      "A restaurant landing. The page presents a Noe Valley kitchen. A portfolio piece, not a client contract.",
    problem:
      "A restaurant landing, with reservations and the menu story above the fold.",
    actions: ["Page published with Next.js and React."],
    results: [
      { label: "URL", value: "https://landing-page-rest-sable.vercel.app" },
    ],
    stack: ["Next.js", "React"],
    links: [
      {
        label: "landing-page-rest-sable.vercel.app",
        href: "https://landing-page-rest-sable.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "dama",
    missionCode: "MISSION_04 // SECTOR_OVEN",
    title: "Dama Pizzaria",
    role: "Portfolio",
    period: "",
    summary:
      "Landing for Dama Pizzaria, in Santa Fé do Sul. Published as a portfolio piece.",
    problem:
      "The page presents the venue: the room, the wood-fired oven, and the city. It is not marked as a confirmed contract.",
    actions: ["Landing published with Next.js and React."],
    results: [
      { label: "URL", value: "https://landing-page-rest-3-5nbx.vercel.app" },
    ],
    stack: ["Next.js", "React"],
    links: [
      {
        label: "landing-page-rest-3-5nbx.vercel.app",
        href: "https://landing-page-rest-3-5nbx.vercel.app",
      },
    ],
    visibility: "public",
  },
  {
    id: "freestyle",
    missionCode: "MISSION_05 // SECTOR_CLOTH",
    title: "Freestyle Store",
    role: "Portfolio",
    period: "",
    summary: "A clothing-store landing. A portfolio piece.",
    problem: "A storefront published as a demonstration, with no confirmed client.",
    actions: ["Public page is live."],
    results: [{ label: "URL", value: "https://loja-roupa-beige.vercel.app" }],
    stack: [],
    links: [
      {
        label: "loja-roupa-beige.vercel.app",
        href: "https://loja-roupa-beige.vercel.app",
      },
    ],
    visibility: "public",
  },
];

export function getProjects(locale: "pt" | "en") {
  return locale === "en" ? en : pt;
}
