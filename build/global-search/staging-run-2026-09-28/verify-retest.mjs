import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const { body } = await api('get_results_for_case/415/55660&limit=1');
console.log('--- the newest comment on one of them, as it now reads ---\n');
console.log(((body.results || body)[0].comment || '').slice(0, 620));
