import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:(process.env.QA_DIR||'/tmp/qa21'),vp:{width:1440,height:900}});
const r=await s.page.evaluate(async()=>{ const B='https://sv11631api.qa.shopview.com'; const f=async p=>(await fetch(B+p,{credentials:'include'})).json();
 const L=(await f('/api/part-sales?rowsPerPage=200')).data.partSales; let parts=0; const hits=[];
 for(const x of L){ const c=(await f(`/api/work-orders/${x.id}/parts/list-requests-by-line?search=`))?.data?.collection||[]; for(const l of c) for(const pr of (l.part_requests||[])){ parts++; if(pr.adjustments&&pr.adjustments.length) hits.push(x.number+' '+pr.description); } }
 return {sales:L.length,parts,hits}; });
console.log(JSON.stringify(r)); process.exit(0);
