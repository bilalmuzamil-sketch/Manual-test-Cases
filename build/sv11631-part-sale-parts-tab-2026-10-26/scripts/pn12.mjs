import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const p=s.page; await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(6000);
const r=await p.evaluate(async()=>{ const B='https://sv11631api.qa.shopview.com'; const f=async u=>(await fetch(B+u,{credentials:'include'})).json();
  const inp=document.querySelector('.base-table tbody .part-number-cell input'); const font=getComputedStyle(inp).font; const box=inp.clientWidth;
  const c=document.createElement('canvas').getContext('2d'); c.font=font;
  const pns=new Set(); for(let pg=1;pg<=40;pg++){ const j=await f(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=200&search=`); const L=Object.values(j?.data||{}).find(Array.isArray)||[]; if(!L.length) break; L.forEach(x=>x.part_number&&pns.add(String(x.part_number).trim())); }
  const twelve=[...pns].filter(x=>x.length===12); const cut=twelve.filter(x=>c.measureText(x).width>box).sort((a,b)=>c.measureText(b).width-c.measureText(a).width);
  const upTo12=[...pns].filter(x=>x.length<=12); const cutUpTo=upTo12.filter(x=>c.measureText(x).width>box);
  return {box,font,total:pns.size,twelve:twelve.length,twelveCut:cut.length,examples:cut.slice(0,6).map(x=>x+' '+c.measureText(x).width.toFixed(1)),upTo12:upTo12.length,upTo12Cut:cutUpTo.length,shortestCut:cutUpTo.sort((a,b)=>a.length-b.length).slice(0,3)}; });
console.log(JSON.stringify(r,null,1)); process.exit(0);
