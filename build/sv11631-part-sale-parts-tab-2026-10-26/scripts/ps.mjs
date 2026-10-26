import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]||'branch';
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
console.log('marker',JSON.stringify(await s.marker()));
const API=env==='branch'?'https://sv11631api.qa.shopview.com':'https://api.shopview.com';
const res=await s.page.evaluate(async B=>{ const f=async p=>(await fetch(B+p,{credentials:'include'})).json();
  const j=await f('/api/part-sales?rowsPerPage=100'); const D=j?.data||{}; const L=Array.isArray(D)?D:(D.part_sales||D.collection||D.partSales||D.items||Object.values(D).find(v=>Array.isArray(v))||[]); const keys=Object.keys(D).join(',')+' / '+(L[0]?Object.keys(L[0]).join(','):'');
  const out=[]; for(const x of L.slice(0,60)){ const r=await f(`/api/work-orders/${x.id}/parts/list-requests-by-line?search=`); const col=r?.data?.collection||[]; let n=0, lines=[]; for(const l of col){ const parts=l.part_requests||l.parts||l.requests||[]; n+=parts.length; lines.push(l.id||l.line_id);} out.push({id:x.id,num:x.number||x.display_number,st:x.status,n,lines}); }
  return {count:L.length,keys,out}; },API);
console.log('part sales',res.count,'keys',res.keys.slice(0,300)); res.out.sort((a,b)=>b.n-a.n).slice(0,10).forEach(x=>console.log(x.num,x.st,'parts',x.n,x.id,(x.lines||[]).join(',')));
process.exit(0);
