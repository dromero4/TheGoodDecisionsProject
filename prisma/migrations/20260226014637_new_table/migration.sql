-- CreateTable
CREATE TABLE "RawTopTexProducts" (
    "externalId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "source" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawTopTexProducts_pkey" PRIMARY KEY ("externalId")
);
