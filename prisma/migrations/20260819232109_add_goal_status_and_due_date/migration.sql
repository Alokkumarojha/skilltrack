/*
  Warnings:

  - You are about to drop the column `completed` on the `Goal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "completed",
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "status" "GoalStatus" NOT NULL DEFAULT 'NOT_STARTED';
