-- CreateTable
CREATE TABLE "public"."Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Store_name_idx" ON "public"."Store"("name");

-- CreateIndex
CREATE INDEX "Store_address_idx" ON "public"."Store"("address");

-- CreateIndex
CREATE INDEX "Store_ownerId_idx" ON "public"."Store"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."Store" ADD CONSTRAINT "Store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
