// observe_c44923.mjs — C44923: a contact that has just had "Approves Work" enabled becomes
// selectable in the work order's Authorizer list WITHOUT refreshing or re-saving the work order.
//
// The first attempt at this proved nothing and must not be read as a failure (skill 03 s8.0-a):
// it navigated to /customers/{id} which REDIRECTS to the work-orders tab (the contacts tab is
// /customers/{id}/contacts), and its option reader returned [] even on the untouched list, so it
// could not have detected a pass. Both are fixed here, and the reader now carries a POSITIVE
// CONTROL: the list must contain "No authorizer" (S3-R6) before any result is believed.
import { boot, APP, apiGet } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
const { WO, CID, CONTACT, NAME } = process.env;
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = () => fs.writeFileSync(`${OUT}/evidence/c44923.log`, log.join('\n') + '\n');

const settle = async (p, m = 1200) => {
  await p.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(4000);
};

async function authorizerOptions(page, tag) {
  // click the field's native input, not the wrapper - the wrapper swallows the click
  const opened = await page.evaluate(() => {
    const sel = [...document.querySelectorAll('.q-select')]
      .find(e => /authoriz/i.test(e.querySelector('.q-field__label')?.textContent || ''));
    if (!sel) return 'no authorizer select found';
    const target = sel.querySelector('.q-field__native') || sel.querySelector('.q-field__control') || sel;
    target.click();
    return 'clicked';
  });
  await page.waitForSelector('.q-menu', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const options = await page.evaluate(() =>
    [...document.querySelectorAll('.q-menu .q-item, .q-menu .q-item__label, .q-menu [role="option"]')]
      .map(e => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean));
  const uniq = [...new Set(options)];
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1000);
  const controlOk = uniq.some(o => /no authorizer/i.test(o));
  L(`  [${tag}] open: ${opened} | options: ${JSON.stringify(uniq)}`);
  L(`  [${tag}] POSITIVE CONTROL "No authorizer" present: ${controlOk}` +
    (controlOk ? '' : '  <-- the reader did not fire; this result proves NOTHING'));
  return { opened, options: uniq, controlOk };
}

const { browser, ctx, page } = await boot('/workorders');

// make sure the contact starts WITHOUT the flag, so the test has somewhere to travel
const pre = await apiGet(`/api/customers/view/${CID}`);
const preC = (pre.body?.data?.company?.contacts || pre.body?.data?.contacts || []).find(c => c.id === CONTACT);
L(`starting state — ${NAME} is_authorizer: ${preC ? preC.is_authorizer : 'NOT FOUND'}`);

await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(page);
L(`work order open: ${page.url()}`);
const before = await authorizerOptions(page, 'BEFORE');
const norm = t => (t || '').replace(/\s+/g, ' ').trim();
L(`  ${NAME} already listed: ${before.options.some(o => norm(o).includes(norm(NAME)))}`);

// tick "Approves Work" on the CONTACTS tab, in a second tab; the work order tab is never touched
const tab2 = await ctx.newPage();
await tab2.goto(`${APP}/customers/${CID}/contacts`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(tab2, 900);
L(`contacts tab: ${tab2.url()}`);
const row = await tab2.evaluate(n => {
  // table cells are separate <td>s, so innerText is "Olivia\tSims" - a raw includes("Olivia Sims")
  // misses every row. Normalise whitespace on BOTH sides before comparing.
  const norm = t => (t || '').replace(/\s+/g, ' ').trim();
  const rows = [...document.querySelectorAll('tr')];
  const r = rows.find(x => norm(x.innerText).includes(norm(n)));
  if (!r) return { found: false, rows: rows.length,
    sample: rows.slice(0, 8).map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 60)) };
  // the row itself is not clickable - each row carries an "edit_note" icon button that opens the
  // contact editor. Clicking the row does nothing and leaves dialogOpen:false.
  const icon = [...r.querySelectorAll('button, i, .q-btn, .material-icons')]
    .find(e => /edit_note|edit/i.test((e.textContent || '') + ' ' + (e.getAttribute('aria-label') || '')));
  if (icon) { icon.click(); return { found: true, via: 'edit icon',
    text: norm(r.innerText).slice(0, 120) }; }
  r.click();
  return { found: true, via: 'row click (no edit icon found)',
    controls: [...r.querySelectorAll('button, i')].map(e => norm(e.textContent).slice(0, 20)),
    text: norm(r.innerText).slice(0, 120) };
}, NAME);
L(`contact row: ${JSON.stringify(row).slice(0, 400)}`);
await tab2.waitForSelector('.q-dialog', { timeout: 15000 }).catch(() => {});
await tab2.waitForTimeout(4500);
await tab2.screenshot({ path: `${OUT}/evidence/c44923-contact-dialog.png` });
const cb = await tab2.evaluate(() => {
  const el = document.querySelector('[data-test-id="input_checkbox_is_authorizer"]')
    || [...document.querySelectorAll('.q-checkbox')].find(e => /approves work/i.test(e.textContent || ''));
  if (!el) return { found: false,
    dialogOpen: !!document.querySelector('.q-dialog'),
    checkboxes: [...document.querySelectorAll('.q-checkbox, .q-toggle, input[type=checkbox]')]
      .map(e => (e.textContent || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40)),
    dialogText: (document.querySelector('.q-dialog')?.innerText || '').replace(/\s+/g, ' ').slice(0, 600) };
  el.click();
  return { found: true, label: (el.textContent || '').trim().slice(0, 60) };
});
L(`"Approves Work" control: ${JSON.stringify(cb).slice(0, 400)}`);
if (cb.found) {
  await tab2.waitForTimeout(1500);
  const saved = await tab2.evaluate(() => {
    const b = [...document.querySelectorAll('button')]
      .find(e => /^\s*(save|update|confirm)\b/i.test((e.innerText || '').trim()));
    if (!b) return { clicked: false, buttons: [...document.querySelectorAll('button')]
      .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 12) };
    b.click(); return { clicked: true, label: b.innerText.trim() };
  });
  L(`save: ${JSON.stringify(saved).slice(0, 300)}`);
  await tab2.waitForTimeout(6000);
}
// confirm from the RECORD, not the screen
const post = await apiGet(`/api/customers/view/${CID}`);
const postC = (post.body?.data?.company?.contacts || post.body?.data?.contacts || []).find(c => c.id === CONTACT);
L(`record now — ${NAME} is_authorizer: ${postC ? postC.is_authorizer : 'NOT FOUND'}`);
await tab2.close();

// back to the untouched work order tab — no reload, no re-save
await page.bringToFront();
await page.waitForTimeout(3000);
L(`work order tab still at: ${page.url()} (never reloaded)`);
const after = await authorizerOptions(page, 'AFTER');
const listed = after.options.some(o => norm(o).includes(norm(NAME)));
L(`RESULT — "${NAME}" selectable without refresh: ${listed}`);
L(`RESULT IS TRUSTWORTHY (control fired both times): ${before.controlOk && after.controlOk}`);
await page.screenshot({ path: `${OUT}/evidence/c44923-after.png` });
fs.writeFileSync(`${OUT}/evidence/c44923.json`, JSON.stringify(
  { pre: preC?.is_authorizer, before, row, cb, post: postC?.is_authorizer, after, listed }, null, 1));
save();
await browser.close();
