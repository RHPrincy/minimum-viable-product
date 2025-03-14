-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fonction` VARCHAR(191) NOT NULL,
    `competences` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObligationFiscale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etape` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_obligation` INTEGER NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date_limite` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tache` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_etape` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AffectationTache` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tache` INTEGER NOT NULL,
    `id_utilisateur` INTEGER NOT NULL,
    `id_dossier` VARCHAR(191) NOT NULL,
    `statut` ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
    `date_affectation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Etape` ADD CONSTRAINT `Etape_id_obligation_fkey` FOREIGN KEY (`id_obligation`) REFERENCES `ObligationFiscale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tache` ADD CONSTRAINT `Tache_id_etape_fkey` FOREIGN KEY (`id_etape`) REFERENCES `Etape`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AffectationTache` ADD CONSTRAINT `AffectationTache_id_tache_fkey` FOREIGN KEY (`id_tache`) REFERENCES `Tache`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AffectationTache` ADD CONSTRAINT `AffectationTache_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
