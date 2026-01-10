-- AlterTable
ALTER TABLE "Project" ADD COLUMN "clientName" TEXT,
ADD COLUMN "industry" TEXT,
ADD COLUMN "problem" TEXT,
ADD COLUMN "solution" TEXT,
ADD COLUMN "impact" TEXT[] DEFAULT ARRAY[]::TEXT[];
