import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const qualifications = await prisma.qualification.findMany();
  
  console.log(`Found ${qualifications.length} total qualifications.`);
  
  const toDelete = qualifications.filter(q => {
    // Delete if longer than 20 characters
    if (q.name.length > 25) return true;
    
    // Delete if starts with lowercase letter (usually a mid-sentence bullet point)
    if (/^[a-z]/.test(q.name)) return true;
    
    // Delete if contains typical skill/sentence keywords
    const lower = q.name.toLowerCase();
    if (lower.includes("ability") || 
        lower.includes("environment") || 
        lower.includes("concepts") ||
        lower.includes("skills") ||
        lower.includes("knowledge")) {
      return true;
    }
    
    return false;
  });

  console.log(`\nIdentified ${toDelete.length} garbage qualifications to delete:`);
  toDelete.forEach(q => console.log(`- "${q.name}"`));
  
  const toDeleteNames = toDelete.map(q => q.name);

  if (toDeleteNames.length > 0) {
    const deleted = await prisma.qualification.deleteMany({
      where: {
        name: { in: toDeleteNames }
      }
    });
    console.log(`\nSuccessfully deleted ${deleted.count} garbage qualifications from the database!`);
  } else {
    console.log(`\nNo garbage qualifications found to delete.`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
