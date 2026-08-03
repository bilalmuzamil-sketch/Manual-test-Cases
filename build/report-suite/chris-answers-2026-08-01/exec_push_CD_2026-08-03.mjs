// exec_push_CD_2026-08-03.mjs — AUTHORISED groups C + D (10 update_case).
// Authorised by the QA lead 2026-08-03: "I want the report suite now at the stage where the only
// remaining part left is the VIU", together with his ruling "Yes all the reports will be gated by
// ONE permission FOR NOW."
// Group E (C30327, C30391) is DELIBERATELY ABSENT — retire-or-rescope awaits his explicit sign-off.
// Guard: refuses any case id outside the whitelist and any case not created_by 3.
import { api } from '../../testing-tools/testrail-api.mjs';
import { writeFileSync, mkdirSync } from 'fs';

const OUT = new URL('./cd-snapshot-2026-08-03/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const ME = 3;
const FORBIDDEN = [30327, 30391, 38919, 38920, 38921, 38922, 38923];
const log = [];
const rec = (o) => { log.push(o); console.log(JSON.stringify(o)); };

const NOTE_POS = 'Note for the tester: for now ONE ordinary reports access opens all six of these new reports; none of them has a permission of its own. If the build demands a separate report permission before this works, mark this Failed and report it — do not change the test.';

// internal_id, C-id, the fields to write, and the Rule-41 spec the whole case was re-read against
const EDITS = [
  { g: 'C', iid: 'PV-PERM-01', id: 30325, spec: 'PV spec v4 (Confluence 620888066; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'A user with ordinary reports access can load the report and export it',
    pre: '1. You are signed in as a user with the Manager or Office User role.\n2. That user\'s role has the ordinary reports access (the standard "can this person see reports" setting).\n3. Some parts have sales activity in the selected date range.',
    exp: '1. The report data loads and rows are shown.\n2. The export downloads successfully — both opening the report and exporting it are allowed by the same ordinary reports access.\n3. ' + NOTE_POS,
    refs: 'SV-8641 (PV spec S1-R4 — one reports permission for all six ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; PV S1-R4 still names Inventory Reports > View — his spec edit owed)' },
  { g: 'C', iid: 'IV-PERM-01', id: 30603, spec: 'IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'A user with ordinary reports access can open Inventory Value',
    pre: '1. A test user exists whose role has the ordinary reports access (assign the Tech user a suitable role if needed; restore the original role afterward).\n2. You are signed in as that user on a desktop browser.',
    exp: '1. The report is listed and opens normally for a user holding the ordinary reports access.\n2. No additional report-specific permission is required — for now the one ordinary reports access covers all six of the new reports.\n3. ' + NOTE_POS,
    refs: 'SV-8668 (IV spec Story 1 Prerequisites — one reports permission for all six ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; the IV prerequisite still names the inventory-reports permission — his spec edit owed)' },
  { g: 'C', iid: 'IV-PERM-02', id: 30604, spec: 'IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'Without reports access Inventory Value is absent from the navigation',
    pre: '1. A test user exists whose role does NOT have reports access (assign the Tech user such a role; restore the original role afterward).\n2. You are signed in as that user on a desktop browser.',
    refs: 'SV-8668 (IV spec Story 1 S1-N1 — the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW")' },
  { g: 'C', iid: 'TU-NAV-07', id: 30398, spec: 'TU spec v5 (Confluence 641400833; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'Without reports access Technician Utilization is hidden',
    pre: '1. You are signed in as a user whose role does NOT have reports access.',
    refs: 'SV-8648 (TU spec S1-N1 — the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; the TU prerequisite still names the timesheet-reports permission — his spec edit owed)' },
  { g: 'C', iid: 'WIP-PERM-01', id: 30526, spec: 'WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'Ordinary reports access covers opening and downloading Work In Progress',
    pre: '1. A test user exists whose role has the ordinary reports access (assign the Tech user a suitable role if needed; restore the original role afterward).\n2. You are signed in as that user on a desktop browser.',
    exp: '1. The report is listed and opens normally.\n2. The download works with the same permission — for now the one ordinary reports access covers the report and its downloads and no new permission is added for it.\n3. ' + NOTE_POS,
    refs: 'SV-8657 (WIP spec Story 1 Prerequisites — one reports permission for all six ruled by Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW"; the WIP prerequisite still names a Work In Progress reports permission — his spec edit owed)' },
  { g: 'C', iid: 'WIP-PERM-02', id: 30527, spec: 'WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03)',
    title: 'Without reports access Work In Progress is absent from the navigation',
    pre: '1. A test user exists whose role does NOT have reports access (assign the Tech user such a role; restore the original role afterward).\n2. You are signed in as that user on a desktop browser.',
    refs: 'SV-8657 (WIP spec Story 1 S1-N1 — the gate is the one ordinary reports access per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW")' },
  { g: 'D', iid: 'PV-NAV-01', id: 30322, spec: 'PV spec v4 (Confluence 620888066; lastModified 2026-07-29; re-checked live 2026-08-03)',
    pre: '1. You are signed in to the ShopView App as a user with the Manager or Office User role.\n2. Your role has the ordinary reports access.',
    refs: 'SV-8641 (PV spec S1-R1 — the "only report" sentence is superseded: Parts Velocity and Inventory Value BOTH live under Parts per the PRD video 2026-07-30; access = the one ordinary reports permission per QA lead 2026-08-03)' },
  { g: 'D', iid: 'IV-NAV-01', id: 30534, spec: 'IV spec v3 (Confluence 720142338; lastModified 2026-07-29; re-checked live 2026-08-03)',
    pre: '1. You are signed in to the ShopView App on a desktop browser.\n2. Your role has the ordinary reports access.',
    refs: 'SV-8668 (IV spec Story 1 S1-R1 — access = the one ordinary reports permission per Chris Ward Q2=A + QA lead 2026-08-03 "ONE permission FOR NOW")' },
  { g: 'D', iid: 'TU-NAV-01', id: 30392, spec: 'TU spec v5 (Confluence 641400833; lastModified 2026-07-29; re-checked live 2026-08-03)',
    pre: '1. You are signed in as a user whose role has the ordinary reports access.',
    refs: 'SV-8648 (TU spec S1-R1 — below the named anchor items [Sales; Technician Efficiency; Advisor Analysis; Shop Efficiency] per the PRD video 2026-07-30; access = the one ordinary reports permission per QA lead 2026-08-03)' },
  { g: 'D', iid: 'WIP-TAB-01', id: 30451, spec: 'WIP spec v6 (Confluence 703660034; lastModified 2026-07-29; re-checked live 2026-08-03)',
    pre: '1. You are signed in to the ShopView App on a desktop browser.\n2. Your role has the ordinary reports access.',
    refs: 'SV-8657 (WIP spec Story 1 S1-R1; S1-R5 — Performance group; below the named anchor items per the PRD video 2026-07-30; S1-R5 = browser page title; access = the one ordinary reports permission per QA lead 2026-08-03)' },
];

for (const e of EDITS) {
  if (FORBIDDEN.includes(e.id)) throw new Error(`GUARD: C${e.id} is out of scope — refusing`);
  if (e.refs.length > 250) throw new Error(`refs too long for C${e.id}: ${e.refs.length}`);
  if (e.refs.includes(',')) throw new Error(`refs must be comma-free for C${e.id}`);
  if (e.title && e.title.length > 80) throw new Error(`title over 80 for C${e.id}: ${e.title.length}`);
}
console.log('pre-flight OK:', EDITS.length, 'edits |', EDITS.filter(e=>e.g==='C').length, 'group C +', EDITS.filter(e=>e.g==='D').length, 'group D');

// run 359 snapshot (no run write planned, but record before/after per Rule 34)
const runBefore = await api('get_run/359');
rec({ op: 'snapshot_run_359_before', http: runBefore.status, untested: runBefore.body.untested_count, tests_expected: 475 });

for (const e of EDITS) {
  const pre = await api(`get_case/${e.id}`);
  if (pre.status !== 200) throw new Error(`read C${e.id} failed`);
  if (pre.body.created_by !== ME) throw new Error(`GUARD: C${e.id} not ours (created_by ${pre.body.created_by})`);
  const body = { refs: e.refs };
  if (e.title) body.title = e.title;
  if (e.pre) body.custom_preconds = e.pre;
  if (e.exp) body.custom_expected = e.exp;
  const w = await api(`update_case/${e.id}`, { method: 'POST', body });
  const post = await api(`get_case/${e.id}`);
  const checks = {
    refs: post.body.refs === e.refs,
    title: e.title ? post.body.title === e.title : post.body.title === pre.body.title,
    preconds: e.pre ? post.body.custom_preconds === e.pre : post.body.custom_preconds === pre.body.custom_preconds,
    expected: e.exp ? post.body.custom_expected === e.exp : post.body.custom_expected === pre.body.custom_expected,
    steps_unchanged: post.body.custom_steps === pre.body.custom_steps,
    section_unchanged: post.body.section_id === pre.body.section_id,
  };
  const ok = Object.values(checks).every(Boolean);
  writeFileSync(OUT + `C${e.id}-BEFORE.json`, JSON.stringify(pre.body, null, 1));
  writeFileSync(OUT + `C${e.id}-AFTER.json`, JSON.stringify(post.body, null, 1));
  rec({ op: 'update_case', group: e.g, internal_id: e.iid, case_id: e.id, http: w.status, reget_http: post.status,
        verified: ok ? 'yes-MATCH' : 'NO-MISMATCH', checks,
        title_len: post.body.title.length, refs_len: e.refs.length,
        rule41: `re-verified whole against ${e.spec}` });
  if (!ok) { console.error('WRITE BODY:', JSON.stringify(w.body).slice(0, 400)); throw new Error(`C${e.id} MISMATCH — stopping`); }
}

// verify run 359 unchanged (no selection change expected from update_case)
let tAfter = [], o = 0;
while (true) { const t = await api(`get_tests/359&limit=250&offset=${o}`); const a = t.body.tests ?? t.body; tAfter = tAfter.concat(a); if (a.length < 250) break; o += 250; }
let rAfter = [], o2 = 0;
while (true) { const r = await api(`get_results_for_run/359&limit=250&offset=${o2}`); const a = r.body.results ?? r.body; rAfter = rAfter.concat(a); if (a.length < 250) break; o2 += 250; }
rec({ op: 'verify_run_359_after', tests: tAfter.length, expected: 475, results: rAfter.length, expected_results: 539,
      verified: (tAfter.length === 475 && rAfter.length === 539) ? 'yes-MATCH' : 'NO-MISMATCH' });
writeFileSync(OUT + 'ops-log.json', JSON.stringify(log, null, 1));
if (!(tAfter.length === 475 && rAfter.length === 539)) process.exit(1);
console.log('\nALL OK —', EDITS.length, 'update_case verified; run 359 unchanged at', tAfter.length, 'tests /', rAfter.length, 'results');
