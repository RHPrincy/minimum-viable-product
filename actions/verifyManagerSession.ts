"use server"
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { User } from "@/app/interfaces";

// Vérifie la session et renvoie l'utilisateur ou redirige
export async function verifySession(): Promise<User> {
    const user = await getSessionUser();
    if (!user || user.fonction !== "manager") {
        redirect("/login");
    }
    return user;
}