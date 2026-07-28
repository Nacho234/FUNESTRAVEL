/**
 * Contrato del copilot de Funes Travel.
 *
 * Todo lo que el bot puede decir pasa por `RespuestaCopilot`. Ese tipo es el
 * mismo para el planificador por reglas de hoy y para el modelo de lenguaje que
 * se conecte después: cambiar de uno a otro no toca la interfaz ni la UI.
 */

/* ── Conversación ─────────────────────────────────────────────────── */

export type Rol = "usuario" | "asistente";

export interface Mensaje {
  id: string;
  rol: Rol;
  texto: string;
  /** Resultados del catálogo que acompañan al texto. */
  tarjetas?: Tarjeta[];
  /** Respuestas rápidas ofrecidas al viajero. */
  sugerencias?: string[];
  /** Qué le pide el bot a la interfaz que muestre, si algo. */
  accion?: Accion;
  /**
   * De dónde salió la información. `catalogo` = leída con una herramienta;
   * `guion` = texto fijo del asistente. Nunca hay una tercera opción: el bot
   * no puede afirmar un dato que no vino de una de las dos.
   */
  fuente: Fuente;
  enviadoEn: string;
}

export type Fuente = "catalogo" | "guion";

/** Lo que la interfaz debe ofrecer después del mensaje. */
export type Accion =
  | { tipo: "solicitud"; borrador: BorradorSolicitud }
  | { tipo: "asesor"; motivo: string }
  | { tipo: "ninguna" };

/**
 * Preferencias de viaje que el bot reunió. Deliberadamente NO incluye datos
 * personales: el nombre, el mail y el teléfono los toma el formulario del lado
 * del servidor, sin pasar por el modelo. Ver `prompt.ts`.
 */
export interface BorradorSolicitud {
  destino?: string;
  fechaAproximada?: string;
  viajeros?: string;
  presupuesto?: string;
  comentario?: string;
}

/* ── Tarjetas de resultado ────────────────────────────────────────── */

export type Tarjeta =
  | { tipo: "paquete"; slug: string; nombre: string; resumen: string; noches: number; desde: string; salida: string; href: string; imagen: string }
  | { tipo: "destino"; slug: string; nombre: string; pais: string; resumen: string; desde: string; temporada: string; href: string; imagen: string }
  | { tipo: "hotel"; slug: string; nombre: string; destino: string; estrellas: number; desde: string; href: string; imagen: string }
  | { tipo: "promocion"; id: string; titulo: string; detalle: string; vence: string; desde?: string; href: string }
  | { tipo: "vuelo"; id: string; origen: string; destino: string; tipoVuelo: string; duracion: string; desde: string; href: string };

/* ── Herramientas ─────────────────────────────────────────────────── */

/**
 * Una herramienta lee el catálogo y devuelve tarjetas. El bot nunca redacta un
 * precio ni una fecha de memoria: los toma de acá.
 *
 * `esquema` es el JSON Schema que se le pasa al modelo cuando se conecte. Está
 * escrito ya para no tener que derivarlo después.
 */
export interface Herramienta<A = Record<string, unknown>> {
  nombre: string;
  descripcion: string;
  esquema: EsquemaJson;
  ejecutar: (args: A) => ResultadoHerramienta;
}

export interface ResultadoHerramienta {
  tarjetas: Tarjeta[];
  /** Cuántos resultados había en total, antes de recortar. */
  total: number;
  /** Resumen legible del filtro aplicado, para que el bot lo cite. */
  criterio: string;
}

export interface EsquemaJson {
  type: "object";
  properties: Record<string, PropiedadEsquema>;
  required?: string[];
  additionalProperties: false;
}

export interface PropiedadEsquema {
  type: "string" | "number" | "integer" | "boolean";
  description: string;
  enum?: string[];
}

/* ── Planificador ─────────────────────────────────────────────────── */

/**
 * La costura entre "cómo se decide qué responder" y todo lo demás.
 *
 * Hoy hay una sola implementación, por reglas. Conectar DeepSeek es escribir
 * una segunda que cumpla esta interfaz; la ruta de API, las herramientas, el
 * prompt y la interfaz quedan igual.
 */
export interface Planificador {
  /** Aparece en la respuesta para saber quién contestó. */
  nombre: string;
  responder: (mensajes: Mensaje[]) => Promise<RespuestaCopilot>;
}

export interface RespuestaCopilot {
  texto: string;
  tarjetas: Tarjeta[];
  sugerencias: string[];
  accion: Accion;
  fuente: Fuente;
  /** Herramientas que se ejecutaron para armar esta respuesta. */
  herramientasUsadas: string[];
}
