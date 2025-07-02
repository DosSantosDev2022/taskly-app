-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "briefingId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Briefing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    "projectId" TEXT,
    "companyName" TEXT NOT NULL,
    "cnpj" TEXT,
    "projectLead" TEXT NOT NULL,
    "phoneNumberWhatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "currentWebsite" TEXT,
    "businessDescription" TEXT NOT NULL,
    "mainProductsServices" TEXT NOT NULL,
    "businessDifferentiator" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "websiteObjectives" TEXT[],
    "otherWebsiteObjective" TEXT,
    "websiteExpectation" TEXT NOT NULL,
    "essentialFeatures" TEXT,
    "hasContent" TEXT NOT NULL,
    "websitePages" TEXT[],
    "otherWebsitePages" TEXT,
    "hasLogoIdentity" TEXT NOT NULL,
    "referenceLink1" TEXT,
    "whatLikedAboutLink1" TEXT,
    "referenceLink2" TEXT,
    "whatLikedAboutLink2" TEXT,
    "referenceLink3" TEXT,
    "whatLikedAboutLink3" TEXT,
    "preferredColors" TEXT,
    "desiredStyle" TEXT[],
    "otherDesiredStyle" TEXT,
    "hasDomain" TEXT NOT NULL,
    "hasHosting" TEXT NOT NULL,
    "desiredDeadline" TEXT NOT NULL,
    "hasDefinedBudget" TEXT NOT NULL,
    "budgetRange" TEXT,
    "howDidYouHear" TEXT NOT NULL,
    "otherHowDidYouHear" TEXT,
    "additionalObservations" TEXT,

    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_briefingId_fkey" FOREIGN KEY ("briefingId") REFERENCES "Briefing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Briefing" ADD CONSTRAINT "Briefing_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Briefing" ADD CONSTRAINT "Briefing_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
