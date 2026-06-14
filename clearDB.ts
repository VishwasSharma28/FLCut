import { prisma } from "./src/lib/prisma";

async function main() {

  await prisma.link.deleteMany();

  console.log("All links deleted successfully");

}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });