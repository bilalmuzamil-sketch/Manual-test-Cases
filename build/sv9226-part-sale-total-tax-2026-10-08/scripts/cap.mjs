// node cap.mjs <prod|branch> <prefix> <customerId> <num1,num2,...>
import {op,ob,j} from './lib.mjs'; import fs from 'fs';
const [env,pre,cid,nums]=process.argv.slice(2); const N=nums.split(',');
const s=env==='prod'? await op({dpr:2,vp:{width:1600,height:1000}}) : await ob({dpr:2,vp:{width:1600,height:Number(process.env.H||1000)}}); const p=s.page; const G={marker:(await s.marker()).version};
await s.go(`/customers/${cid}/part-sales`); await p.waitForTimeout(4000);
G.tab=await p.evaluate(ns=>{const hs=[...document.querySelectorAll('thead th')]; const ti=hs.findIndex(h=>/Total Price/.test(h.innerText)); const th=hs[ti].getBoundingClientRect();
  return {th:[th.x,th.y,th.width,th.height],rows:[...document.querySelectorAll('tbody tr')].filter(r=>ns.some(n=>r.innerText.includes(n+'\t')||r.innerText.startsWith(n))).map(r=>{const td=r.querySelectorAll('td'); const g=r.getBoundingClientRect(); const c=td[ti].getBoundingClientRect(); return {n:td[0].innerText.trim(),total:td[ti].innerText.trim(),row:[g.x,g.y,g.width,g.height],cell:[c.x,c.y,c.width,c.height]};})};},N);
await p.screenshot({path:`/tmp/qa9226/${pre}-tab.png`});
const all=[]; for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`)).json?.data?.partSales||[];all.push(...c);if(c.length<100)break;}
G.detail={};
for(const n of N){ const x=all.find(r=>r.number===n); await s.go(`/parts/part-sale/${x.id}/part-requests`); 
  let fi=null; for(let k=0;k<24;k++){ await p.waitForTimeout(500); fi=await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.innerText?.trim()==='Financial Info'); if(!h) return null; let c=h; for(let i=0;i<4;i++) c=c.parentElement; const g=c.getBoundingClientRect(); const rows=[...c.querySelectorAll('tr,.row,div')].filter(e=>/^Total\s/.test(e.innerText.trim())&&e.innerText.trim().length<40).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\s+/g,' '),g:[r.x,r.y,r.width,r.height]};}); const txt=c.innerText.split('\n').map(t=>t.trim()).filter(Boolean); return {card:[g.x,g.y,g.width,g.height],totalRow:rows.slice(-1)[0],txt};}); if(fi&&fi.totalRow&&/\$/.test(fi.totalRow.t)) break; }
  G.detail[n]=fi; await p.screenshot({path:`/tmp/qa9226/${pre}-${n}.png`,fullPage:true}); }
fs.writeFileSync(`/tmp/qa9226/${pre}.json`,JSON.stringify(G,null,1)); console.log(j({marker:G.marker,tab:G.tab.rows.map(r=>[r.n,r.total]),detail:Object.fromEntries(Object.entries(G.detail).map(([k,v])=>[k,v?.totalRow?.t]))},900));
await s.close();
