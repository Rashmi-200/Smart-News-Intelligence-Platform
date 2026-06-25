-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_articleId_key" ON "Bookmark"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_articleId_key" ON "ReadingHistory"("userId", "articleId");

-- AlterTable
ALTER TABLE "KeywordAlert" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
