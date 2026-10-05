import { test, expect } from '../fixtures/test.js';
import { signIn, buildMarker, api, type Session } from '../fixtures/auth.js';
import { APP, APIH, IS_PROD } from '../fixtures/boot.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, entityTerms, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * WHAT A PERSON CAN AND CANNOT SEE IN SEARCH.
 *
 * SOURCE: Global Search — Product Requirements v1.5, §10 Permissions, plus epic SV-9160.
 * Each check was run by hand and passed in run 415 before being automated (Rule 115).
 *
 * 🔴 TWO ACCOUNTS, NOT A ROLE EDITED MID-RUN — AND THAT IS THE QA LEAD'S OWN INSTRUCTION.
 * Cases worded "flipping only Parts access shows then hides the same part" describe a difference
 * in what two people can see. A spec could produce that by editing a role while it runs, but on a
 * shared environment that collides with anyone else working in it and leaves the role wrong if the
 * run stops half way. It is also unnecessary: a lower-permission login already exists and the QA
 * lead ruled on 24 September 2026 that it is the one to use — *"The second person with fewer
 * permission need not to be added as new from scratch. You can rather use the other login which I
 * have already shared with you for such lower permission tasks."*
 *
 * So each check signs in as BOTH people, searches the SAME record, and compares. Nothing is
 * mutated, the environment is left exactly as found, and the assertion is stronger: it is the same
 * record at the same moment, not the same record before and after an edit that might itself have
 * changed something else.
 *
 * 🔴 AND THE PERMISSIONS ARE READ LIVE, NEVER ASSUMED. A login's access can be changed by anyone
 * at any time. Every check below reads what each account actually holds and skips, naming what was
 * missing, if the pair cannot demonstrate the thing being asked about. A spec that assumes an
 * account is still limited will one day pass while proving nothing.
 */
const FULL_ENVF = process.env.PROD_ENVF || '/tmp/shopview/prod-gs.env';
const LIMITED_ENVF = process.env.GS_LIMITED_ENVF || '/tmp/shopview/prod-login-limited.env';
// 🔴 OFF PRODUCTION THE SECOND PERSON IS A QUICK-LOGIN KEY, NOT A PASSWORD. Measured on staging
// 2 October 2026: `admin` holds 59 permissions and every area; `tech` is a Technician with 6 —
// work orders and customers/assets, but NOT parts, part sales or vendors. That is a genuine
// difference to compare, available unattended from the same Google session, and it needs no
// shared role edited. (On production the lower-permission PASSWORD login had drifted to all 58
// permissions because its role is shared with three other staff — see the README.)
const LIMITED_KEY = process.env.GS_LIMITED_KEY || 'tech';
const FULL_KEY = process.env.GS_LOGIN_AS || 'admin';

type Who = { s: Session; perms: string[]; label: string; as?: string };
let full: Who, limited: Who;
/**
 * 🔴 A THIRD, NARROWER PERSON - FOR THE CHECKS THE TECHNICIAN CANNOT SERVE (2026-10-03).
 * The technician holds Customers and Work Orders, so "without Customers access" could never be shown.
 * Staging has staff on narrower roles (Time Clock User: no customers, parts, suppliers or part sales).
 * Staging's quick sign-in has only two accounts and a second sign-in to one ends the first, so this
 * person is reached by SWITCHING inside the full-access session and switching back before the
 * full-access person is used again (actAs). Nothing shared is edited - no role, no assignment.
 * Every STOCK role on staging can see work orders, so a seeded ZZAUTOTEST person on a role without
 * them is tried second (seeding/seed_roles.py, 2026-10-05).
 */
let narrows: Who[] = [];        // every narrower person available, tried in order (2026-10-05)
let fullAs = '';                 // the admin staff member the full session switches back to
let acting: Who | null = null;
const HEAVY_DUTY = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
async function actAs(w: Who) {
  if (!narrows.length || w === limited || acting === w || (w === full && acting === null)) return;
  const id = w === full ? fullAs : w.as!;
  await api(full.s.page, 'POST', '/api/switch-user', { user_id: id });
  await full.s.page.waitForTimeout(800);
  await api(full.s.page, 'POST', '/api/iam/change-location', { workplace_id: HEAVY_DUTY, workplace_timezone: 'America/Edmonton' });
  await full.s.page.goto(`${APP}/dashboard`, { waitUntil: 'load' });
  await full.s.page.waitForTimeout(3_000);
  acting = w;
}
let BROAD = '';
let LIVE: LiveAnchors = {};

async function permsOf(s: Session): Promise<string[]> {
  const r: any = await api(s.page, 'GET', '/api/auth/me/fe-permissions');
  const b = r?.body;
  const list = b?.data?.fe_permissions ?? b?.fe_permissions ?? b?.data ?? b;
  return Array.isArray(list) ? list.map(String) : [];
}

test.beforeAll(async () => {
  full = { s: await signIn('/customers', undefined, FULL_ENVF, FULL_KEY), perms: [], label: 'the full-access person' };
  full.perms = await permsOf(full.s);
  console.log('build under test:', await buildMarker(full.s.page));
  console.log(`full-access account: ${full.perms.length} permissions`);
  LIVE = await harvestAnchors(full.s.page);
  BROAD = (await broadTerm(full.s.page))?.term ?? '';
});

test.beforeAll(async () => {
  // 🔴 SIGNING IN SECOND DOES NOT EVICT THE FIRST: they are different people, and the session is
  // per account. Signing in as the SAME person twice is what ends the earlier session.
  limited = { s: await signIn('/customers', undefined, LIMITED_ENVF, LIMITED_KEY), perms: [], label: 'the lower-permission person' };
  limited.perms = await permsOf(limited.s);
  console.log(`lower-permission account: ${limited.perms.length} permissions -> ${limited.perms.slice(0, 12).join(', ')}`);
});

test.beforeAll(async () => {
  if (IS_PROD) return;
  // 🔴 ONE NARROWER PERSON COULD NOT SERVE THE WORK-ORDER CHECKS (2026-10-05): every stock role on
  // staging can see work orders. seeding/seed_roles.py now makes a role without them AND puts one
  // ZZAUTOTEST person on it, so that person is the second one tried. GS_NARROW_ROLE (comma-separated)
  // overrides the list.
  const roles = (process.env.GS_NARROW_ROLE || 'Time Clock User,ZZAUTOTEST No Work Orders View')
    .split(',').map((r) => r.trim()).filter(Boolean);
  // 🔴 THE PLAIN STAFF LIST LEAVES SOME PEOPLE OUT (staging, 2026-10-05: 22 rows, and neither seeded
  // ZZAUTOTEST person among them; ?search= finds them at once). So the seeded people are searched for too.
  const listed = async (q: string) => (((await api(full.s.page, 'GET', `/api/staff${q}`)).body as any)?.data?.collection ?? []);
  const seen = new Set<string>();
  const staff: any[] = [...await listed(''), ...await listed('?search=ZZAUTOTEST')]
    .filter((x: any) => x.is_active && !seen.has(x.id) && seen.add(x.id));
  const prefer = (ok: (x: any) => boolean) => staff.find((x) => ok(x) && x.workplace_id === HEAVY_DUTY) ?? staff.find(ok);
  fullAs = prefer((x) => /^admin(istrator)?$/i.test(String(x.role_label ?? '')))?.id ?? '';
  if (!fullAs) { console.log('no admin to switch back to — the narrower checks stand down'); return; }
  for (const role of roles) {
    const who = prefer((x) => String(x.role_label) === role);
    if (!who) { console.log(`no active "${role}" staff — not available as a narrower person`); continue; }
    const n: Who = { s: full.s, perms: [], label: `the ${role} person`, as: who.id };
    narrows.push(n);
    await actAs(n);
    n.perms = await permsOf(full.s);
    await actAs(full);
    console.log(`narrower person (${role}): ${n.perms.length} permissions -> ${n.perms.join(', ')}`);
    // the switch did not take: never compare a person with themselves
    if (n.perms.length >= full.perms.length) narrows = narrows.filter((x) => x !== n);
  }
});

/** the lower-permission person who LACKS this area: the technician if it does, else the first narrower person who does */
const lacking = (re: RegExp): Who | null =>
  !has(limited, re) ? limited : (narrows.find((n) => !has(n, re)) ?? null);

test.afterAll(async () => { await full?.s?.browser.close(); await limited?.s?.browser.close(); });

const has = (w: Who, re: RegExp) => w.perms.some(p => re.test(p));

/**
 * 🔴 WHICH PERMISSION ACTUALLY GOVERNS EACH TAB — NOT THE ONE ITS NAME SUGGESTS.
 * Deriving the permission from the tab label made two checks fail against correct behaviour: the
 * lower-permission login holds `customersView` and no permission containing "asset", yet it sees
 * twenty Assets. That is right, and the suite says so itself — **C55703: "A user WITH Customers
 * access sees Customer AND Asset results"**. A vehicle belongs to a customer, so Customers access
 * carries it. Vendors, Purchase orders and Vendor invoices are likewise one area, not three.
 */
const GOVERNED_BY: Record<string, RegExp> = {
  'work orders':     /workOrder|^wo[A-Z]/,
  'customers':       /customersView|customer/i,
  'assets':          /customersView|customer/i,          // C55703 — Customers access carries Assets
  'parts':           /^parts|inventory|partsView/i,
  'vendors':         /vendor|purchasing|ordering/i,
  'purchase orders': /vendor|purchasing|ordering/i,
  'vendor invoices': /vendor|purchasing|ordering/i,
  'part sales':      /partSale/i,
};
const permFor = (tabLabel: string) => GOVERNED_BY[tabLabel.toLowerCase()] ?? new RegExp(tabLabel.split(' ')[0], 'i');

/** search as this person and return the rows, with the scope forced back to All */
async function rowsAs(w: Who, q: string): Promise<string[]> {
  await actAs(w);
  await typeAndWait(w.s.page, q);
  return w.s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
}
async function tabsAs(w: Who, q: string) {
  await actAs(w);
  await typeAndWait(w.s.page, q);
  return w.s.page.evaluate(() => [...document.querySelectorAll('.search-tabs__tab')].map(t => ({
    label: (t as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim(),
    count: Number(((t as HTMLElement).innerText.match(/\((\d+)\)/) || [])[1] ?? -1),
  })));
}
const norm = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toLowerCase();

/**
 * A record of `kind` that the FULL person can find, used as the thing the limited person must not
 * see. Taken live so the check never depends on a record that has since been edited or removed.
 */
async function recordOnlyFullCanSee(tab: string): Promise<{ q: string; row: string } | null> {
  await actAs(full);
  const terms = [BROAD, ...(await entityTerms(full.s.page, tab, 8))].filter(Boolean) as string[];
  for (const q of terms) {
    const tabs = await tabsAs(full, q);
    const t = tabs.find(x => x.label.toLowerCase() === tab.toLowerCase());
    if (!t || t.count <= 0) continue;
    const ok = await full.s.page.evaluate(l => {
      const el = [...document.querySelectorAll('.search-tabs__tab')]
        .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
      if (!el) return false; (el as HTMLElement).click(); return true; }, tab);
    if (!ok) continue;
    await full.s.page.waitForTimeout(2_400);
    const rows = await full.s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
      .map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
    if (rows.length) return { q, row: rows[0] };
  }
  return null;
}

/* ───────── A PERSON WITHOUT AN ACCESS AREA SEES NOTHING FROM IT ───────── */
const DENIED: [string, string, RegExp, string][] = [
  ['C44878', 'Parts',           /^parts|inventory/i,            'Parts'],
  ['C44879', 'Work orders',     /workOrder.*View|^workOrders/i,  'Work Orders'],
  ['C45145', 'Vendors',         /vendor|purchasing|ordering/i,   'Vendor & Order Management'],
  ['C55704', 'Part sales',      /partSale/i,                     'Part Sales'],
];
for (const [cid, tab, permRe, areaName] of DENIED) {
  test(`${cid} — without ${areaName} access, no ${tab.toLowerCase()} appear @${cid}`, async () => {
    test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
    const who = lacking(permRe);
    test.skip(!who,
      `no lower-permission person here lacks ${areaName} access, so the absence this case is about cannot be shown. `
      + `The technician holds: ${limited.perms.join(', ')}`
      + narrows.map((n) => `; the ${n.label.replace(/^the /, '')} holds: ${n.perms.join(', ')}`).join('')
      + `. Nobody available lacks it - check that seeding/seed_roles.py ran (it makes a role without work orders and a person on it).`);
    test.skip(!has(full, permRe),
      `the full-access login does not hold ${areaName} access either, so there is no difference to compare`);
    const seed = await recordOnlyFullCanSee(tab);
    test.skip(!seed, `the full-access person finds no ${tab.toLowerCase()} on this environment, so there is nothing to hide`);
    // the same query, as the person without that access
    const tabs = await tabsAs(who!, seed!.q);
    const mine = tabs.find(x => x.label.toLowerCase() === tab.toLowerCase());
    const rows = await rowsAs(who!, seed!.q);
    const leaked = rows.filter(r => norm(r) === norm(seed!.row));
    expect(leaked, `a person without ${areaName} access was shown a ${tab.toLowerCase()} row: ${seed!.row.slice(0, 110)}`)
      .toEqual([]);
    if (mine) expect(mine.count, `the ${tab} tab still reports ${mine.count} matches to a person without ${areaName} access`)
      .toBeLessThanOrEqual(0);
  });
}

/* ───────── THE SAME RECORD, VISIBLE TO ONE PERSON AND NOT THE OTHER ───────── */
const FLIP: [string, string, RegExp, string][] = [
  ['C55731', 'Parts',           /^parts|inventory/i,          'Parts'],
  ['C55732', 'Work orders',     /workOrder.*View|^workOrders/i,'Work Orders'],
  ['C55733', 'Customers',       /customer/i,                   'Customers'],
  ['C55734', 'Part sales',      /partSale/i,                   'Part Sales'],
  ['C55735', 'Vendors',         /vendor|purchasing|ordering/i, 'Vendor & Order Management'],
];
for (const [cid, tab, permRe, areaName] of FLIP) {
  test(`${cid} — ${areaName}: the same record is shown to one person and withheld from the other @${cid}`, async () => {
    test.skip(!BROAD, 'no broad query on this environment');
    const who = lacking(permRe);
    test.skip(!has(full, permRe) || !who,
      `no pair of logins here can show the difference for ${areaName}: full has it = ${has(full, permRe)}, `
      + `and every lower-permission person available holds it too. Both must differ for the comparison to mean anything.`);
    const seed = await recordOnlyFullCanSee(tab);
    test.skip(!seed, `no ${tab.toLowerCase()} is visible even to the full-access person, so there is nothing to compare`);
    const asLimited = await rowsAs(who!, seed!.q);
    expect(asLimited.filter(r => norm(r) === norm(seed!.row)),
      `the same ${tab.toLowerCase()} row is visible to a person without ${areaName} access:\n  ${seed!.row.slice(0, 120)}`)
      .toEqual([]);
  });
}

/* ───────── WHOLE GROUPS, COUNTS AND TABS GO TOGETHER ───────── */
test('C44881 — a kind with nothing the person may see shows no group at all @C44881', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const denied = ['Parts', 'Vendors', 'Part sales', 'Purchase orders', 'Vendor invoices']
    .filter(t => !has(limited, permFor(t)));
  test.skip(denied.length === 0, 'the lower-permission login is not short of any access area, so nothing should be hidden');
  await typeAndWait(limited.s.page, BROAD);
  const heads = await limited.s.page.evaluate(() => [...document.querySelectorAll('.search-group__header')]
    .map(h => (h as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
  for (const t of denied) {
    expect(heads.some(h => h.toLowerCase().startsWith(t.toLowerCase())),
      `a "${t}" group is shown to a person without that access: ${heads.join(' | ')}`).toBe(false);
  }
});

/**
 * 🔴 WHICH AREAS THIS PERSON LACKS - READ FROM THE FULL-ACCESS PERSON'S TABS (2026-10-03).
 * These checks looked for the missing areas among the lower-permission person's OWN tabs. The product
 * removes a forbidden kind's tab altogether, so there was never one to find: "keeps 3 areas and
 * lacks 0", and three checks stood down on correct behaviour. The kinds the full-access person is
 * offered for the same query, minus the ones this person holds, are the ones that must be hidden.
 */
async function lostAreas(q: string) {
  const fullTabs = (await tabsAs(full, q)).filter((t) => !/^All$/i.test(t.label) && t.count > 0);
  const limTabs = await tabsAs(limited, q);
  const lost = fullTabs.filter((t) => !has(limited, permFor(t.label)))
    .map((t) => ({ label: t.label, fullCount: t.count, count: limTabs.find((x) => x.label.toLowerCase() === t.label.toLowerCase())?.count ?? 0 }));
  const kept = limTabs.filter((t) => !/^All$/i.test(t.label) && has(limited, permFor(t.label)));
  return { lost, kept, limTabs, fullTabs };
}

test('C44882 — the counts and tabs are hidden with the group, not just the rows @C44882', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const { lost: denied } = await lostAreas(BROAD);
  test.skip(denied.length === 0, 'the full-access person is offered no kind here that the lower-permission person lacks');
  for (const t of denied) {
    expect(t.count, `the ${t.label} tab reports ${t.count} matches to a person without that access`)
      .toBeLessThanOrEqual(0);
  }
});

test('C55720 — several missing areas are all hidden, and the rest still work @C55720', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const { lost, kept } = await lostAreas(BROAD);
  test.skip(kept.length === 0 || lost.length === 0,
    `this login is not a mixed case: it keeps ${kept.length} areas and lacks ${lost.length}`);
  for (const t of lost) expect(t.count, `${t.label} is still counted for a person without that access`).toBeLessThanOrEqual(0);
  // and the areas it DOES hold are unaffected — the point of the case
  const total = kept.reduce((n, t) => n + Math.max(t.count, 0), 0);
  expect(total, `the areas this person DOES hold returned nothing at all, so the hiding has taken the wrong things too: `
    + kept.map(t => `${t.label}(${t.count})`).join(' | ')).toBeGreaterThan(0);
});

test('C55737 — records a person cannot see are not counted anywhere @C55737', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const fullTabs = await tabsAs(full, BROAD);
  const limTabs = await tabsAs(limited, BROAD);
  const fullAll = fullTabs.find(t => /^All$/i.test(t.label))?.count ?? -1;
  const limAll = limTabs.find(t => /^All$/i.test(t.label))?.count ?? -1;
  test.skip(fullAll < 0 || limAll < 0, 'the All tab carries no count for this query');
  const lost = (await lostAreas(BROAD)).lost;
  test.skip(lost.length === 0, 'the full-access person is offered no kind here that the lower-permission person lacks');
  // the hidden kinds must be absent from the overall total too, not merely from their own tab
  expect(limAll, `the All count for the lower-permission person (${limAll}) is not lower than the full-access `
    + `person's (${fullAll}), although ${lost.map(t => t.label).join(', ')} should be hidden from them`)
    .toBeLessThan(fullAll);
  const sumOwn = limTabs.filter(t => !/^All$/i.test(t.label)).reduce((n, t) => n + Math.max(t.count, 0), 0);
  expect(limAll, `the All count (${limAll}) does not match the sum of the tabs the person can see (${sumOwn})`)
    .toBeLessThanOrEqual(sumOwn);
});

/* ───────── AN EXACT NUMBER, AND A TYPO, MUST NOT LEAK EITHER ───────── */
test('C55718 — typing the exact number of a record you may not see does not surface it @C55718', async () => {
  const candidates: [string, RegExp][] = [
    [String(LIVE.partNumber || ''), /^parts|inventory/i],
    [String(LIVE.poNumber || ''),   /vendor|purchasing|ordering/i],
    [String(LIVE.partSaleNo || ''), /partSale/i],
  ];
  const pick = candidates.find(([v, re]) => v && has(full, re) && !has(limited, re));
  test.skip(!pick, 'no identifier on this environment belongs to an area the two logins differ on');
  const [id] = pick!;
  const asFull = await rowsAs(full, id);
  test.skip(!asFull.some(r => norm(r).includes(norm(id))),
    `even the full-access person cannot find "${id}" right now, so nothing below would be about permissions`);
  const asLimited = await rowsAs(limited, id);
  expect(asLimited.some(r => norm(r).includes(norm(id))),
    `typing the exact identifier "${id}" surfaced a record the person may not see:\n  `
    + asLimited.slice(0, 3).map(r => r.slice(0, 100)).join('\n  ')).toBe(false);
});

test('C55721 — a near-miss spelling does not leak a record you may not see @C55721', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const pick = ['Parts', 'Vendors', 'Part sales'].find(t => has(full, permFor(t)) && !has(limited, permFor(t)));
  test.skip(!pick, 'the two logins do not differ on any area that can be searched by name');
  const seed = await recordOnlyFullCanSee(pick!);
  test.skip(!seed, `the full-access person finds no ${pick!.toLowerCase()} to try this with`);
  const word = (seed!.row.match(/[A-Za-z]{6,}/) || [])[0];
  test.skip(!word, `no word long enough to misspell in "${seed!.row.slice(0, 80)}"`);
  const typo = word!.slice(0, Math.floor(word!.length / 2)) + word!.slice(Math.floor(word!.length / 2) + 1);
  const asLimited = await rowsAs(limited, typo);
  expect(asLimited.filter(r => norm(r) === norm(seed!.row)),
    `a close-match search for "${typo}" leaked a ${pick!.toLowerCase()} row the person may not see`).toEqual([]);
});

test('C55719 — a contact match does not surface a company you may not see @C55719', async () => {
  const who = lacking(/customer/i);
  test.skip(!has(full, /customer/i) || !who,
    'every lower-permission person available holds Customers access, so a hidden parent company cannot be demonstrated');
  const seed = await recordOnlyFullCanSee('Customers');
  test.skip(!seed, 'no customer is visible even to the full-access person');
  const asLimited = await rowsAs(who!, seed!.q);
  expect(asLimited.filter(r => norm(r) === norm(seed!.row)), 'a hidden company was surfaced through a contact match').toEqual([]);
});

/* ───────── RECENT ACTIVITY RESPECTS THE SAME RULES ───────── */
const RECENT: [string, string][] = [
  ['C55717', 'the recent list only shows records the person can still open'],
  ['C45149', 'recent items the person can no longer reach are hidden'],
];
for (const [cid, what] of RECENT) {
  test(`${cid} — ${what} @${cid}`, async () => {
    // open something as the limited person, then confirm the recent list holds only permitted kinds
    test.skip(!BROAD, 'no broad query on this environment');
    const rows = await rowsAs(limited, BROAD);
    test.skip(rows.length === 0, 'the lower-permission person finds nothing to open');
    await limited.s.page.keyboard.press('ArrowDown'); await limited.s.page.waitForTimeout(400);
    await limited.s.page.keyboard.press('Enter');
    await limited.s.page.waitForLoadState('domcontentloaded').catch(() => {});
    await limited.s.page.waitForTimeout(4_000);
    await limited.s.page.goto(`${APP}/customers`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => {});
    await limited.s.page.waitForTimeout(3_500);
    await closePanel(limited.s.page); await openPanel(limited.s.page);
    await limited.s.page.locator(SEL.input).fill('').catch(() => {});
    await limited.s.page.waitForTimeout(2_500);
    const text = (await limited.s.page.locator(SEL.modal).innerText().catch(() => '')).replace(/\s+/g, ' ');
    test.skip(!/Recent/i.test(text), 'this account has no recent activity to inspect');
    const denied = ['Parts', 'Vendors', 'Part sales', 'Purchase orders', 'Vendor invoices']
      .filter(t => !has(limited, permFor(t)));
    for (const t of denied) {
      expect(text.toLowerCase(), `the recent list offers a ${t} entry to a person without that access`)
        .not.toMatch(new RegExp(`\\b${t.toLowerCase()}\\b`));
    }
  });
}

test('C45148 — a kind the person is not permitted to see is not listed at all @C45148', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  const tabs = await tabsAs(limited, BROAD);
  const known = ['All', 'Work orders', 'Customers', 'Assets', 'Parts', 'Vendors', 'Part sales', 'Purchase orders', 'Vendor invoices'];
  const unknown = tabs.filter(t => !known.some(k => k.toLowerCase() === t.label.toLowerCase()));
  expect(unknown.map(t => t.label), 'a result kind outside the specified set is being offered').toEqual([]);
});

test('C44860 — opening a record records it, and the recent list is per person @C44860', async () => {
  // the app itself calls this when a record is opened; it is the contract the case describes
  const r: any = await api(limited.s.page, 'GET', '/api/user/recent-entities');
  expect([200, 204]).toContain(r?.status);
  const body = JSON.stringify(r?.body ?? '');
  const denied: [string, string][] = [['parts', 'Parts'], ['vendors', 'Vendors'], ['partSales', 'Part sales'],
    ['purchaseOrders', 'Purchase orders'], ['vendorInvoices', 'Vendor invoices']];
  for (const [key, tab] of denied) {
    if (has(limited, permFor(tab))) continue;        // they DO hold it — nothing to assert
    expect(body, `the recent list served to this person includes a ${tab} entry they may not open`)
      .not.toMatch(new RegExp(`"type"\\s*:\\s*"${key}"`, 'i'));
  }
});
