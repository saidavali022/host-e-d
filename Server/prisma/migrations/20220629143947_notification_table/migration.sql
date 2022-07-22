/*
  Warnings:

  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `accepted_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `accepted_at` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `employee_notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiver_employee_id` VARCHAR(255) NOT NULL,
    `sender_employee_id` VARCHAR(255) NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_notification` ADD CONSTRAINT `employee_notification_sender_employee_id_fkey` FOREIGN KEY (`sender_employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_notification` ADD CONSTRAINT `employee_notification_receiver_employee_id_fkey` FOREIGN KEY (`receiver_employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
