// AUTHORIZER, round 2 — on an EDITABLE work order and on an INVOICED one.
//
// Round 1 found `select_authorizer` on the work-order page and confirmed the "Authorizer" label,
// but the click timed out. That was on S2-15522, which is PAID -- and C44922 asserts the Authorizer
// locks once the work order is invoiced. A TIMEOUT IS NOT EVIDENCE OF LOCKING: Playwright's click
// waits for visible+enabled+stable, so a disabled control and a mis-shaped locator produce the
// identical symptom. So this run does two things properly:
//   (a) opens the picker on an EDITABLE work order, to read 'Approves Work' / 'No authorizer';
//   (b) reads the DISABLED STATE of the control explicitly on the invoiced one, rather than
//       inferring it from a failed click.
// Read-only: pickers are opened to be read and closed with Escape. No case is written.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const log = (...a) => console.log(...a);
const out = { probes: {} };
const COOK = fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim();

const { browser, page } = await boot('/workorders?tab=all');

// pick work orders by status from the API
const wos = await (await fetch('https://sv8218api.qa.shopview.com/api/work-orders?limit=200',
  { headers: { Cookie: COOK } })).json();
function rows(o) { if (Array.isArray(o) && o[0] && typeof o[0] === 'object') return o; if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = rows(v); if (r) return r; } } return null; }
const list = rows(wos) || [];
const byStatus = {};
for (const w of list) (byStatus[String(w.status).toLowerCase()] ||= []).push(w);
log('work orders available by status:', Object.fromEntries(Object.entries(byStatus).map(([k, v]) => [k, v.length])));

const EDITABLE = ['estimate', 'approved', 'in progress', 'review', 'complete'];
const editable = EDITABLE.map(s => (byStatus[s] || [])[0]).find(Boolean);
const invoiced = (byStatus['invoiced'] || byStatus['paid'] || [])[0];

async function probe(label, wo, tryOpen) {
  if (!wo) { log(`\n[${label}] no work order of this kind — SKIP`); return; }
  log(`\n[${label}] ${wo.number} (${wo.status})`);
  await page.goto(`${APP}/workorders/${wo.id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3500);
  const el = page.locator('[data-test-id="select_authorizer"]').first();
  const present = await el.count();
  // read the control's real state instead of guessing from a click outcome
  const state = present ? await page.evaluate(() => {
    const d = document.querySelector('[data-test-id="select_authorizer"]');
    if (!d) return null;
    const cs = getComputedStyle(d);
    const inp = d.querySelector('input');
    const cls = d.className || '';
    return {
      text: (d.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 120),
      classes: cls,
      looks_disabled: /disabled|readonly|q-field--disabled/i.test(cls) ||
                      (inp ? (inp.disabled || inp.readOnly) : false),
      input_disabled: inp ? inp.disabled : null,
      input_readonly: inp ? inp.readOnly : null,
      pointer_events: cs.pointerEvents,
      visible: !!(d.offsetWidth || d.offsetHeight),
    };
  }) : null;
  log(`   control present: ${present ? 'yes' : 'NO'}`);
  if (state) {
    log(`   text          : ${JSON.stringify(state.text)}`);
    log(`   classes       : ${state.classes.slice(0, 110)}`);
    log(`   looks disabled: ${state.looks_disabled}  (input.disabled=${state.input_disabled} readOnly=${state.input_readonly} pointer-events=${state.pointer_events})`);
  }
  let options = [];
  if (present && tryOpen) {
    // click the inner input/field, which is what actually opens a Quasar select
    for (const sel of ['[data-test-id="select_authorizer"] input',
                       '[data-test-id="select_authorizer"] .q-field__control',
                       '[data-test-id="select_authorizer"]']) {
      const l = page.locator(sel).first();
      if (!(await l.count())) continue;
      await l.click({ timeout: 6000, force: true }).catch(() => {});
      await page.waitForTimeout(1800);
      options = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=option]')]
        .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
        .filter(x => x.t && x.t.length < 90));
      if (options.length) { log(`   picker opened via ${sel}`); break; }
    }
    log(`   picker options: ${options.length}`);
    options.slice(0, 30).forEach(o => log(`      - ${JSON.stringify(o.t).slice(0, 64)}  ${o.id}`));
    await page.screenshot({ path: `${EV}/authorizer-${label}.png`, fullPage: true }).catch(() => {});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }
  const text = await page.evaluate(() => document.body?.innerText || '');
  fs.writeFileSync(`${DIR}/surface-authorizer-${label}.txt`, text + '\n\n--- PICKER OPTIONS ---\n' +
    options.map(o => o.t).join('\n'));
  out.probes[label] = { wo: wo.number, status: wo.status, present: !!present, state, options, chars: text.length };
}

await probe('editable', editable, true);
await probe('invoiced', invoiced, true);

fs.writeFileSync(`${DIR}/authorizer-probe.json`, JSON.stringify(out, null, 1));
const corpus = Object.values(out.probes).map(p =>
  fs.readFileSync(`${DIR}/surface-authorizer-${Object.keys(out.probes).find(k => out.probes[k] === p)}.txt`, 'utf8')).join('\n');
log('\n---- LABEL CHECK across both probes ----');
for (const l of ['Authorizer', 'Approves Work', 'No authorizer', 'Approval Code']) {
  log(`   ${l.padEnd(16)} ${corpus.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
}
log(`   ${'zz-9f3a-control'.padEnd(16)} ${corpus.includes('zz-9f3a-control') ? 'FOUND (BAD)' : 'absent (control OK)'}`);
await browser.close();
