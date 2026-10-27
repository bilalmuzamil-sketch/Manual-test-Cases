import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const out=await s.page.evaluate(async(api)=>{
  const g=async p=>{const r=await fetch(api+p,{credentials:'include'});return r.ok?r.json():null;};
  const ids=[]; let total=0;
  for(let pg=1;pg<60;pg++){const j=await g('/api/work-orders?rowsPerPage=100&page='+pg); const w=j?.data?.work_orders||[]; if(!w.length)break; w.forEach(x=>ids.push([x.id,x.number,x.status])); }
  const hits=[]; let done=0;
  const work=async()=>{while(ids.length){const [id,num,st]=ids.pop(); const j=await g('/api/work-orders/lines/'+id); done++;
     const col=j?.data?.collection||j?.data||[]; for(const l of (Array.isArray(col)?col:[])){const a=l.adjustments||[]; if(a.length) hits.push({id,num,st,line:l.line_name||l.name,lid:l.line_id||l.id,adj:a.map(x=>[x.kind,x.scope,x.name,x.calculationType,x.amount].join('|'))});}}};
  await Promise.all(Array.from({length:12},work)); return {done,hits};
},s.host.api);
console.log('scanned',out.done,'hits',out.hits.length); for(const h of out.hits.slice(0,40)) console.log(JSON.stringify(h));
fs.writeFileSync('/tmp/qa11685/w/fee/scan-hits.json',JSON.stringify(out.hits,null,1));
await s.browser.close(); process.exit(0);
