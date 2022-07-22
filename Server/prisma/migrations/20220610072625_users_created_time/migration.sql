-- DropIndex
DROP INDEX `employee_compensation_employee_id_fkey` ON `employee_compensation`;

-- DropIndex
DROP INDEX `employee_complants_advices_suggestions_employee_id_fkey` ON `employee_complants_advices_suggestions`;

-- DropIndex
DROP INDEX `employee_letters_employee_id_fkey` ON `employee_letters`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
