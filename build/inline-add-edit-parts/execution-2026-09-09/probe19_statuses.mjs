// Which work-order statuses actually exist on this branch, and pick one Complete / Invoiced / Paid
// work order that HAS a line with a part - the state C44993 / C44994 need.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APIH } = s;
const r = await page.evaluate(async (h)=>{
  const get=async u=>{try{const x=await fetch(`https://${h}${u}`,{credentials:'include',headers:{Accept:'application/json'}});
    return x.ok?await x.json():{__s:x.status};}catch(e){return{__e:String(e)}}};
  let all=[];
  for(let p=1;p<=8;p++){
    const j=await get(`/api/work-orders?pagination%5Bpage%5D=${p}&pagination%5BrowsPerPage%5D=100`);
    const c=j?.data?.collection ?? j?.data ?? j?.collection ?? j;
    if(!Array.isArray(c)||!c.length) break;
    all=all.concat(c); if(c.length<100) break;
  }
  const norm=w=>({id:w.id, num:w.number??w.wo_number??w.display_number,
    status:(w.status&&(w.status.name??w.status))??w.state??null,
    lines:w.lines_count??w.line_count??null, parts:w.parts_count??null});
  const rows=all.map(norm);
  const counts={}; rows.forEach(x=>counts[String(x.status)]=(counts[String(x.status)]||0)+1);
  return { total:rows.length, counts, rows };
}, APIH);
log('work orders read:', r.total);
log('STATUS COUNTS:', JSON.stringify(r.counts));
const want=['Complete','Invoiced','Paid'];
for (const st of want){
  const m=(r.rows||[]).filter(x=>String(x.status)===st).slice(0,4);
  log(`${st}: ${m.length ? JSON.stringify(m) : 'NONE'}`);
}
fs.writeFileSync(`${DIR}/evidence/19-statuses.json`, JSON.stringify(r,null,1));
await s.browser.close();
