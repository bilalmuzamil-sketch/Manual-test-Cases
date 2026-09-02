// UI-FIRST ROUTE FINDER — the generic version of what found the credit-note route.
//
// THE METHOD, and why it is this way round (QA lead, 2026-09-02: "Maybe UI first and then API path
// as a fallback? DO what is best for this purpose scientifically"):
//
//   Guessing API routes is search over an unbounded space with no feedback: on 2026-08-31 thirteen
//   guesses for the credit document all 404'd and the pass concluded the document "is not rendered on
//   this branch". It IS. Walking the UI is search over a BOUNDED space - a screen has a finite number
//   of controls - and every step gives feedback. One click produced
//   GET /api/credit-memos/{id}/pdf, a shape no guess had tried (a /pdf SUFFIX, and a download rather
//   than a preview).
//
//   It is also the only order that serves build verification. A manual tester clicks; they do not
//   call endpoints. A route discovered by clicking IS the precondition and the steps - already
//   build-verified, already runnable, and impossible to invent, because it was witnessed. An API
//   route discovered by guessing tells a tester nothing and cannot go in a case at all.
//
//   ⇒ UI FIRST, ALWAYS. Drop to the API only to (a) SEED a state the UI cannot reach, or (b) READ a
//   complete set the screen only samples (e.g. every status a control can offer). Never to find a
//   route.
//
// WHAT THIS DOES: opens a page, enumerates every control in a scope, HOVERS each one to read its
// tooltip (Quasar q-tooltips are hover-only and absent from the DOM until then), clicks the one whose
// tooltip or text matches, and records every request, popup and download it fires - then writes the
// result to the route registry so nobody has to find it again.
//
// USAGE:
//   node build/testing-tools/find_ui_route.mjs <branch> <route> "<label to click>" [scope-selector]
//   e.g. node build/testing-tools/find_ui_route.mjs sv8218 \
//          /customers/039fd202-c7f5-4b34-8000-969488b49687/invoices "Print credit memo" "table tbody tr"
import { boot } from './qa-branch-boot.mjs';
import { record } from './route_registry.mjs';
import fs from 'fs';

const [branch, route, wanted, scope = 'body'] = process.argv.slice(2);
if (!branch || !route || !wanted) {
  console.log('usage: node find_ui_route.mjs <branch> <route> "<label>" [scope-selector]');
  process.exit(1);
}
const LABEL_FN = `(el) => { const c = el.cloneNode(true);
  c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
  return (c.textContent || '').replace(/\\s+/g, ' ').trim(); }`;

const { browser, page, APP, APIH } = await boot(branch, '/', 'admin');
const seen = { calls: [], popups: [], downloads: [] };
page.on('request', r => { const u = r.url();
  if (u.includes(APIH)) seen.calls.push(`${r.method()} ${u.replace(`https://${APIH}`, '')}`); });
page.context().on('page', async p => { try { await p.waitForLoadState('domcontentloaded'); seen.popups.push(p.url()); } catch (e) {} });
page.on('download', d => seen.downloads.push(d.suggestedFilename()));

await page.goto(APP + route, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);
const build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content);
console.log(`${branch} ${build} — ${page.url().replace(APP, '')}`);

const n = await page.evaluate(([sc, labFn]) => {
  const label = eval(labFn);
  const roots = [...document.querySelectorAll(sc)];
  let i = 0;
  for (const root of roots)
    for (const el of root.querySelectorAll('button, a, [role="button"], .q-btn, i[class*="icon"]'))
      el.setAttribute('data-qa-ctl', String(i++));
  return i;
}, [scope, LABEL_FN]);
console.log(`enumerating ${n} control(s) in ${JSON.stringify(scope)} — hovering each to read its tooltip`);

let target = null, inventory = [];
for (let i = 0; i < n; i++) {
  const loc = page.locator(`[data-qa-ctl="${i}"]`);
  if (!(await loc.count())) continue;
  await loc.first().hover().catch(() => {});
  await page.waitForTimeout(700);
  const info = await page.evaluate(([idx, labFn]) => {
    const label = eval(labFn);
    const el = document.querySelector(`[data-qa-ctl="${idx}"]`);
    const tips = [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')].map(e => (e.textContent || '').trim()).filter(Boolean);
    return { text: el ? label(el) : null, tips };
  }, [i, LABEL_FN]);
  const all = [info.text, ...info.tips].filter(Boolean);
  if (all.length) inventory.push({ i, seen: all });
  if (target === null && all.some(t => t.toLowerCase() === wanted.toLowerCase())) target = i;
}
console.log('controls and what they say:');
inventory.forEach(x => console.log(`   [${x.i}] ${JSON.stringify(x.seen)}`));
if (target === null) {
  console.log(`\nno control says ${JSON.stringify(wanted)} on this screen. Nothing recorded - a route is `
            + 'never written down unless it was witnessed.');
  await browser.close(); process.exit(2);
}
const before = seen.calls.length;
await page.locator(`[data-qa-ctl="${target}"]`).first().click({ timeout: 20000 }).catch(e => console.log('click:', String(e).split('\n')[0]));
await page.waitForTimeout(10000);
const fired = [...new Set(seen.calls.slice(before))];
console.log(`\nclicked [${target}] — it fired:`);
fired.forEach(c => console.log('   ' + c));
if (seen.downloads.length) console.log('downloads:', JSON.stringify(seen.downloads));
if (seen.popups.length) console.log('popups   :', JSON.stringify(seen.popups));

if (process.env.RECORD_AS) {
  record({ name: process.env.RECORD_AS, feature: process.env.RECORD_FEATURE || branch,
           branch, build, ui_path: `${route} → the control labelled “${wanted}”`,
           api: fired[0] ? `${fired[0].split(' ')[0]} ${fired[0].split(' ')[1]}` : null,
           download: seen.downloads[0] || null,
           labels: inventory.flatMap(x => x.seen).slice(0, 40),
           evidence: `find_ui_route.mjs ${branch} ${route} "${wanted}"` });
  console.log('\nrecorded to the route registry.');
} else {
  console.log('\nset RECORD_AS="<name>" (and RECORD_FEATURE) to append this to the route registry.');
}
await browser.close();
