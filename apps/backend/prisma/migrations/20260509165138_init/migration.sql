-- CreateTable
CREATE TABLE "FeaturedProductPreference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scope" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "productTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "FeaturedProductPreference_scope_rank_idx" ON "FeaturedProductPreference"("scope", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedProductPreference_scope_productId_key" ON "FeaturedProductPreference"("scope", "productId");
