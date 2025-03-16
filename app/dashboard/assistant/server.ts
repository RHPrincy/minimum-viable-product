"use server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getSessionUser, destroySession } from "@/lib/session";
import dossiersData from "@/data/Dossier.json";

// Initialiser Prisma Client
const prisma = new PrismaClient();
console.log("Prisma Client initialized.");

// Interfaces pour les types exposés
interface User {
  id: number;
  username: string;
  fonction: string;
  competences?: string | null;
}

interface Task {
  id: number;
  description: string;
  status: "todo" | "in_progress" | "done";
  assignedTo?: number | null;
  id_dossier: string;
}

interface Step {
  id: number;
  nom: string;
  description: string;
  tasks: Task[];
}

interface DossierGroup {
  id: string; // id_dossier
  nom: string; // Titre du dossier
  steps: Step[];
}

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
  const user = await getSessionUser();
  console.log("Session user:", user);

  if (!user || user.fonction !== "assistant") {
    console.log("User is not an assistant or not logged in, redirecting to login.");
    redirect("/login");
  }
  return user;
}

// Action de déconnexion côté serveur
export async function logoutAction(): Promise<void> {
  await destroySession();
  console.log("Session destroyed.");
  redirect("/login");
}

// Récupérer les tâches et étapes regroupées par dossier pour l'assistant
export async function getStepsAndTasksForAssistant(assistantId: number): Promise<DossierGroup[]> {
  try {
    // Récupérer les affectations de tâches pour l'assistant
    const affectations = await prisma.affectationTache.findMany({
      where: { id_utilisateur: assistantId },
      include: {
        tache: {
          include: {
            etape: true, // Inclure l'étape associée à la tâche
          },
        },
      },
    });

    // Regrouper les tâches par dossier, puis par étape
    const dossierMap: Record<string, DossierGroup> = {};

    affectations.forEach((affectation) => {
      const idDossier = affectation.id_dossier || "inconnu";
      const dossier = dossiersData.find((d) => d.id === idDossier);
      const nomDossier = dossier ? dossier.Titre : `Dossier ${idDossier}`;
      const etape = affectation.tache.etape;

      if (!etape) {
        console.error("Étape manquante pour la tâche :", affectation.tache.id);
        return;
      }

      // Initialiser le dossier s'il n'existe pas
      if (!dossierMap[idDossier]) {
        dossierMap[idDossier] = {
          id: idDossier,
          nom: nomDossier,
          steps: [],
        };
      }

      // Trouver ou créer l'étape dans le dossier
      let step = dossierMap[idDossier].steps.find((s) => s.id === etape.id);
      if (!step) {
        step = {
          id: etape.id,
          nom: etape.nom,
          description: etape.description,
          tasks: [],
        };
        dossierMap[idDossier].steps.push(step);
      }

      // Ajouter la tâche à l'étape
      step.tasks.push({
        id: affectation.tache.id,
        description: affectation.tache.description,
        status: affectation.statut,
        assignedTo: affectation.id_utilisateur,
        id_dossier: idDossier,
      });
    });

    return Object.values(dossierMap);
  } catch (error) {
    console.error("Error fetching tasks for assistant:", error);
    throw new Error(
      `Erreur lors de la récupération des tâches : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  } finally {
    await prisma.$disconnect();
    console.log("Prisma Client disconnected.");
  }
}

// Mettre à jour le statut d'une affectation de tâche
export async function updateTaskStatusForAssistant(
  taskId: number,
  newStatus: "todo" | "in_progress" | "done",
  assistantId: number
): Promise<void> {
  try {
    const affectation = await prisma.affectationTache.findFirst({
      where: { id_tache: taskId, id_utilisateur: assistantId },
    });

    if (!affectation) {
      throw new Error("Tâche non assignée à l'assistant.");
    }

    await prisma.affectationTache.update({
      where: { id: affectation.id },
      data: { statut: newStatus },
    });

    console.log("Task status updated successfully.");
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error(
      `Erreur lors de la mise à jour du statut : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
}