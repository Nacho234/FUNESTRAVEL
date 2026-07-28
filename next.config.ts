import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El indicador de desarrollo se planta abajo a la izquierda, justo encima del
  // botón del asistente, y se come el clic. Apagarlo no oculta los errores:
  // los de compilación y ejecución se siguen mostrando. Solo afecta a `next dev`.
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Cada valor de `quality` usado en el código debe estar acá o Next avisa.
    qualities: [70, 75, 78, 80],
  },
};

export default nextConfig;
