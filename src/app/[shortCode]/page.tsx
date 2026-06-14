import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

export default async function RedirectPage({ params }: PageProps) {

  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: {
      shortCode: shortCode,
    },
  });

  if (!link) {
    return <h1>Link not found</h1>;
  }

  redirect(link.originalUrl);
}