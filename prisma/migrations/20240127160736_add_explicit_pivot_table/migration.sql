/*
  Warnings:

  - You are about to drop the `_SeriesToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SeriesToUser" DROP CONSTRAINT "_SeriesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SeriesToUser" DROP CONSTRAINT "_SeriesToUser_B_fkey";

-- DropTable
DROP TABLE "_SeriesToUser";

-- CreateTable
CREATE TABLE "SeriesUser" (
    "id" SERIAL NOT NULL,
    "seriesId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "SeriesUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
