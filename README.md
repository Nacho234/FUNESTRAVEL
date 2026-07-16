# Funes Travel — plataforma de e-commerce turístico

Sitio comercial completo para una agencia de viajes: búsqueda y reserva de paquetes, comparador de
vuelos, hoteles, excursiones, salidas grupales, viajes a medida, checkout multietapa, panel del
cliente y panel administrativo.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** estricto
- **Tailwind CSS v4** con design tokens propios en `src/app/globals.css` (`@theme`)
- **Motion** para microinteracciones (respeta `prefers-reduced-motion`)
- **Phosphor Icons** (una sola familia, stroke consistente)
- Tipografías: **Bricolage Grotesque** (display) + **Hanken Grotesk** (UI) vía `next/font`

## Correr el proyecto

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build de producción (todas las rutas SSG/estáticas verificadas)
npx tsc --noEmit  # typecheck
npx eslint src    # lint
```

## Modo demo

El proyecto funciona 100% sin backend para poder demostrarse:

- **Catálogo** (destinos, paquetes, hoteles, excursiones, vuelos, promos, artículos, FAQs) vive en
  `src/data/*` con tipos en `src/lib/types.ts`.
- **Estado del cliente** (favoritos, reserva en curso, reservas confirmadas, cotizaciones, sesión)
  persiste en `localStorage` vía `src/lib/store.tsx` (`StoreProvider`).
- **Pagos**: el checkout simula la aprobación; no se recolectan ni guardan datos de tarjeta.
- **Admin**: en `/admin` (mismo dominio: `www.funestravel.com/admin`). Con las variables de
  Google OAuth configuradas (ver `.env.example`) el acceso es con cuenta de Google + allowlist de
  correos y roles por email, validado en el servidor. Sin credenciales, corre en modo demo
  (login local). Manual del panel en `docs/MANUAL-ADMIN.md` y en `/admin/guia`.

## Dónde conectar servicios reales

| Servicio | Punto de conexión | Variable sugerida |
|---|---|---|
| Pagos (Mercado Pago) | Reemplazar la simulación en `src/components/checkout/checkout-flow.tsx` (`confirm()`) por creación de preferencia server-side | `MP_ACCESS_TOKEN` |
| Correo transaccional | Envíos post-reserva y newsletter (`newsletter-form.tsx`) | `RESEND_API_KEY` |
| WhatsApp Business | Los enlaces `wa.me/5493415550123` están centralizados por página en `src/components/layout/whatsapp-button.tsx` | `WHATSAPP_TOKEN` |
| Vuelos (GDS/NDC) | `src/data/flights.ts` es el mock a reemplazar por un adaptador | `AMADEUS_KEY` |
| Base de datos | La capa `src/data/*` + `src/lib/store.tsx` se migra a Prisma/Postgres; los tipos de `src/lib/types.ts` ya modelan las entidades | `DATABASE_URL` |

**Regla al conectar pagos**: precios, disponibilidad y totales deben revalidarse SIEMPRE en el
servidor; nunca confiar en los montos enviados por el frontend.

## Estructura

```
src/
  app/(site)/       # sitio público + checkout + cuenta (Header/Footer compartidos)
  app/admin/        # panel administrativo (layout propio, noindex)
  components/       # ui/ (primitivas), cards/, search/, packages/, checkout/, account/, admin/...
  data/             # catálogo demo + registro central de imágenes (img.ts)
  lib/              # tipos, formateadores, store client-side
```

## Sistema visual

Paleta: petróleo `#0e3a47` (confianza) · marfil `#faf7f2` (fondo) · arena (secciones editoriales) ·
turquesa `#2c8c99` (detalles) · coral `#d9552a` (CTA de conversión) · grafito (texto). Radios: cards
16px / controles 10px. Sombras tintadas al petróleo. Los tokens están en `globals.css` y se usan vía
clases Tailwind (`bg-petrol-900`, `text-coral-600`, `rounded-[var(--radius-card)]`, etc.).
