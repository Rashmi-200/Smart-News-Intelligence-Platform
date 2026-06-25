-- CreateTable
CREATE TABLE "CompanyMention" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,
    "mentionedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisasterAlert" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisasterAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyMention" ADD CONSTRAINT "CompanyMention_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
