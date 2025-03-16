"use client";
import { logoutAction } from "@/actions/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Team() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Team Page</h1>

      <Link href="/dashboard/manager" className="text-blue-600 hover:underline mb-4">
        Retourner au tableau de bord
      </Link>
      <Link href="/dashboard/manager/performance" className="text-blue-600 hover:underline mb-4">
        Voir les performances
      </Link>

      <button 
        onClick={handleLogout} 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
}
