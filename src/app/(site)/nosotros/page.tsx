import Image from "next/image";
import type { Metadata } from "next";
import {
  ChatsCircleIcon,
  HandshakeIcon,
  SealCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { avatar, IMG } from "@/data/img";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Funes Travel es una agencia familiar de Funes, Santa Fe. Conocé al equipo que arma y acompaña cada viaje.",
};

const team = [
  {
    name: "Sofía Gachet",
    role: "Directora y asesora senior",
    bio: "Fundó la agencia después de diez años vendiendo circuitos por Europa para un operador mayorista. Especialista en itinerarios de varias ciudades.",
    avatar: avatar(44),
  },
  {
    name: "Marcela Buttini",
    role: "Coordinadora de salidas grupales",
    bio: "Acompañó más de treinta grupos por Europa, Turquía y el norte argentino. Si viajás en grupo, ella va a estar en el aeropuerto antes que vos.",
    avatar: avatar(32),
  },
  {
    name: "Diego Anselmi",
    role: "Asesor de viajes y posventa",
    bio: "El que responde el WhatsApp de emergencias cuando un vuelo se reprograma un domingo. Experto en Caribe, Brasil y viajes en familia.",
    avatar: avatar(53),
  },
];

const values = [
  {
    icon: ChatsCircleIcon,
    title: "Asesoramiento real",
    text: "Ningún bot: cada consulta la responde una persona que conoce el destino porque lo vendió, lo cotizó y casi siempre lo pisó.",
  },
  {
    icon: SealCheckIcon,
    title: "Transparencia",
    text: "Precio final con impuestos discriminados, condiciones de cancelación antes de reservar y cotizaciones con vigencia por escrito.",
  },
  {
    icon: HandshakeIcon,
    title: "Acompañamiento",
    text: "No desaparecemos después del pago. Línea directa durante el viaje y gestión de imprevistos sin que tengas que pelearla vos.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Intro editorial: text + photo, no timeline */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900 leading-tight">
                Una agencia de barrio que despacha viajeros por todo el mundo
              </h1>
              <div className="mt-6 max-w-[65ch] space-y-4 text-lg leading-relaxed text-graphite-600">
                <p>
                  Funes Travel nació como una oficina chica sobre la calle San José, en Funes, Santa Fe.
                  Hoy seguimos en la misma cuadra, con más escritorios y la misma manera de trabajar:
                  conocer a quien viaja antes de venderle nada.
                </p>
                <p>
                  Somos una empresa de viajes y turismo habilitada (EVT, legajo 18.432), lo que significa
                  que operamos con responsabilidad legal directa sobre cada reserva. Trabajamos con
                  operadores mayoristas que auditamos todos los años y hoteles que elegimos por
                  experiencia propia o de nuestros pasajeros.
                </p>
                <p>
                  Más de 2.400 viajeros de Funes, Roldán, Rosario y la zona ya salieron con nosotros.
                  Muchos vuelven cada año, y esa es la métrica que más cuidamos.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]">
              <Image
                src={IMG.planning}
                alt="Planificación de un viaje sobre un escritorio con mapas y cuadernos"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Values */}
        <section className="mt-16 lg:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-petrol-900">
              Cómo trabajamos
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                  <value.icon className="size-7 text-teal-600" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold text-petrol-900">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-16 lg:mt-24">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-petrol-900">
              El equipo detrás de cada reserva
            </h2>
            <p className="mt-2 max-w-xl text-graphite-600">
              Cuando escribís a Funes Travel, te responde alguna de estas personas. Con nombre, apellido
              y responsabilidad sobre tu viaje.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-card)] bg-sand-50 p-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={member.avatar}
                      alt={`Retrato de ${member.name}`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-display text-lg font-bold text-petrol-900">{member.name}</h3>
                      <p className="text-sm font-medium text-teal-600">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-graphite-600">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-[var(--radius-card)] bg-petrol-950 p-8 sm:p-10 text-ivory sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Vení a tomar un café y hablemos de tu viaje</h2>
            <p className="mt-2 max-w-xl text-petrol-100/85">
              Estamos en San José 1650, Funes. También atendemos por WhatsApp y videollamada si te queda
              más cómodo.
            </p>
          </div>
          <ButtonLink href="/contacto" className="mt-5 sm:mt-0 shrink-0">
            Ir a contacto
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
