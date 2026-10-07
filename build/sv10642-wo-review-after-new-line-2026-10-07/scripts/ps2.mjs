import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page;
const r=await s.api('/api/part-sales?limit=50'); const ps=r.json.data.partSales; console.log('n',ps.length, j(Object.keys(ps[0]),600));
const one=ps.find(x=>x.status==='Approved'||x.status==='approved')||ps[0]; console.log('pick',one.id,one.number,one.status);
await s.go('/parts/part-sales/'+one.id); console.log('url',p.url());
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(x=>/line|status|review|complete/i.test(x)).slice(0,30)); console.log('tids',j(t,800));
const btn=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.innerText.trim()).filter(Boolean).slice(0,30)); console.log('buttons',j(btn,600));
await s.shot('ps-detail','shots'); await s.close();
