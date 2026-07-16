import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/checkout", "/cuenta", "/reserva"],
      },
    ],
    sitemap: "https://funestravel.com.ar/sitemap.xml",
  };
}
