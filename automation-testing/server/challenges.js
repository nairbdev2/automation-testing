const crypto = require('crypto');

// --- Random helpers -------------------------------------------------------
const WORDS = [
  'falcon', 'ember', 'quartz', 'nimbus', 'cobalt', 'willow', 'saffron', 'glacier',
  'orbit', 'pepper', 'lantern', 'marble', 'thistle', 'harbor', 'meadow', 'raven',
  'tundra', 'velvet', 'zephyr', 'cinder', 'juniper', 'onyx', 'prism', 'sable',
];
const FIRST_NAMES = ['Ada', 'Linus', 'Grace', 'Alan', 'Barbara', 'Dennis', 'Margaret', 'Ken', 'Radia', 'Guido', 'Hedy', 'Tim'];
const LAST_NAMES = ['Lovelace', 'Torvalds', 'Hopper', 'Turing', 'Liskov', 'Ritchie', 'Hamilton', 'Thompson', 'Perlman', 'Rossum', 'Lamarr', 'Berners'];
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const rint = (min, max) => crypto.randomInt(min, max + 1);
const pick = (arr) => arr[crypto.randomInt(arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const code = (n = 6) => Array.from({ length: n }, () => pick([...CODE_ALPHABET])).join('');
const cap = (w) => w[0].toUpperCase() + w.slice(1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (v) => String(v ?? '').trim();

// --- Challenge registry ---------------------------------------------------
// start()            -> { pub, priv }   pub goes to the browser, priv stays here
// verify(answer, s)  -> true | 'error message'
// actions[name](s, input) -> JSON object, or { __file: { name, content } }
// peek(s)            -> data for pages served from the foreign origin (:3001)

const TIERS = {
  1: 'Basics',
  2: 'Timing & State',
  3: 'Frames',
  4: 'Shadow DOM',
  5: 'Boss Level',
};

const challenges = [
  // ---------------------------------------------------------------- Tier 1
  {
    id: 'login',
    tier: 1,
    title: 'Sticky Note Login',
    objective: 'Someone left the credentials on a sticky note. Read them off the page, fill in the login form and sign in.',
    hints: [
      'Credentials change on every page load, so read them from the page each run, never hard-code them.',
      'Look for labels and placeholders: they make better selectors than generated CSS paths.',
    ],
    start() {
      const username = `${pick(WORDS)}${rint(10, 99)}`;
      const password = code(10);
      return { pub: { username, password }, priv: { username, password } };
    },
    verify(a, s) {
      if (norm(a?.username) !== s.priv.username) return 'Unknown username.';
      if (a?.password !== s.priv.password) return 'Wrong password.';
      return true;
    },
  },
  {
    id: 'dynamic-ids',
    tier: 1,
    title: 'Shape Shifters',
    objective: 'Click the button with the requested label. IDs and classes are random and the grid re-renders every few seconds.',
    hints: [
      'Generated ids/classes are useless: locate by visible text or accessible role + name.',
      'Not every element with the right text is visible. Make sure you click the visible one.',
      'If your tool keeps element references around, expect "stale element" errors after a re-render: find the element again right before clicking.',
    ],
    start() {
      const labels = shuffle(WORDS).slice(0, 8).map(cap);
      const target = pick(labels);
      return { pub: { labels, target }, priv: { target } };
    },
    verify(a, s) {
      if (a === 'decoy') return 'You clicked a hidden decoy. Real users cannot click invisible things.';
      return norm(a) === s.priv.target ? true : `That was "${norm(a)}", not "${s.priv.target}".`;
    },
  },
  {
    id: 'table-scrape',
    tier: 1,
    title: 'Spreadsheet Hunter',
    objective: 'Sum the Amount column for every row in the requested department, across all pages of the table, and submit the total.',
    hints: [
      'The table is paginated and pages load from the server: wait for the new rows after each click.',
      'Amounts are formatted like "$1,234". Strip the symbols before adding them up.',
      'Check that the page actually changed before you scrape it, otherwise you may read the same page twice.',
    ],
    start() {
      const depts = ['Engineering', 'Sales', 'Marketing', 'Support', 'Finance'];
      const rows = Array.from({ length: rint(47, 73) }, (_, i) => ({
        id: 1000 + i,
        name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        dept: pick(depts),
        amount: rint(100, 9999),
      }));
      const targetDept = pick(depts);
      const sum = rows.filter((r) => r.dept === targetDept).reduce((t, r) => t + r.amount, 0);
      const pageSize = 10;
      return {
        pub: { targetDept, pageSize, totalRows: rows.length, pages: Math.ceil(rows.length / pageSize) },
        priv: { rows, sum, pageSize },
      };
    },
    actions: {
      async page(s, input) {
        const pages = Math.ceil(s.priv.rows.length / s.priv.pageSize);
        const page = Math.min(Math.max(parseInt(input.page, 10) || 1, 1), pages);
        await sleep(rint(250, 900));
        const start = (page - 1) * s.priv.pageSize;
        return { page, pages, rows: s.priv.rows.slice(start, start + s.priv.pageSize) };
      },
    },
    verify(a, s) {
      const n = Number(String(a).replace(/[$,\s]/g, ''));
      return n === s.priv.sum ? true : `Total ${a} is not correct.`;
    },
  },
  {
    id: 'form-controls',
    tier: 1,
    title: 'Form Gauntlet',
    objective: 'Fill in every control to match the requested values: a native select, radios, checkbox, date, a range slider and a custom (non-<select>) dropdown.',
    hints: [
      'The native select shows country names but its option values are codes. Choose by label, not value.',
      'The custom dropdown is just divs: click it open, then click the option.',
      'Range sliders respond to arrow keys. Setting .value from JS also works if you fire an "input" event afterwards.',
      'Date inputs take ISO format (YYYY-MM-DD) whatever they display.',
    ],
    start() {
      const countries = { ca: 'Canada', jp: 'Japan', br: 'Brazil', ke: 'Kenya', no: 'Norway', in: 'India' };
      const country = pick(Object.keys(countries));
      const plan = pick(['free', 'pro', 'enterprise']);
      const newsletter = pick([true, false]);
      const date = `2027-${String(rint(1, 12)).padStart(2, '0')}-${String(rint(1, 28)).padStart(2, '0')}`;
      const color = pick(['Crimson', 'Teal', 'Amber', 'Indigo', 'Olive']);
      const volume = rint(1, 9) * 10;
      return {
        pub: { countryName: countries[country], plan, newsletter, date, color, volume },
        priv: { country, plan, newsletter, date, color, volume },
      };
    },
    verify(a, s) {
      const p = s.priv;
      const wrong = [];
      if (a?.country !== p.country) wrong.push('country');
      if (a?.plan !== p.plan) wrong.push('plan');
      if (Boolean(a?.newsletter) !== p.newsletter) wrong.push('newsletter');
      if (a?.date !== p.date) wrong.push('date');
      if (a?.color !== p.color) wrong.push('color');
      if (Number(a?.volume) !== p.volume) wrong.push('volume');
      return wrong.length ? `Wrong fields: ${wrong.join(', ')}.` : true;
    },
  },

  // ---------------------------------------------------------------- Tier 2
  {
    id: 'delayed-element',
    tier: 2,
    title: 'Patience, Grasshopper',
    objective: 'A claim button shows up after a random delay (2 to 8 seconds). Click it once it is really there. A disabled placeholder shows up first.',
    hints: [
      'Do not use fixed sleeps: wait for a condition (the element is visible and enabled).',
      'The placeholder looks a lot like the real button. Tell them apart by state, not just by text.',
    ],
    start() {
      const delay = rint(2000, 8000);
      return { pub: {}, priv: { readyAt: Date.now() + delay, label: `Claim ${cap(pick(WORDS))}` } };
    },
    actions: {
      status(s) {
        const ready = Date.now() >= s.priv.readyAt;
        return ready ? { ready, label: s.priv.label } : { ready };
      },
    },
    verify(a, s) {
      if (Date.now() < s.priv.readyAt) return 'Too early!';
      return norm(a) === s.priv.label ? true : 'That is not the claim button.';
    },
  },
  {
    id: 'async-load',
    tier: 2,
    title: 'Slow Report',
    objective: 'Generate the report (the server takes a few seconds), then type the report code it returns into the box and submit.',
    hints: [
      'Wait for the result element to contain text, or wait for the network response itself.',
      'The spinner disappearing is a good signal too, but make sure it appeared in the first place.',
    ],
    start() {
      return { pub: {}, priv: { code: code(8) } };
    },
    actions: {
      async report(s) {
        await sleep(rint(3000, 6000));
        s.state.fetched = true;
        return { code: s.priv.code };
      },
    },
    verify(a, s) {
      if (!s.state.fetched) return 'Generate the report first.';
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong report code.';
    },
  },
  {
    id: 'infinite-scroll',
    tier: 2,
    title: 'Endless Feed',
    objective: 'Scroll the feed until you find the item with the requested code, then press its Select button. Items load in batches as you scroll.',
    hints: [
      'New items load when the bottom of the list scrolls into view.',
      'Scroll, wait for the item count to grow, repeat. Stop when the target shows up.',
      'Selecting the wrong item counts as a failed attempt.',
    ],
    start() {
      const items = Array.from({ length: 300 }, (_, i) => ({ n: i + 1, code: `ITEM-${code(5)}` }));
      const target = items[rint(120, 260)].code;
      return { pub: { target }, priv: { items, target } };
    },
    actions: {
      async items(s, input) {
        const offset = Math.max(parseInt(input.offset, 10) || 0, 0);
        await sleep(rint(400, 1000));
        const batch = s.priv.items.slice(offset, offset + 15);
        return { items: batch, hasMore: offset + 15 < s.priv.items.length };
      },
    },
    verify(a, s) {
      return norm(a) === s.priv.target ? true : `Selected ${norm(a)}, but the target is elsewhere.`;
    },
  },
  {
    id: 'overlays',
    tier: 2,
    title: 'Pop-up Purgatory',
    objective: 'Get to the Continue button: accept the cookie wall, close the newsletter modal that appears afterwards, then click Continue (which is a bit shy).',
    hints: [
      'Elements under an overlay cannot be clicked. Your tool will either complain or click the overlay instead.',
      'The modal appears a moment after the cookie wall goes away: wait for it before carrying on.',
      'The Continue button jumps away the first time the mouse reaches it. Find it again after it moves.',
    ],
    start() {
      return { pub: {}, priv: {} };
    },
    actions: {
      cookies(s) { s.state.cookies = true; return { ok: true }; },
      modal(s) { s.state.modal = true; return { ok: true }; },
    },
    verify(a, s) {
      if (!s.state.cookies) return 'You never accepted the cookies.';
      if (!s.state.modal) return 'You never closed the newsletter modal.';
      return true;
    },
  },

  // ---------------------------------------------------------------- Tier 3
  {
    id: 'iframe-basic',
    tier: 3,
    title: 'Window in a Window',
    objective: 'The form lives inside an iframe. Type the requested name into it and submit.',
    hints: [
      'Selectors on the main page do not reach inside an iframe. Switch into the frame (or use a frame locator) first.',
      'If you use a "switch to frame" style API, remember to switch back afterwards.',
    ],
    start() {
      const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      return { pub: { name }, priv: { name } };
    },
    verify(a, s) {
      return norm(a) === s.priv.name ? true : 'Wrong name.';
    },
  },
  {
    id: 'iframe-nested',
    tier: 3,
    title: 'Frame-ception',
    objective: 'Three iframes, nested. The secret code is shown in the deepest one (level 3). Type it into the form in level 1.',
    hints: [
      'Go one frame at a time: main page, then level 1, then level 2, then level 3.',
      'After reading the code you have to come back up to level 1 to type it.',
    ],
    start() {
      return { pub: {}, priv: { code: code(6) } };
    },
    actions: {
      peek(s) { return { code: s.priv.code }; },
    },
    verify(a, s) {
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong code.';
    },
  },
  {
    id: 'iframe-cross-origin',
    tier: 3,
    title: 'Foreign Embassy',
    objective: 'The iframe comes from another origin (port 3001). Press Reveal inside it, read the code, and submit it in the form on the main page (which unlocks once the code is revealed).',
    hints: [
      'Browser JS on the main page cannot reach into a cross-origin frame, but automation tools can.',
      'Devtools-protocol tools (Playwright, Puppeteer) list cross-origin frames like any other. WebDriver switches into them the usual way.',
      'The main page input stays disabled until the frame tells it (via postMessage) that the code was revealed.',
    ],
    start() {
      return { pub: {}, priv: { code: code(7) } };
    },
    peek(s) {
      s.state.revealed = true;
      return { code: s.priv.code };
    },
    verify(a, s) {
      if (!s.state.revealed) return 'The code was never revealed.';
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong code.';
    },
  },
  {
    id: 'iframe-dynamic',
    tier: 3,
    title: 'Now You See Me',
    objective: 'A widget iframe gets injected after a delay. Type the requested word and press Next. The iframe is then replaced by a new one: press Confirm in the new one.',
    hints: [
      'The iframe is not in the page at load time. Wait for it to be attached.',
      'After step 1 the old iframe is removed and a new one (with a new id) is inserted. Anything you held from the old frame is now stale.',
      'Avoid selecting the iframe by its id: it is random.',
    ],
    start() {
      const word = pick(WORDS);
      return { pub: { word }, priv: { word } };
    },
    actions: {
      step1(s, input) {
        if (norm(input.value).toLowerCase() !== s.priv.word) return { ok: false, message: 'Wrong word.' };
        s.state.step1 = true;
        return { ok: true };
      },
    },
    verify(a, s) {
      return s.state.step1 ? true : 'Step 1 not completed.';
    },
  },

  // ---------------------------------------------------------------- Tier 4
  {
    id: 'shadow-open',
    tier: 4,
    title: 'Into the Shadows',
    objective: 'The code input and button live inside an open shadow root of a custom element. Enter the code shown on the page and unlock.',
    hints: [
      'document.querySelector does not see inside shadow roots. element.shadowRoot does.',
      'Some tools pierce open shadow roots automatically (Playwright CSS locators do). Others need you to get the shadow root first (Selenium: element.shadow_root).',
    ],
    start() {
      const c = code(6);
      return { pub: { code: c }, priv: { code: c } };
    },
    verify(a, s) {
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong code.';
    },
  },
  {
    id: 'shadow-nested',
    tier: 4,
    title: 'Russian Dolls',
    objective: 'Three nested shadow roots. Part 1 of the passphrase is printed in the middle layer, part 2 is slotted in from the light DOM. Enter "PART1-PART2" in the innermost input.',
    hints: [
      'Each custom element has its own shadow root. Walk them one by one: outer, then middle, then inner.',
      'Slotted content stays in the light DOM. Look for it where the custom element is used, not inside the shadow root.',
    ],
    start() {
      const part1 = code(4);
      const part2 = pick(WORDS).toUpperCase();
      return { pub: { part1, part2 }, priv: { answer: `${part1}-${part2}` } };
    },
    verify(a, s) {
      return norm(a).toUpperCase() === s.priv.answer ? true : 'Wrong passphrase.';
    },
  },
  {
    id: 'shadow-closed',
    tier: 4,
    title: 'Locked Vault',
    objective: 'The vault uses a CLOSED shadow root: no selector can reach inside. Get the code into its input and unlock it anyway.',
    hints: [
      'With a closed root, element.shadowRoot is null and selector engines cannot see inside.',
      'Real users do not use selectors. Click where the input is (coordinates relative to the host element) or Tab into it, then type.',
      'Pressing Enter in the input also submits.',
    ],
    start() {
      const c = code(6);
      return { pub: { code: c }, priv: { code: c } };
    },
    verify(a, s) {
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong code.';
    },
  },

  // ---------------------------------------------------------------- Tier 5
  {
    id: 'windows-dialogs',
    tier: 5,
    title: 'Tab Juggler',
    objective: 'Open the vault link (a new tab) and read the code. Back on this page, press Begin: accept the confirm dialog, enter the code in the prompt, and dismiss the final alert.',
    hints: [
      'Links with target="_blank" open a new page/window. Your tool must switch to it (or wait for the "popup" event).',
      'Native dialogs block the page. Register a dialog handler before the click that triggers them.',
      'Cancel the confirm and nothing happens. Accept the prompt with the code as its text.',
    ],
    start() {
      return { pub: {}, priv: { code: code(6) } };
    },
    actions: {
      popup(s) {
        s.state.popup = true;
        return { code: s.priv.code };
      },
    },
    verify(a, s) {
      if (!s.state.popup) return 'You never opened the vault tab.';
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong vault code.';
    },
  },
  {
    id: 'drag-hover',
    tier: 5,
    title: 'Hover & Drop',
    objective: 'Hover through the Tools menu to reveal the secret word. Then drag the requested tasks from Backlog into Done and submit.',
    hints: [
      'The submenus open only on hover (CSS :hover). Move the mouse over each level in turn.',
      'The board uses native HTML5 drag & drop. Some tools need to simulate the dragstart/dragover/drop events themselves.',
      'Only the requested tasks should end up in Done.',
    ],
    start() {
      const tasks = shuffle(['Write tests', 'Fix login bug', 'Update docs', 'Refactor API', 'Design logo', 'Deploy app', 'Review PR']);
      const wanted = shuffle(tasks).slice(0, 3);
      return { pub: { tasks, wanted }, priv: { wanted, word: pick(WORDS) } };
    },
    actions: {
      word(s) {
        s.state.word = true;
        return { word: s.priv.word };
      },
    },
    verify(a, s) {
      if (!s.state.word || norm(a?.word).toLowerCase() !== s.priv.word) return 'Secret word missing or wrong.';
      const done = Array.isArray(a?.done) ? [...a.done].sort() : [];
      const wanted = [...s.priv.wanted].sort();
      if (done.length !== wanted.length || done.some((t, i) => t !== wanted[i])) return 'Done column does not match.';
      return true;
    },
  },
  {
    id: 'upload-download',
    tier: 5,
    title: 'Paper Trail',
    objective: 'Download the key file, read the key out of it, then upload a file named answer.txt that contains only the key.',
    hints: [
      'Set up download handling first (download dir/prefs, or wait for the download event).',
      'File inputs take a path. You never need to click through the OS file picker.',
      'The file name matters: answer.txt.',
    ],
    start() {
      return { pub: {}, priv: { key: `${code(4)}-${code(4)}-${code(4)}` } };
    },
    actions: {
      file(s) {
        s.state.downloaded = true;
        return {
          __file: {
            name: 'dojo-key.txt',
            content: `# Automation Dojo key file\n# generated ${new Date().toISOString()}\nKEY=${s.priv.key}\n`,
          },
        };
      },
    },
    verify(a, s) {
      if (!s.state.downloaded) return 'Download the key file first.';
      if (a?.name !== 'answer.txt') return `File must be called answer.txt (got ${a?.name}).`;
      return norm(a?.content) === s.priv.key ? true : 'answer.txt must contain only the key.';
    },
  },
  {
    id: 'matryoshka',
    tier: 5,
    title: 'Matryoshka',
    objective: 'Final boss: iframe, then shadow root, then a cross-origin iframe, then another shadow root, each rendered late. Find Reveal at the bottom, read the code, and submit it on this page.',
    hints: [
      'Draw the tree on paper first: page, iframe, <dojo-shell> shadow, cross-origin iframe, <dojo-core> shadow.',
      'Every layer renders after a delay. Wait at each step.',
      'The final input is back on the top-level page.',
    ],
    start() {
      return { pub: {}, priv: { code: code(8) } };
    },
    peek(s) {
      s.state.revealed = true;
      return { code: s.priv.code };
    },
    verify(a, s) {
      if (!s.state.revealed) return 'The code was never revealed.';
      return norm(a).toUpperCase() === s.priv.code ? true : 'Wrong code.';
    },
  },
];

const byId = Object.fromEntries(challenges.map((c) => [c.id, c]));

module.exports = { challenges, byId, TIERS };
