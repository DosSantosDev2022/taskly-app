/*
  Warnings:

  - You are about to drop the column `company` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Client` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "company",
DROP COLUMN "description",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" "ClientStatus",
ADD COLUMN     "zipcode" TEXT;
