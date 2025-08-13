import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.findFirst({
    where: { role: "OWNER" }
  });

  if (!owner) {
    console.error("No store owner found. Please run the user seed first.");
    process.exit(1);
  }

  const stores = [
    {
      name: "FreshMart Grocery",
      address: "Market Road, Wakad, Pune 411057",
      ownerId: owner.id
    },
    {
      name: "TechWorld Electronics",
      address: "IT Park Road, Wakad, Pune 411057",
      ownerId: owner.id
    },
    {
      name: "Book Haven",
      address: "College Street, Wakad, Pune 411057",
      ownerId: owner.id
    }
  ];

for (const store of stores) {
  const exists = await prisma.store.findFirst({
    where: {
      name: store.name,
      ownerId: store.ownerId
    }
  });

  if (!exists) {
    await prisma.store.create({ data: store });
  }
}
  console.log("Store seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
