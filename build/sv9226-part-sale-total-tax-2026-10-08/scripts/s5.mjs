import {ob,j} from './lib.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('full-compare.json')); const byN=Object.fromEntries(C.map(x=>[x.n,x]));
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page;
const read=async()=>p.evaluate(()=>{const hs=[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim()); const ti=hs.findIndex(h=>/Total Price/.test(h)); const ni=hs.findIndex(h=>/^Number/.test(h));
  return {hs,rows:[...document.querySelectorAll('tbody tr')].map(r=>{const td=[...r.querySelectorAll('td')].map(c=>c.innerText.trim()); return [td[ni],td[ti]];}).filter(x=>x[0])};});
await s.go('/parts/part-sales'); await p.waitForTimeout(3000);
let a=await read(); console.log('headers',a.hs.join('|')); await p.screenshot({path:'/tmp/qa9226/A-list.png'});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(800); const foot=await p.evaluate(()=>{const t=document.body.innerText; const i=t.lastIndexOf('Total'); return t.slice(Math.max(0,i-200),i+200);}); console.log('bottom text',JSON.stringify(foot)); await p.screenshot({path:'/tmp/qa9226/A-list-bottom.png'});
const chk=rows=>rows.map(([n,t])=>{const c=Math.round(parseFloat((t||'').replace(/[$,]/g,''))*100); const d=byN[n]; return {n,screen:t,detail:d?.detailCents??null,ok:d?(c===d.detailCents||(t==='-'&&d.detailCents===0)):null, zeroDash:t==='-'};});
const A=chk(a.rows); console.log('Parts>Part Sales rows on screen',A.length,'ok',A.filter(x=>x.ok).length,'bad',j(A.filter(x=>x.ok===false)), 'unknown',A.filter(x=>x.ok===null).map(x=>x.n).join(','));
await s.go('/customers/91067a7e-46e1-4019-8e40-ff436abcc4cc'); await p.waitForTimeout(2500);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab, a')].map(e=>e.innerText.trim()).filter(t=>/Part/i.test(t))); console.log('tabs',j(tabs));
const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('[role=tab], .q-tab, a')].find(x=>/^Part Sales/i.test(x.innerText.trim())); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(t){ await p.mouse.click(t.x,t.y); await p.waitForTimeout(3000); }
let b=await read(); console.log('cust url',p.url(),'headers',b.hs.join('|')); await p.screenshot({path:'/tmp/qa9226/B-customer.png'});
const B=chk(b.rows); console.log('Customer tab rows',B.length,'ok',B.filter(x=>x.ok).length,'bad',j(B.filter(x=>x.ok===false)),'unknown',B.filter(x=>x.ok===null).map(x=>x.n).join(','));
fs.writeFileSync('screen-compare.json',JSON.stringify({A,B},null,1));
await s.close();
