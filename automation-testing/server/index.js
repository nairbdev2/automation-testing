const path = require('path');
const express = require('express');
const { challenges, byId, TIERS } = require('./challenges');
const store = require('./store');
const { flagFor, challengeIdForFlag } = require('./flags');

const PORT = Number(process.env.PORT) || 3000;
const FOREIGN_PORT = Number(process.env.FOREIGN_PORT) || 3001;

// Express 4 does not catch rejected promises, so wrap async handlers.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function meta(c, progress) {
  return {
    id: c.id,
    tier: c.tier,
    tierName: TIERS[c.tier],
    title: c.title,
    objective: c.objective,
    hints: c.hints,
    path: `/c/${c.id}/`,
    solved: Boolean(progress.solved[c.id]),
  };
}

function findChallenge(req, res) {
  const c = byId[req.params.id];
  if (!c) res.status(404).json({ error: 'Unknown challenge.' });
  return c;
}

function findSession(req, res, challengeId) {
  const token = req.body?.t ?? req.query.t;
  const s = store.getSession(token, challengeId);
  if (!s) res.status(400).json({ error: 'Session expired or invalid. Reload the challenge page.' });
  return s;
}

// --------------------------------------------------------------- main app
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// If the foreign port is remapped (e.g. docker -p 4001:3001), tell the browser the public one.
const PUBLIC_FOREIGN_PORT = Number(process.env.PUBLIC_FOREIGN_PORT) || FOREIGN_PORT;
app.get('/api/config', (req, res) => res.json({ foreignPort: PUBLIC_FOREIGN_PORT }));

app.get('/api/challenges', (req, res) => {
  const progress = store.loadProgress();
  res.json({ tiers: TIERS, challenges: challenges.map((c) => meta(c, progress)) });
});

app.get('/api/challenges/:id', (req, res) => {
  const c = findChallenge(req, res);
  if (c) res.json(meta(c, store.loadProgress()));
});

app.post('/api/c/:id/start', (req, res) => {
  const c = findChallenge(req, res);
  if (!c) return;
  const s = store.createSession(c.id, c.start());
  res.json({ token: s.token, data: s.pub });
});

app.all('/api/c/:id/action/:name', wrap(async (req, res) => {
  const c = findChallenge(req, res);
  if (!c) return;
  const action = c.actions?.[req.params.name];
  if (!action) return res.status(404).json({ error: 'Unknown action.' });
  const s = findSession(req, res, c.id);
  if (!s) return;
  const result = await action(s, { ...req.query, ...(req.body || {}) });
  if (result?.__file) {
    res.attachment(result.__file.name).type('text/plain').send(result.__file.content);
  } else {
    res.json(result);
  }
}));

app.post('/api/c/:id/solve', wrap(async (req, res) => {
  const c = findChallenge(req, res);
  if (!c) return;
  const s = findSession(req, res, c.id);
  if (!s) return;
  const result = await c.verify(req.body.answer, s);
  if (result === true) {
    res.json({ ok: true, flag: flagFor(c.id) });
  } else {
    res.json({ ok: false, message: result || 'Not quite.' });
  }
}));

app.post('/api/flags', (req, res) => {
  const id = challengeIdForFlag(req.body?.flag, challenges.map((c) => c.id));
  if (!id) return res.json({ ok: false, message: 'That flag is not valid.' });
  const progress = store.loadProgress();
  const already = Boolean(progress.solved[id]);
  if (!already) {
    progress.solved[id] = new Date().toISOString();
    store.saveProgress(progress);
  }
  res.json({ ok: true, id, title: byId[id].title, already });
});

app.post('/api/reset', (req, res) => {
  store.saveProgress({ solved: {} });
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error.' });
});

app.listen(PORT, () => console.log(`Automation Dojo running on http://localhost:${PORT}`));

// ----------------------------------------------- foreign origin (iframes)
// A second listener on another port = a different origin, so the browser
// treats these pages as cross-origin when embedded in the main app.
const foreign = express();
foreign.disable('x-powered-by');

foreign.get('/api/peek/:id/:token', (req, res) => {
  const c = byId[req.params.id];
  const s = c?.peek && store.getSession(req.params.token, c.id);
  if (!s) return res.status(400).json({ error: 'Invalid session.' });
  res.json(c.peek(s));
});

foreign.use(express.static(path.join(__dirname, '..', 'foreign'), { extensions: ['html'] }));

foreign.listen(FOREIGN_PORT, () => console.log(`Foreign origin running on http://localhost:${FOREIGN_PORT}`));
