import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const envResult = dotenv.config({ path: path.join(__dirname, "..", ".env") });

const url = process.env.DATABASE_URL || envResult.parsed?.DATABASE_URL;

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: url!,
  },
  migrations: {
    seed: "npx tsx src/backend/db/seed.ts",
  },
});
