import type { Planificador } from "./types";
import { planificadorReglas } from "./planner-rules";
import { planificadorDeepSeek } from "./planner-deepseek";

/**
 * Elige quién contesta. Por defecto, el planificador por reglas: funciona sin
 * clave de API y sin costo por conversación.
 *
 * Se cambia con COPILOT_PLANIFICADOR=deepseek en el entorno.
 */
export function obtenerPlanificador(): Planificador {
  return process.env.COPILOT_PLANIFICADOR === "deepseek"
    ? planificadorDeepSeek
    : planificadorReglas;
}

export { PROMPT_SISTEMA, SALUDO_INICIAL, SUGERENCIAS_INICIALES, NOTA_PRIVACIDAD } from "./prompt";
export { herramientas, definicionesParaModelo } from "./tools";
export type * from "./types";
