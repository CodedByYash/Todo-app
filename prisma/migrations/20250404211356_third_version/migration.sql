-- AlterEnum
ALTER TYPE "priorityEnum" ADD VALUE 'no_priority';

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "dueDate" DROP NOT NULL;
