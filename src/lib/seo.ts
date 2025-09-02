/*
  Centralized SEO utilities for SPA routes.
  - Applies <title>, meta description, keywords
  - Adds Open Graph and Twitter tags
  - Injects canonical link
  - Adds JSON-LD BreadcrumbList and page-specific schema

  Usage: import { applyRouteSEO } from "@/lib/seo"; applyRouteSEO(locationPathname)
  Configure your production site URL via VITE_SITE_URL env. Fallback: window.location.origin
*/

export type PageType = "website" | "article" | "product" | "service";

export interface PageSEO {
  path: string; // path starting with /
  title: string;
  description: string;
  keywords?: string[];
  image?: string; // absolute URL preferred
  type?: PageType;
}

const SITE_NAME = "Design Dynasty";
const DEFAULT_LOCALE = "en_US";

function getSiteUrl(): string {
  // Prefer env, fallback to browser origin when available
  // @ts-ignore
  const fromEnv = import.meta?.env?.VITE_SITE_URL as string | undefined;
  if (fromEnv && /^https?:\/\//i.test(fromEnv))
    return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin)
    return window.location.origin;
  return "https://www.designdynasty.com"; // fallback placeholder
}

function absoluteUrl(path: string): string {
  const root = getSiteUrl();
  if (!path) return root;
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
}

function upsertMeta(
  nameOrProperty: { name?: string; property?: string },
  content: string
) {
  const selector = nameOrProperty.name
    ? `meta[name="${nameOrProperty.name}"]`
    : `meta[property="${nameOrProperty.property}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (nameOrProperty.name) el.setAttribute("name", nameOrProperty.name);
    if (nameOrProperty.property)
      el.setAttribute("property", nameOrProperty.property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkRel(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: object) {
  let el = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function buildBreadcrumbs(pathname: string) {
  const siteUrl = getSiteUrl();
  const segments = pathname.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl + "/",
    },
    ...segments.map((seg, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: decodeURIComponent(seg.replace(/-/g, " ")).replace(/\b\w/g, (c) =>
        c.toUpperCase()
      ),
      item: absoluteUrl("/" + segments.slice(0, idx + 1).join("/")),
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildPageSchema(meta: Required<PageSEO>, pathname: string) {
  const url = absoluteUrl(pathname);
  const image = meta.image;
  const base = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.description,
    url,
    image,
  } as any;

  switch (meta.type) {
    case "article":
      return {
        ...base,
        "@type": "Article",
        headline: meta.title,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        mainEntityOfPage: url,
      };
    case "product":
      return {
        ...base,
        "@type": "Product",
        brand: {
          "@type": "Organization",
          name: SITE_NAME,
        },
      };
    case "service":
      return {
        ...base,
        "@type": "Service",
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Global",
        },
      };
    default:
      return {
        ...base,
        "@type": "WebPage",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: getSiteUrl(),
        },
      };
  }
}

const DEFAULT_IMAGE = absoluteUrl("/vite.svg"); // Default OG image; replace by adding /public/og-default.jpg and updating this path

const routeMeta: PageSEO[] = [
  {
    path: "/",
    title: "Design Dynasty | Web, Mobile, and Design Solutions",
    description:
      "Full-service agency delivering websites, mobile apps, and brand design that grow your business.",
    keywords: [
      "web development",
      "mobile apps",
      "graphic design",
      "digital agency",
      "Design Dynasty",
    ],
    image: DEFAULT_IMAGE,
    type: "website",
  },
  {
    path: "/about",
    title: "About Design Dynasty | Team, Mission, Experience",
    description:
      "Meet Design Dynasty: our mission, values, and experienced team delivering exceptional digital solutions.",
    keywords: ["about", "agency", "team", "mission", "experience"],
    image: DEFAULT_IMAGE,
    type: "website",
  },
  {
    path: "/services",
    title: "Services | Web Development, Mobile, Design, Marketing",
    description:
      "Comprehensive services: web development, mobile apps, graphic design, digital marketing, e-commerce.",
    keywords: ["services", "web", "mobile", "design", "marketing", "ecommerce"],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/services/web-development",
    title: "Web Development Services | React, Node.js, Cloud",
    description:
      "Custom websites and web apps using React, Node.js, and cloud. Secure, scalable, and fast.",
    keywords: ["web development", "react", "node.js", "frontend", "backend"],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/services/graphic-design",
    title: "Graphic Design Services | Brand Identity, UI/UX",
    description:
      "Brand identity, UI/UX, and marketing assets that elevate your visual presence.",
    keywords: ["graphic design", "brand identity", "ui ux", "visual design"],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/services/mobile-development",
    title: "Mobile App Development | iOS, Android, Cross-Platform",
    description:
      "Native iOS/Android and cross-platform apps built with React Native and Flutter.",
    keywords: [
      "mobile development",
      "react native",
      "flutter",
      "ios",
      "android",
    ],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/services/digital-marketing",
    title: "Digital Marketing | SEO, PPC, Social, Content",
    description:
      "Data-driven SEO, PPC, social media, and content marketing to grow your brand.",
    keywords: [
      "digital marketing",
      "seo",
      "ppc",
      "social media",
      "content marketing",
    ],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/services/ecommerce-solutions",
    title: "E-commerce Solutions | Shopify, WooCommerce, Magento",
    description:
      "High-converting online stores with secure payments, analytics, and mobile commerce.",
    keywords: [
      "ecommerce",
      "shopify",
      "woocommerce",
      "magento",
      "online store",
    ],
    image: DEFAULT_IMAGE,
    type: "service",
  },
  {
    path: "/pricing",
    title: "Pricing Plans | Transparent Web & App Development Pricing",
    description:
      "Starter, Business, and Enterprise plans for websites and apps. Clear, transparent pricing.",
    keywords: [
      "pricing",
      "plans",
      "cost",
      "web development pricing",
      "app development pricing",
    ],
    image: DEFAULT_IMAGE,
    type: "product",
  },
  {
    path: "/blog",
    title: "Blog & Insights | Web, Mobile, and Design Trends",
    description:
      "Latest insights on web development, mobile apps, and design from our expert team.",
    keywords: [
      "blog",
      "insights",
      "web development trends",
      "mobile",
      "design",
    ],
    image: DEFAULT_IMAGE,
    type: "article",
  },
  {
    path: "/contact",
    title: "Contact Design Dynasty | Free Consultation & Quotes",
    description:
      "Get in touch for a free consultation about web, mobile, or design projects.",
    keywords: ["contact", "quote", "consultation", "get in touch"],
    image: DEFAULT_IMAGE,
    type: "website",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | Design Dynasty",
    description: "Read how we collect, use, and protect your information.",
    keywords: ["privacy policy", "data protection", "gdpr"],
    image: DEFAULT_IMAGE,
    type: "website",
  },
];

function matchRouteMeta(pathname: string): PageSEO | null {
  // Exact match first, then prefix for grouped pages
  const exact = routeMeta.find((m) => m.path === pathname);
  if (exact) return exact;
  const prefix = routeMeta
    .filter((m) => m.path !== "/" && pathname.startsWith(m.path))
    .sort((a, b) => b.path.length - a.path.length)[0];
  return prefix || routeMeta.find((m) => m.path === "/") || null;
}

export function applySEO(meta: PageSEO, pathname: string) {
  const siteUrl = getSiteUrl();
  const resolved: Required<PageSEO> = {
    ...meta,
    keywords: meta.keywords || [],
    image: meta.image || DEFAULT_IMAGE,
    type: meta.type || "website",
  } as Required<PageSEO>;

  // Title
  document.title = resolved.title;

  // Meta basics
  upsertMeta({ name: "description" }, resolved.description);
  if (resolved.keywords.length)
    upsertMeta({ name: "keywords" }, resolved.keywords.join(", "));

  // Canonical
  const canonical = absoluteUrl(pathname);
  upsertLinkRel("canonical", canonical);

  // Open Graph
  upsertMeta({ property: "og:title" }, resolved.title);
  upsertMeta({ property: "og:description" }, resolved.description);
  upsertMeta({ property: "og:image" }, resolved.image);
  upsertMeta({ property: "og:url" }, canonical);
  upsertMeta(
    { property: "og:type" },
    resolved.type === "article" ? "article" : "website"
  );
  upsertMeta({ property: "og:site_name" }, SITE_NAME);
  upsertMeta({ property: "og:locale" }, DEFAULT_LOCALE);

  // Twitter
  upsertMeta({ name: "twitter:card" }, "summary_large_image");
  upsertMeta({ name: "twitter:title" }, resolved.title);
  upsertMeta({ name: "twitter:description" }, resolved.description);
  upsertMeta({ name: "twitter:image" }, resolved.image);

  // Structured data
  const breadcrumbs = buildBreadcrumbs(pathname);
  upsertJsonLd("ldjson-breadcrumb", breadcrumbs);
  const pageSchema = buildPageSchema(resolved as Required<PageSEO>, pathname);
  upsertJsonLd("ldjson-page", pageSchema);
}

export function applyRouteSEO(pathname: string) {
  if (typeof document === "undefined") return;
  const meta = matchRouteMeta(pathname);
  if (!meta) return;
  applySEO(meta, pathname);
}
