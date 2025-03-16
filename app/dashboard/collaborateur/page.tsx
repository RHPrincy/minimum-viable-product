"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    verifySession,
    logoutAction,
    getStepsAndTasksForCollaborator,
    updateTaskStatusForCollaborator,
    getAssistants,
    reassignTaskToAssistant,
} from "./server";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { NavBar } from "@/app/components/NavBar";
// import { Sidebar } from "@/app/components/Sidebar";
import { Badge } from "@/app/components/Badge";
import toast, { Toaster } from "react-hot-toast";
import { User, Task, Step, DossierGroup, Assistant } from "@/app/interfaces";

// // Interfaces
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

const CollaboratorDashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dossierGroups, setDossierGroups] = useState<DossierGroup[]>([]);
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const router = useRouter();

    // Initialisation de la session et récupération des données
    useEffect(() => {
        const initialize = async () => {
            try {
                const sessionUser = await verifySession();
                setUser(sessionUser);

                const fetchedGroups = await getStepsAndTasksForCollaborator(sessionUser.id);
                setDossierGroups(fetchedGroups);

                const fetchedAssistants = await getAssistants();
                setAssistants(fetchedAssistants);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "Une erreur est survenue"
                );
                router.push("/login");
            }
        };

        initialize();
    }, [router]);

    // Gestion de la déconnexion
    const handleLogout = async () => {
        try {
            await logoutAction();
            router.push("/");
        } catch (error) {
            setErrorMessage("Erreur lors de la déconnexion");
        }
    };

    // Mise à jour du statut d'une tâche
    const changeTaskStatus = async (
        taskId: number,
        dossierId: string,
        newStatus: "todo" | "in_progress" | "done"
    ) => {
        if (!user) return;

        try {
            await updateTaskStatusForCollaborator(taskId, dossierId, newStatus, user.id);

            setDossierGroups((prevGroups) =>
                prevGroups.map((group) => ({
                    ...group,
                    steps: group.steps.map((step) => ({
                        ...step,
                        tasks: step.tasks.map((task) =>
                            task.id === taskId && task.id_dossier === dossierId
                                ? { ...task, status: newStatus }
                                : task
                        ),
                    })),
                }))
            );

            toast.success(`Statut de la tâche mis à jour : ${newStatus}`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    // Ouvrir la popup de réaffectation
    const openReassignPopup = (task: Task) => {
        setSelectedTask(task);
    };

    // Fermer la popup de réaffectation
    const closeReassignPopup = () => {
        setSelectedTask(null);
    };

    // Réaffecter une tâche à un assistant
    const reassignTask = async (assistant: Assistant) => {
        if (!selectedTask || !user) return;

        try {
            if (selectedTask.id_dossier) {
                await reassignTaskToAssistant(selectedTask.id, assistant.id, selectedTask.id_dossier, user.id);
            } else {
                toast.error("Erreur: ID du dossier non défini.");
            }

            // Retirer la tâche de l'état local car elle n'est plus assignée au collaborateur
            setDossierGroups((prevGroups) =>
                prevGroups.map((group) => ({
                    ...group,
                    steps: group.steps.map((step) => ({
                        ...step,
                        tasks: step.tasks.filter((task) => task.id !== selectedTask.id || task.id_dossier !== selectedTask.id_dossier),
                    })),
                }))
            );

            toast.success(
                `Tâche "${selectedTask.description}" réaffectée à ${assistant.username}`
            );
        } catch (error) {
            toast.error("Erreur lors de la réaffectation de la tâche");
        }
        closeReassignPopup();
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Toaster />
            <NavBar
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                user={user}
                logout={handleLogout}
            />
            {/* <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                user={user}
            /> */}

            <main
                className={`flex-1 px-6 pt-16 transition-all duration-300 ${
                    sidebarOpen ? "md:ml-64" : "md:ml-16"
                }`}
            >
                <div className="mx-auto max-w-4xl pt-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Mes tâches</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Tâches assignées organisées par dossier et étape
                        </p>
                    </div>

                    {dossierGroups.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                            Aucune tâche assignée.
                        </p>
                    ) : (
                        dossierGroups.map((group) => (
                            <Card
                                key={group.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
                            >
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {group.nom} (ID: {group.id})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {group.steps.map((step) => (
                                        <div key={step.id} className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {step.nom}
                                            </h3>
                                            {step.tasks.length === 0 ? (
                                                <p className="text-gray-600">
                                                    Aucune tâche assignée pour cette étape.
                                                </p>
                                            ) : (
                                                step.tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-150"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {task.status === "done" ? (
                                                                <svg
                                                                    className="h-5 w-5 text-green-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            ) : task.status === "in_progress" ? (
                                                                <svg
                                                                    className="h-5 w-5 text-yellow-600 animate-spin"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M12 4v2m0 12v2m8-8h-2m-12 0H4m15.36-6.36l-1.42 1.42M6.06 17.94l-1.42 1.42M17.94 6.06l1.42-1.42M4.64 19.36l-1.42-1.42"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                                                            )}
                                                            <div>
                                                                <p className="text-gray-900 font-medium">
                                                                    {task.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge
                                                                className={`px-2 py-1 rounded-full font-medium ${
                                                                    task.status === "done"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : task.status === "in_progress"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-gray-100 text-gray-700"
                                                                }`}
                                                            >
                                                                {task.status === "done"
                                                                    ? "Terminé"
                                                                    : task.status === "in_progress"
                                                                    ? "En cours"
                                                                    : "À faire"}
                                                            </Badge>
                                                            {task.assignedTo === user.id && task.status !== "done" && (
                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) =>
                                                                        task.id_dossier && changeTaskStatus(
                                                                            task.id,
                                                                            task.id_dossier,
                                                                            e.target.value as "todo" | "in_progress" | "done"
                                                                        )
                                                                    }
                                                                    className="bg-white border border-gray-200 rounded-full pl-3 pr-8 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150 cursor-pointer custom-select"
                                                                >
                                                                    <option value="todo">À faire</option>
                                                                    <option value="in_progress">En cours</option>
                                                                    <option value="done">Terminé</option>
                                                                </select>
                                                            )}
                                                            <button
                                                                onClick={() => openReassignPopup(task)}
                                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-all duration-200 font-medium"
                                                            >
                                                                Réaffecter
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))
                    )}

                    {/* Popup de réaffectation */}
                    {selectedTask && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Réaffecter la tâche : {selectedTask.description}
                                </h3>
                                <ul className="space-y-2 max-h-64 overflow-y-auto">
                                    {assistants.map((assistant) => (
                                        <li
                                            key={assistant.id}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-all duration-150"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {assistant.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {assistant.username}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => reassignTask(assistant)}
                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                                            >
                                                Réaffecter
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={closeReassignPopup}
                                    className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200 font-medium"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CollaboratorDashboard;