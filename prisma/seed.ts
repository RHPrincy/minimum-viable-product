const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Ajout des utilisateurs
    // await prisma.user.createMany({
    //     data: [
    //         {
    //             id : 1,
    //             username: "manager1",
    //             password: "admin",
    //             fonction: "manager",
    //         },
    //         {
    //             id : 2,
    //             username: "manager2",
    //             password: "admin",
    //             fonction: "manager",
    //         },
    //         {
    //             id : 3,
    //             username: "collaborateur1",
    //             password: "admin",
    //             fonction: "collaborateur",
    //             competences: "Gestion de projet",
    //         },
    //         {
    //             id : 4,
    //             username: "collaborateur2",
    //             password: "admin",
    //             fonction: "collaborateur",
    //             competences: "Gestion de projet",
    //         },
    //         {
    //             id : 5,
    //             username: "assistant1",
    //             password: "admin",
    //             fonction: "assistant",
    //             competences: "Saisie de données",
    //         },
    //         {
    //             id : 6,
    //             username: "assistant2",
    //             password: "admin",
    //             fonction: "assistant",
    //             competences: "Saisie de données",
    //         }
    //     ],
    // });
    await prisma.obligationFiscale.createMany({
        data: [
            { id: 1, nom: 'TVA', description: 'TVA Mensuelle' },
            { id: 2, nom: 'BIC', description: 'Obligation BIC' },
            { id: 3, nom: 'HTA', description: 'HTA Obligation' },
        ],
    });
    await prisma.etape.createMany({
        data: [
            { id: 1, id_obligation: 1,nom:"Etape 1", description: "Etape 1 de l'obligation TVA" },
            { id: 2, id_obligation: 1,nom:"Etape 2", description: "Etape 2 de l'obligation TVA" },
            { id: 3, id_obligation: 1,nom:"Etape 3", description: "Etape 3 de l'obligation TVA" },
            { id: 4, id_obligation: 2,nom:"Etape 1", description: "Etape 1 de l'obligation BIC" },
            { id: 5, id_obligation: 2,nom:"Etape 2", description: "Etape 2 de l'obligation BIC" },
            { id: 6, id_obligation: 3,nom:"Etape 1", description: "Etape 1 de l'obligation HTA" },
            { id: 7, id_obligation: 3,nom:"Etape 2", description: "Etape 2 de l'obligation HTA" },
        ],
    });
    await prisma.tache.createMany({
        data: [
            { id: 1, id_etape: 1, description: "Tache 1 de l'etape 1 de l'obligation TVA" },
            { id: 2, id_etape: 1, description: "Tache 2 de l'etape 1 de l'obligation TVA" },
            { id: 3, id_etape: 1, description: "Tache 3 de l'etape 1 de l'obligation TVA" },
            { id: 4, id_etape: 2, description: "Tache 1 de l'etape 2 de l'obligation TVA" },
            { id: 5, id_etape: 2, description: "Tache 2 de l'etape 2 de l'obligation TVA" },
            { id: 6, id_etape: 3, description: "Tache 1 de l'etape 3 de l'obligation TVA" },
            { id: 7, id_etape: 3, description: "Tache 2 de l'etape 3 de l'obligation TVA" },
            { id: 8, id_etape: 3, description: "Tache 3 de l'etape 3 de l'obligation TVA" },
            { id: 9, id_etape: 4, description: "Tache 1 de l'etape 1 de l'obligation BIC" },
            { id: 10, id_etape: 4, description: "Tache 2 de l'etape 1 de l'obligation BIC" },
            { id: 11, id_etape: 5, description: "Tache 1 de l'etape 2 de l'obligation BIC" },
            { id: 12, id_etape: 5, description: "Tache 2 de l'etape 2 de l'obligation BIC" },
            { id: 13, id_etape: 6, description: "Tache 1 de l'etape 1 de l'obligation HTA" },
            { id: 14, id_etape: 7, description: "Tache 1 de l'etape 2 de l'obligation HTA" },
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