#!/usr/bin/env node
/**
 * Applies supabase/ensure_class_fees_schema.sql via Postgres (pooler URI).
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-ensure-class-fees.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "..", "supabase", "ensure_class_fees_schema.sql");

const url = process.env.DATABASE_URL;
if (!url || !String(url).startsWith("postgres")) {
  console.error(
    "Missing DATABASE_URL. Add your Supabase Postgres connection string to .env.local.\n",
  );
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("Applied ensure_class_fees_schema.sql successfully.");
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
