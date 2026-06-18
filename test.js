const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const job = await prisma.job.findFirst();
  console.log(job);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
