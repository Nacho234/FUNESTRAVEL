import { NextResponse } from "next/server";
import { obtenerPlanificador } from "@/lib/copilot";
import type { Mensaje } from "@/lib/copilot/types";

/**
 * Endpoint del copilot.
 *
 * Recibe el historial y devuelve la próxima respuesta. Es el único lugar donde
 * va a vivir la clave del modelo cuando se conecte: nunca del lado del cliente.
 *
 * PENDIENTE antes de abrirlo al público: límite de uso por IP. Sin eso,
 * cualquiera puede consumir la cuota desde una consola.
 */

/** Tope defensivo: el historial completo llega en cada pedido. */
const MAX_MENSAJES = 40;
const MAX_LARGO_TEXTO = 1000;

function esMensaje(v: unknown): v is Mensaje {
  if (typeof v !== "object" || v === null) return false;
  const m = v as Record<string, unknown>;
  return (
    typeof m.texto === "string" &&
    m.texto.length <= MAX_LARGO_TEXTO &&
    (m.rol === "usuario" || m.rol === "asistente")
  );
}

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo del pedido no es JSON válido." }, { status: 400 });
  }

  const mensajes = (cuerpo as { mensajes?: unknown })?.mensajes;
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return NextResponse.json({ error: "Falta el historial de mensajes." }, { status: 400 });
  }
  if (mensajes.length > MAX_MENSAJES) {
    return NextResponse.json(
      { error: "La conversación es demasiado larga. Empezá una nueva o hablá con un asesor." },
      { status: 413 },
    );
  }
  if (!mensajes.every(esMensaje)) {
    return NextResponse.json({ error: "Hay mensajes con un formato inesperado." }, { status: 400 });
  }

  const planificador = obtenerPlanificador();

  try {
    const respuesta = await planificador.responder(mensajes);
    return NextResponse.json({ ...respuesta, planificador: planificador.nombre });
  } catch (error) {
    // El detalle queda en el servidor; al viajero se le da una salida útil.
    console.error("[copilot] falló el planificador:", error);
    return NextResponse.json(
      {
        error:
          "No pude procesar tu consulta. Escribinos por WhatsApp y te responde una persona del equipo.",
      },
      { status: 500 },
    );
  }
}
