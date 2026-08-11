// testrail-api.mjs — TestRail API helper (basic-auth fetch + common calls).
//
// SECRET-FREE: reads email + password-or-key + host from /tmp/testrail/creds.json
// at runtime. Never hard-code the TestRail email / password / API key here.
// creds.json shape: { "email": "...", "password": "..." OR "key": "...",
//                     "host": "https://shopview.testrail.io" }
//
// Usage (CLI):
//   node testrail-api.mjs get_projects
//   node testrail-api.mjs get_case 26482
//   node testrail-api.mjs add_result_for_case <run_id> <case_id> <status_id> "comment"
//   node testrail-api.mjs raw get_runs/1               (any GET endpoint)
// Usage (import): import { api, getCase, addResultForCase } from './testrail-api.mjs';
import { readFileSync } from 'fs';

const c = JSON.parse(readFileSync('/tmp/testrail/creds.json', 'utf8'));
const secret = c.password ?? c.key; // accept either password or API key
const auth = 'Basic ' + Buffer.from(`${c.email}:${secret}`).toString('base64');
const host = c.host.replace(/\/$/, '');
const H = { 'Authorization': auth, 'Content-Type': 'application/json' };

export async function api(path, { method = 'GET', body } = {}) {
  const url = `${host}/index.php?/api/v2/${path}`;
  const opts = { method, headers: H };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const text = await r.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: r.status, body: parsed };
}

export const getProjects = () => api('get_projects');
export const getCase = (id) => api(`get_case/${id}`);
export const getCases = (projectId, suiteId) => api(`get_cases/${projectId}&suite_id=${suiteId}`);
export const getRun = (id) => api(`get_run/${id}`);
export const addResultForCase = (runId, caseId, statusId = 1, comment = '') =>
  api(`add_result_for_case/${runId}/${caseId}`, { method: 'POST', body: { status_id: statusId, comment } });

// ---------------------------------------------------------------------------
// add_case — CANONICAL PAYLOAD. Copy from here, never from an old exec script.
//
// `custom_atmstatus` is TestRail's "Automation status" dropdown (field id 17):
//   1 Not Automated | 2 Cannot be automated | 3 Automated | 4 Pending
// is_required: true, default_value: "1"  (read live from get_case_fields, project 1).
//
// Every one-off push script in this repo used to send 3, so every case we created by API
// landed flagged Automated when nobody had automated it. That field is how the automation
// engineer records what he has actually automated, and Standing Rule 65 keys the tell-Vlad
// duty off it — so `1` is a statement of fact and `3` is a claim about somebody else's work.
//
// Python twin (and the guard): build/testing-tools/testrail_add_case.py
//                              build/testing-tools/check_add_case_payloads.py
// ---------------------------------------------------------------------------
export const AUTOMATION_STATUS = {
  'Not Automated': 1, 'Cannot be automated': 2, Automated: 3, Pending: 4,
};
export const DEFAULT_ATMSTATUS = AUTOMATION_STATUS['Not Automated']; // 1 — never 3
export const DEFAULT_AUTOMATION_TYPE = 0;                            // "None"

export function addCasePayload({
  title, refs, preconds, steps, expected,
  typeId = 1, priorityId = 1, templateId = 1,
  atmstatus = DEFAULT_ATMSTATUS, automationType = DEFAULT_AUTOMATION_TYPE,
  ...extra
} = {}) {
  if (atmstatus === AUTOMATION_STATUS.Automated) {
    throw new Error(
      "custom_atmstatus=3 ('Automated') is the automation engineer's flag to set, not ours "
      + "(CLAUDE.md 'Durable key facts -> TestRail'; Standing Rules 38 and 65). A case we create "
      + "has not been automated by anyone, so it is 1 ('Not Automated').");
  }
  if (!Object.values(AUTOMATION_STATUS).includes(atmstatus)) {
    throw new Error(`custom_atmstatus must be 1..4, got ${JSON.stringify(atmstatus)}`);
  }
  const body = {
    title, type_id: typeId, priority_id: priorityId, template_id: templateId,
    custom_atmstatus: atmstatus, custom_automation_type: automationType,
  };
  // Text fields only when supplied. NOTE for `update_case` (a different call): TestRail
  // RE-RENDERS any text field you OMIT, so an update payload must always carry
  // custom_preconds + custom_steps + custom_expected even unchanged — playbook section J.
  if (refs !== undefined) body.refs = refs;
  if (preconds !== undefined) body.custom_preconds = preconds;
  if (steps !== undefined) body.custom_steps = steps;
  if (expected !== undefined) body.custom_expected = expected;
  return { ...body, ...extra };
}

/** Create a case. Needs the QA lead's explicit permission first (Standing Rule 6). */
export const addCase = (sectionId, fields) =>
  api(`add_case/${sectionId}`, { method: 'POST', body: addCasePayload(fields) });

/** Post-create check. Do NOT assert `custom_atmstatus === 3` — that fails a correct case. */
export function verifyCreatedCase(caseBody, expectedAtmstatus = DEFAULT_ATMSTATUS) {
  const problems = [];
  if (caseBody.custom_atmstatus !== expectedAtmstatus) {
    problems.push(`custom_atmstatus is ${JSON.stringify(caseBody.custom_atmstatus)}, `
      + `expected ${JSON.stringify(expectedAtmstatus)}`);
  }
  if (caseBody.custom_automation_type !== DEFAULT_AUTOMATION_TYPE) {
    problems.push(`custom_automation_type is ${JSON.stringify(caseBody.custom_automation_type)}, `
      + `expected ${JSON.stringify(DEFAULT_AUTOMATION_TYPE)}`);
  }
  return { ok: problems.length === 0, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, ...rest] = process.argv;
  let res;
  if (cmd === 'add_result_for_case') {
    const [runId, caseId, statusId, comment] = rest;
    res = await addResultForCase(runId, caseId, Number(statusId) || 1, comment || '');
  } else if (cmd === 'get_case') {
    res = await getCase(rest[0]);
  } else if (cmd === 'get_projects') {
    res = await getProjects();
  } else if (cmd === 'raw' && rest[0]) {
    res = await api(rest[0]);
  } else {
    console.log('Usage: node testrail-api.mjs <get_projects|get_case <id>|add_result_for_case <run> <case> <status> <comment>|raw <endpoint>>');
    process.exit(1);
  }
  console.log('HTTP', res.status);
  console.log(typeof res.body === 'string' ? res.body.slice(0, 4000) : JSON.stringify(res.body, null, 1).slice(0, 6000));
}
