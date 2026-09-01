// observe_final.mjs — the remaining live observations for C45190, C44923 and C45191, in one
// browser session (quick-login rotates the shared session, so one session is also the safe choice).
//
// Run build/testing-tools/sv8218_keepalive.sh alongside: sv8218 auto-sleeps within minutes and a
// sleeping environment serves a 148-character "Environment Sleeping" page on EVERY route, which a
// naive reader records as "every field absent".
import { boot, APP, apiGet, apiPost } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = () => fs.writeFileSync(`${OUT}/evidence/final-observations.log`, log.join('\n') + '\n');

const { WO, PS, IMP, CID, CONTACT, NAME, TECH, TECHNAME } = process.env;

const settle = async (page, min = 700) => {
  await page.waitForFunction(m => (document.body?.innerText || '').length > m, min, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(4000);
};
const asleep = (page) => page.evaluate(() =>
  /Environment Sleeping/i.test(document.body?.innerText || '') || location.host.startsWith('sleep.'));

const readCard = (page) => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const selects = [...document.querySelectorAll('.q-select')]
    .map(e => (e.querySelector('.q-field__label')?.textContent || '').trim()).filter(Boolean);
  const statics = [...document.querySelectorAll('.static-field__label')].map(e => e.textContent.trim());
  const hit = re => statics.some(l => re.test(l)) || selects.some(l => re.test(l));
  return {
    url: location.pathname, bodyChars: t.length, statics, selects,
    contact: hit(/^contact$/i), phone: hit(/^phone$/i), authorizer: hit(/authoriz/i),
    authorizerReadonlyEl: !!document.querySelector('[data-test-id="authorizer_readonly"]'),
    changeCustomer: /Change Customer/i.test(t),
    fullText: t.replace(/\s+/g, ' ').slice(0, 2500),
  };
});

const { browser, ctx, page } = await boot('/workorders');
const results = {};

// ---------------- C45190 : the imported work order, reached the way a tester reaches it ----------
L('### C45190 — imported work order');
await page.goto(`${APP}/workorders?status=imported`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(page, 600);
L('  imported list:', page.url(), '| asleep:', await asleep(page));
const clicked = await page.evaluate(n => {
  const r = [...document.querySelectorAll('tr')].find(x => (x.innerText || '').includes(n));
  if (!r) return false; r.click(); return true;
}, 'ZZAUTOTEST-IMP-001');
L('  row clicked:', clicked);
await page.waitForTimeout(9000);
results.imported = await readCard(page);
L('  landed', results.imported.url, '| chars', results.imported.bodyChars);
L('  statics:', JSON.stringify(results.imported.statics));
L('  selects:', JSON.stringify(results.imported.selects));
L('  Contact', results.imported.contact, '| Phone', results.imported.phone,
  '| AUTHORIZER', results.imported.authorizer, '| Change Customer', results.imported.changeCustomer);
L('  full text:', results.imported.fullText.slice(0, 1200));
await page.screenshot({ path: `${OUT}/evidence/final-imported.png`, fullPage: true });
save();

// ---------------- C45190 : the parts sale ----------
L('\n### C45190 — parts sale');
await page.goto(`${APP}/parts/part-sale/${PS}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(page, 900);
results.partSale = await readCard(page);
L('  landed', results.partSale.url, '| chars', results.partSale.bodyChars);
L('  statics:', JSON.stringify(results.partSale.statics));
L('  selects:', JSON.stringify(results.partSale.selects));
L('  Contact', results.partSale.contact, '| Phone', results.partSale.phone,
  '| AUTHORIZER', results.partSale.authorizer, '| Change Customer', results.partSale.changeCustomer);
await page.screenshot({ path: `${OUT}/evidence/final-partsale.png`, fullPage: true });
save();

// ---------------- C44923 : a newly ticked "Approves Work" contact, no refresh ----------
L('\n### C44923 — new Approves Work contact becomes selectable without refresh');
await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(page, 1200);
const openAuthorizer = async () => {
  const h = await page.evaluateHandle(() =>
    [...document.querySelectorAll('.q-select')]
      .find(e => /authoriz/i.test(e.querySelector('.q-field__label')?.textContent || '')) || null);
  const el = h.asElement();
  if (!el) return { opened: false, options: [] };
  await el.click().catch(() => {});
  await page.waitForTimeout(3000);
  const options = await page.evaluate(() =>
    [...document.querySelectorAll('.q-menu .q-item')].map(e => e.textContent.trim()).filter(Boolean));
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(800);
  return { opened: true, options };
};
const before = await openAuthorizer();
L('  BEFORE — list opened:', before.opened, '| options:', JSON.stringify(before.options));
L('  target contact:', NAME, '| already listed:', before.options.some(o => o.includes(NAME)));

// flip the flag on the contact record itself — a SECOND tab, the work order tab untouched
const tab2 = await ctx.newPage();
await tab2.goto(`${APP}/customers/${CID}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle(tab2, 900);
L('  contacts tab:', tab2.url());
const flip = await tab2.evaluate(name => {
  const r = [...document.querySelectorAll('tr')].find(x => (x.innerText || '').includes(name));
  if (!r) return { rowFound: false, sample: [...document.querySelectorAll('tr')].slice(0, 8)
    .map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 60)) };
  r.click(); return { rowFound: true };
}, NAME);
L('  contact row:', JSON.stringify(flip).slice(0, 300));
await tab2.waitForTimeout(4000);
const cb = await tab2.evaluate(() => {
  const el = document.querySelector('[data-test-id="input_checkbox_is_authorizer"]')
    || [...document.querySelectorAll('.q-checkbox')].find(e => /approves work/i.test(e.textContent || ''));
  if (!el) return { found: false, tail: (document.body?.innerText || '').slice(-500) };
  el.click();
  return { found: true };
});
L('  Approves Work control:', JSON.stringify(cb).slice(0, 300));
if (cb.found) {
  await tab2.waitForTimeout(1500);
  const saved = await tab2.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(e => /^\s*(save|update)\b/i.test(e.innerText || ''));
    if (!b) return false; b.click(); return true;
  });
  L('  save clicked:', saved);
  await tab2.waitForTimeout(5000);
}
const chk = await apiGet(`/api/customers/view/${CID}`);
const cons = chk.body?.data?.contacts || [];
const tgt = cons.find(c => c.id === CONTACT);
L('  is_authorizer on the RECORD now:', tgt ? tgt.is_authorizer : 'contact not found');
await tab2.close();
await page.bringToFront();
await page.waitForTimeout(3000);
const after = await openAuthorizer();
L('  AFTER (work order never refreshed) options:', JSON.stringify(after.options));
L('  RESULT — selectable without refresh:', after.options.some(o => o.includes(NAME)));
results.c44923 = { before, after, recordFlag: tgt?.is_authorizer };
await page.screenshot({ path: `${OUT}/evidence/final-c44923.png` });
save();

// ---------------- C45191 : no work-order edit permission -> read-only Authorizer ----------
L('\n### C45191 — restricted user sees a read-only Authorizer');
const adminRead = await readCard(page);
L('  POSITIVE CONTROL (admin): authorizer select present:', adminRead.authorizer,
  '| readonly element:', adminRead.authorizerReadonlyEl);
const sw = await apiPost('/api/switch-user', { user_id: TECH });
L(`  switch-user -> ${TECHNAME}: HTTP ${sw.status}`);
if (sw.status === 200 || sw.status === 201) {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  const perms = fe.body?.data?.fe_permissions || [];
  L('  workOrder* permissions as this user:', JSON.stringify(perms.filter(p => /^workOrder/i.test(p))));
  L('  workOrdersCreateAndEdit present:', perms.includes('workOrdersCreateAndEdit'));
  const d = sw.body?.data || {};
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.evaluate(({ u, f, t }) => {
    localStorage.setItem('user', JSON.stringify(u));
    if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (t) localStorage.setItem('token', JSON.stringify(t));
  }, { u: { data: { token: d.token, role: d.role, details: d.details } }, f: fe.body?.data, t: d.token });
  await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle(page, 900);
  results.c45191 = await readCard(page);
  results.c45191.perms = perms.filter(p => /^workOrder/i.test(p));
  L('  AS RESTRICTED USER: chars', results.c45191.bodyChars, '| landed', results.c45191.url);
  L('    statics:', JSON.stringify(results.c45191.statics));
  L('    selects:', JSON.stringify(results.c45191.selects));
  L('    authorizer present:', results.c45191.authorizer,
    '| READ-ONLY ELEMENT:', results.c45191.authorizerReadonlyEl);
  await page.screenshot({ path: `${OUT}/evidence/final-c45191.png`, fullPage: true });
} else {
  L('  switch-user body:', JSON.stringify(sw.body).slice(0, 300));
}
const back = await apiPost('/api/quick-login', { key: 'admin' });
L('  restored to admin: HTTP', back.status);

fs.writeFileSync(`${OUT}/evidence/final-observations.json`, JSON.stringify(results, null, 1));
save();
await browser.close();
