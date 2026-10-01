// Pull the 183 passing-but-unspecced cases from TestRail so each spec asserts what its CASE says,
// not what I remember it saying (Rule 100). Written to a file and summarised - never bulk-read
// into the session (Rule 88).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const need=JSON.parse(fs.readFileSync('build/global-search/prod-2026-10-01/passing-without-specs.json','utf8'));
const strip=h=>(h||'').replace(/<br\s*\/?>/g,'\n').replace(/<\/(p|li|ol|ul|div)>/g,'\n')
  .replace(/<[^>]+>/g,'').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,'&')
  .replace(/\n{3,}/g,'\n\n').trim();
const out=[];
for (const c of need.cases){
  const {body:k}=await api(`get_case/${c.case_id}`);
  out.push({ cid:c.case_id, title:k.title, section:k.section_id,
    preconds:strip(k.custom_preconds), steps:strip(k.custom_steps), expected:strip(k.custom_expected),
    automated:k.custom_atmstatus, type:k.custom_automation_type });
  if(out.length%40===0) console.log('  fetched', out.length);
}
fs.writeFileSync('build/global-search/specs-2026-10-01/cases-183.json', JSON.stringify(out,null,1));
// what search term does each case tell the tester to type? that is what the spec must use.
const withTerm=out.filter(c=>/TYPE THIS INTO THE SEARCH BOX/i.test(c.preconds||'')).length;
console.log(`fetched ${out.length} cases; ${withTerm} name an explicit search term in their preconditions`);
