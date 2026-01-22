/*
  Warnings:

  - You are about to drop the column `contact` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_contact_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "contact",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "mobile" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "public"."User"("mobile");
