/*
  Warnings:

  - You are about to drop the column `avatarImage` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "avatarImage",
DROP COLUMN "name",
ADD COLUMN     "teamAvatarImage" TEXT,
ADD COLUMN     "teamDescription" TEXT,
ADD COLUMN     "teamName" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");
