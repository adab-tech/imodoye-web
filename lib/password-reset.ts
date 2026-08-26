import crypto from "crypto";
import { sql } from "@/lib/db";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Stores a hash of the token, never the token itself — a DB read alone
// can't be used to reset a password. Returns the raw token to email/share.
export async function createResetToken(profileId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  await sql`update profiles set reset_token_hash = ${hashToken(token)}, reset_token_expires = ${expires} where id = ${profileId}`;
  return token;
}

export async function profileForResetToken(token: string) {
  const rows = await sql`
    select id, email, full_name from profiles
    where reset_token_hash = ${hashToken(token)} and reset_token_expires > now()
  `;
  return rows[0] ?? null;
}

export async function clearResetToken(profileId: string) {
  await sql`update profiles set reset_token_hash = null, reset_token_expires = null where id = ${profileId}`;
}
