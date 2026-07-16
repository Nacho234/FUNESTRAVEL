import { BlogAdmin } from "@/components/admin/marketing/blog-admin";

export const metadata = { title: "Blog" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return <BlogAdmin openNew={sp.nueva === "1"} />;
}
