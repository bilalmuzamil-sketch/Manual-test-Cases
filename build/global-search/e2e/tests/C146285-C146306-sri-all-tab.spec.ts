import { test, expect } from '../fixtures/test.js';
import { RESULTS_DIR } from '../fixtures/data.js';
import path from 'node:path';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { APP, APIH, apiJson, collectionOf } from '../fixtures/boot.js';
import { resolveTerm, harvestAnchors, type LiveAnchors } from '../fixtures/anchors.js';
import { panelShape, openTab, groupRows, lastPointerCheck } from '../fixtures/rowshape.js';
import * as fs from 'node:fs';

/**
 * SEARCH RESULTS INTEGRITY — THE ALL TAB AND CROSS-TAB SHEET (C146285–C146306).
 *
 * Twenty-two cases about the SHAPE of the panel rather than the content of a row: tab counts, the
 * order of groups, what "Show all" does, how punctuation is handled, and what an empty result
 * says. One (C146301) is held by its own Expected and is recorded, never judged.
 *
 * These are one-off checks, so each carries its own reasoning rather than sharing a table. Where a
 * case asks the tester to compare two searches, the test runs both and compares them — a single
 * search cannot answer "are these the same?".
 */
const VIEWPORT = { width: 1440, height: 900 };
const ORDER = ['Work orders', 'Customers', 'Assets', 'Parts', 'Vendors', 'Part sales',
               'Purchase orders', 'Vendor invoices'];
/**
 * 🔴 "ZZBROAD" RETURNS NOTHING ON PRODUCTION (measured 2 Oct 2026) — it is a staging fixture.
 * These cases are about how the All tab behaves when a query matches several kinds, not about that
 * particular word, so the term is resolved at run time and the fixture is used wherever it exists.
 */
/**
 * 🔴 EVERY VALUE BELOW USED TO BE A STAGING RECORD WRITTEN INTO THIS FILE — a work order number
 * "S-34379", a telephone "609-461-6502", a chassis number "SVEWU82M5ETEJFWFA". None exists on
 * production, so eight checks failed saying the control found nothing, which is true and says
 * nothing about the product. They are harvested from the environment under test instead, and a
 * check whose value this environment cannot supply stands down with that reason.
 */
let BROADQ = 'ZZBROAD';
let LIVE: LiveAnchors = {};
let WO_NUMBER = '';     // a work order number that exists here
let PHONE = '';         // a telephone as a customer actually has it recorded
let s: Session;
const m: Record<string, any> = { viewport: VIEWPORT };

test.beforeAll(async () => {
  s = await signIn('/customers');
  BROADQ = (await resolveTerm(s.page, 'ZZBROAD')) ?? 'ZZBROAD';
  LIVE = await harvestAnchors(s.page);
  const woTerm = await resolveTerm(s.page, 'ZZLONGROW', 'Work orders');
  if (woTerm) {
    const sample = await groupRows(s.page, woTerm, 'Work orders');
    WO_NUMBER = (sample.map((r) => (r.text.match(/\bS\d-\d+/) || [])[0]).find(Boolean)) ?? '';
  }
  PHONE = await (async () => {
    const rows = collectionOf(await apiJson(s, '/api/customers?limit=80'));
    return rows.map((c: any) => String(c?.telephone || c?.phone || ''))
      .find((v: string) => v.replace(/\D/g, '').length >= 7) || '';
  })();
  console.log(`all-tab values — work order: "${WO_NUMBER || 'none'}", telephone: "${PHONE || 'none'}", `
    + `chassis: "${LIVE.assetVin ?? 'none'}"`);
  await s.page.setViewportSize(VIEWPORT);
  m.build = await buildMarker(s.page);
  console.log('build under test:', m.build);
});
test.afterAll(async () => {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });   // the suite's own folder, wherever the run was started
  fs.writeFileSync(path.join(RESULTS_DIR, 'sri-all-tab.json'), JSON.stringify(m, null, 1));
  await s?.browser.close();
});
const rec = (k: string, v: unknown) => { m[k] = v; console.log(k, JSON.stringify(v).slice(0, 400)); };

test('C146285 — a tab\'s count equals the number of rows inside it @C146285', async () => {
  const p = await panelShape(s.page, '965');
  const checked: any[] = [];
  for (const t of p.tabs.filter((t) => t.label !== 'All' && (t.count ?? 0) > 0)) {
    const o = await openTab(s.page, t.label);
    checked.push({ tab: t.label, count: t.count, rows: o.rows.length });
  }
  rec('C146285', { pointer: lastPointerCheck, checked });
  for (const c of checked) {
    // "up to a maximum of 20" — the count may be capped, so the rows must equal min(count, 20).
    expect(c.rows, `the ${c.tab} tab reads ${c.count} but holds ${c.rows} rows`)
      .toBe(Math.min(c.count, 20));
  }
});

test('C146286 — no count anywhere reads higher than 20 [expected to fail: SV-10320] @C146286', async () => {
  /**
   * 🔴 REPRODUCES A KNOWN FAULT. Status read live from Jira on 2 October 2026: **OBSOLETE**.
   * A closed ticket is not a spec change, so the expectation STAYS and is not edited to match the
   * build (Rules 57 and 114). Whether the behaviour is now intended is the QA lead's ruling and is
   * raised with him. Marked expected-to-fail so the file is not red for reproducing what it names.
   */
  test.fail();
  const p = await panelShape(s.page, BROADQ);
  const over = [...p.tabs.filter((t) => (t.count ?? 0) > 20).map((t) => `tab ${t.label}=${t.count}`),
                ...p.groups.filter((g) => (g.count ?? 0) > 20).map((g) => `group ${g.head}=${g.count}`),
                ...p.groups.map((g) => g.showAll).filter((l): l is string =>
                  !!l && Number(l.replace(/\D/g, '')) > 20).map((l) => `link "${l}"`)];
  rec('C146286', { tabs: p.tabs, groups: p.groups.map((g) => ({ h: g.head, c: g.count, link: g.showAll })), over });
  expect(over, `these read above the limit: ${JSON.stringify(over)}`).toHaveLength(0);
});

test('C146287 — a group on the All tab shows 5 and offers the rest @C146287', async () => {
  const p = await panelShape(s.page, BROADQ);
  const big = p.groups.filter((g) => (g.count ?? 0) > 5);
  rec('C146287', p.groups.map((g) => ({ head: g.head, count: g.count, rows: g.rows, showAll: g.showAll })));
  expect(big.length, 'no group has more than five results, so this case has nothing to check')
    .toBeGreaterThan(0);
  for (const g of big) {
    expect(g.rows, `the ${g.head} group holds ${g.count} but draws ${g.rows} rows on the All tab`).toBe(5);
    expect(g.showAll, `the ${g.head} group offers no "Show all" link`).toBeTruthy();
  }
});

test('C146288 — "Show all" opens that tab and keeps you in the search box @C146288', async () => {
  const p = await panelShape(s.page, BROADQ);
  const g = p.groups.find((x) => x.showAll);
  expect(g, 'no group offers a "Show all" link, so this case cannot be run').toBeTruthy();
  const before = s.page.url();
  await s.page.evaluate(() => {
    const el = [...document.querySelectorAll('.search-group a, .search-group button')]
      .find((e) => /show all/i.test((e as HTMLElement).innerText));
    (el as HTMLElement)?.click();
  });
  await s.page.waitForTimeout(2_500);
  const after = await s.page.evaluate(() => ({
    url: location.href,
    modalOpen: !!document.querySelector('.search-modal'),
    inputValue: (document.querySelector('.search-modal input') as HTMLInputElement)?.value ?? null,
    activeTab: (document.querySelector('.search-tabs__tab--active') as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? null,
  }));
  rec('C146288', { clicked: g!.showAll, group: g!.head, before, after });
  expect(after.modalOpen, 'the panel closed — being sent to a separate page is a FAIL').toBe(true);
  expect(after.url, 'the browser navigated away from the page').toBe(before);
  expect(after.inputValue, 'the search box no longer holds what was typed').toBe(BROADQ);
  expect(after.activeTab, `the active tab is "${after.activeTab}", not the group that was clicked`)
    .toMatch(new RegExp(g!.head.split(/\s+/)[0], 'i'));
});

test('C146289 — all nine tabs are there, named and counted @C146289', async () => {
  const p = await panelShape(s.page, '965');
  const labels = p.tabs.map((t) => t.label);
  rec('C146289', p.tabs);
  expect(labels, 'the tab strip is not the nine expected tabs in order')
    .toEqual(['All', ...ORDER]);
  const uncounted = p.tabs.filter((t) => t.count === null).map((t) => t.label);
  expect(uncounted, `these tabs carry no count: ${JSON.stringify(uncounted)}`).toHaveLength(0);
});

test('C146290 — groups on the All tab are always in the same order @C146290', async () => {
  const p = await panelShape(s.page, '965');
  const heads = p.groups.map((g) => g.head);
  rec('C146290', heads);
  // Kinds with no results are skipped, so the shown order must be a SUBSEQUENCE of the fixed order.
  const idx = heads.map((h) => ORDER.findIndex((o) => new RegExp('^' + o, 'i').test(h)));
  expect(idx.every((x) => x >= 0), `a group heading is not one of the nine: ${JSON.stringify(heads)}`).toBe(true);
  expect(idx, `the groups are out of order: ${JSON.stringify(heads)}`)
    .toEqual([...idx].sort((a, b) => a - b));
});

test('C146291 — typing a full record number puts that record at the very top @C146291', async () => {
  /**
   * ⛔ THE FEATURE THIS CHECKS WAS CANCELLED. The QA lead ruled on 29 September 2026, on C44850 and
   * C55729 which test the same behaviour, that the pinned top result "has been taken off", and he
   * marked both passing himself (PROJECT-STATE.md §0-QA-LEAD-RULINGS-2026-09-29; the withdrawn
   * ticket draft is kept at staging-run-2026-09-29/WITHDRAWN-TICKET-DRAFT-pinned-top-result.md).
   * Asserting it would make this file red for a product behaving as decided. Stood down, not
   * deleted, so the ruling is visible to whoever reads this next.
   */
  test.skip(true, 'the pinned top result was withdrawn by the QA lead on 2026-09-29 — this is not a '
    + 'defect and the check is not asserted');
  test.skip(!WO_NUMBER, 'no work order number could be read from this environment');
  const p = await panelShape(s.page, WO_NUMBER);
  rec('C146291', { topRows: p.topRows, firstGroup: p.groups[0]?.head, body: p.body.slice(0, 160) });
  expect(p.topRows.length,
    `nothing sits above the first group heading — the exact record is not promoted. ` +
    `Groups: ${JSON.stringify(p.groups.map((g) => g.head))}`).toBeGreaterThan(0);
  expect(p.topRows.join(' '), 'the promoted row is not the record that was typed')
    .toContain(WO_NUMBER.replace(/^[A-Z]\d-/i, ''));
});

/** Two searches whose results must match. Returns both lists so a failure shows what differed. */
async function sameResults(a: string, b: string, tab?: string) {
  const ra = tab ? (await groupRows(s.page, a, tab)).map((r) => r.text) : (await panelShape(s.page, a)).groups.flatMap((g) => g.head);
  const rb = tab ? (await groupRows(s.page, b, tab)).map((r) => r.text) : (await panelShape(s.page, b)).groups.flatMap((g) => g.head);
  return { a, b, ra, rb, same: JSON.stringify(ra) === JSON.stringify(rb) };
}

test('C146292 — a number is found with and without its dashes @C146292', async () => {
  test.skip(!WO_NUMBER, 'no work order number could be read from this environment');
  const r = await sameResults(WO_NUMBER, WO_NUMBER.replace(/-/g, ''), 'Work orders');
  rec('C146292', r);
  expect(r.ra.length, 'the punctuated form finds nothing, so there is nothing to compare').toBeGreaterThan(0);
  expect(r.rb, `"${r.b}" returns a different list from "${r.a}"`).toEqual(r.ra);
});

test('C146293 — a phone number is found however it is punctuated @C146293', async () => {
  test.skip(!PHONE, 'no customer on this environment has a telephone recorded, so punctuation '
    + 'cannot be compared');
  const r = await sameResults(PHONE, PHONE.replace(/\D/g, ''), 'Customers');
  rec('C146293', r);
  expect(r.ra.length, 'the punctuated number finds nothing').toBeGreaterThan(0);
  expect(r.rb, 'the unpunctuated digits return a different list').toEqual(r.ra);
});

test('C146294 — an accented name is found typed either way @C146294', async () => {
  // The seeded pair: whatever ZZACC returns is the record; then the same name stripped of accents.
  const seeded = await groupRows(s.page, 'ZZACC', 'Customers');
  rec('C146294.seed', seeded.map((r) => r.text));
  expect(seeded.length, 'no ZZACC customer exists on this environment, so the case cannot be run')
    .toBeGreaterThan(0);
  const name = seeded[0].title.text.trim();
  const plain = name.normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (plain === name) { rec('C146294', { note: 'the seeded name carries no accents; nothing to compare', name }); return; }
  const r = await sameResults(name, plain, 'Customers');
  rec('C146294', r);
  expect(r.rb, `"${plain}" does not return what "${name}" returns`).toEqual(r.ra);
});

test('C146295 — an apostrophe or hyphen in a name is optional @C146295', async () => {
  const seeded = await groupRows(s.page, 'ZZPUNC', 'Customers');
  rec('C146295.seed', seeded.map((r) => r.text));
  expect(seeded.length, 'no ZZPUNC customer exists, so the case cannot be run').toBeGreaterThan(0);
  const name = seeded[0].title.text.trim();
  const plain = name.replace(/['’-]/g, '');
  if (plain === name) { rec('C146295', { note: 'the seeded name carries no apostrophe or hyphen', name }); return; }
  const r = await sameResults(name, plain, 'Customers');
  rec('C146295', r);
  expect(r.rb, `"${plain}" does not return what "${name}" returns`).toEqual(r.ra);
});

test('C146296 — a typo in a NUMBER is not silently corrected @C146296', async () => {
  const VIN = String(LIVE.assetVin || '');
  test.skip(!VIN, 'this environment has no chassis number that search can currently find');
  // 🔴 A CHASSIS NUMBER BELONGS TO AN ASSET. Looking for it under Work orders found nothing and the
  // control failed, which says nothing about typo handling. Take whichever tab actually holds it.
  let vinTab = 'Work orders';
  let exact = await groupRows(s.page, VIN, vinTab);
  if (!exact.length) { vinTab = 'Assets'; exact = await groupRows(s.page, VIN, vinTab); }
  test.skip(!exact.length, `the chassis number "${VIN}" is not findable in Work orders or Assets on `
    + 'this environment, so a near miss would prove nothing about typo handling');
  // POSITIVE CONTROL: the exact VIN must find the vehicle, or the near-miss result means nothing.
  expect(exact.length,
    'CONTROL FAILED: the exact chassis number finds nothing, so "the near miss finds nothing" ' +
    'says nothing about typo handling').toBeGreaterThan(0);
  const typo = VIN.slice(0, -1) + (VIN.endsWith('A') ? 'B' : 'A');
  const near = await groupRows(s.page, typo, 'Work orders');
  rec('C146296', { exactRows: exact.length, typo, nearRows: near.length,
                   nearText: near.map((r) => r.text.slice(0, 80)) });
  expect(near.length,
    `changing one character of the chassis number to "${typo}" still returns ${near.length} rows — ` +
    `a typo in a number is being silently corrected`).toBe(0);
});

test('C146297 — typing a status word returns nothing because of status @C146297', async () => {
  const found: any = {};
  for (const w of ['Approved', 'Invoiced', 'Unpaid', 'Ordered']) {
    const rows = await groupRows(s.page, w, 'Work orders');
    // A row is legitimate only if the word is in its TEXT other than the status badge.
    // 🔴 THE ROW'S OWN NOTE SAYS WHY IT CAME BACK, AND THE CASE ALLOWS THAT REASON.
    // "Records whose name genuinely contains the word are fine" — and so is a line item whose
    // TEXT contains it. Judging on the title and badge alone flagged twenty work orders whose
    // note reads "Line item: approved": they matched a line item's wording, not their status.
    const note = (r: any) => r.metaParts.find((p: string) => /^[A-Za-z][A-Za-z /]{2,30}:\s/.test(p)) ?? '';
    found[w] = rows.map((r) => ({ text: r.text.slice(0, 90), badge: r.badge, note: note(r),
      wordInName: new RegExp(w, 'i').test(r.title.text),
      wordInMatchedField: new RegExp(w, 'i').test(note(r)) }));
  }
  rec('C146297', found);
  const byStatusOnly = Object.entries(found).flatMap(([w, rows]: any) =>
    rows.filter((r: any) => !r.wordInName && !r.wordInMatchedField
                            && new RegExp(w, 'i').test(r.badge ?? ''))
        .map((r: any) => `${w}: ${r.text}`));
  expect(byStatusOnly,
    `these came back only because of their status, not their name: ${JSON.stringify(byStatusOnly)}`)
    .toHaveLength(0);
});

test('C146298 — a work order whose truck has no unit number still reads properly @C146298', async () => {
  // find a work order whose asset shows no unit number, rather than naming the staging one
  const noUnitTerm = await resolveTerm(s.page, 'ZZNOUNIT', 'Work orders');
  const candidates = noUnitTerm ? await groupRows(s.page, noUnitTerm, 'Work orders') : [];
  const rows = candidates.filter((r) => r.metaParts.length <= 1);
  test.skip(rows.length === 0, 'every work order on this environment is on an asset that carries a '
    + 'unit number, so the row this case is about does not exist here');
  rec('C146298', rows.map((r) => ({ text: r.text, meta: r.metaParts })));

  for (const r of rows) {
    expect(r.text, 'the row shows the word "undefined"').not.toMatch(/undefined|null/i);
    // A leftover separator: " · " at either end, or two in a row.
    const meta = r.meta.text.trim();
    expect(meta, `the second line has a leftover separator: "${meta}"`).not.toMatch(/^·|·$|·\s*·/);
  }
});

test('C146299 — a very long value does not push the rest of the row out of sight @C146299', async () => {
  const term = await resolveTerm(s.page, 'ZZLONGROW', 'Work orders');
  test.skip(!term, 'no work order comes back on this environment');
  const rows = await groupRows(s.page, term!, 'Work orders');
  rec('C146299', rows.map((r) => ({ badge: r.badge, meta: r.metaParts, titleClipped: r.title.clipped })));
  expect(rows.length).toBeGreaterThan(0);
  for (const r of rows) {
    expect(r.badge, 'the status badge has been pushed off the row').toBeTruthy();
    expect(r.metaParts.length, 'the second line has been pushed off the row').toBeGreaterThan(0);
  }
});

test('C146300 — a very common word still gives a usable list @C146300', async () => {
  const rows = await groupRows(s.page, 'Filter', 'Parts');
  const texts = rows.map((r) => r.text);
  rec('C146300', { rows: rows.length, sample: texts.slice(0, 5) });
  expect(rows.length, '"Filter" returns no parts at all').toBeGreaterThan(0);
  // "the rows differ enough to choose from" — identical rows make the list unusable.
  const dupes = texts.filter((t, i) => texts.indexOf(t) !== i);
  expect(dupes, `these rows are indistinguishable from one another: ${JSON.stringify(dupes.slice(0, 3))}`)
    .toHaveLength(0);
});

test('C146302 — a kind of record that does not exist yet does not break search @C146302', async () => {
  const p = await panelShape(s.page, '965');
  const zero = p.tabs.filter((t) => t.count === 0).map((t) => t.label);
  const headsShown = p.groups.map((g) => g.head);
  rec('C146302', { zeroTabs: zero, groupsShown: headsShown });
  // The empty kinds must not appear as GROUPS on the All tab.
  for (const z of zero) {
    expect(headsShown.some((h) => new RegExp('^' + z, 'i').test(h)),
      `"${z}" has no results but still shows a group heading on the All tab`).toBe(false);
  }
  expect(p.groups.length, 'the panel shows no groups at all — search is broken, not merely empty')
    .toBeGreaterThan(0);
});

test('C146303 — no results shows your query back, and nothing else @C146303', async () => {
  const p = await panelShape(s.page, 'Zqwxpol');
  rec('C146303', { body: p.body, empty: p.empty, rows: p.groups.reduce((n, g) => n + g.rows, 0) });
  expect(p.groups.reduce((n, g) => n + g.rows, 0), 'this term was supposed to match nothing').toBe(0);
  expect(p.body, 'the empty message does not quote what was typed').toMatch(/Zqwxpol/i);
  expect(p.body, 'the empty state offers more than the message').not.toMatch(/try|suggest|tip|instead|did you mean/i);
});

test('C146304 — no results inside a tab names the tab @C146304', async () => {
  const p = await panelShape(s.page, 'ZZVORTAC');
  const emptyTab = p.tabs.find((t) => t.label !== 'All' && t.count === 0);
  rec('C146304.tabs', p.tabs);
  expect(emptyTab, 'every tab has results for this term, so the case cannot be run').toBeTruthy();
  await openTab(s.page, emptyTab!.label);
  const body = await s.page.evaluate(() =>
    (document.querySelector('.search-modal__body') as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? '');
  rec('C146304', { tab: emptyTab!.label, body: body.slice(0, 220) });
  expect(body, `the message inside the empty "${emptyTab!.label}" tab does not name the tab`)
    .toMatch(new RegExp(emptyTab!.label.split(/\s+/)[0], 'i'));
});

test('C146305 — a record you can open from its own list is never "not found" @C146305', async () => {
  const term = await resolveTerm(s.page, 'ZZLONGROW', 'Work orders');
  test.skip(!term, 'no work order comes back on this environment');
  const rows = await groupRows(s.page, term!, 'Work orders');
  // The control the case insists on: a DIFFERENT value from the SAME record, taken from the row
  // itself rather than a staging word ("Rowcheck") that production has never heard of.
  const other = (rows[0]?.text.match(/\b[A-Za-z]{5,}\b/g) || []).find((w) => !new RegExp(term!, 'i').test(w)) ?? '';
  test.skip(!other, 'the row carries no second value to use as a control');
  const control = await groupRows(s.page, other, 'Work orders');
  rec('C146305', { value: term, found: rows.length, controlTerm: other, controlFound: control.length });
  expect(control.length,
    'CONTROL FAILED: a second value from the same record finds nothing either, so a miss below ' +
    'would mean "search is down", not "this field is not searchable"').toBeGreaterThan(0);
  expect(rows.length, 'the value does not find its record, though the record is reachable from its list')
    .toBeGreaterThan(0);
});

test('C146306 — someone without access sees no rows AND no count @C146306', async () => {
  /**
   * 🔴 THIS USES THE STAGING QUICK-LOGIN, which does not exist on production: the page ends up on a
   * Google sign-in screen and the check times out after two minutes having tested nothing. The same
   * ground is covered without any of that by `permissions-two-accounts.spec.ts`, which signs in as
   * a full-access person and the lower-permission person and compares the same record — the
   * approach the QA lead asked for on 2026-09-24.
   */
  test.skip(!/staging/.test(process.env.GS_APP ?? ''),
    'this check signs in through the staging quick-login, which production does not have. '
    + 'permissions-two-accounts.spec.ts covers the same ground here.');
  const full = await panelShape(s.page, '965');
  const fullShape = full.tabs.map((t) => `${t.label}=${t.count}`);
  // 🔴 A SECOND SESSION ON THE LOWER-PERMISSION ACCOUNT, BOOTED DIRECTLY.
  // signIn()'s second argument is `device`, NOT an account - it takes the account from
  // GS_LOGIN_AS. Passing 'tech' to it would have signed in as ADMIN again and quietly compared
  // the admin against himself, which passes this case for entirely the wrong reason. The boot is
  // called here with an explicit key instead.
  // the portable staging sign-in, not a script from one particular container
  const mod: any = await import('../fixtures/boot.js');
  const tech: any = await mod.signInStaging('/customers', { key: 'tech', settle: 11_000 });
  try {
    await tech.page.setViewportSize(VIEWPORT);
    // CONTROL: prove the second session really is a different, lesser account. Comparing a
    // session against itself would pass this case while testing nothing.
    // Read from the server, not a browser variable: `__fe_permissions` is never set by our sign-in,
    // so both read null and the proof rested on the panels alone.
    const permsOf = async (pg: any) => {
      const host = mod.APIH;
      return pg.evaluate(async (h: string) => {
        const r = await fetch(`https://${h}/api/auth/me/fe-permissions`, { credentials: 'include' });
        const j = await r.json().catch(() => null);
        return (j?.data?.fe_permissions ?? null)?.length ?? null;
      }, host);
    };
    const perms = await permsOf(tech.page);
    const adminPerms = await permsOf(s.page);
    const r = await panelShape(tech.page, '965');
    const techShape = r.tabs.map((t) => `${t.label}=${t.count}`);
    rec('C146306.accounts', { adminPerms, restrictedPerms: perms,
      differentPanels: JSON.stringify(fullShape) !== JSON.stringify(techShape) });
    // A failed control means nothing was measured - it stands down, it is not a product failure.
    test.skip(perms === null || adminPerms === null || perms >= adminPerms,
      `CONTROL FAILED: the second session holds ${perms} permissions against the admin's ${adminPerms}, `
      + 'so it is not proven to be a lesser account - this case would test nothing');
    rec('C146306', { admin: fullShape, restricted: techShape,
                     adminGroups: full.groups.map((g) => g.head), restrictedGroups: r.groups.map((g) => g.head) });
    // The restricted account must not see MORE than the admin, and wherever it has no rows it must
    // not still publish a count - a count alone leaks how much exists.
    const leaks: string[] = [];
    for (const t of r.tabs) {
      const grp = r.groups.find((g) => new RegExp('^' + t.label, 'i').test(g.head));
      if (t.label !== 'All' && (t.count ?? 0) > 0 && !grp) leaks.push(`${t.label} counts ${t.count} but shows no group`);
    }
    expect(leaks, `a count is shown for records the restricted user cannot see: ${JSON.stringify(leaks)}`)
      .toHaveLength(0);
  } finally { await tech.browser.close(); }
});

test('C146301 — [HELD: the source is silent] what one or two characters do @C146301', async () => {
  const one = await panelShape(s.page, '9');
  const two = await panelShape(s.page, '96');
  rec('C146301', {
    held: 'the specification sets a typing delay but no minimum length, so this is recorded, not judged',
    oneChar: { body: one.body.slice(0, 150), groups: one.groups.map((g) => `${g.head}:${g.rows}`) },
    twoChar: { body: two.body.slice(0, 150), groups: two.groups.map((g) => `${g.head}:${g.rows}`) },
  });
  // The three things its Expected DOES commit to: no error, no hang, no stale results.
  expect(two.body, 'the two-character search still shows the one-character results').not.toBe(one.body);
});
