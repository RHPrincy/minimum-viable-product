// /app/dashboard/manager/server.ts
"use server";
import { redirect } from "next/navigation";
import { getSessionUser, destroySession } from "@/lib/auth";

// Interfaces
interface User {
    id: number;
    username: string;
    fonction: string;
    competences?: string | null;
}

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
    const user = await getSessionUser();
    if (!user || user.fonction !== "manager") {
        redirect("/login");
    }
    return user;
}

// Action de déconnexion côté serveur
export async function logoutAction() {
    await destroySession();
    redirect("/login");
}
