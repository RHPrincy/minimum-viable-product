"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  verifySession,
  logoutAction,
  getStepsAndTasksForAssistant,
  updateTaskStatusForAssistant,
} from "./server";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { NavBar } from "@/app/components/NavBar";
import { Sidebar } from "@/app/components/Sidebar";
import { Badge } from "@/app/components/Badge";
import toast, { Toaster } from "react-hot-toast";

// Interfaces
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
  id: string;
  nom: string;
  steps: Step[];
}

const AssistantDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dossierGroups, setDossierGroups] = useState<DossierGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Initialisation de la session et récupération des données
  useEffect(() => {
    const initialize = async () => {
      try {
        const sessionUser = await verifySession();
        setUser(sessionUser);

        const fetchedGroups = await getStepsAndTasksForAssistant(sessionUser.id);
        setDossierGroups(fetchedGroups);
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
      router.push("/login");
    } catch (error) {
      setErrorMessage("Erreur lors de la déconnexion");
    }
  };

  // Mise à jour du statut d'une tâche
  const changeTaskStatus = async (
    taskId: number,
    newStatus: "todo" | "in_progress" | "done"
  ) => {
    if (!user) return;

    try {
      await updateTaskStatusForAssistant(taskId, newStatus, user.id);

      setDossierGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          steps: group.steps.map((step) => ({
            ...step,
            tasks: step.tasks.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          })),
        }))
      );

      toast.success(`Statut de la tâche mis à jour : ${newStatus}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
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
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
      />

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
                              {task.assignedTo === user.id &&
                                task.status !== "done" && (
                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      changeTaskStatus(
                                        task.id,
                                        e.target.value as
                                          | "todo"
                                          | "in_progress"
                                          | "done"
                                      )
                                    }
                                    className="appearance-none bg-white border border-gray-200 rounded-full pl-3 pr-8 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150 cursor-pointer custom-select"
                                  >
                                    <option value="todo">À faire</option>
                                    <option value="in_progress">En cours</option>
                                    <option value="done">Terminé</option>
                                  </select>
                                )}
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
        </div>
      </main>
    </div>
  );
};

export default AssistantDashboard;