// /lib/auth.ts
import { prisma } from '@/lib/prisma';

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

