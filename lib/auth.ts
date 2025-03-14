import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Vérifier les identifiants et retourner l'utilisateur (Not Safe)
export async function authenticate(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (user && user.password === password) {
        return user;
    }
    return null;
}

// Créer une session avec un cookie
export async function createSession(userId: number, fonction: string) {
    const cookieValues = JSON.stringify({ userId, fonction });
    (await cookies()).set('session', cookieValues.toString(), { httpOnly: true });
    console.log('Session created');

}

// Récupérer l'utilisateur connecté
export async function getSessionUser() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return null;

    const cookieValue = JSON.parse(session.value);
    const id = parseInt(cookieValue.userId);

    return await prisma.user.findUnique({
        where: { id: (id) },
    });
}

// Déconnexion
export async function destroySession() {
    (await cookies()).delete('session');
}