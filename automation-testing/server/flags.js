const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA_DIR } = require('./store');

// Flags are an HMAC of the challenge id, so they are stable across restarts
// but cannot be guessed without the secret.
function loadSecret() {
  if (process.env.FLAG_SECRET) return process.env.FLAG_SECRET;
  const file = path.join(DATA_DIR, 'secret');
  try {
    return fs.readFileSync(file, 'utf8').trim();
  } catch {
    const secret = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(file, secret);
    return secret;
  }
}

const SECRET = loadSecret();

function flagFor(id) {
  const mac = crypto.createHmac('sha256', SECRET).update(id).digest('hex').slice(0, 12);
  return `FLAG{${id}:${mac}}`;
}

function challengeIdForFlag(flag, ids) {
  const clean = String(flag || '').trim();
  return ids.find((id) => flagFor(id) === clean) || null;
}

module.exports = { flagFor, challengeIdForFlag };
