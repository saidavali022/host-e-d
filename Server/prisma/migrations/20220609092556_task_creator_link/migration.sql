/*
  Warnings:

  - You are about to drop the column `createdAt` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id]` on the table `checklists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee_compensation` DROP FOREIGN KEY `employee_compensation_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_complants_advices_suggestions` DROP FOREIGN KEY `employee_complants_advices_suggestions_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_letters` DROP FOREIGN KEY `employee_letters_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_employee_id_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `checklists_employee_id_key` ON `checklists`(`employee_id`);

-- AddForeignKey
ALTER TABLE `checklists` ADD CONSTRAINT `checklists_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
