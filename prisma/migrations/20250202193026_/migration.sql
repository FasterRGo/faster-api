-- DropIndex
DROP INDEX "Invite_id_key";

-- AlterTable
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("id");
