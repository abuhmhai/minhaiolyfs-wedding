import { prisma } from "@/lib/prisma";

async function main() {
  try {
    // Add ao-dai category if it doesn't exist
    const aoDaiCategory = await prisma.category.upsert({
      where: { slug: "ao-dai-co-dau" },
      update: {},
      create: {
        name: "Áo Dài Cô Dâu",
        slug: "ao-dai-co-dau",
      },
    });

    console.log("Added/Updated ao-dai category:", aoDaiCategory);
  } catch (error) {
    console.error("Error adding category:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 