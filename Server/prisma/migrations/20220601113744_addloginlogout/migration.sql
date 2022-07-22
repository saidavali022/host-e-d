/*
  Warnings:

  - The values [pendding] on the enum `task_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[employee_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date_in` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_in` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_out` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `employee_id` on table `attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `date_in` DATE NOT NULL,
    ADD COLUMN `shift_in` TIME NOT NULL,
    ADD COLUMN `shift_out` TIME NOT NULL,
    ADD COLUMN `status` ENUM('break', 'available', 'unavailable', 'salah') NOT NULL DEFAULT 'unavailable',
    MODIFY `log_in` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `log_out` TIME NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL,
    MODIFY `employee_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `status` ENUM('pending', 'completed', 'started', '') NOT NULL;

-- CreateTable
CREATE TABLE `shift_timings` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_id` VARCHAR(191) NOT NULL,
    `shift_in` TIME NOT NULL,
    `shift_out` TIME NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `policies_attedance` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `start_minutes` SMALLINT UNSIGNED NULL,
    `end_minutes` SMALLINT UNSIGNED NULL,
    `point` FLOAT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lop` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_employee_id_key` ON `users`(`employee_id`);

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `Attendance_user_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `breaks` ADD CONSTRAINT `breaks_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `attendance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_attendees` ADD CONSTRAINT `event_attendees_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `event_attendees` ADD CONSTRAINT `event_attendees_attendee_id_fkey` FOREIGN KEY (`attendee_id`) REFERENCES `users`(`employee_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift_timings` ADD CONSTRAINT `shift_timings_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
