import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const ids=new Map();
for(let pg=1;pg<80;pg++){const r=await s.api(`/api/work-orders?pagination[page]=${pg}&pagination[rowsPerPage]=100`); const w=r.json?.data?.work_orders||[]; if(!w.length)break; let n=0; for(const x of w){ if(!ids.has(x.id)){ids.set(x.id,[x.number,x.status]);n++;} } if(!n)break; }
console.log('work orders',ids.size);
const list=[...ids.entries()]; const hits=[];
for(let i=0;i<list.length;i+=40){
  const batch=list.slice(i,i+40).map(e=>e[0]);
  const res=await s.page.evaluate(async([api,b])=>Promise.all(b.map(async id=>{const r=await fetch(api+'/api/work-orders/lines/'+id,{credentials:'include'}); if(!r.ok)return [id,null]; const j=await r.json(); const col=j?.data?.collection||[];
     return [id,col.filter(l=>(l.adjustments||[]).length).map(l=>({line:l.line_name||l.name,lid:l.line_id||l.id,adj:l.adjustments.map(a=>[a.kind,a.scope,a.name,a.calculationType,a.amount].join('|'))}))];})),[s.host.api,batch]);
  for(const [id,ls] of res) if(ls&&ls.length) { const h={id,num:ids.get(id)[0],st:ids.get(id)[1],lines:ls}; hits.push(h); console.log('HIT',JSON.stringify(h).slice(0,400)); }
  if(i%400===0) console.log('progress',i,'/',list.length);
}
console.log('done hits',hits.length); fs.writeFileSync('/tmp/qa11685/w/fee/scan-hits.json',JSON.stringify(hits,null,1));
await s.browser.close(); process.exit(0);
