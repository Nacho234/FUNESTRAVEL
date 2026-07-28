import type { Planificador } from "./types";

/**
 * Planificador con modelo de lenguaje. TODAVÍA NO CONECTADO.
 *
 * Este archivo es la única pieza que falta para que el copilot deje de ser
 * determinista. Todo lo demás —herramientas, prompt, contrato de respuesta,
 * ruta de API e interfaz— ya está y no cambia.
 *
 * ── Qué hay que hacer para conectarlo ───────────────────────────────
 *
 * 1. `npm install openai` — la API de DeepSeek es compatible con OpenAI, así
 *    que se usa ese SDK apuntando a otro host.
 *
 * 2. Variables de entorno (ver .env.example):
 *      DEEPSEEK_API_KEY=...
 *      COPILOT_PLANIFICADOR=deepseek
 *
 * 3. Implementar `responder` con este bucle:
 *
 *      const cliente = new OpenAI({
 *        apiKey: process.env.DEEPSEEK_API_KEY,
 *        // `/beta` habilita strict mode: el modelo respeta el JSON Schema
 *        // de cada herramienta al pie de la letra.
 *        baseURL: "https://api.deepseek.com/beta",
 *      });
 *
 *      a. Mandar PROMPT_SISTEMA como mensaje `system`, el historial como
 *         `user`/`assistant`, y `definicionesParaModelo` como `tools`.
 *      b. Si la respuesta trae `tool_calls`, ejecutar cada una con
 *         `herramientas[nombre].ejecutar(args)` y devolver el resultado como
 *         mensaje `tool`. Repetir hasta que no pida más herramientas.
 *      c. Armar la `RespuestaCopilot`: el texto del modelo, las tarjetas que
 *         devolvieron las herramientas, y `fuente: "catalogo"` si se usó
 *         alguna.
 *
 * 4. Modelos: `deepseek-v4-flash` para el copilot público, que es el de
 *    volumen. `deepseek-v4-pro` conviene sólo si el interno necesita más
 *    criterio.
 *
 * ── Lo que NO hay que hacer ─────────────────────────────────────────
 *
 * · No dejar que el modelo redacte precios: siempre salen de las tarjetas que
 *   devuelve la herramienta. El texto del modelo los menciona, no los produce.
 * · No mandar datos personales en el prompt. El nombre, el mail y el teléfono
 *   los toma el formulario del lado del servidor. Ver la nota en `prompt.ts`.
 * · No exponer la clave al cliente: la llamada vive en la ruta de API.
 * · Falta límite de uso por IP antes de abrir esto al público.
 */
export const planificadorDeepSeek: Planificador = {
  nombre: "deepseek",
  async responder() {
    throw new Error(
      "El planificador DeepSeek todavía no está implementado. " +
        "Quitá COPILOT_PLANIFICADOR=deepseek para volver al planificador por reglas, " +
        "o seguí las instrucciones de src/lib/copilot/planner-deepseek.ts.",
    );
  },
};
