import { getContent } from "@/lib/store";
import { Portfolio } from "@/components/Portfolio";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return { title: content.seoTitle, description: content.seoDescription };
}

export default async function Home() {
  return <Portfolio content={await getContent()} />;
}
