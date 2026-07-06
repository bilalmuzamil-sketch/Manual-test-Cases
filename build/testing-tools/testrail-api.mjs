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
