"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// import { getCollaborators, getDossierDetails, assignTaskToUser, updateTaskStatus } from "./server";
import { getCollaborators, getDossierDetails, assignTaskToUser } from "./server";
import { verifySession } from "@/actions/verifyManagerSession";
import { logoutAction } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { NavBar } from "@/app/components/NavBar";
import { Sidebar } from "@/app/components/Sidebar";
import { Badge } from "@/app/components/Badge";
import toast, { Toaster } from "react-hot-toast";
import { User, Dossier, Task, Step, Collaborator } from "@/app/interfaces";

const DossierDetailPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dossier, setDossier] = useState<Dossier | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    // Get dossier by id if not params
    const params = useParams();
    const router = useRouter();

    // Initialisation de la session et récupération des données
    useEffect(() => {
        const initialize = async () => {
            try {
                const sessionUser = await verifySession();
                setUser(sessionUser);

                const { dossier, steps } = await getDossierDetails(params.id as string);
                if (!dossier) {
                    setErrorMessage("Dossier introuvable");
                } else {
                    setDossier(dossier);
                    setSteps(steps);
                    console.log("params.id", params.id);
                }

                const fetchedCollaborators = await getCollaborators();
                setCollaborators(fetchedCollaborators);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "Une erreur est survenue"
                );
            }
        };

        initialize();
    }, [params.id]);

    // Gestion de la déconnexion
    const handleLogout = async () => {
        await logoutAction();
    };

    // Ouvrir la popup d'affectation
    const openAssignPopup = (task: Task) => {
        setSelectedTask(task);
    };

    // Fermer la popup d'affectation
    const closeAssignPopup = () => {
        setSelectedTask(null);
    };

    // Affecter une tâche à un utilisateur
    const assignTask = async (collaborator: Collaborator) => {
        if (!selectedTask || !dossier) return;

        try {
            await assignTaskToUser(selectedTask.id, collaborator.id, dossier.id);
            setSteps((prevSteps) =>
                prevSteps.map((step) => ({
                    ...step,
                    tasks: step.tasks.map((task) =>
                        task.id === selectedTask.id
                            ? { ...task, assignedTo: collaborator.id, status: "todo" }
                            : task
                    ),
                }))
            );
            toast.success(
                `Tâche "${selectedTask.description}" affectée à ${collaborator.username}`
            );
        } catch (error) {
            toast.error("Erreur lors de l'affectation de la tâche");
        }
        closeAssignPopup();
    };

    // Mise à jour du statut d'une tâche
    // const changeTaskStatus = async (
    //     taskId: number,
    //     newStatus: "todo" | "in_progress" | "done"
    // ) => {
    //     if (!dossier) return;

    //     try {
    //         await updateTaskStatus(taskId, dossier.id, newStatus);
    //         setSteps((prevSteps) =>
    //             prevSteps.map((step) => ({
    //                 ...step,
    //                 tasks: step.tasks.map((task) =>
    //                     task.id === taskId ? { ...task, status: newStatus } : task
    //                 ),
    //             }))
    //         );
    //         toast.success(`Statut mis à jour : ${newStatus}`);
    //     } catch (error) {
    //         toast.error("Erreur lors de la mise à jour du statut");
    //     }
    // };

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Toaster />
            <NavBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} logout={handleLogout}/>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user}/>

            <main className={`flex-1 px-6 pt-16 transition-all duration-300 ${ sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
                <div className="mx-auto max-w-6xl pt-6">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">
                            {errorMessage}
                        </div>
                    )}

                    {dossier ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            
                            {/* Détails du dossier */}
                            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
                                <CardHeader className="border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-semibold text-gray-900">
                                            {dossier.Titre}
                                        </CardTitle>
                                        <Badge className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full">
                                            {dossier["Forme juridique"]}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(dossier).map(([key, value]) => (
                                            <div key={key}>
                                                <p className="text-gray-500 font-medium">{key}</p>
                                                <p className="text-gray-900 break-words">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => router.push("/dashboard/manager")}
                                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium"
                                    >
                                        Retour au tableau de bord
                                    </button>
                                </CardContent>
                            </Card>

                            {/* Étapes et tâches */}
                            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        Étapes et Tâches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {steps.length > 0 ? (
                                        steps.map((step) => (
                                            <div key={step.id} className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {step.nom}
                                                </h3>
                                                <ul className="space-y-2">
                                                    {step.tasks.map((task) => {
                                                        const taskStatus = task.status || "todo";
                                                        return (
                                                            <li
                                                                key={task.id}
                                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-150 cursor-pointer"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    {taskStatus === "done" ? (
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
                                                                    ) : taskStatus === "in_progress" ? (
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
                                                                        <p className="text-gray-900">
                                                                            {task.description}
                                                                        </p>
                                                                        {task.assignedTo && (
                                                                            <p className="text-xs text-gray-500">
                                                                                Assigné à :{" "}
                                                                                {collaborators.find(
                                                                                    (c) => c.id === task.assignedTo
                                                                                )?.username || "Utilisateur " + task.assignedTo}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <Badge
                                                                        className={`px-2 py-1 rounded-full font-medium ${
                                                                            taskStatus === "done"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : taskStatus === "in_progress"
                                                                                ? "bg-yellow-100 text-yellow-700"
                                                                                : "bg-gray-100 text-gray-700"
                                                                        }`}
                                                                    >
                                                                        {taskStatus === "done"
                                                                            ? "Terminé"
                                                                            : taskStatus === "in_progress"
                                                                            ? "En cours"
                                                                            : "À faire"}
                                                                    </Badge>
                                                                    <button
                                                                        onClick={() => openAssignPopup(task)}
                                                                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-all duration-200 font-medium"
                                                                    >
                                                                        Affecter
                                                                    </button>
                                                                    {/* <select
                                                                        value={taskStatus}
                                                                        onChange={(e) =>
                                                                            changeTaskStatus(
                                                                                task.id,
                                                                                e.target.value as
                                                                                    | "todo"
                                                                                    | "in_progress"
                                                                                    | "done"
                                                                            )
                                                                        }
                                                                        className="px-2 py-1 border rounded-md text-sm"
                                                                    >
                                                                        <option value="todo">À faire</option>
                                                                        <option value="in_progress">En cours</option>
                                                                        <option value="done">Terminé</option>
                                                                    </select> */}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">
                                            Aucune étape disponible pour ce dossier.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        !errorMessage && (
                            <p className="text-gray-600 text-center py-4">
                                Chargement des détails du dossier...
                            </p>
                        )
                    )}

                    {/* Popup d'affectation */}
                    {selectedTask && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Affecter la tâche : {selectedTask.description}
                                </h3>
                                <ul className="space-y-2 max-h-64 overflow-y-auto">
                                    {collaborators.map((collab) => (
                                        <li
                                            key={collab.id}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-all duration-150"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {collab.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {collab.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500 capitalize">
                                                        {collab.fonction}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => assignTask(collab)}
                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                                            >
                                                Affecter
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={closeAssignPopup}
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

export default DossierDetailPage;