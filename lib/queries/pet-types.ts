import { prisma } from "@/lib/prismadb";

export function getPetTypeByName(name: string) {
  return prisma.petType.findFirst({
    where: { name },
    select: { id: true, name: true, displayName: true, petImageUrl: true },
  });
}

export function getTopPetTypes(top: number) {
  return prisma.petType.findMany({
    orderBy: { popularity: "asc" },
    take: top,
    select: { id: true, name: true, displayName: true, petImageUrl: true },
  });
}

export function getAllPetTypes() {
  return prisma.petType.findMany({
    select: { id: true, name: true, displayName: true },
  });
}
