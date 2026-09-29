import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const { body } = await api('get_results_for_case/415/44854&limit=1');
const c = (body.results || body)[0].comment;
console.log('--- C44854, the tail of its comment ---');
console.log(c.slice(c.indexOf('--- WHERE THIS STANDS ---')));
console.log('\n--- check every one now names something ---');
for (const cid of [53476,44850,44854,55716,55729,44898,45132,45134,45136,45153,45160,53601,55660,55673,55685,55686]) {
  const { body: b } = await api(`get_results_for_case/415/${cid}&limit=1`);
  const cm = (b.results || b)[0].comment || '';
  const keys = [...new Set(cm.match(/SV-\d+/g) || [])];
  console.log(`C${cid}: ${keys.join(', ')}`);
}
