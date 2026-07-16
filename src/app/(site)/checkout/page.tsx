import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Tu reserva",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-20">
      <CheckoutFlow />
    </div>
  );
}
