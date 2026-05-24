import path from "node:path";
import { defineConfig } from "prisma/config";

const dbPath = path.join(__dirname, "dev.db");

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: `file:${dbPath}`,
  },
  migrations: {
    seed: "npx tsx src/backend/db/seed.ts",
  },
});
