// Importation des types NextRequest et NextResponse depuis Next.js pour gérer les requêtes et réponses
import { NextRequest, NextResponse } from "next/server";

// Importation des fonctions d'authentification et de création de session depuis un fichier auth personnalisé
import { authenticate } from "@/lib/auth";
import { createSession } from "@/lib/session";

// Définition d'une fonction POST asynchrone qui gère les requêtes POST
export async function POST(req: NextRequest) {
  
  // Extraction des champs username et password depuis le corps de la requête JSON
    const { username, password } = await req.json();

    // Tentative d'authentification de l'utilisateur avec les identifiants fournis
    const user = await authenticate(username, password);
    
    // Vérification si l'authentification a échoué (user est null ou undefined)
    if (!user) {
        // Retourne une réponse JSON avec un message d'erreur et un statut HTTP 401 (Non autorisé)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Création d'une session pour l'utilisateur authentifié en utilisant son ID
    await createSession(user.id, user.fonction);
    
    // Retourne une réponse JSON contenant la fonction (rôle) de l'utilisateur avec un statut 200 par défaut
    return NextResponse.json({ fonction: user.fonction });
}