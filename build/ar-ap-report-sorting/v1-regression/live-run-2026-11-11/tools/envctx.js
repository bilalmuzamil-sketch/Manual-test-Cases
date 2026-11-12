// The environment a browser run is for, and the dates/numbers its checks expect - shared by env.js, run.js and
// cases_qa.js. Nothing secret here. The environment comes from RUN_ENV (run.js sets it) and defaults to 'qa',
// so `node -e "require('./cases_qa.js')"` still loads the QA estate exactly as before.
//
// DATES. cases_qa.js was written against the QA seed, anchored on 2026-11-11 (both locations on Edmonton).
// Every document is dated "N days before the anchor" at ITS OWN location, so a date named in a case is
// that QA date moved by (this env's anchor date at that location - 2026-11-11) days: SH(iso, 'A'|'B').
// The anchor dates come from the ledger the seeder wrote (seed.py reads each location's time zone from the
// app and records anchor_dates) - NOT from Node's own clock maths, because Node's built-in time-zone data
// (2025b) puts America/Edmonton on UTC-7 in Nov 2026 while this machine's tzdata (2026e) says UTC-6.
const fs = require('fs'); const path = require('path');
const KNOWN = ['qa', 'staging', 'prod'];
const env = process.env.RUN_ENV || (KNOWN.includes(process.argv[2]) ? process.argv[2] : 'qa');
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, f))); } catch (e) { return null; } };
const ledgerFile = `seeded-${env === 'prod' ? 'qa' : env}.json`;
const L = read(ledgerFile) || {};
const WP = read(`workplaces-${env}.json`) || {};
const QA_ANCHOR = '2026-11-11';
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const diff = (a, b) => Math.round((Date.parse(a + 'T12:00:00Z') - Date.parse(b + 'T12:00:00Z')) / 864e5);
const localToday = (tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
// anchor date per location: new ledgers carry anchor_dates {A, B}; the QA ledger carries one 'anchor' for both
const anchor = { A: (L.anchor_dates || {}).A || L.anchor, B: (L.anchor_dates || {}).B || L.anchor };
const unseeded = !anchor.A;
if (unseeded) { const t = WP.A && WP.A.timezone ? localToday(WP.A.timezone) : QA_ANCHOR; anchor.A = anchor.A || t; anchor.B = anchor.B || t; }
const delta = { A: diff(anchor.A, QA_ANCHOR), B: diff(anchor.B, QA_ANCHOR) };
const SH = (iso, loc = 'A') => addDays(iso, delta[loc]);
// the number the screen shows: <prefix><shop number of the document's own location>-<sequence>.
// On QA both locations are shop 11315; on staging A is shop 2 and B is shop 3 (GET staff/my-workplaces, 12 Nov 2026).
// The FE builds it from the document's own shop (row.invoice_shop_id, UnpaidTransactionsTable.vue:846).
// UNPROVEN on staging until the first seeded record is read back off the report (status.py prints documentNumber).
const shop = (loc = 'A') => (WP[loc] && WP[loc].shop_id) || (env === 'qa' ? '11315' : null);
module.exports = { env, ledgerFile, L, WP, anchor, delta, SH, addDays, diff, shop, unseeded, localToday, QA_ANCHOR };
