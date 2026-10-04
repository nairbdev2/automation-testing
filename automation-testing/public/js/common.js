// Shared helpers for every challenge page (and same-origin frames).
(function () {
  const params = new URLSearchParams(location.search);

  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const Dojo = {
    id: document.body.dataset.challenge,
    token: params.get('t'),
    data: null,

    async api(url, body) {
      const opts = body === undefined
        ? {}
        : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
      const res = await fetch(url, opts);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || res.statusText);
      return json;
    },

    // Top-level challenge page: render the brief, start a session, return its data.
    async boot() {
      const main = document.querySelector('main');
      const header = document.createElement('header');
      header.className = 'topbar';
      header.innerHTML = '<a href="/" class="brand">&larr; Automation Dojo</a><span class="crumb"></span>';
      document.body.prepend(header);

      const brief = document.createElement('section');
      brief.className = 'brief';
      main.prepend(brief);

      const result = document.createElement('section');
      result.className = 'result';
      result.innerHTML = '<div id="error" role="alert"></div><div id="flag-box" hidden><span>Solved! Your flag:</span><code id="flag"></code></div>';
      main.append(result);

      const [meta, start] = await Promise.all([
        this.api(`/api/challenges/${this.id}`),
        this.api(`/api/c/${this.id}/start`, {}),
      ]);
      document.title = `${meta.title} · Automation Dojo`;
      header.querySelector('.crumb').textContent = `Tier ${meta.tier} · ${meta.tierName}`;
      brief.innerHTML = `
        <h1>${esc(meta.title)} ${meta.solved ? '<span class="badge">solved</span>' : ''}</h1>
        <p class="objective">${esc(meta.objective)}</p>
        <details class="hints"><summary>Hints (${meta.hints.length})</summary>
          <ol>${meta.hints.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
        </details>`;

      this.token = start.token;
      this.data = start.data;
      return start.data;
    },

    // Same-origin frame: reuse the parent's session token from ?t=
    attach() {
      if (!this.token) this.showError('Missing session token.');
      return this;
    },

    action(name, body = {}) {
      return this.api(`/api/c/${this.id}/action/${name}`, { ...body, t: this.token });
    },

    actionUrl(name) {
      return `/api/c/${this.id}/action/${name}?t=${encodeURIComponent(this.token)}`;
    },

    async solve(answer) {
      this.showError('');
      try {
        const r = await this.api(`/api/c/${this.id}/solve`, { t: this.token, answer });
        if (r.ok) this.showFlag(r.flag);
        else this.showError(r.message);
        return r;
      } catch (e) {
        this.showError(e.message);
        return { ok: false, message: e.message };
      }
    },

    showFlag(flag) {
      if (window !== window.top) {
        window.top.postMessage({ type: 'dojo-flag', flag }, location.origin);
        return;
      }
      const box = document.getElementById('flag-box');
      document.getElementById('flag').textContent = flag;
      box.hidden = false;
      this.showError('');
    },

    showError(msg) {
      const el = document.getElementById('error');
      if (el) el.textContent = msg || '';
    },

    async foreignOrigin() {
      const { foreignPort } = await this.api('/api/config');
      return `${location.protocol}//${location.hostname}:${foreignPort}`;
    },

    randomId(prefix = 'x') {
      return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
    },

    esc,
  };

  // Frames on the same origin hand their flag up to the top page.
  window.addEventListener('message', (e) => {
    if (e.origin === location.origin && e.data?.type === 'dojo-flag' && window === window.top) {
      Dojo.showFlag(e.data.flag);
    }
  });

  window.Dojo = Dojo;
})();
