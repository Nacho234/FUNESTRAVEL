"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  BedIcon,
  CaretRightIcon,
  ChatCircleTextIcon,
  LockSimpleIcon,
  MapPinIcon,
  MinusIcon,
  NotePencilIcon,
  PackageIcon,
  PaperPlaneRightIcon,
  SnowflakeIcon,
  SparkleIcon,
  StarIcon,
  UmbrellaIcon,
  UserCircleIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { Accion, Mensaje, RespuestaCopilot, Tarjeta } from "@/lib/copilot/types";
import { NOTA_PRIVACIDAD, SALUDO_INICIAL, SUGERENCIAS_INICIALES } from "@/lib/copilot/prompt";

/**
 * Asistente de viajes: panel flotante, no modal.
 *
 * Vive anclado a la esquina inferior derecha, por encima del botón de WhatsApp,
 * y deja la web usable detrás: sin overlay, sin bloqueo de scroll y sin capturar
 * los clics del fondo. Es una decisión de producto, no un detalle de estilo — el
 * viajero tiene que poder seguir mirando el paquete mientras pregunta por él.
 *
 * Renderiza la `RespuestaCopilot` que devuelve `/api/copilot`: texto, tarjetas
 * de catálogo, sugerencias y acción. Es agnóstico de quién la produjo, así que
 * conectar el modelo no le cambia una línea.
 */

const WHATSAPP =
  "https://wa.me/5493415550123?text=Hola,%20vengo%20del%20asistente%20de%20la%20web%20y%20quiero%20hablar%20con%20un%20asesor.";

/** La charla sobrevive a la navegación y a un F5, pero no al cierre de la pestaña. */
const CLAVE_MEMORIA = "funes-copilot-v1";

/** Tiempos del aviso: aparece con la página ya asentada y se retira solo. */
const DEMORA_AVISO = 1400;
const DURACION_AVISO = 7000;

const nuevoId = () => Math.random().toString(36).slice(2, 10);

function mensajeInicial(): Mensaje {
  return {
    id: nuevoId(),
    rol: "asistente",
    texto: SALUDO_INICIAL,
    sugerencias: SUGERENCIAS_INICIALES,
    fuente: "guion",
    enviadoEn: new Date().toISOString(),
  };
}

function leerMemoria(): Mensaje[] {
  // En el servidor no hay sesión; el panel arranca cerrado, así que este estado
  // no se renderiza en el HTML inicial y no hay riesgo de desajuste al hidratar.
  if (typeof window === "undefined") return [mensajeInicial()];
  try {
    const crudo = window.sessionStorage.getItem(CLAVE_MEMORIA);
    if (!crudo) return [mensajeInicial()];
    const guardados = JSON.parse(crudo) as Mensaje[];
    return Array.isArray(guardados) && guardados.length > 0 ? guardados : [mensajeInicial()];
  } catch {
    return [mensajeInicial()];
  }
}

/* ── Separador de día ─────────────────────────────────────────────── */

const soloDia = (iso: string) => new Date(iso).toDateString();

function etiquetaDia(iso: string): string {
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const dia = soloDia(iso);
  if (dia === hoy.toDateString()) return "Hoy";
  if (dia === ayer.toDateString()) return "Ayer";
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

/* ── Sugerencias ──────────────────────────────────────────────────── */

/**
 * Ícono de cada sugerencia, deducido del texto. Las sugerencias las escribe el
 * planificador, así que no puede haber una tabla fija: se busca por palabra y
 * hay un ícono neutro de respaldo.
 */
const ICONOS_SUGERENCIA: [RegExp, typeof StarIcon, string][] = [
  [/nieve|esqu|ski/i, SnowflakeIcon, "text-teal-600"],
  [/promo|oferta|descuento|cuota/i, StarIcon, "text-warning-700"],
  [/playa|caribe|mar\b/i, UmbrellaIcon, "text-coral-600"],
  [/asesor|persona|humano/i, UserCircleIcon, "text-petrol-700"],
  [/vuelo|aére|aere/i, AirplaneTiltIcon, "text-teal-600"],
  [/hotel|alojamiento/i, BedIcon, "text-petrol-700"],
  [/cotiz|solicitud|medida/i, NotePencilIcon, "text-coral-600"],
  [/destino|adónde|adonde/i, MapPinIcon, "text-teal-600"],
  [/paquete|opcion/i, PackageIcon, "text-petrol-700"],
];

function IconoSugerencia({ texto }: { texto: string }) {
  const encontrado = ICONOS_SUGERENCIA.find(([re]) => re.test(texto));
  const [, Icono, color] = encontrado ?? [null, ChatCircleTextIcon, "text-graphite-400"];
  return <Icono weight="fill" className={`size-4 shrink-0 ${color}`} aria-hidden />;
}

/* ── Tarjetas de resultado ────────────────────────────────────────── */

const TARJETA =
  "group relative flex items-center gap-3 rounded-xl border border-graphite-100 bg-white p-2 pr-7 transition-all duration-200 hover:border-teal-500/50 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40";

function Flecha() {
  return (
    <CaretRightIcon
      weight="bold"
      aria-hidden
      className="absolute right-2 size-3.5 text-graphite-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-teal-600"
    />
  );
}

function Precio({ valor, unidad }: { valor: string; unidad?: string }) {
  return (
    <span className="shrink-0 text-right">
      <span className="block text-[0.625rem] uppercase tracking-[0.08em] text-graphite-400">Desde</span>
      <span className="tabular block text-[0.8125rem] font-bold leading-tight text-coral-600">{valor}</span>
      {unidad && <span className="block text-[0.625rem] text-graphite-400">{unidad}</span>}
    </span>
  );
}

function TarjetaResultado({ tarjeta }: { tarjeta: Tarjeta }) {
  if (tarjeta.tipo === "promocion") {
    return (
      <Link href={tarjeta.href} className={TARJETA}>
        <span
          className="grid size-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-700 text-white"
          aria-hidden
        >
          <SparkleIcon weight="fill" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] font-bold leading-snug text-petrol-900">
            {tarjeta.titulo}
          </span>
          <span className="mt-0.5 block truncate text-[0.6875rem] text-graphite-500">{tarjeta.detalle}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.625rem] font-semibold text-coral-700">
            <span className="whitespace-nowrap rounded-full bg-coral-50 px-1.5 py-0.5">Hasta el {tarjeta.vence}</span>
            {tarjeta.desde && <span className="tabular whitespace-nowrap">desde {tarjeta.desde}</span>}
          </span>
        </span>
        <Flecha />
      </Link>
    );
  }

  if (tarjeta.tipo === "vuelo") {
    return (
      <Link href={tarjeta.href} className={TARJETA}>
        <span className="min-w-0 flex-1 pl-1">
          <span className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-petrol-900">
            {tarjeta.origen}
            <ArrowRightIcon weight="bold" className="size-3 text-teal-600" aria-hidden />
            {tarjeta.destino}
          </span>
          <span className="mt-0.5 block truncate text-[0.6875rem] text-graphite-500">
            {tarjeta.tipoVuelo} · {tarjeta.duracion}
          </span>
        </span>
        <Precio valor={tarjeta.desde} unidad="ida y vuelta" />
        <Flecha />
      </Link>
    );
  }

  // Paquete, destino y hotel comparten forma: foto + título + precio.
  const { imagen, nombre, href, desde } = tarjeta;
  const detalle =
    tarjeta.tipo === "paquete"
      ? `${tarjeta.noches} noches · sale de ${tarjeta.salida}`
      : tarjeta.tipo === "destino"
        ? tarjeta.pais
        : `${tarjeta.destino} · ${tarjeta.estrellas}★`;

  return (
    <Link href={href} className={TARJETA}>
      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-sand-50">
        <Image src={imagen} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-bold leading-snug text-petrol-900">{nombre}</span>
        <span className="mt-0.5 block truncate text-[0.6875rem] text-graphite-500">{detalle}</span>
      </span>
      <Precio valor={desde} unidad={tarjeta.tipo === "hotel" ? "por noche" : "por persona"} />
      <Flecha />
    </Link>
  );
}

/* ── Acción al pie de un mensaje ──────────────────────────────────── */

function BloqueAccion({ accion }: { accion: Accion }) {
  if (accion.tipo === "asesor") {
    return (
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-positive-700 px-4 text-[0.8125rem] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <WhatsappLogoIcon weight="fill" className="size-4" aria-hidden />
        Hablar con un asesor
      </a>
    );
  }

  if (accion.tipo === "solicitud") {
    // El formulario existente toma los datos de contacto. El modelo nunca los ve.
    const { destino, presupuesto, comentario } = accion.borrador;
    const params = new URLSearchParams();
    if (destino) params.set("destino", destino);
    if (presupuesto) params.set("presupuesto", presupuesto);
    if (comentario) params.set("nota", comentario);
    const href = `/viajes-a-medida${params.size ? `?${params}` : ""}`;
    return (
      <div className="mt-2.5">
        <Link
          href={href}
          className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-4 text-[0.8125rem] font-bold text-white shadow-[var(--shadow-lift)] transition-colors hover:bg-coral-600 active:scale-[0.98]"
        >
          Completar mi solicitud
          <ArrowRightIcon
            weight="bold"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <p className="mt-1.5 text-[0.6875rem] leading-snug text-graphite-400">{NOTA_PRIVACIDAD}</p>
      </div>
    );
  }

  return null;
}

/* ── Widget ───────────────────────────────────────────────────────── */

export function CopilotWidget() {
  const reduce = useReducedMotion() ?? false;
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>(leerMemoria);
  const [pensando, setPensando] = useState(false);
  const [borrador, setBorrador] = useState("");
  const finRef = useRef<HTMLDivElement>(null);
  const entradaRef = useRef<HTMLInputElement>(null);
  const lanzadorRef = useRef<HTMLButtonElement>(null);
  const devolverFoco = useRef(false);

  /**
   * Aviso de bienvenida. Aparece solo, se retira solo hacia el lanzador y el
   * botón queda atenuado: está a mano sin competir con la página.
   *
   * Se muestra una vez por carga de página. No hace falta guardarlo en ningún
   * lado: el widget vive en el layout, así que navegar por el sitio no lo
   * vuelve a montar y el aviso no se repite mientras el visitante recorre las
   * páginas. Sólo vuelve si recarga de verdad, que es cuando corresponde.
   */
  const [aviso, setAviso] = useState<"pendiente" | "visible" | "retirado">("pendiente");

  const retirarAviso = useCallback(() => setAviso("retirado"), []);

  useEffect(() => {
    if (aviso !== "pendiente") return;
    const aparecer = window.setTimeout(() => setAviso("visible"), DEMORA_AVISO);
    return () => window.clearTimeout(aparecer);
  }, [aviso]);

  useEffect(() => {
    if (aviso !== "visible") return;
    const irse = window.setTimeout(retirarAviso, DURACION_AVISO);
    return () => window.clearTimeout(irse);
  }, [aviso, retirarAviso]);

  /**
   * Al cerrar, el foco vuelve al lanzador. No se puede hacer en el mismo
   * momento del cierre: mientras el panel está abierto el lanzador no existe,
   * así que hay que esperar a que vuelva a montarse.
   */
  const minimizar = useCallback(() => {
    devolverFoco.current = true;
    setAbierto(false);
  }, []);

  /** Cerrar además descarta la charla: la próxima vez se arranca de cero. */
  const cerrar = useCallback(() => {
    devolverFoco.current = true;
    setAbierto(false);
    setMensajes([mensajeInicial()]);
    setBorrador("");
  }, []);

  useEffect(() => {
    if (abierto || !devolverFoco.current) return;
    devolverFoco.current = false;
    lanzadorRef.current?.focus();
  }, [abierto]);

  // Guardar la charla es sincronizar con un sistema externo: va en un efecto.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(CLAVE_MEMORIA, JSON.stringify(mensajes));
    } catch {
      // Sesión llena o bloqueada: la charla sigue viva en memoria.
    }
  }, [mensajes]);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "end" });
  }, [mensajes, pensando, abierto, reduce]);

  useEffect(() => {
    if (abierto) entradaRef.current?.focus();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") minimizar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto, minimizar]);

  const enviar = useCallback(
    async (texto: string) => {
      const limpio = texto.trim();
      if (!limpio || pensando) return;

      const delUsuario: Mensaje = {
        id: nuevoId(),
        rol: "usuario",
        texto: limpio,
        fuente: "guion",
        enviadoEn: new Date().toISOString(),
      };
      const historial = [...mensajes, delUsuario];
      setMensajes(historial);
      setBorrador("");
      setPensando(true);

      try {
        const res = await fetch("/api/copilot", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            // Sólo lo que el planificador necesita: sin tarjetas ni acciones.
            mensajes: historial.map((m) => ({ rol: m.rol, texto: m.texto })),
          }),
        });

        if (!res.ok) {
          const { error } = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(error ?? "No se pudo contactar al asistente.");
        }

        const r = (await res.json()) as RespuestaCopilot;
        setMensajes((previos) => [
          ...previos,
          {
            id: nuevoId(),
            rol: "asistente",
            texto: r.texto,
            tarjetas: r.tarjetas,
            sugerencias: r.sugerencias,
            accion: r.accion,
            fuente: r.fuente,
            enviadoEn: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setMensajes((previos) => [
          ...previos,
          {
            id: nuevoId(),
            rol: "asistente",
            texto:
              error instanceof Error
                ? error.message
                : "No pude procesar tu consulta. Probá de nuevo o escribinos por WhatsApp.",
            accion: { tipo: "asesor", motivo: "error del asistente" },
            fuente: "guion",
            enviadoEn: new Date().toISOString(),
          },
        ]);
      } finally {
        setPensando(false);
      }
    },
    [mensajes, pensando],
  );

  const ultimo = mensajes.at(-1);
  const sugerenciasVivas = !pensando && ultimo?.rol === "asistente" ? (ultimo.sugerencias ?? []) : [];

  const controlCabecera =
    "grid size-8 cursor-pointer place-items-center rounded-lg text-petrol-100 transition-colors hover:bg-white/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-100";

  return (
    <>
      {/* Aviso de bienvenida. Se va solo hacia el lanzador, para que quede claro
          de dónde salió y adónde volver a buscarlo. */}
      <AnimatePresence>
        {aviso === "visible" && !abierto && (
          <motion.div
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : // Se encoge contra su esquina inferior izquierda —donde está el
                  // botón— y cae sobre él.
                  { opacity: 0, scale: 0.25, y: 46, x: -8 }
            }
            transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom left" }}
            className="pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-5 z-40 w-[min(19rem,calc(100vw-2.5rem))] rounded-[var(--radius-card)] bg-petrol-900 p-3.5 pr-9 text-ivory shadow-[var(--shadow-float)]"
          >
            <p className="font-display text-[0.875rem] font-bold leading-snug">Soy tu asistente de viajes</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-petrol-100">
              Puedo buscarte paquetes, vuelos, hoteles y promociones reales del catálogo. Estoy acá abajo
              cuando me necesites.
            </p>
            <button
              type="button"
              onClick={retirarAviso}
              aria-label="Descartar el aviso del asistente"
              className="pointer-events-auto absolute right-1.5 top-1.5 grid size-7 cursor-pointer place-items-center rounded-full text-petrol-100 transition-colors hover:bg-white/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-100"
            >
              <XIcon weight="bold" className="size-3.5" aria-hidden />
            </button>
            {/* Pico apuntando al botón. */}
            <span
              className="absolute -bottom-1.5 left-6 size-3 rotate-45 rounded-[0.125rem] bg-petrol-900"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lanzador. Desaparece con el panel abierto: el cierre vive en la
          cabecera. Atenuado una vez retirado el aviso, para no competir con la
          página; recupera opacidad al apuntarlo o al recibir el foco. */}
      <AnimatePresence>
        {!abierto && (
          <motion.button
            ref={lanzadorRef}
            type="button"
            onClick={() => {
              retirarAviso();
              setAbierto(true);
            }}
            aria-expanded={false}
            aria-controls="copilot-panel"
            aria-label="Abrir el asistente de viajes"
            /* El valor inicial no puede depender de `reduce`: en el servidor
               `useReducedMotion()` siempre devuelve false, así que branquear acá
               hace que el HTML del servidor y el del cliente no coincidan. Lo
               que se apaga es la duración, no el estado de partida. */
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: aviso === "retirado" ? 0.62 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
            /* El hover va por Motion y no por CSS: el `transform` en línea que
               escribe Motion le gana a cualquier clase de escala. */
            whileHover={{ opacity: 1, scale: reduce ? 1 : 1.05 }}
            whileFocus={{ opacity: 1 }}
            whileTap={{ scale: reduce ? 1 : 0.97 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            /* Sin círculo: sólo el ícono. La sombra proyectada lo despega de
               las fotos oscuras, donde el robot —teal oscuro— se perdería. */
            className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-5 z-40 grid size-16 cursor-pointer place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Image
              src="/images/copilot-robot.png"
              alt=""
              width={128}
              height={128}
              className="size-16 [filter:drop-shadow(0_2px_4px_rgb(14_58_71/0.25))_drop-shadow(0_8px_20px_rgb(14_58_71/0.35))]"
              priority
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id="copilot-panel"
            role="dialog"
            aria-label="Asistente de viajes de Funes Travel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.97 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom left" }}
            /* Tarjeta anclada abajo a la izquierda, en móvil y en escritorio.
               En el celular no ocupa el ancho completo: deja ver la página al
               costado, para que se sienta parte del sitio y no una app aparte.
               El ancho no baja de lo que necesitan las tarjetas de resultado
               (foto + título + precio) para seguir siendo legibles. */
            className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 z-40 flex max-h-[58dvh] w-[min(20rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-float)] ring-1 ring-graphite-100 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:left-5 sm:max-h-[min(38rem,calc(100dvh-7rem))] sm:w-[25rem]"
          >
            {/* Cabecera */}
            <div className="flex items-center gap-3 bg-petrol-900 px-4 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ivory" aria-hidden>
                <Image src="/images/copilot-robot.png" alt="" width={64} height={64} className="size-8" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[0.9375rem] font-bold leading-tight text-ivory">
                  Asistente de viajes
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.6875rem] text-petrol-100">
                  <span className="size-1.5 rounded-full bg-positive-100" aria-hidden />
                  Online
                </p>
              </div>
              <button
                type="button"
                onClick={minimizar}
                aria-label="Minimizar el asistente, sin perder la conversación"
                title="Minimizar"
                className={controlCabecera}
              >
                <MinusIcon weight="bold" className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar el asistente y empezar una conversación nueva"
                title="Cerrar y empezar de nuevo"
                className={controlCabecera}
              >
                <XIcon weight="bold" className="size-4" aria-hidden />
              </button>
            </div>

            {/* Hilo */}
            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-white px-4 py-4">
              {mensajes.map((m, i) => {
                const previo = mensajes[i - 1];
                const nuevoDia = !previo || soloDia(previo.enviadoEn) !== soloDia(m.enviadoEn);
                return (
                  <div key={m.id} className="space-y-3">
                    {nuevoDia && i > 0 && (
                      <p className="pt-1 text-center text-[0.6875rem] text-graphite-400">
                        {etiquetaDia(m.enviadoEn)}
                      </p>
                    )}
                    <div className={m.rol === "usuario" ? "flex justify-end" : ""}>
                      <div className={m.rol === "usuario" ? "max-w-[85%]" : "w-full"}>
                        <div
                          className={
                            m.rol === "usuario"
                              ? "rounded-2xl rounded-br-md bg-petrol-900 px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ivory"
                              : "whitespace-pre-line rounded-2xl rounded-tl-md bg-petrol-50 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-graphite-800"
                          }
                        >
                          {m.texto}
                        </div>

                        {m.tarjetas && m.tarjetas.length > 0 && (
                          <div className="mt-2.5 space-y-1.5">
                            {m.tarjetas.map((t, j) => (
                              <TarjetaResultado key={`${m.id}-${j}`} tarjeta={t} />
                            ))}
                          </div>
                        )}

                        {m.accion && <BloqueAccion accion={m.accion} />}
                      </div>
                    </div>
                    {/* El primer mensaje lleva el separador debajo, como apertura
                        de la charla del día. */}
                    {i === 0 && (
                      <p className="text-center text-[0.6875rem] text-graphite-400">{etiquetaDia(m.enviadoEn)}</p>
                    )}
                  </div>
                );
              })}

              {/* Sugerencias del último turno, dentro del hilo: son la respuesta
                  esperable, no un accesorio. */}
              {sugerenciasVivas.length > 0 && (
                <div className="flex flex-col items-start gap-2 pt-0.5">
                  {sugerenciasVivas.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => enviar(s)}
                      className="flex min-h-11 max-w-full cursor-pointer items-center gap-2.5 rounded-full border border-graphite-200 bg-white px-4 text-left text-[0.8125rem] font-medium text-graphite-700 transition-all hover:border-teal-500 hover:bg-teal-50 hover:text-petrol-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 active:scale-[0.98]"
                    >
                      <IconoSugerencia texto={s} />
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </div>
              )}

              {pensando && (
                <p className="flex items-center gap-2 text-[0.8125rem] text-graphite-500" aria-live="polite">
                  Buscando en el catálogo
                  <span className="flex gap-1" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-teal-500"
                        animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                </p>
              )}

              <div ref={finRef} />
            </div>

            {/* Entrada */}
            <div className="shrink-0 border-t border-graphite-100 bg-white px-4 pb-3 pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void enviar(borrador);
                }}
                className="flex items-center gap-2 rounded-[var(--radius-control)] border border-graphite-200 bg-white py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
              >
                <label htmlFor="copilot-entrada" className="sr-only">
                  Escribí tu consulta
                </label>
                <input
                  id="copilot-entrada"
                  ref={entradaRef}
                  value={borrador}
                  onChange={(e) => setBorrador(e.target.value)}
                  placeholder="¿A dónde querés ir?"
                  maxLength={1000}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2 text-[0.8125rem] text-graphite-800 placeholder:text-graphite-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!borrador.trim() || pensando}
                  aria-label="Enviar consulta"
                  className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-coral-500 text-white transition-all hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/50 active:scale-95 disabled:cursor-not-allowed disabled:bg-graphite-200"
                >
                  <PaperPlaneRightIcon weight="fill" className="size-4" aria-hidden />
                </button>
              </form>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.6875rem] text-graphite-400">
                <LockSimpleIcon weight="fill" className="size-3 text-teal-600" aria-hidden />
                Tus datos están protegidos
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
