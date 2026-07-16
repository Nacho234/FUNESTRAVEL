import { AccountShell } from "@/components/account/account-shell";

export const metadata = { title: "Mi cuenta", robots: { index: false } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
