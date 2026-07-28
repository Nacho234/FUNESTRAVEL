import type { Herramienta, ResultadoHerramienta, Tarjeta } from "./types";
import { packages } from "@/data/packages";
import { destinations, regions } from "@/data/destinations";
import { hotels } from "@/data/hotels";
import { promotions } from "@/data/content";
import { featuredRoutes } from "@/data/flight-routes";
import { formatMoney } from "@/lib/format";

/**
 * Herramientas del copilot: las únicas funciones autorizadas a producir un
 * dato del negocio.
 *
 * Todas leen `src/data/*` y devuelven tarjetas ya formateadas. El bot no
 * redacta precios ni fechas: llama a una de estas y cita el resultado. Cuando
 * el catálogo pase a una base de datos, se cambia el cuerpo de cada `ejecutar`
 * y nada más.
 */

/** Sin acentos y en minúscula, para comparar lo que escribe el viajero. */
export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const MAX_RESULTADOS = 3;

const recortar = (tarjetas: Tarjeta[], criterio: string): ResultadoHerramienta => ({
  tarjetas: tarjetas.slice(0, MAX_RESULTADOS),
  total: tarjetas.length,
  criterio,
});

const nombreDestino = (slug: string) =>
  destinations.find((d) => d.slug === slug)?.name ?? slug;

/* ── Estilos y regiones, tomados del propio catálogo ───────────────── */

export const estilosDisponibles = [
  ...new Set(packages.flatMap((p) => p.travelStyles)),
].sort();

export const regionesDisponibles = [...regions];

/* ── 1 · Paquetes ─────────────────────────────────────────────────── */

interface ArgsPaquetes {
  destino?: string;
  estilo?: string;
  precioMaximo?: number;
  ciudadSalida?: string;
}

export const buscarPaquetes: Herramienta<ArgsPaquetes> = {
  nombre: "buscar_paquetes",
  descripcion:
    "Busca paquetes en el catálogo de Funes Travel. Usala cuando el viajero pregunte por un viaje armado, un destino concreto, o pida opciones por presupuesto o forma de viajar.",
  esquema: {
    type: "object",
    properties: {
      destino: { type: "string", description: "Nombre o parte del nombre del destino o la ciudad. Ej: Bariloche, Caribe, Europa." },
      estilo: { type: "string", description: "Forma de viajar.", enum: estilosDisponibles },
      precioMaximo: { type: "number", description: "Precio máximo por persona en dólares." },
      ciudadSalida: { type: "string", description: "Ciudad desde la que sale el viajero. Ej: Rosario, Buenos Aires." },
    },
    additionalProperties: false,
  },
  ejecutar: ({ destino, estilo, precioMaximo, ciudadSalida }) => {
    const criterios: string[] = [];
    let encontrados = packages;

    if (destino) {
      const q = normalizar(destino);
      encontrados = encontrados.filter((p) => {
        const d = destinations.find((x) => x.slug === p.destinationSlug);
        // El país entra en la búsqueda: "Brasil" tiene que encontrar Florianópolis.
        const campos = [p.name, p.destinationSlug, ...p.cities, d?.name, d?.country];
        return campos.some((t) => t && normalizar(t).includes(q));
      });
      criterios.push(destino);
    }
    if (estilo) {
      const q = normalizar(estilo);
      encontrados = encontrados.filter((p) => p.travelStyles.some((s) => normalizar(s) === q));
      criterios.push(estilo.toLowerCase());
    }
    if (typeof precioMaximo === "number") {
      encontrados = encontrados.filter((p) => p.priceFrom.amount <= precioMaximo);
      criterios.push(`hasta USD ${precioMaximo}`);
    }
    if (ciudadSalida) {
      const q = normalizar(ciudadSalida);
      encontrados = encontrados.filter((p) => normalizar(p.departureCity).includes(q));
      criterios.push(`saliendo de ${ciudadSalida}`);
    }

    const ordenados = [...encontrados].sort((a, b) => a.priceFrom.amount - b.priceFrom.amount);

    return recortar(
      ordenados.map((p) => ({
        tipo: "paquete" as const,
        slug: p.slug,
        nombre: p.name,
        resumen: p.summary,
        noches: p.nights,
        desde: formatMoney(p.priceFrom),
        salida: p.departureCity,
        href: `/paquetes/${p.slug}`,
        imagen: p.image,
      })),
      criterios.join(" · ") || "todo el catálogo",
    );
  },
};

/* ── 2 · Destinos ─────────────────────────────────────────────────── */

interface ArgsDestinos {
  region?: string;
  estilo?: string;
  precioMaximo?: number;
}

export const buscarDestinos: Herramienta<ArgsDestinos> = {
  nombre: "buscar_destinos",
  descripcion:
    "Busca destinos. Usala cuando el viajero todavía no sabe adónde ir y describe una región, un clima o una forma de viajar.",
  esquema: {
    type: "object",
    properties: {
      region: { type: "string", description: "Región del destino.", enum: regionesDisponibles },
      estilo: { type: "string", description: "Forma de viajar.", enum: estilosDisponibles },
      precioMaximo: { type: "number", description: "Precio máximo por persona en dólares." },
    },
    additionalProperties: false,
  },
  ejecutar: ({ region, estilo, precioMaximo }) => {
    const criterios: string[] = [];
    let encontrados = destinations;

    if (region) {
      const q = normalizar(region);
      encontrados = encontrados.filter((d) => normalizar(d.region).includes(q));
      criterios.push(region);
    }
    if (estilo) {
      const q = normalizar(estilo);
      encontrados = encontrados.filter((d) => d.idealFor.some((s) => normalizar(s) === q));
      criterios.push(estilo.toLowerCase());
    }
    if (typeof precioMaximo === "number") {
      encontrados = encontrados.filter((d) => d.priceFrom.amount <= precioMaximo);
      criterios.push(`hasta USD ${precioMaximo}`);
    }

    const ordenados = [...encontrados].sort((a, b) => a.priceFrom.amount - b.priceFrom.amount);

    return recortar(
      ordenados.map((d) => ({
        tipo: "destino" as const,
        slug: d.slug,
        nombre: d.name,
        pais: d.country,
        resumen: d.tagline,
        desde: formatMoney(d.priceFrom),
        temporada: d.season,
        href: `/destinos/${d.slug}`,
        imagen: d.image,
      })),
      criterios.join(" · ") || "todos los destinos",
    );
  },
};

/* ── 3 · Hoteles ──────────────────────────────────────────────────── */

interface ArgsHoteles {
  destino?: string;
  estrellasMinimas?: number;
}

export const buscarHoteles: Herramienta<ArgsHoteles> = {
  nombre: "buscar_hoteles",
  descripcion: "Busca hoteles del catálogo. Usala cuando el viajero pregunte por alojamiento en un destino.",
  esquema: {
    type: "object",
    properties: {
      destino: { type: "string", description: "Nombre o parte del nombre del destino." },
      estrellasMinimas: { type: "integer", description: "Cantidad mínima de estrellas, de 1 a 5." },
    },
    additionalProperties: false,
  },
  ejecutar: ({ destino, estrellasMinimas }) => {
    const criterios: string[] = [];
    let encontrados = hotels;

    if (destino) {
      const q = normalizar(destino);
      encontrados = encontrados.filter(
        (h) => normalizar(h.name).includes(q) || normalizar(nombreDestino(h.destinationSlug)).includes(q),
      );
      criterios.push(destino);
    }
    if (typeof estrellasMinimas === "number") {
      encontrados = encontrados.filter((h) => h.stars >= estrellasMinimas);
      criterios.push(`${estrellasMinimas}★ o más`);
    }

    return recortar(
      encontrados.map((h) => {
        const menor = Math.min(...h.rooms.map((r) => r.pricePerNight.amount));
        return {
          tipo: "hotel" as const,
          slug: h.slug,
          nombre: h.name,
          destino: nombreDestino(h.destinationSlug),
          estrellas: h.stars,
          desde: formatMoney({ amount: menor, currency: "USD" }),
          href: `/hoteles/${h.slug}`,
          imagen: h.image,
        };
      }),
      criterios.join(" · ") || "todos los hoteles",
    );
  },
};

/* ── 4 · Promociones ──────────────────────────────────────────────── */

export const verPromociones: Herramienta<Record<string, never>> = {
  nombre: "ver_promociones",
  descripcion:
    "Devuelve las promociones vigentes, ordenadas por fecha de vencimiento. Usala cuando el viajero pregunte por ofertas, descuentos o cuotas.",
  esquema: { type: "object", properties: {}, additionalProperties: false },
  ejecutar: () => {
    const hoy = new Date();
    const vigentes = promotions
      .filter((p) => new Date(p.validUntil) >= hoy)
      .sort((a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime());

    return recortar(
      vigentes.map((p) => ({
        tipo: "promocion" as const,
        id: p.id,
        titulo: p.title,
        detalle: p.detail,
        vence: new Date(p.validUntil).toLocaleDateString("es-AR", { day: "numeric", month: "long" }),
        desde: p.priceFrom ? formatMoney(p.priceFrom) : undefined,
        href: p.href,
      })),
      "promociones vigentes",
    );
  },
};

/* ── 5 · Vuelos ───────────────────────────────────────────────────── */

interface ArgsVuelos {
  origen?: string;
  destino?: string;
}

export const buscarVuelos: Herramienta<ArgsVuelos> = {
  nombre: "buscar_vuelos",
  descripcion:
    "Devuelve rutas aéreas destacadas con precio de referencia. Usala cuando el viajero pregunte por un vuelo o un pasaje suelto. Los precios son orientativos, no disponibilidad en vivo.",
  esquema: {
    type: "object",
    properties: {
      origen: { type: "string", description: "Ciudad de salida. Ej: Rosario, Buenos Aires." },
      destino: { type: "string", description: "Ciudad de llegada. Ej: Bariloche, Madrid." },
    },
    additionalProperties: false,
  },
  ejecutar: ({ origen, destino }) => {
    const criterios: string[] = [];
    let encontradas = featuredRoutes;

    if (origen) {
      const q = normalizar(origen);
      encontradas = encontradas.filter(
        (r) => normalizar(r.origin.city).includes(q) || normalizar(r.origin.code).includes(q),
      );
      criterios.push(`desde ${origen}`);
    }
    if (destino) {
      const q = normalizar(destino);
      encontradas = encontradas.filter(
        (r) => normalizar(r.destination.city).includes(q) || normalizar(r.destination.code).includes(q),
      );
      criterios.push(`hacia ${destino}`);
    }

    return recortar(
      encontradas.map((r) => ({
        tipo: "vuelo" as const,
        id: r.id,
        origen: r.origin.city,
        destino: r.destination.city,
        tipoVuelo: r.flightType,
        duracion: r.duration,
        desde: `${r.currency} ${r.priceFrom}`,
        href: r.primaryCta.href,
      })),
      criterios.join(" · ") || "rutas destacadas",
    );
  },
};

/* ── Registro ─────────────────────────────────────────────────────── */

/** Todas las herramientas, por nombre. Es lo que se le pasa al modelo. */
export const herramientas = {
  buscar_paquetes: buscarPaquetes,
  buscar_destinos: buscarDestinos,
  buscar_hoteles: buscarHoteles,
  ver_promociones: verPromociones,
  buscar_vuelos: buscarVuelos,
} as const;

export type NombreHerramienta = keyof typeof herramientas;

/**
 * Definiciones en el formato que espera la API (OpenAI / DeepSeek). Se genera
 * desde el mismo objeto que se ejecuta, así no puede desincronizarse del
 * código que corre.
 */
export const definicionesParaModelo = Object.values(herramientas).map((h) => ({
  type: "function" as const,
  function: {
    name: h.nombre,
    description: h.descripcion,
    parameters: h.esquema,
    strict: true,
  },
}));
