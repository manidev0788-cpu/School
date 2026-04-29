#!/usr/bin/env node
/**
 * Applies supabase/ensure_students_schema.sql using direct Postgres (pooler) connection.
 * Requires DATABASE_URL in the environment (Supabase → Project Settings → Database → URI).
 * Session pooler (port 5432/6543) recommended for DDL.
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-ensure-students.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "..", "supabase", "ensure_students_schema.sql");

const url = process.env.DATABASE_URL;
if (!url || !String(url).startsWith("postgres")) {
  console.error(
    "Missing DATABASE_URL. Add your Supabase Postgres connection string to .env.local, e.g.\n" +
      "DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres\n",
  );
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("Applied ensure_students_schema.sql successfully.");
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
