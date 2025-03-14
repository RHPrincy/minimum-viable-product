const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Ajout des utilisateurs
    await prisma.user.createMany({
        data: [
            {
                id : 1,
                username: "manager1",
                password: "admin",
                fonction: "manager",
            },
            {
                id : 2,
                username: "manager2",
                password: "admin",
                fonction: "manager",
            },
            {
                id : 3,
                username: "collaborateur1",
                password: "admin",
                fonction: "collaborateur",
                competences: "Gestion de projet",
            },
            {
                id : 4,
                username: "collaborateur2",
                password: "admin",
                fonction: "collaborateur",
                competences: "Gestion de projet",
            },
            {
                id : 5,
                username: "assistant1",
                password: "admin",
                fonction: "assistant",
                competences: "Saisie de données",
            },
            {
                id : 6,
                username: "assistant2",
                password: "admin",
                fonction: "assistant",
                competences: "Saisie de données",
            }
        ],
    });
}

    main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });