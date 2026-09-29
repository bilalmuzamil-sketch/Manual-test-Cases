import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const strip = h => (h || '').replace(/<[^>]+>/g, '\n').replace(/&#8984;/g,'Cmd').replace(/&rsquo;/g,"'")
  .replace(/&ldquo;|&rdquo;/g,'"').replace(/&mdash;/g,'-').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
  .replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\n+/g,'\n').trim();
// which of the four still exist, and what do they now expect?
for (const cid of [44850, 55729, 44898, 45132, 45134, 45136]) {
  const { status, body } = await api(`get_case/${cid}`);
  if (status !== 200) { console.log(`C${cid}: get_case -> ${status}  (gone?)`); continue; }
  console.log(`\n=== C${cid} "${body.title}"  updated ${new Date(body.updated_on*1000).toISOString().slice(0,16).replace('T',' ')}`);
  console.log(strip(body.custom_expected).split('Source')[0].slice(0, 700));
}
// and what is in the run now
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
console.log('\n=== run 415 holds', tests.length, 'tests ===');
for (const cid of [44850, 55729, 44898, 45132, 45134, 45136]) {
  const t = tests.find(x => x.case_id === cid);
  console.log(`   C${cid}: ${t ? 'still in the run (test ' + t.id + ')' : 'NOT in the run any more'}`);
}
const { body: run } = await api('get_run/415');
console.log(`passed ${run.passed_count} failed ${run.failed_count} blocked ${run.blocked_count} untested ${run.untested_count}`);
