-- CreateTable
CREATE TABLE "PortfolioView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioView_userId_idx" ON "PortfolioView"("userId");

-- CreateIndex
CREATE INDEX "PortfolioView_viewedAt_idx" ON "PortfolioView"("viewedAt");

-- AddForeignKey
ALTER TABLE "PortfolioView" ADD CONSTRAINT "PortfolioView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
