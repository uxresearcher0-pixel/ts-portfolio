import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/store";
import { AdminApp } from "@/components/AdminApp";

export const metadata = { title: "Portfolio CMS — Taslima Rumky" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  return <AdminApp initialAuthenticated={authenticated} initialContent={authenticated ? await getContent() : null} />;
}
