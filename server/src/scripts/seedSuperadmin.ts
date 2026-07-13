// src/scripts/seedSuperadmin.ts
import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../config/db";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

async function seedSuperadmin() {
  const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;

  if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
    console.error("❌ Missing SUPERADMIN_NAME, SUPERADMIN_EMAIL, or SUPERADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existingSuperadmin = await prisma.user.findFirst({
    where: { role: Role.SUPERADMIN },
  });

  if (existingSuperadmin) {
    console.log(`✅ Superadmin already exists: ${existingSuperadmin.email}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, SALT_ROUNDS);

  const superadmin = await prisma.user.create({
    data: {
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPERADMIN,
      isVerified: true,
    },
  });

  console.log(`✅ Superadmin created: ${superadmin.email}`);
  process.exit(0);
}

seedSuperadmin().catch((error) => {
  console.error("❌ Failed to seed superadmin.");
  console.error(error);
  process.exit(1);
});