import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const strip = h => (h || '').replace(/<[^>]+>/g, '\n').replace(/&#8984;/g,'Cmd').replace(/&rsquo;/g,"'")
  .replace(/&ldquo;|&rdquo;/g,'"').replace(/&mdash;/g,'-').replace(/&gt;/g,'>').replace(/&lt;/g,'<')
  .replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\n+/g,'\n').trim();
for (const cid of process.argv.slice(2)) {
  const { body } = await api(`get_case/${cid}`);
  console.log('\n' + '='.repeat(96));
  console.log(`C${cid}  ${body.title}`);
  console.log('--PRECONDITIONS--\n' + strip(body.custom_preconds).slice(0, 700));
  console.log('--STEPS--\n' + strip(body.custom_steps).slice(0, 700));
  console.log('--EXPECTED--\n' + strip(body.custom_expected).slice(0, 1100));
}
