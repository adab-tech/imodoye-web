// One-off: apply db/schema.sql to the connected Neon database.
// Usage: node scripts/apply-schema.mjs
import { readFileSync } from "node:fs";
import { Client } from "pg";

const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query(schema);
  console.log("Schema applied.");
} finally {
  await client.end();
}
