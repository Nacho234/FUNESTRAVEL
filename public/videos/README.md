# Videos (assets de Higgsfield)

Los clips de motion generados en Higgsfield van acá. Cada archivo se referencia
desde `src/data/video.ts` (registro central, espejo de `src/data/img.ts`).

## Cómo agregar un clip

1. Generá el clip en Higgsfield y exportalo como **.mp4** (H.264, sin audio).
2. Copiá el archivo acá con el nombre exacto que figura en `src/data/video.ts`.
3. En `src/data/video.ts`, poné `ready: true` en esa entrada.

Hasta que `ready` sea `true`, la UI usa la foto de `img.ts` como poster: el sitio
nunca queda en blanco ni muestra un `<video>` roto.

## Recomendaciones

- Duración 4–8 s, **loopeable** sin corte visible.
- Sin audio (los videos van `muted` + `autoPlay` + `playsInline`).
- Orientación horizontal 16:9, 1920×1080 (o 1280×720 si pesa mucho).
- Opcional: exportar también **.webm** (VP9) y setear `webm` en el registro para
  archivos más livianos.

## Clips esperados (sección del despegue en la home)

| Archivo                  | Escena                                    |
|--------------------------|-------------------------------------------|
| `takeoff-airport.mp4`    | Avión en plataforma al atardecer (escena A) |
| `takeoff-runway.mp4`     | Despegue, ruedas dejando la pista (escena B) |
| `takeoff-flight.mp4`     | Avión crucero sobre nubes doradas (escena C) |
