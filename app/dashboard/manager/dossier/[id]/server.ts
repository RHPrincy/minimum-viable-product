"use server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getSessionUser, destroySession } from "@/lib/auth";
import dossiersData from "@/data/Dossier.json";
import { User, Dossier, Task, Step, Collaborator } from "@/app/interfaces";


// Initialiser Prisma Client
const prisma = new PrismaClient();
console.log("Prisma Client initialized.");

// // Interfaces pour les types exposés
// interface User {
//     id: number;
//     username: string;
//     fonction: string;
//     competences?: string | null;
// }

// interface Dossier {
//     id: string;
//     Titre: string;
//     Nom: string;
//     Genre: string;
//     Activite: string;
//     SIRET: string;
//     Adresse: string;
//     Email: string;
//     "Forme juridique": string;
//     "Regime fiscal": string;
//     "Regime imposition": string;
//     Type: string;
//     manager: number;
// }

// interface Task {
//     id: number;
//     description: string;
//     assignedTo?: number | null;
//     status?: "todo" | "in_progress" | "done";
// }

// interface Step {
//     id: number;
//     nom: string;
//     description: string;
//     tasks: Task[];
// }

// interface Collaborator {
//     id: number;
//     username: string;
//     fonction: "collaborateur" | "assistant";
// }

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
    const user = await getSessionUser();
    console.log("Session user:", user);

    if (!user || user.fonction !== "manager") {
        console.log(
            "User is not a manager or not logged in, redirecting to login."
        );
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

// Récupérer les collaborateurs et assistants
export async function getCollaborators(): Promise<Collaborator[]> {
    const prismaUsers = await prisma.user.findMany({
        where: { fonction: { in: ["collaborateur", "assistant"] } },
        select: { id: true, username: true, fonction: true, competences: true },
    });
    console.log("Prisma users fetched:", prismaUsers);

    return prismaUsers.map((user) => ({
        id: user.id,
        username: user.username,
        fonction: user.fonction as "collaborateur" | "assistant",
    }));
}

// Récupérer les détails du dossier et ses étapes
export async function getDossierDetails(
    dossierId: string
): Promise<{ dossier: Dossier | null; steps: Step[] }> {
    try {
        const dossier = dossiersData.find((d) => d.id === dossierId);
        console.log("Dossier found:", dossier);

        if (!dossier) {
            return { dossier: null, steps: [] };
        }

        const obligation = await prisma.obligationFiscale.findFirst({
            where: { nom: dossier.Type },
        });
        console.log("Obligation fiscale found:", obligation);

        if (!obligation) {
            throw new Error(`Aucune obligation fiscale trouvée pour ${dossier.Type}`);
        }

        const fetchedSteps = await prisma.etape.findMany({
            where: { id_obligation: obligation.id },
            include: {
                taches: {
                    include: {
                        affectations: {
                            where: { id_dossier: dossierId }, // Filtrer par dossier
                            select: {
                                id: true,
                                id_tache: true,
                                id_utilisateur: true,
                                date_affectation: true,
                                statut: true,
                            },
                        },
                    },
                },
            },
        });
        console.log("Fetched steps:", fetchedSteps);

        const steps = fetchedSteps.map((step) => ({
            id: step.id,
            nom: step.nom,
            description: step.description,
            tasks: step.taches.map((tache) => ({
                id: tache.id,
                description: tache.description,
                assignedTo: tache.affectations[0]?.id_utilisateur || null,
                status: tache.affectations[0]?.statut || undefined,
            })),
        }));

        return { dossier, steps };
    } catch (error) {
        console.error("Error fetching dossier details:", error);
        throw new Error(
            `Erreur lors de la récupération des détails : ${
                error instanceof Error ? error.message : "Erreur inconnue"
            }`
        );
    } finally {
        await prisma.$disconnect();
        console.log("Prisma Client disconnected.");
    }
}

// Affecter une tâche à un utilisateur avec unicité par tâche et dossier
export async function assignTaskToUser(
    taskId: number,
    userId: number,
    dossierId: string
): Promise<void> {
    try {
        // Vérifier si une affectation existe déjà pour cette tâche dans ce dossier
        const existingAffectation = await prisma.affectationTache.findFirst({
            where: { id_tache: taskId, id_dossier: dossierId },
        });
        console.log("Existing affectation:", existingAffectation);

        if (existingAffectation) {
            // Mettre à jour l'affectation existante
            await prisma.affectationTache.update({
                where: { id: existingAffectation.id },
                data: {
                    id_utilisateur: userId,
                    statut: "todo", // Réinitialiser à "todo" lors de la réaffectation
                },
            });
        } else {
            // Créer une nouvelle affectation avec statut par défaut
            await prisma.affectationTache.create({
                data: {
                    id_tache: taskId,
                    id_utilisateur: userId,
                    id_dossier: dossierId,
                    statut: "todo",
                },
            });
        }
        console.log("Task assigned successfully.");
    } catch (error) {
        console.error("Error assigning task to user:", error);
        throw new Error(
            `Erreur lors de l'affectation : ${
                error instanceof Error ? error.message : "Erreur inconnue"
            }`
        );
    }
}

// Mettre à jour le statut d'une affectation de tâche spécifique à un dossier
export async function updateTaskStatus(
    taskId: number,
    dossierId: string,
    newStatus: "todo" | "in_progress" | "done"
): Promise<void> {
    try {
        // Trouver l'affectation associée à la tâche et au dossier
        const affectation = await prisma.affectationTache.findFirst({
            where: { id_tache: taskId, id_dossier: dossierId },
        });

        if (!affectation) {
            throw new Error(
                `Aucune affectation trouvée pour la tâche ${taskId} dans le dossier ${dossierId}`
            );
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