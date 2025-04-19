/*
  Warnings:

  - You are about to drop the column `accepted` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `participant` table. All the data in the column will be lost.
  - The values [INPROGRESS] on the enum `Task_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `accepted`,
    ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `participant` DROP COLUMN `Role`,
    ADD COLUMN `role` ENUM('VIEWER', 'MEMBER', 'MANAGER') NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE `task` MODIFY `status` ENUM('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'REVIEWED') NOT NULL DEFAULT 'TODO';
