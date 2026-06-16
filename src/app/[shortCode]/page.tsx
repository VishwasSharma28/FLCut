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
  if (
  link?.launchAt &&
  new Date() < new Date(link.launchAt)
) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        This link is not live yet.
      </h1>
    </div>
  );
}
  if (link?.expiresAt && new Date() > new Date(link.expiresAt)) {

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        This link has expired.
      </h1>
    </div>
  );

}

  if (!link) {
    return <h1>Link not found</h1>;
  }

  redirect(link.originalUrl);
}