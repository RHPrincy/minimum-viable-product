// /lib/user.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Collaborator {
  id: number;
  username: string;
  fonction: "collaborateur" | "assistant";
}

export async function getCollaborateurs(): Promise<Collaborator[]> {
  try {
    const collaborateurs = await prisma.user.findMany({
      where: {
        fonction: {
          in: ["collaborateur", "assistant"], // Filtrer les utilisateurs avec ces rôles
        },
      },
      select: {
        id: true,
        username: true,
        fonction: true,
      },
    });

    // Mapper les résultats au format Collaborator
    return collaborateurs.map((user) => ({
      id: user.id,
      username: user.username,
      fonction: user.fonction as "collaborateur" | "assistant", 
    }));
  } catch (error) {
    console.error("Failed to fetch collaborators:", error);
    throw new Error("Erreur lors de la récupération des collaborateurs");
  } finally {
    await prisma.$disconnect();
  }
}