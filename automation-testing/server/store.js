const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

fs.mkdirSync(DATA_DIR, { recursive: true });

// --- Challenge sessions (in memory) -------------------------------------
// Each visit to a challenge page starts a session holding the randomized
// data. `pub` is sent to the browser, `priv` (the answer) never leaves here.
const sessions = new Map();

function createSession(challengeId, { pub = {}, priv = {} }) {
  const token = crypto.randomBytes(12).toString('hex');
  const session = { token, challengeId, pub, priv, state: {}, created: Date.now() };
  sessions.set(token, session);
  return session;
}

function getSession(token, challengeId) {
  const session = sessions.get(String(token || ''));
  if (!session) return null;
  if (Date.now() - session.created > SESSION_TTL_MS) {
    sessions.delete(session.token);
    return null;
  }
  if (challengeId && session.challengeId !== challengeId) return null;
  return session;
}

setInterval(() => {
  const now = Date.now();
  for (const [token, s] of sessions) {
    if (now - s.created > SESSION_TTL_MS) sessions.delete(token);
  }
}, 10 * 60 * 1000).unref();

// --- Progress (persisted to disk) ---------------------------------------
function loadProgress() {
  try {
    const p = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    return { solved: p.solved || {} };
  } catch {
    return { solved: {} };
  }
}

function saveProgress(progress) {
  const tmp = PROGRESS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(progress, null, 2));
  fs.renameSync(tmp, PROGRESS_FILE);
}

module.exports = { DATA_DIR, createSession, getSession, loadProgress, saveProgress };
