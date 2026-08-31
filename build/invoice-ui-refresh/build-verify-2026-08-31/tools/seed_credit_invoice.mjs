// SEED a Credit Invoice so the 12 Credit Invoice cases can be build-verified.
// QA lead 2026-08-31: "nothing should block you ... nothing is impossible to do in the branch".
// Seeding on a disposable QA branch is expected (Rule 14 / Rule 74).
//
// 🛑 SAFETY, core §7.5: this ESTABLISHES whether a confirmation step exists BEFORE pressing the
// control that commits. Pass 1 opens the flow and READS it. It commits only if a recognisable
// submit control is found AND --commit is passed, and it prints every non-GET call it made at
// exit so an unintended write is visible within seconds rather than at the next diff.
//
// Target: S2-15517 — deliberately NOT S2-15522, which is the captured baseline for the
// already-verified cases and must stay untouched.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const COMMIT = process.argv.includes('--commit');
const TARGET = process.env.SEED_WO_ID || '';
const log = (...a) => console.log(...a);

const { browser, page } = await boot('/workorders?tab=complete');
const nonGet = [];
page.on('request', r => {
  if (r.method() !== 'GET' && /\/api\//.test(r.url())) nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
});

// find the target work order by number, via the API (the list has no links)
const wos = await (await fetch('https://sv8218api.qa.shopview.com/api/work-orders?limit=200',
  { headers: { Cookie: fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim() } })).json();
function rows(o) { if (Array.isArray(o) && o[0] && typeof o[0] === 'object') return o; if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = rows(v); if (r) return r; } } return null; }
const list = rows(wos) || [];
const wo = TARGET ? list.find(w => w.id === TARGET) : list.find(w => w.number === 'S2-15517') || list.find(w => String(w.status).toLowerCase() === 'paid');
if (!wo) { log('no target work order found'); await browser.close(); process.exit(2); }
log(`target: ${wo.number} (${wo.status}) id=${wo.id}`);

await page.goto(`${APP}/workorders/${wo.id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 });
await page.locator('[data-test-id="link_finance_tab"]').first().click();
await page.waitForTimeout(3500);
log('finance tab:', page.url().replace(APP, ''));

// open the invoice menu and read it
await page.locator('[data-test-id="button_wo_invoice_menu"]').first().click({ timeout: 10000 });
await page.waitForTimeout(1500);
const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
  .map(e => ({ t: (e.innerText || '').trim(), id: e.getAttribute('data-test-id') || '' })).filter(x => x.t));
log('menu items:', items.map(i => `${i.t}[${i.id}]`).join(' , '));

const credit = page.locator('[data-test-id="menu_item_issue_credit"]').first();
if (!(await credit.count())) { log('menu_item_issue_credit not present — STOP'); await browser.close(); process.exit(3); }

// ---- STEP 1: OPEN the flow and READ it. This is not the commit. ----
await credit.click({ timeout: 10000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${EV}/seed-issue-credit-dialog.png`, fullPage: true }).catch(() => {});
const dlg = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog') || document.body;
  const controls = [...d.querySelectorAll('button,[role=button],input,select,textarea,label,[data-test-id]')]
    .map(e => ({ tag: e.tagName.toLowerCase(), t: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 60), id: e.getAttribute('data-test-id') || '', type: e.getAttribute('type') || '' }))
    .filter(x => x.t || x.id);
  return { text: (d.innerText || '').slice(0, 1500), controls, isDialog: !!document.querySelector('.q-dialog') };
});
log(`\ndialog present: ${dlg.isDialog}`);
log('dialog text:'); log(JSON.stringify(dlg.text.slice(0, 700)));
log('\ndialog controls:');
dlg.controls.slice(0, 30).forEach(c => log(`   ${c.tag}/${c.type} ${JSON.stringify(c.t).slice(0, 44).padEnd(46)} ${c.id}`));
fs.writeFileSync(`${DIR}/seed-credit-dialog.json`, JSON.stringify(dlg, null, 1));

// ---- STEP 2: commit ONLY with --commit, and only via a recognisable submit control ----
// Prefer the real submit: a BUTTON with type=submit, or the canonical confirm test-id.
// The first version of this matched the dialog TITLE span ("Issue Credit", id=dialog_title)
// because a title reads like an action -- a detector that matches text alone will click a
// heading and report a failed commit. Require it to be a button.
const submit = dlg.controls.find(c => c.id === 'button_confirm_dialog')
            || dlg.controls.find(c => c.tag === 'button' && c.type === 'submit')
            || dlg.controls.find(c => c.tag === 'button' && /^(issue|confirm|submit|save|create|apply)/i.test(c.t));
if (!COMMIT) {
  log(`\n--commit NOT passed. Nothing committed.`);
  log(`submit control that WOULD be used: ${submit ? JSON.stringify(submit) : 'NONE FOUND — the flow needs reading by a human first'}`);
  await page.keyboard.press('Escape');
} else if (!submit) {
  log('\n--commit passed but NO recognisable submit control — refusing to guess. Nothing committed.');
  await page.keyboard.press('Escape');
} else {
  // fill the minimum the flow needs: STORE CREDIT (no payment method required) and a reason
  // tagged ZZAUTOTEST so the seeded record is identifiable as throwaway QA data.
  const hold = page.locator('[data-test-id="radio_credit_memo_outcome_hold"]').first();
  if (await hold.count()) { await hold.click({ timeout: 8000 }).catch(() => {}); await page.waitForTimeout(900);
    log('selected: Issue Store Credit (avoids a payment method and any inventory movement)'); }
  const reason = page.locator('[data-test-id="input_credit_memo_reason"]').first();
  if (await reason.count()) { await reason.fill('ZZAUTOTEST build verification 2026-08-31 (seeded to verify the Credit Invoice cases)').catch(() => {}); log('reason filled with a ZZAUTOTEST tag'); }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${EV}/seed-issue-credit-filled.png`, fullPage: true }).catch(() => {});
  log(`\ncommitting via ${JSON.stringify(submit)}`);
  const loc = submit.id ? page.locator(`[data-test-id="${submit.id}"]`).first()
                        : page.getByRole('button', { name: submit.t }).first();
  await loc.click({ timeout: 15000 }).catch(e => log('click failed:', String(e).slice(0, 120)));
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${EV}/seed-issue-credit-after.png`, fullPage: true }).catch(() => {});
  log('after commit, url:', page.url().replace(APP, ''));
  const after = await page.evaluate(() => (document.body.innerText || '').slice(0, 600));
  log('page text after:', JSON.stringify(after.slice(0, 400)));
}

log(`\nNON-GET CALLS THIS RUN (expected empty unless --commit): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
fs.writeFileSync(`${DIR}/seed-credit-nonget.json`, JSON.stringify({ commit: COMMIT, wo: wo.number, nonGet }, null, 1));
await browser.close();
