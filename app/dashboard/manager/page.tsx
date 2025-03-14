"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllDossier } from "@/lib/dossier";
import { verifySession, logoutAction } from "./server";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { NavBar } from "@/app/components/NavBar";
import { Sidebar } from "@/app/components/Sidebar";
import { Badge } from "@/app/components/Badge";
import Link from "next/link";

// Interfaces
interface User {
    id: number;
    username: string;
    fonction: string;
    competences?: string | null;
    taches_traitees?: number | null;
}

interface Dossier {
    id: string;
    Titre: string;
    Nom: string;
    Genre: string;
    Activite: string;
    SIRET: string;
    Adresse: string;
    Email: string;
    "Forme juridique": string;
    "Regime fiscal": string;
    "Regime imposition": string;
    Type: string;
    manager: number;
}

const ManagerDashboard = () => {
    console.log("Initialisation du composant ManagerDashboard");

    const [user, setUser] = useState<User | null>(null);
    console.log("État user initialisé :", user);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    console.log("État sidebarOpen initialisé :", sidebarOpen);

    const [userFiles, setUserFiles] = useState<Dossier[]>([]);
    console.log("État userFiles initialisé :", userFiles);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    console.log("État errorMessage initialisé :", errorMessage);

    const router = useRouter();
    console.log("Router initialisé");

    useEffect(() => {

        console.log("useEffect déclenché");

        const initializeUser = async () => {
            console.log("Début de l'initialisation de l'utilisateur");
            
            try {
                const sessionUser = await verifySession(); // Récupérer l'utilisateur depuis le serveur
                console.log("Utilisateur de session récupéré :", sessionUser);
                setUser(sessionUser);

                const result = await getAllDossier();
                console.log("Résultat de getAllDossier :", result);
                const dossiers = Array.isArray(result) ? result : [];
                console.log("Dossiers filtrés :", dossiers);

                const filteredFiles = dossiers.filter((file) => file.manager === sessionUser.id);
                console.log("Dossiers filtrés par manager :", filteredFiles);
                setUserFiles(filteredFiles);
            } catch (error) {
                console.error("Échec de l'initialisation du tableau de bord :", error);
                setErrorMessage(
                    error instanceof Error ? error.message : "Une erreur est survenue"
                );
                console.log("Redirection vers /login en raison d'une erreur");
                router.push("/login"); // Rediriger en cas d'erreur inattendue
            }
        };

        initializeUser();
    }, [router]);

    const toggleSidebar = () => {
        console.log("Basculement de l'état sidebarOpen");
        setSidebarOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        console.log("Début de la déconnexion");
        try {
            await logoutAction(); // Appeler l'action serveur pour déconnexion
            console.log("Déconnexion réussie");
            setUser(null);
            console.log("Redirection vers /login après déconnexion");
            router.push("/login"); // Redirection côté client après déconnexion
        } catch (error) {
            console.error("Échec de la déconnexion :", error);
            setErrorMessage("Erreur lors de la déconnexion");
        }
    };

    if (!user) {
        console.log("Utilisateur non connecté, retourne null");
        return null;
    }

    console.log("Rendu du composant ManagerDashboard");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <NavBar toggleSidebar={toggleSidebar} user={user} logout={handleLogout} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} user={user} />

            <main
                className={`flex-1 px-4 pt-20 transition-all duration-300 lg:px-8 ${sidebarOpen ? "md:ml-64" : "md:ml-16"
                    }`}
            >
                <div className="mx-auto max-w-5xl pt-6">
                    {/* Section Bienvenue */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Bienvenue, {user.username}
                        </h1>
                        <p className="mt-2 text-gray-600">Liste des projets attribués</p>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card
                            variant="glass"
                            padding="md"
                            className="bg-white bg-opacity-90 backdrop-blur-md shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 animate-slide-up"
                            style={{ animationDelay: "100ms" }}
                        >
                            <CardContent gap="sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total des dossiers</p>
                                        <h3 className="mt-1 text-3xl font-semibold text-gray-900">
                                            {userFiles.length}
                                        </h3>
                                    </div>
                                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <path d="M16 2v5h5" />
                                            <path d="M21 6v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11.5L21 6z" />
                                        </svg>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section des dossiers */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Vos dossiers</h2>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        )}

                        <p className="text-sm text-gray-600 mb-4">
                            Cliquez sur un dossier pour voir plus de détails
                        </p>

                        {userFiles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Aucun dossier attribué.</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {userFiles.map((file, index) => (
                                    <Link href={`/dashboard/manager/dossier/${file.id}`} key={file.id}>
                                        <Card
                                            variant="glass"
                                            padding="md"
                                            className="bg-white bg-opacity-90 backdrop-blur-md shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 cursor-pointer animate-slide-up"
                                            style={{ animationDelay: `${100 * (index + 1)}ms` }}
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle size="md" className="text-gray-900">
                                                        {file.Titre}
                                                    </CardTitle>
                                                    <Badge className="bg-indigo-100 text-indigo-800">
                                                        {file["Forme juridique"]}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent gap="sm">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Activité</p>
                                                        <p className="font-medium text-gray-900">{file.Activite}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Régime fiscal</p>
                                                        <p className="font-medium text-gray-900">{file["Regime fiscal"]}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Type d'imposition</p>
                                                        <p className="font-medium text-gray-900">
                                                            {file["Regime imposition"]}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Catégorie</p>
                                                        <p className="font-medium text-gray-900">{file.Type}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerDashboard;