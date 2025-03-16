"use server";
import { redirect } from "next/navigation";
import { destroySession } from "@/lib/session";
// Action de déconnexion côté serveur
export async function logoutAction() {
    await destroySession();
    redirect("/login");
}