"use server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { User } from "@/app/interfaces";

// Prisma Client est initialisé dans un fichier séparé (@/lib/prisma) pour éviter plusieurs instances

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
  const user = await getSessionUser();
  if (!user || user.fonction !== "manager") {
    console.log("User is not a manager or not logged in, redirecting to login.");
    redirect("/login");
  }
  return user;
}

// Récupérer les statistiques de performance pour tous les collaborateurs et assistants
export async function getPerformanceStats() {
  try {
    // Récupérer toutes les affectations avec les informations utilisateur
    const affectations = await prisma.affectationTache.findMany({
      where: {
        utilisateur: {
          fonction: { in: ["collaborateur", "assistant"] }, // Filtrer les collaborateurs et assistants
        },
      },
      include: {
        utilisateur: {
          select: { id: true, username: true, fonction: true },
        },
      },
    });

    // Agréger les statistiques par utilisateur
    const statsMap: Record<
      number,
      { userId: number; username: string; role: string; dossiersProcessed: number; totalDossiersAssigned: number; completionRate: number }
    > = {};

    for (const affectation of affectations) {
      const userId = affectation.utilisateur.id;
      if (!statsMap[userId]) {
        statsMap[userId] = {
          userId,
          username: affectation.utilisateur.username,
          role: affectation.utilisateur.fonction,
          dossiersProcessed: 0,
          totalDossiersAssigned: 0,
          completionRate: 0,
        };
      }
      statsMap[userId].totalDossiersAssigned += 1;
      if (affectation.statut === "done") {
        statsMap[userId].dossiersProcessed += 1;
      }
    }

    // Calculer le taux de complétion pour chaque utilisateur
    const performanceStats = Object.values(statsMap).map((stat) => ({
      ...stat,
      completionRate:
        stat.totalDossiersAssigned > 0
          ? Number(((stat.dossiersProcessed / stat.totalDossiersAssigned) * 100).toFixed(1))
          : 0,
    }));

    return performanceStats;
  } catch (error) {
    console.error("Error fetching performance stats:", error);
    throw new Error(
      `Erreur lors de la récupération des statistiques: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  } finally {
    // Pas de prisma.$disconnect() car l'instance est gérée dans @/lib/prisma
  }
}