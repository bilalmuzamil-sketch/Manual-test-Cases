import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const { body: r } = await api('get_run/415');
console.log(`run 415 now: ${r.passed_count+r.failed_count+r.blocked_count+r.retest_count+r.untested_count} tests — ${r.passed_count} passed, ${r.failed_count} failed, ${r.retest_count} retest, ${r.untested_count} untested`);
