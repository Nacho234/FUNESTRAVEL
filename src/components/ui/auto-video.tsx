"use client";

import { useEffect, useRef } from "react";

export type FuenteVideo = {
  src: string;
  type: string;
  /** Consulta de medios: evita descargar el archivo donde no se va a ver. */
  media?: string;
};

/**
 * Video de fondo que se asegura de arrancar.
 *
 * `autoPlay` solo no alcanza. El navegador puede negarse a reproducir y el
 * video queda pausado para siempre mostrando el póster, sin ningún aviso:
 *
 *  · iOS con Modo de bajo consumo bloquea toda reproducción automática.
 *  · Safari y Chrome no arrancan videos que están fuera de la pantalla.
 *  · Si la promesa de `play()` se rechaza, nadie vuelve a intentarlo.
 *
 * Acá se reintenta cuando el video entra en pantalla, cuando termina de
 * cargar datos y —para el caso del bajo consumo— al primer gesto del
 * visitante, que es lo que levanta el bloqueo. Fuera de pantalla se pausa:
 * ahorra batería y ancho de banda en el celular.
 */
export function AutoVideo({
  fuentes,
  poster,
  className,
}: {
  fuentes: FuenteVideo[];
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    let enPantalla = false;
    const intentar = () => {
      if (enPantalla && v.paused) void v.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entrada]) => {
        enPantalla = entrada.isIntersecting;
        if (enPantalla) intentar();
        else if (!v.paused) v.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(v);

    const gestos = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    v.addEventListener("loadeddata", intentar);
    for (const gesto of gestos) window.addEventListener(gesto, intentar, { passive: true });

    return () => {
      io.disconnect();
      v.removeEventListener("loadeddata", intentar);
      for (const gesto of gestos) window.removeEventListener(gesto, intentar);
    };
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline poster={poster} aria-hidden>
      {fuentes.map((f) => (
        <source key={f.src} src={f.src} type={f.type} media={f.media} />
      ))}
    </video>
  );
}
