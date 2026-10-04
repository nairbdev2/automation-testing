# Automation Dojo

A self-hosted playground for practicing browser automation. 19 challenges across 5 tiers walk you
from basic form filling to digging through nested iframes, shadow roots and cross-origin frames.
Works with any tool: Playwright, Selenium, Puppeteer, Cypress, WebdriverIO and so on.

## Running it

**Docker (recommended)**

```bash
docker compose up --build -d
```

Then open <http://localhost:3000>.

**Without Docker** (Node 18+)

```bash
npm install
npm start
```

The app uses two ports:

| Port | Purpose |
|------|---------|
| 3000 | Main app, dashboard and challenges |
| 3001 | A second "foreign" origin, used for the cross-origin iframe challenges |

Both ports must be reachable from the browser you automate. If you remap the foreign port
(for example `-p 4001:3001`), set `PUBLIC_FOREIGN_PORT=4001` so pages point iframes at the right place.

## How it works

1. Open a challenge from the dashboard. Each page load generates fresh random data (codes, names,
   positions), so hard-coded answers won't work. Your script has to read the page every run.
2. Complete the objective. The answer is checked on the server.
3. On success the page shows a flag like `FLAG{login:3fa9...}` in the `#flag` element.
4. Have your script submit the flag in the dashboard form (or `POST /api/flags` with `{"flag": "..."}`).
   Solved challenges get a badge and count towards your progress.

Every challenge has hints on its page and on the dashboard. Try it without them first.

### Rules of the dojo

- Automate it. Solving by hand teaches you nothing.
- Don't read the server code for answers. That's the one place where the answers live.
- Calling the API directly skips the point. Drive the browser like a user would.

## Challenges

| Tier | Challenge | What it teaches |
|------|-----------|-----------------|
| 1 Basics | Sticky Note Login | Reading values off the page, filling forms |
| | Shape Shifters | Random ids/classes, hidden decoys, re-rendered (stale) elements |
| | Spreadsheet Hunter | Scraping a paginated table, waiting for page changes |
| | Form Gauntlet | Select by label, radios, checkboxes, date, range slider, custom div dropdown |
| 2 Timing & State | Patience, Grasshopper | Waiting for a condition instead of sleeping, enabled vs disabled |
| | Slow Report | Waiting for slow network results |
| | Endless Feed | Infinite scroll inside a scrollable container |
| | Pop-up Purgatory | Cookie walls, late modals, elements that move |
| 3 Frames | Window in a Window | Working inside an iframe |
| | Frame-ception | Three levels of nested iframes |
| | Foreign Embassy | Cross-origin iframes |
| | Now You See Me | Late-injected iframes that get replaced (stale frame handles) |
| 4 Shadow DOM | Into the Shadows | Open shadow roots |
| | Russian Dolls | Nested shadow roots and slotted content |
| | Locked Vault | Closed shadow roots (keyboard/mouse only) |
| 5 Boss Level | Tab Juggler | New tabs, alert/confirm/prompt dialogs |
| | Hover & Drop | Hover-only menus, HTML5 drag and drop |
| | Paper Trail | File downloads and uploads |
| | Matryoshka | iframe, shadow root, cross-origin iframe and shadow root, all rendered late |

## Housekeeping

- Progress and the flag secret are stored in `data/` (a Docker volume called `dojo-data` when you use Compose).
- "Reset progress" at the bottom of the dashboard clears your solved list.
- To get brand-new flags, delete `data/secret` (or the volume) and restart. You can also set `FLAG_SECRET`.
- Stop the app with `docker compose down`. Add `-v` to wipe progress too.
