import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { hotels } from "@/data/hotels";
import { excursions } from "@/data/excursions";
import { articles, groupTrips } from "@/data/content";

const BASE = "https://funestravel.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/destinos",
    "/paquetes",
    "/vuelos",
    "/hoteles",
    "/excursiones",
    "/promociones",
    "/viajes-grupales",
    "/viajes-a-medida",
    "/inspiracion",
    "/ayuda",
    "/nosotros",
    "/contacto",
    "/sucursales",
    "/medios-de-pago",
    "/terminos",
    "/privacidad",
    "/politica-de-cancelaciones",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...destinations.map((d) => ({ url: `${BASE}/destinos/${d.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...packages.map((p) => ({ url: `${BASE}/paquetes/${p.slug}`, changeFrequency: "daily" as const, priority: 0.9 })),
    ...hotels.map((h) => ({ url: `${BASE}/hoteles/${h.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...excursions.map((e) => ({ url: `${BASE}/excursiones/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...groupTrips.map((g) => ({ url: `${BASE}/viajes-grupales/${g.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${BASE}/inspiracion/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
