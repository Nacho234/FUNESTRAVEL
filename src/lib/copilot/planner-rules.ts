import type {
  Accion,
  BorradorSolicitud,
  Mensaje,
  Planificador,
  RespuestaCopilot,
  Tarjeta,
} from "./types";
import {
  buscarDestinos,
  buscarHoteles,
  buscarPaquetes,
  buscarVuelos,
  estilosDisponibles,
  normalizar,
  regionesDisponibles,
  verPromociones,
} from "./tools";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";

/**
 * Planificador determinista.
 *
 * Decide qué herramienta usar leyendo palabras clave, no entendiendo la frase.
 * Cubre bien los caminos frecuentes y falla de forma honesta en el resto:
 * cuando no reconoce la intención lo dice y ofrece un asesor, en vez de
 * improvisar una respuesta.
 *
 * Respeta las mismas reglas que `PROMPT_SISTEMA`: no inventa datos, aclara la
 * base del precio la primera vez, hace una sola pregunta por turno y deriva
 * cuando corresponde. Al conectar el modelo, esas reglas pasan a estar
 * garantizadas por el prompt en vez de por este código.
 */

/* ── Extracción de entidades ──────────────────────────────────────── */

/** Nombres de destino y ciudad que aparecen en el catálogo. */
const terminosDestino = [
  ...new Set([
    ...destinations.map((d) => d.name),
    ...destinations.map((d) => d.country),
    ...packages.flatMap((p) => p.cities),
  ]),
]
  // Los más largos primero: "Río de Janeiro" antes que "Río".
  .sort((a, b) => b.length - a.length);

/**
 * Coincidencia por palabra completa. Con `includes` a secas, "Marte" activaba
 * "mar" y devolvía paquetes de playa: exactamente el tipo de suposición que el
 * copilot no tiene que hacer.
 */
function contienePalabra(textoNormalizado: string, termino: string): boolean {
  const escapado = normalizar(termino).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapado}([^\\p{L}\\p{N}]|$)`, "u").test(textoNormalizado);
}

function detectarDestino(texto: string): string | undefined {
  const t = normalizar(texto);
  return terminosDestino.find((d) => contienePalabra(t, d));
}

function detectarEstilo(texto: string): string | undefined {
  const t = normalizar(texto);
  const sinonimos: Record<string, string> = {
    nieve: "Nieve",
    esqui: "Nieve",
    ski: "Nieve",
    playa: "Playa",
    mar: "Playa",
    caribe: "Playa",
    aventura: "Aventura",
    trekking: "Aventura",
    familia: "Familia",
    chicos: "Familia",
    hijos: "Familia",
    pareja: "Pareja",
    romantico: "Pareja",
    "luna de miel": "Luna de miel",
    gastronomia: "Gastronomía",
    comer: "Gastronomía",
    vino: "Gastronomía",
    cultura: "Cultura",
    museos: "Cultura",
    amigos: "Amigos",
    relax: "Relax",
    descansar: "Relax",
    crucero: "Cruceros",
  };
  // De la clave más larga a la más corta: en "luna de miel en el Caribe" gana
  // "luna de miel", no "caribe".
  const claves = Object.keys(sinonimos).sort((a, b) => b.length - a.length);
  for (const clave of claves) {
    const estilo = sinonimos[clave];
    if (contienePalabra(t, clave) && estilosDisponibles.includes(estilo as never)) return estilo;
  }
  return estilosDisponibles.find((e) => contienePalabra(t, e));
}

function detectarRegion(texto: string): string | undefined {
  const t = normalizar(texto);
  return regionesDisponibles.find((r) => contienePalabra(t, r));
}

/**
 * Presupuesto en dólares. Acepta "1500", "1.500", "USD 1500", "hasta 2000".
 * Descarta números que son claramente otra cosa (un año, una cantidad de
 * noches o de personas).
 */
function detectarPresupuesto(texto: string): number | undefined {
  const t = normalizar(texto);
  const match = t.match(/(?:usd|u\$s|\$|hasta|menos de|maximo|presupuesto de)?\s*([\d][\d.,]{2,})/);
  if (!match) return undefined;
  const crudo = match[1].replace(/[.,]/g, "");
  const valor = Number(crudo);
  if (!Number.isFinite(valor)) return undefined;
  // Un año o un número chico no es un presupuesto.
  if (valor < 100 || (valor >= 2020 && valor <= 2100)) return undefined;
  return valor;
}

function detectarCiudadSalida(texto: string): string | undefined {
  const t = normalizar(texto);
  if (contienePalabra(t, "rosario")) return "Rosario";
  // "capital" a secas no alcanza: en "la capital de Francia" no es la salida.
  if (contienePalabra(t, "buenos aires") || contienePalabra(t, "capital federal") || contienePalabra(t, "caba"))
    return "Buenos Aires";
  return undefined;
}

/* ── Intención ────────────────────────────────────────────────────── */

type Intencion =
  | "saludo"
  | "promociones"
  | "vuelos"
  | "hoteles"
  | "asesor"
  | "solicitud"
  | "destinos"
  | "paquetes"
  | "desconocida";

const contiene = (t: string, palabras: string[]) => palabras.some((p) => t.includes(p));

function detectarIntencion(texto: string): Intencion {
  const t = normalizar(texto);

  if (contiene(t, ["asesor", "humano", "una persona", "alguien", "llamar", "telefono", "whatsapp"]))
    return "asesor";
  if (contiene(t, ["reservar", "cotizar", "cotizacion", "presupuesto para", "me interesa", "quiero avanzar", "como sigo", "contactenme", "contactame"]))
    return "solicitud";
  if (contiene(t, ["promo", "oferta", "descuento", "cuota", "financiacion", "rebaja"]))
    return "promociones";
  if (contiene(t, ["vuelo", "pasaje", "volar", "aereo", "aerea"])) return "vuelos";
  if (contiene(t, ["hotel", "alojamiento", "hospedaje", "resort", "donde dormir", "hosteria"]))
    return "hoteles";
  if (contiene(t, ["no se adonde", "no se a donde", "adonde ir", "a donde ir", "recomenda", "recomienda", "sugeri", "sugiere", "ideas", "opciones de destino"]))
    return "destinos";
  if (contiene(t, ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches"]) && t.length < 30)
    return "saludo";

  if (detectarDestino(texto) || detectarEstilo(texto) || detectarPresupuesto(texto)) return "paquetes";
  if (detectarRegion(texto)) return "destinos";

  return "desconocida";
}

/* ── Ayudas de redacción ──────────────────────────────────────────── */

const NADA: Accion = { tipo: "ninguna" };

/** La aclaración de base va una sola vez por conversación. */
function yaMostroPrecio(mensajes: Mensaje[]): boolean {
  return mensajes.some(
    (m) => m.rol === "asistente" && (m.tarjetas ?? []).some((t) => "desde" in t && t.desde),
  );
}

const BASE_PRECIO =
  "Los precios son por persona, en base doble y orientativos: se confirman al cotizar.";

/** Reúne lo que se dijo en toda la charla, para no volver a preguntarlo. */
function borradorDesdeConversacion(mensajes: Mensaje[]): BorradorSolicitud {
  const delUsuario = mensajes.filter((m) => m.rol === "usuario").map((m) => m.texto.trim());
  const todo = delUsuario.join(" ");
  const presupuesto = detectarPresupuesto(todo);
  // El último mensaje es el que disparó la solicitud ("quiero cotizar"): como
  // nota no aporta nada. Lo que sirve es lo que contó antes.
  const contexto = delUsuario
    .slice(0, -1)
    .filter((t) => detectarIntencion(t) !== "saludo")
    .join(". ");
  return {
    destino: detectarDestino(todo),
    presupuesto: presupuesto ? `Hasta USD ${presupuesto}` : undefined,
    comentario: (contexto || delUsuario.at(-1))?.slice(0, 300),
  };
}

function respuesta(
  texto: string,
  extra: Partial<Omit<RespuestaCopilot, "texto">> = {},
): RespuestaCopilot {
  return {
    texto,
    tarjetas: [],
    sugerencias: [],
    accion: NADA,
    fuente: "guion",
    herramientasUsadas: [],
    ...extra,
  };
}

/**
 * Texto para un resultado de búsqueda. Un solo formato para las cinco
 * herramientas: qué se encontró, con qué criterio, y una única pregunta.
 */
function textoResultados(
  cantidad: number,
  total: number,
  criterio: string,
  cierre: string,
  conPrecio: boolean,
  primeraVez: boolean,
): string {
  if (cantidad === 0) return "";
  const encabezado =
    total > cantidad
      ? `Encontré ${total} opciones para ${criterio}. Te muestro las ${cantidad} más convenientes.`
      : `Encontré ${cantidad === 1 ? "una opción" : `${cantidad} opciones`} para ${criterio}.`;
  const base = conPrecio && primeraVez ? ` ${BASE_PRECIO}` : "";
  return `${encabezado}${base}\n\n${cierre}`;
}

const SIN_RESULTADOS_SUGERENCIAS = ["Ver promociones vigentes", "Armar un viaje a medida", "Hablar con un asesor"];

/* ── Planificador ─────────────────────────────────────────────────── */

export const planificadorReglas: Planificador = {
  nombre: "reglas",

  async responder(mensajes) {
    const ultimo = [...mensajes].reverse().find((m) => m.rol === "usuario");
    if (!ultimo) return respuesta("Contame qué viaje tenés en mente.");

    const texto = ultimo.texto;
    const intencion = detectarIntencion(texto);
    const primerPrecio = !yaMostroPrecio(mensajes);

    switch (intencion) {
      /* ── Saludo ───────────────────────────────────────────────── */
      case "saludo":
        return respuesta(
          "Hola. Contame qué estás buscando: un destino, unas fechas, o simplemente las ganas de irte a algún lado.",
          {
            sugerencias: ["Quiero ir a la nieve", "Playa en familia", "Ver promociones vigentes"],
          },
        );

      /* ── Promociones ──────────────────────────────────────────── */
      case "promociones": {
        const r = verPromociones.ejecutar({});
        if (r.tarjetas.length === 0) {
          return respuesta(
            "Ahora mismo no tengo promociones vigentes cargadas. Un asesor puede contarte qué salidas tienen mejor precio esta semana.",
            { sugerencias: SIN_RESULTADOS_SUGERENCIAS, accion: { tipo: "asesor", motivo: "sin promociones vigentes" } },
          );
        }
        return respuesta(
          textoResultados(
            r.tarjetas.length,
            r.total,
            "promociones vigentes",
            "Las condiciones completas están en cada una. ¿Alguna te sirve o buscamos por destino?",
            true,
            primerPrecio,
          ),
          {
            tarjetas: r.tarjetas,
            sugerencias: ["Buscar por destino", "Hablar con un asesor"],
            fuente: "catalogo",
            herramientasUsadas: [verPromociones.nombre],
          },
        );
      }

      /* ── Vuelos ───────────────────────────────────────────────── */
      case "vuelos": {
        const destino = detectarDestino(texto);
        const origen = detectarCiudadSalida(texto);
        const r = buscarVuelos.ejecutar({ origen, destino });
        if (r.tarjetas.length === 0) {
          return respuesta(
            `No tengo una ruta de referencia${destino ? ` hacia ${destino}` : ""} cargada. Cotizamos cabotaje e internacionales, así que un asesor te consigue el valor real.`,
            { sugerencias: SIN_RESULTADOS_SUGERENCIAS, accion: { tipo: "asesor", motivo: "ruta fuera del catálogo de referencia" } },
          );
        }
        return respuesta(
          textoResultados(
            r.tarjetas.length,
            r.total,
            r.criterio,
            "Son valores de referencia, ida y vuelta. La tarifa final depende de la fecha y la disponibilidad del día. ¿Para cuándo lo estarías necesitando?",
            true,
            primerPrecio,
          ),
          {
            tarjetas: r.tarjetas,
            sugerencias: ["Quiero cotizarlo", "Hablar con un asesor"],
            fuente: "catalogo",
            herramientasUsadas: [buscarVuelos.nombre],
          },
        );
      }

      /* ── Hoteles ──────────────────────────────────────────────── */
      case "hoteles": {
        const destino = detectarDestino(texto);
        const r = buscarHoteles.ejecutar({ destino });
        if (r.tarjetas.length === 0) {
          return respuesta(
            `No tengo hoteles cargados${destino ? ` en ${destino}` : ""}. Trabajamos con muchos más de los que están publicados: un asesor te arma opciones.`,
            { sugerencias: SIN_RESULTADOS_SUGERENCIAS, accion: { tipo: "asesor", motivo: "hotel fuera del catálogo publicado" } },
          );
        }
        return respuesta(
          textoResultados(
            r.tarjetas.length,
            r.total,
            r.criterio,
            "El precio es por noche. ¿Querés que lo veamos como paquete con aéreo y traslados incluidos?",
            true,
            primerPrecio,
          ),
          {
            tarjetas: r.tarjetas,
            sugerencias: ["Verlo como paquete", "Hablar con un asesor"],
            fuente: "catalogo",
            herramientasUsadas: [buscarHoteles.nombre],
          },
        );
      }

      /* ── Destinos ─────────────────────────────────────────────── */
      case "destinos": {
        const r = buscarDestinos.ejecutar({
          region: detectarRegion(texto),
          estilo: detectarEstilo(texto),
          precioMaximo: detectarPresupuesto(texto),
        });
        if (r.tarjetas.length === 0) {
          return respuesta(
            "Con esos filtros no me quedó ningún destino. Si me decís en qué mes podés viajar y con cuánto contás, lo busco de nuevo.",
            { sugerencias: SIN_RESULTADOS_SUGERENCIAS },
          );
        }
        return respuesta(
          textoResultados(
            r.tarjetas.length,
            r.total,
            r.criterio,
            "¿Cuál te tienta? Con eso te busco los paquetes que salen para ahí.",
            true,
            primerPrecio,
          ),
          {
            tarjetas: r.tarjetas,
            sugerencias: r.tarjetas.slice(0, 2).map((t) => ("nombre" in t ? `Paquetes a ${t.nombre}` : "Ver paquetes")),
            fuente: "catalogo",
            herramientasUsadas: [buscarDestinos.nombre],
          },
        );
      }

      /* ── Paquetes ─────────────────────────────────────────────── */
      case "paquetes": {
        const destino = detectarDestino(texto);
        const estilo = detectarEstilo(texto);
        const precioMaximo = detectarPresupuesto(texto);
        const r = buscarPaquetes.ejecutar({
          destino,
          estilo,
          precioMaximo,
          ciudadSalida: detectarCiudadSalida(texto),
        });

        if (r.tarjetas.length === 0) {
          const alternativa = buscarDestinos.ejecutar({ estilo, precioMaximo });
          if (alternativa.tarjetas.length > 0) {
            return respuesta(
              `No tengo un paquete armado para ${r.criterio}. Estos destinos sí entran en lo que buscás, y podemos armar el viaje a medida.`,
              {
                tarjetas: alternativa.tarjetas,
                sugerencias: ["Armar un viaje a medida", "Hablar con un asesor"],
                fuente: "catalogo",
                herramientasUsadas: [buscarPaquetes.nombre, buscarDestinos.nombre],
              },
            );
          }
          return respuesta(
            `No tengo un paquete armado para ${r.criterio}. Eso no quiere decir que no se pueda: armamos viajes a medida y un asesor te cotiza sin cargo.`,
            {
              sugerencias: SIN_RESULTADOS_SUGERENCIAS,
              accion: { tipo: "asesor", motivo: `sin paquetes para ${r.criterio}` },
              herramientasUsadas: [buscarPaquetes.nombre],
            },
          );
        }

        return respuesta(
          textoResultados(
            r.tarjetas.length,
            r.total,
            r.criterio,
            "Cada una incluye aéreo, alojamiento y traslados salvo que diga lo contrario. ¿Te preparo una solicitud con alguna?",
            true,
            primerPrecio,
          ),
          {
            tarjetas: r.tarjetas,
            sugerencias: ["Quiero cotizar una", "Ver más opciones", "Hablar con un asesor"],
            fuente: "catalogo",
            herramientasUsadas: [buscarPaquetes.nombre],
          },
        );
      }

      /* ── Solicitud ────────────────────────────────────────────── */
      case "solicitud":
        return respuesta(
          "Perfecto. Te dejo el formulario con lo que ya me contaste cargado: completá el contacto y un asesor te responde en menos de 24 horas hábiles.",
          {
            accion: { tipo: "solicitud", borrador: borradorDesdeConversacion(mensajes) },
          },
        );

      /* ── Asesor ───────────────────────────────────────────────── */
      case "asesor":
        return respuesta(
          "Te paso con alguien del equipo. Atienden de lunes a viernes de 9 a 18 y sábados de 9 a 13.",
          { accion: { tipo: "asesor", motivo: "lo pidió el viajero" } },
        );

      /* ── No entendí ───────────────────────────────────────────── */
      default:
        return respuesta(
          "No estoy seguro de haber entendido. Puedo buscar paquetes, destinos, hoteles, vuelos y promociones del catálogo. Si es algo más puntual, te paso con un asesor.",
          {
            sugerencias: ["Ver promociones vigentes", "Buscar por destino", "Hablar con un asesor"],
          },
        );
    }
  },
};

/** Se exporta para poder testear la clasificación sin levantar el chat. */
export const _internos = { detectarIntencion, detectarDestino, detectarEstilo, detectarPresupuesto };

export type { Tarjeta };
