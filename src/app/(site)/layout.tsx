import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { StoreProvider } from "@/lib/store";

const agencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Funes Travel",
  url: "https://funestravel.com.ar",
  telephone: "+54-9-341-555-0123",
  email: "hola@funestravel.com.ar",
  address: {
    "@type": "PostalAddress",
    streetAddress: "San José 1650",
    addressLocality: "Funes",
    addressRegion: "Santa Fe",
    addressCountry: "AR",
  },
  openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agencyJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </StoreProvider>
  );
}
