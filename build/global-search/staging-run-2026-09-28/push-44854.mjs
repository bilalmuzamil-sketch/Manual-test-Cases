import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const V = JSON.parse(fs.readFileSync('VERDICTS.json', 'utf8')).verdicts['44854'];
const comment = `Passed on ${JSON.parse(fs.readFileSync('VERDICTS.json','utf8')).environment}, build ${V.build}, 29 September 2026.\n\n${V.why}\n\n--- WHERE THIS STANDS ---\nThe report raised about this: SV-10188 — QA Complete, still open\nhttps://shopview.atlassian.net/browse/SV-10188\nIt does not reproduce, on this build or on the previous one. It should be closed.\n\nThe piece of work this belongs to: SV-9165 — TESTING QA\nhttps://shopview.atlassian.net/browse/SV-9165`;
const r = await api('add_result_for_case/415/44854', { method: 'POST', body: { status_id: 1, comment, version: V.build } });
console.log('C44854 -> Passed ->', r.status);
const { body: run } = await api('get_run/415');
console.log(`RUN 415 NOW: passed ${run.passed_count} failed ${run.failed_count} blocked ${run.blocked_count} untested ${run.untested_count}`);
