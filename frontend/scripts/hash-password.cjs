#!/usr/bin/env node
/**
 * Generate AUTH_PASSWORD_HASH for .env.local
 * Usage: node scripts/hash-password.cjs "your-password"
 */
const bcrypt = require("bcryptjs");

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash-password.cjs "your-password"');
  process.exit(1);
}

bcrypt.hash(pwd, 12).then((hash) => {
  console.log("Add to .env.local:\nAUTH_PASSWORD_HASH=" + hash);
});
