-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;
