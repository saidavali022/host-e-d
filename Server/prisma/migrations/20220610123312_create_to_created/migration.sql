/*
  Warnings:

  - You are about to drop the column `create_at` on the `employee_complants_advices_suggestions` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `employee_leaves` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `employee_letters` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `employee_resignation` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `feedback` table. All the data in the column will be lost.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `accepted_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `employee_complants_advices_suggestions` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `employee_leaves` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `employee_letters` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `employee_resignation` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `accepted_at` TIMESTAMP NULL;
