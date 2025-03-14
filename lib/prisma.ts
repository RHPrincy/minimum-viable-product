import { PrismaClient } from '@prisma/client';

// Crée une référence vers l'objet global qui contiendra notre instance Prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };


// Creation de l'instance Singleton de PrismaClient
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;