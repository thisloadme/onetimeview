-- AlterTable: Add password reset columns
ALTER TABLE "User" ADD COLUMN "reset_token" TEXT;
ALTER TABLE "User" ADD COLUMN "reset_token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_reset_token_key" ON "User"("reset_token");
