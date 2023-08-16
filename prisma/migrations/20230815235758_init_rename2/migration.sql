/*
  Warnings:

  - You are about to drop the `Bookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "PinDetails" DROP CONSTRAINT "PinDetails_bookmarkId_fkey";

-- DropTable
DROP TABLE "Bookmarks";

-- CreateTable
CREATE TABLE "timeline" (
    "_id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT,
    "link" TEXT NOT NULL,
    "note" TEXT,
    "favicon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinDetails" ADD CONSTRAINT "PinDetails_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "timeline"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
