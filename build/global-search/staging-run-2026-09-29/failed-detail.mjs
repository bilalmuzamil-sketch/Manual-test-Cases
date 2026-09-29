import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'node:fs';
const plan=JSON.parse(fs.readFileSync('cases-110.json','utf8'));
const meta=new Map(plan.map(c=>[c.case_id,c]));
let tests=[],offset=0;
for(;;){ const {body}=await api(`get_tests/415&limit=250&offset=${offset}`);
  const r=body.tests||body; if(!r||!r.length) break; tests.push(...r); if(r.length<250) break; offset+=250; }
const failed=tests.filter(t=>t.status_id===5 && meta.has(t.case_id));
const out=[];
for(const t of failed){
  const {body:c}=await api('get_case/'+t.case_id);
  const strip=s=>(s||'').replace(/<br\s*\/?>/g,'\n').replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,'')
    .replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
  const pre=strip(c.custom_preconds), stp=strip(c.custom_steps), exp=strip(c.custom_expected);
  const term=(pre.match(/TYPE THIS INTO THE SEARCH BOX — exactly as written:\s*\n(.+)/)||[])[1];
  const stepTerm=(stp.match(/type\s+([A-Za-z0-9@.\- ]{2,40})/i)||[])[1];
  const {body:res}=await api(`get_results_for_case/415/${t.case_id}&limit=1`);
  const r0=(res.results||res)[0]||{};
  out.push({cid:t.case_id, test_id:t.id, section:meta.get(t.case_id).section, title:c.title,
    term:(term||'').trim(), stepTerm:(stepTerm||'').trim(),
    expected:exp.split('---')[0].trim(), comment:(r0.comment||'').slice(0,900)});
}
out.sort((a,b)=>a.cid-b.cid);
fs.writeFileSync('failed-detail.json', JSON.stringify(out,null,1));
console.log('failed:',out.length);
const seeded=out.filter(o=>/^ZZ/i.test(o.term)).length;
console.log('using ZZ-seeded terms:',seeded,'| using live data:',out.length-seeded);
