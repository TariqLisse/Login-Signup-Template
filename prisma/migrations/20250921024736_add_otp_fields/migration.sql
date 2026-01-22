-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3);
