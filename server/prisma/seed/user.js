import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password@123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "ADMIN"
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "USER"
    },
    {
      name: "Jane Doe",
      email: "jane@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "USER"
    },
    {
      name: "John Smith",
      email: "john.smith@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "USER"
    },
    {
      name: "Alex Johnson",
      email: "alex@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "USER"
    },
    {
      name: "Store Owner",
      email: "owner@example.com",
      password: password,
      address: "Wakad Pune 411057",
      role: "OWNER"
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }

  console.log("User seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
