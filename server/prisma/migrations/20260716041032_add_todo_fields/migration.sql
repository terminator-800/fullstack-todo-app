-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
