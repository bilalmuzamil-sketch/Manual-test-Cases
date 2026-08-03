// exec_push_2026-08-03.mjs — AUTHORISED narrow push (buckets A + B + run-359 UNION).
// Scope guard: refuses any case id outside the whitelist and any case not created_by 3.
// Buckets C, D, E are NOT in this file (frozen pending Chris's clarification).
import { api } from '../../testing-tools/testrail-api.mjs';
import { writeFileSync, mkdirSync } from 'fs';

const OUT = new URL('./run359-snapshot-2026-08-03/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const ME = 3;                       // Bilal Muzamil
const ALLOWED_UPDATE = [30096, 30098, 30099];
const FOREIGN = [38919, 38920, 38921, 38922, 38923];
const log = [];
const rec = (o) => { log.push(o); console.log(JSON.stringify(o)); };

const NOTE = 'Note for the tester: the product owner has ruled that every report in this suite opens with the ordinary reports access, and the written description now says the same. If the build still demands a separate Sales By Customer permission, mark this test Failed and report it against the change already raised with the developers — do not change the test. You may also find a "Sales By Customer" permission still listed for an administrator to switch on and off: that should have been hidden from the screen, so please report that too. If it is listed but switching it on or off changes nothing at all, that part is expected for now — just report that it is still visible.';

const REFS = {
  30096: 'SV-8600 (SBC spec S1-R1; S1-R3; S1-R4 — Confluence 577634305 v-2026-07-31; Performance-group placement per the PRD video 2026-07-30; access = ordinary reports permission per Chris Ward 2026-07-31 Q4=A + SV-8598 sheet Q1=A)',
  30098: 'SV-8600 (SBC spec S1-R2 — Confluence 577634305 v-2026-07-31 — now reads "gated by ordinary reports access; not by a report-specific permission"; Chris Ward Q1=A; built atom hidden-and-inert per his ruling; SV-8780 Ready to Fix)',
  30099: 'SV-8600 (SBC spec S1-N1 — Confluence 577634305 v-2026-07-31 — now reads "A user without reports access does not see the report in navigation and cannot open it by direct link"; Chris Ward Q1=A; SV-8780 Ready to Fix)',
};
for (const [k, v] of Object.entries(REFS)) if (v.length > 250) throw new Error(`refs too long for C${k}: ${v.length}`);

// ---- guard: foreign cases must never be writable through this script -------
for (const id of FOREIGN) {
  const r = await api(`get_case/${id}`);
  if (r.body.created_by === ME) throw new Error(`GUARD: C${id} unexpectedly ours — abort`);
  rec({ op: 'guard_foreign_readonly', case_id: id, http: r.status, created_by: r.body.created_by, verified: 'skipped-not-ours' });
}

// ---- STEP 1: snapshot run 359 BEFORE any write ------------------------------
const runBefore = await api('get_run/359');
if (runBefore.status !== 200) throw new Error('cannot read run 359');
let tests = [], off = 0;
while (true) {
  const t = await api(`get_tests/359&limit=250&offset=${off}`);
  const arr = t.body.tests ?? t.body;
  if (!Array.isArray(arr)) throw new Error('get_tests shape: ' + JSON.stringify(t.body).slice(0, 200));
  tests = tests.concat(arr); if (arr.length < 250) break; off += 250;
}
let results = [], ro = 0;
while (true) {
  const r = await api(`get_results_for_run/359&limit=250&offset=${ro}`);
  const arr = r.body.results ?? r.body;
  if (!Array.isArray(arr)) throw new Error('get_results shape: ' + JSON.stringify(r.body).slice(0, 200));
  results = results.concat(arr); if (arr.length < 250) break; ro += 250;
}
const beforeCaseIds = tests.map(t => t.case_id).sort((a, b) => a - b);
writeFileSync(OUT + 'run359-tests-BEFORE.json', JSON.stringify(tests, null, 1));
writeFileSync(OUT + 'run359-results-BEFORE.json', JSON.stringify(results, null, 1));
writeFileSync(OUT + 'run359-case-ids-BEFORE.txt', beforeCaseIds.join('\n'));
rec({ op: 'snapshot_run_359', http: runBefore.status, tests: tests.length, unique_case_ids: new Set(beforeCaseIds).size, results: results.length, include_all: runBefore.body.include_all, verified: 'yes' });

// ---- STEP 2: 3 update_case (bucket A) --------------------------------------
for (const id of ALLOWED_UPDATE) {
  const pre = await api(`get_case/${id}`);
  if (pre.status !== 200) throw new Error(`read C${id} failed`);
  if (pre.body.created_by !== ME) throw new Error(`GUARD: C${id} is not ours (created_by ${pre.body.created_by}) — refusing`);
  const oldExp = pre.body.custom_expected;
  const lines = oldExp.split('\n');
  const li = lines.findIndex(l => /^\d+\.\s*Note for the tester:/.test(l));
  if (li === -1) throw new Error(`C${id}: could not find the numbered tester-note line`);
  const num = lines[li].match(/^(\d+)\./)[1];
  lines[li] = `${num}. ${NOTE}`;
  const newExp = lines.join('\n');
  const body = { refs: REFS[id], custom_expected: newExp };
  const w = await api(`update_case/${id}`, { method: 'POST', body });
  const post = await api(`get_case/${id}`);
  const match = post.body.refs === REFS[id] && post.body.custom_expected === newExp
    && post.body.title === pre.body.title && post.body.custom_preconds === pre.body.custom_preconds
    && post.body.custom_steps === pre.body.custom_steps && post.body.section_id === pre.body.section_id;
  writeFileSync(OUT + `C${id}-BEFORE.json`, JSON.stringify(pre.body, null, 1));
  writeFileSync(OUT + `C${id}-AFTER.json`, JSON.stringify(post.body, null, 1));
  rec({ op: 'update_case', case_id: id, http: w.status, reget_http: post.status, verified: match ? 'yes-MATCH' : 'NO-MISMATCH',
        fields_written: ['refs', 'custom_expected'], title_unchanged: post.body.title === pre.body.title,
        preconds_unchanged: post.body.custom_preconds === pre.body.custom_preconds,
        steps_unchanged: post.body.custom_steps === pre.body.custom_steps });
  if (!match) { console.error('WRITE BODY:', JSON.stringify(w.body).slice(0,400)); throw new Error(`C${id} verification MISMATCH — stopping`); }
}

// ---- STEP 3: 1 add_case (bucket B) ----------------------------------------
const NEW = {
  title: 'No Sales By Customer permission is offered in the role permission editor',
  template_id: 1, type_id: 5, priority_id: 4,
  custom_atmstatus: 3, custom_automation_type: 0,
  refs: 'SV-8598 (SBC spec S1-R2 — Confluence 577634305 v-2026-07-31 — "there is no dedicated Sales By Customer View permission"; Chris Ward Q1=A + his ruling to hide an already-built permission from the front end; SV-8780)',
  custom_preconds: '1. You are signed in as an administrator who can edit roles and their permissions.\n2. Create a throwaway custom role named starting with ZZAUTOTEST to work in, and delete it when you have finished.',
  custom_steps: '1. Open the area where a role\'s permissions are switched on and off.\n2. Read through the reports-related permissions from top to bottom.\n3. Search the permission list for "Sales By Customer".',
  custom_expected: '1. There is NO "Sales By Customer" permission anywhere in the list for an administrator to switch on or off.\n2. The only reports permission offered is the ordinary reports access, and that one covers all six of the new reports.\n3. ' + NOTE,
};
const add = await api('add_case/4289', { method: 'POST', body: NEW });
if (add.status !== 200) throw new Error('add_case failed: ' + JSON.stringify(add.body).slice(0, 400));
const newId = add.body.id;
const chk = await api(`get_case/${newId}`);
const addMatch = ['title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected', 'custom_atmstatus', 'custom_automation_type']
  .every(k => chk.body[k] === NEW[k]) && chk.body.section_id === 4289 && chk.body.created_by === ME;
writeFileSync(OUT + `C${newId}-AFTER.json`, JSON.stringify(chk.body, null, 1));
rec({ op: 'add_case', section_id: 4289, case_id: newId, http: add.status, reget_http: chk.status, verified: addMatch ? 'yes-MATCH' : 'NO-MISMATCH', atmstatus: chk.body.custom_atmstatus, automation_type: chk.body.custom_automation_type });
if (!addMatch) throw new Error('add_case verification MISMATCH — stopping BEFORE the run write');

// ---- STEP 4: run 359 UNION update_run -------------------------------------
const union = [...new Set([...beforeCaseIds, newId])].sort((a, b) => a - b);
if (union.length !== beforeCaseIds.length + 1) throw new Error(`UNION size wrong: ${union.length} vs ${beforeCaseIds.length}+1`);
for (const id of beforeCaseIds) if (!union.includes(id)) throw new Error('UNION lost a case id — abort');
writeFileSync(OUT + 'run359-case-ids-UNION-SENT.txt', union.join('\n'));
const ur = await api('update_run/359', { method: 'POST', body: { include_all: false, case_ids: union } });
rec({ op: 'update_run', run_id: 359, http: ur.status, sent_case_ids: union.length });
if (ur.status !== 200) throw new Error('update_run FAILED: ' + JSON.stringify(ur.body).slice(0, 400));

// ---- STEP 5: verify AFTER --------------------------------------------------
let tAfter = [], o2 = 0;
while (true) {
  const t = await api(`get_tests/359&limit=250&offset=${o2}`);
  const arr = t.body.tests ?? t.body;
  tAfter = tAfter.concat(arr); if (arr.length < 250) break; o2 += 250;
}
let rAfter = [], o3 = 0;
while (true) {
  const r = await api(`get_results_for_run/359&limit=250&offset=${o3}`);
  const arr = r.body.results ?? r.body;
  rAfter = rAfter.concat(arr); if (arr.length < 250) break; o3 += 250;
}
const afterIds = tAfter.map(t => t.case_id).sort((a, b) => a - b);
writeFileSync(OUT + 'run359-tests-AFTER.json', JSON.stringify(tAfter, null, 1));
writeFileSync(OUT + 'run359-results-AFTER.json', JSON.stringify(rAfter, null, 1));
writeFileSync(OUT + 'run359-case-ids-AFTER.txt', afterIds.join('\n'));
const missing = beforeCaseIds.filter(id => !afterIds.includes(id));
const newPresent = afterIds.includes(newId);
const countOk = tAfter.length === tests.length + 1;
const resultsOk = rAfter.length >= results.length &&
  results.every(pr => rAfter.some(nr => nr.id === pr.id));
rec({ op: 'verify_run_359_after', tests_before: tests.length, tests_after: tAfter.length, expected: tests.length + 1,
      count_ok: countOk, new_case_present: newPresent, prior_case_ids_lost: missing.length,
      results_before: results.length, results_after: rAfter.length, all_prior_results_present: resultsOk,
      verified: (countOk && newPresent && !missing.length && resultsOk) ? 'yes-MATCH' : 'NO-MISMATCH' });
writeFileSync(OUT + 'ops-log.json', JSON.stringify(log, null, 1));
if (!(countOk && newPresent && !missing.length && resultsOk)) { console.error('POST-WRITE VERIFICATION FAILED'); process.exit(1); }
console.log('\nALL OK — new case id:', newId, '| run 359', tests.length, '->', tAfter.length);
