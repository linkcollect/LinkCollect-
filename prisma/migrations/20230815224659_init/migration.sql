-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profilePic" TEXT,
    "bio" TEXT,
    "password" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "emailToken" TEXT,
    "verified" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socials" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savedCollectionId" TEXT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Bookmarks" (
    "_id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT,
    "link" TEXT NOT NULL,
    "note" TEXT,
    "favicon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "CollectionUpvote" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionUpvote_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PinDetails" (
    "_id" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT,
    "bookmarkId" TEXT,

    CONSTRAINT "PinDetails_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_title_key" ON "Collection"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionUpvote_userId_collectionId_key" ON "CollectionUpvote"("userId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "PinDetails_collectionId_key" ON "PinDetails"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "PinDetails_bookmarkId_key" ON "PinDetails"("bookmarkId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_savedCollectionId_fkey" FOREIGN KEY ("savedCollectionId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUpvote" ADD CONSTRAINT "CollectionUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionUpvote" ADD CONSTRAINT "CollectionUpvote_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinDetails" ADD CONSTRAINT "PinDetails_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinDetails" ADD CONSTRAINT "PinDetails_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmarks"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
