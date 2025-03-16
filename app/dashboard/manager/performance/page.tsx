"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifySession, getPerformanceStats } from "./server";
import { logoutAction } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/Card";
import { NavBar } from "@/app/components/NavBar";
import { Sidebar } from "@/app/components/Sidebar";
import { User } from "@/app/interfaces";
import toast, { Toaster } from "react-hot-toast";

interface PerformanceStats {
  userId: number;
  username: string;
  role: "collaborateur" | "assistant";
  dossiersProcessed: number;
  totalDossiersAssigned: number;
  completionRate: number;
}

const PerformancePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<PerformanceStats[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const sessionUser = await verifySession();
        setUser(sessionUser);

        const performanceStats = await getPerformanceStats();
        setStats(
          performanceStats.map((stat) => ({
            ...stat,
            role: stat.role as "collaborateur" | "assistant",
          }))
        );
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
        router.push("/login");
      }
    };
    initialize();
  }, [router]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />
      <NavBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} logout={handleLogout} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <main className={`flex-1 p-6 pt-20 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Performance des Équipes</h1>
          {stats.length === 0 ? (
            <p className="text-gray-500 text-center">Aucune donnée disponible</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {stats.map((stat) => (
                <Card
                  key={stat.userId}
                  className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                >
                  <CardHeader className="p-5 bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900">{stat.username}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 text-sm">
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Rôle :</span>
                      <span className="text-gray-900 capitalize">{stat.role}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Assignés :</span>
                      <span className="text-gray-900">{stat.totalDossiersAssigned}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Traités :</span>
                      <span className="text-gray-900">{stat.dossiersProcessed}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Taux de complétion :</span>
                      <span className="text-gray-900">{stat.completionRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;
