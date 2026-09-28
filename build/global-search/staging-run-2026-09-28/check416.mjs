import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
for (const id of [415, 416]) {
  const { body: r } = await api(`get_run/${id}`);
  console.log(`run ${id} "${r.name}": passed ${r.passed_count} · failed ${r.failed_count} · blocked ${r.blocked_count} · retest ${r.retest_count} · untested ${r.untested_count}  (${r.passed_count + r.failed_count + r.blocked_count + r.retest_count + r.untested_count} tests)`);
}
