/*
  Warnings:

  - You are about to alter the column `created_at` on the `policies_attedance` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `shift_timings` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `log_in` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `log_out` TIME NULL,
    MODIFY `shift_in` TIME NOT NULL,
    MODIFY `shift_out` TIME NOT NULL;

-- AlterTable
ALTER TABLE `policies_attedance` MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `shift_timings` MODIFY `shift_in` TIME NOT NULL,
    MODIFY `shift_out` TIME NOT NULL,
    MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `employee_leaves` ADD CONSTRAINT `employee_leaves_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `users`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
