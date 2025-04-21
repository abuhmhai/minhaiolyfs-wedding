import { prisma } from "@/lib/db";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
} 