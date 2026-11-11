// pr10_guard.mjs — 11 Nov 2026 21:10 UTC: does the CSV apostrophe guard ("'-1 Diesel": names starting with = + - @ tab get a leading ') exist
// BEFORE the release? Production has no such names in its exports, so read the build instead (grep the chunks, 97/104): capture every .js the
// app loads on Sales By Customer + a CSV export, search each for the guard's tell-tale patterns. Same on the QA site (QA=1) as the positive control.
import fs from 'fs'; const QA = !!process.env.QA; const o = { side: QA ? 'qa' : 'prod' }; let p, B, s;
if (QA) { const { start } = await import('./lib.mjs'); s = await start(new URL('./pr10/', import.meta.url).pathname); p = s.page; } else { const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs'); B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); p = B.page; }
const reqs = []; p.on('request', (r) => { if (/\/api\//.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^https?:\/\/[^/]+/, '')); });
const js = {}; p.on('response', async (r) => { const u = r.url(); if (!/\.js(\?|$)/.test(u)) return; try { js[u] = await r.text(); } catch {} });
const base = new URL(p.url()).origin;
try { await p.goto(base + '/reports/sales-by-customer', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const more = p.locator('main button[aria-label="Export report"]').or(p.locator('main button').filter({ hasText: /more_(horiz|vert)/ })).first(); await more.click(); await p.waitForTimeout(800);
  const w = p.waitForEvent('download', { timeout: 60000 }).catch(() => null); await p.locator('.q-menu:visible').last().getByText(/Summary \(CSV\)/).first().click(); await w; await p.waitForTimeout(2000);
  /* 21:55: the code dump goes to the scratchpad, NEVER the repo (company code; the repo is public) */ const D = '/tmp/claude-0/-home-user-Manual-test-Cases/126e0959-4bca-54ed-8b95-71a191ca38d1/scratchpad/pr10-' + o.side + '-js/'; fs.mkdirSync(D, { recursive: true }); for (const [u, t] of Object.entries(js)) fs.writeFileSync(D + u.split('/').pop().split('?')[0], t);
  o.reqs = reqs.slice(0, 40);
  const pats = { classA: /\[=\+\\-@/g, classB: /\[=\+@\\-/g, classC: /\[-=\+@/g, tab: /\\t\\r/g, quotePrefix: /"'"\s*\+/g, startsWith: /startsWith\("="\)/g, injection: /injection/gi };
  o.files = Object.keys(js).length; o.hits = []; for (const [u, t] of Object.entries(js)) for (const [k, re] of Object.entries(pats)) { const m = [...t.matchAll(re)]; for (const x of m.slice(0, 3)) o.hits.push({ file: u.split('/').pop(), k, ctx: t.slice(Math.max(0, x.index - 90), x.index + 90) }); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.mkdirSync(new URL('./pr10/', import.meta.url).pathname, { recursive: true }); fs.writeFileSync(new URL('./pr10/' + o.side + '.json', import.meta.url).pathname, JSON.stringify(o, null, 1));
console.log('pr10', o.side, o.files, o.err || '', JSON.stringify(o.hits.map((h) => [h.file, h.k, h.ctx.replace(/\s+/g, ' ')])).slice(0, 2500)); if (s) await s.close(); if (B) await B.browser.close(); process.exit(0);
