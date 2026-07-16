import type { Money } from "@/lib/types";

export interface Extra {
  id: string;
  name: string;
  detail: string;
  price: Money;
  perPerson: boolean;
}

// Optional services offered in checkout step 3. Prices are per trip unless perPerson.
export const extrasCatalog: Extra[] = [
  {
    id: "equipaje-extra",
    name: "Valija extra de 23 kg",
    detail: "Una pieza adicional de equipaje en bodega, ida y vuelta.",
    price: { amount: 80, currency: "USD" },
    perPerson: true,
  },
  {
    id: "seguro-premium",
    name: "Upgrade de asistencia a cobertura premium",
    detail: "Amplía la cobertura médica a USD 300.000 y suma cancelación por cualquier causa (hasta USD 2.000).",
    price: { amount: 65, currency: "USD" },
    perPerson: true,
  },
  {
    id: "traslado-privado",
    name: "Traslados privados",
    detail: "Reemplaza los traslados regulares por vehículo privado con chofer para tu grupo.",
    price: { amount: 120, currency: "USD" },
    perPerson: false,
  },
  {
    id: "asiento",
    name: "Selección anticipada de asientos",
    detail: "Elegís los asientos del vuelo apenas la aerolínea habilita el mapa, con nuestra gestión.",
    price: { amount: 35, currency: "USD" },
    perPerson: true,
  },
  {
    id: "habitacion-superior",
    name: "Upgrade a habitación superior",
    detail: "Sujeto a disponibilidad del hotel. Si no se consigue, se reintegra el importe completo.",
    price: { amount: 190, currency: "USD" },
    perPerson: false,
  },
];
