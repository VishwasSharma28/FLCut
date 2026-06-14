import { prisma } from "./src/lib/prisma";

async function main() {
  const deletedLink = await prisma.link.delete({
    where: {
      shortCode: "test123",
    },
  });

  console.log("Deleted Link:");
  console.log(deletedLink);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });