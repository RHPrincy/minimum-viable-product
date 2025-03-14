"use server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getSessionUser, destroySession } from "@/lib/auth";
import dossiersData from "@/data/Dossier.json";

// Initialiser Prisma Client
const prisma = new PrismaClient();
console.log("Prisma Client initialized.");
import { User, Task, Step, DossierGroup, Assistant } from "@/app/interfaces";

// // Interfaces pour les types exposés
// interface User {
//     id: number;
//     username: string;
//     fonction: string;
//     competences?: string | null;
// }

// interface Task {
//     id: number;
//     description: string;
//     status: "todo" | "in_progress" | "done";
//     assignedTo?: number | null;
//     id_dossier: string;
// }

// interface Step {
//     id: number;
//     nom: string;
//     description: string;
//     tasks: Task[];
// }

// interface DossierGroup {
//     id: string;
//     nom: string;
//     steps: Step[];
// }

// interface Assistant {
//     id: number;
//     username: string;
// }

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
    const user = await getSessionUser();
    console.log("Session user:", user);

    if (!user || user.fonction !== "collaborateur") {
        console.log("User is not a collaborator or not logged in, redirecting to login.");
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

// Récupérer les tâches et étapes regroupées par dossier pour le collaborateur
export async function getStepsAndTasksForCollaborator(collaboratorId: number): Promise<DossierGroup[]> {
    try {
        // Récupérer les affectations de tâches pour le collaborateur
        const affectations = await prisma.affectationTache.findMany({
            where: { id_utilisateur: collaboratorId },
            include: {
                tache: {
                    include: {
                        etape: true,
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
        console.error("Error fetching tasks for collaborator:", error);
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

// Mettre à jour le statut d'une affectation de tâche spécifique à un dossier
export async function updateTaskStatusForCollaborator(
    taskId: number,
    dossierId: string,
    newStatus: "todo" | "in_progress" | "done",
    collaboratorId: number
): Promise<void> {
    try {
        const affectation = await prisma.affectationTache.findFirst({
            where: { id_tache: taskId, id_dossier: dossierId, id_utilisateur: collaboratorId },
        });

        if (!affectation) {
            throw new Error("Tâche non assignée au collaborateur dans ce dossier.");
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

// Récupérer la liste des assistants
export async function getAssistants(): Promise<Assistant[]> {
    try {
        const assistants = await prisma.user.findMany({
            where: { fonction: "assistant" },
            select: { id: true, username: true },
        });
        return assistants.map((assistant) => ({
            id: assistant.id,
            username: assistant.username,
        }));
    } catch (error) {
        console.error("Error fetching assistants:", error);
        throw new Error(
            `Erreur lors de la récupération des assistants : ${
                error instanceof Error ? error.message : "Erreur inconnue"
            }`
        );
    }
}

// Réaffecter une tâche à un assistant avec unicité par tâche et dossier
export async function reassignTaskToAssistant(
    taskId: number,
    assistantId: number,
    dossierId: string,
    collaboratorId: number
): Promise<void> {
    try {
        const affectation = await prisma.affectationTache.findFirst({
            where: { id_tache: taskId, id_dossier: dossierId, id_utilisateur: collaboratorId },
        });

        if (!affectation) {
            throw new Error("Tâche non assignée au collaborateur ou déjà réaffectée.");
        }

        await prisma.affectationTache.update({
            where: { id: affectation.id },
            data: { id_utilisateur: assistantId, statut: "todo" }, // Réinitialiser à "todo"
        });

        console.log(`Task ${taskId} reassigned to assistant ${assistantId} in dossier ${dossierId}.`);
    } catch (error) {
        console.error("Error reassigning task:", error);
        throw new Error(
            `Erreur lors de la réaffectation de la tâche : ${
                error instanceof Error ? error.message : "Erreur inconnue"
            }`
        );
    }
}