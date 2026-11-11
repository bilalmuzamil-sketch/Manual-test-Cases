// A/R Collection (or A/P Unpaid): open the 100+ group, count document rows in the page before and after scrolling
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP||'ar-aging-collection', NAME=process.env.NAME||'ZZAUTOTEST OVER100 C', PFX=process.env.PFX||'arcol', TAG=process.env.TAG||REP;
const s=await sess(); const p=s.page; const net=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2);
p.on('response',async r=>{ const u=r.url(); if(/\/api\//.test(u)&&!/(notif|preferences|fe-permissions|me$|clock|whats-new|settings)/.test(u)){ let n=''; try{ const j=await r.json(); const d=j?.data??j; const a=d?.rows||d?.collection||d?.items||d?.documents||(Array.isArray(d)?d:null); n=a?(' rows='+a.length):(' keys='+Object.keys(d||{}).slice(0,8).join(',')); }catch{} net.push(`${T()} ${r.status()} ${r.request().method()} ${decodeURIComponent(u.replace(/^https:\/\/[^/]+/,'')).slice(0,170)}${n}`);} });
console.log('marker',JSON.stringify(await s.marker()));
await s.go('/reports/'+REP); await p.waitForTimeout(8000);
// tick only the customer/vendor in the filter chip
const chip=process.env.CHIP||(REP.startsWith('ar')?'filter_chip_customerIds':'filter_chip_vendorIds');
await s.glideClick(chip); await p.waitForTimeout(1500);
const KEY=chip.replace('filter_chip_','');
await p.locator(`[data-test-id=filter_search_${KEY}] input, input[data-test-id=filter_search_${KEY}]`).first().click().catch(async()=>{ await s.glideClick('filter_search_'+KEY); });
await p.keyboard.type('OVER100',{delay:40}); await p.waitForTimeout(3000);
const opt=await p.evaluate(([n,K])=>{const e=[...document.querySelectorAll(`[data-test-id^="filter_option_${K}_"]`)].find(x=>x.innerText.trim().startsWith(n)); if(!e) return [...document.querySelectorAll(`[data-test-id^="filter_option_${K}_"]`)].map(x=>x.innerText.trim()).slice(0,8); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim(),id:e.getAttribute('data-test-id')}},[NAME,KEY]);
console.log('option',JSON.stringify(opt)); if(opt&&opt.x){ await p.mouse.click(opt.x,opt.y); await p.waitForTimeout(1500); }
await p.keyboard.press('Escape'); await p.waitForTimeout(5000);
console.log('url',p.url());
const grp=await p.evaluate(n=>[...document.querySelectorAll('[data-test-id$="_cell_customer_name"],[data-test-id$="_cell_vendor_name"],tr')].filter(e=>e.innerText.includes(n)).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,80)).slice(0,3),NAME); console.log('group rows',JSON.stringify(grp));
// toggle the group open
const tg=await p.evaluate(n=>{const tr=[...document.querySelectorAll('tr')].find(r=>r.innerText.includes(n)); const b=tr&&tr.querySelector('[data-test-id*="_toggle_"]'); if(!b) return null; b.scrollIntoView({block:'center'}); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:b.getAttribute('data-test-id')}},NAME);
console.log('toggle',JSON.stringify(tg)); const mark=net.length; await p.mouse.click(tg.x,tg.y); await p.waitForTimeout(6000);
console.log('--- requests after opening the group'); console.log(net.slice(mark).join('\n'));
const count=()=>p.evaluate(()=>{ const rows=[...document.querySelectorAll('tbody tr')]; const doc=rows.filter(r=>/^(\s*\d{1,2}\/\d{1,2}\/\d{4})/.test(r.innerText.trim())||/(S11315-|ZZO100-|INV-|Invoice|Bill)/.test(r.innerText)); return {trs:rows.length, docRows:doc.length, last:doc.length?doc[doc.length-1].innerText.replace(/\s+/g,' ').slice(0,90):'', scrollH:document.scrollingElement.scrollHeight, inner:[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)).map(e=>(e.getAttribute('data-test-id')||e.className.toString().slice(0,40))+':'+e.scrollHeight).slice(0,4)}; });
const out={marker:await s.marker(),steps:[]};
let c=await count(); console.log('after open (no scroll):',JSON.stringify(c)); out.steps.push({at:'after open, no scroll',...c});
await p.screenshot({path:`../ev/${TAG}-1-open.png`});
for(let i=1;i<=6;i++){ const m2=net.length;
  await p.evaluate(()=>{ const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); const el=sc.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0]||document.scrollingElement; el.scrollTop=el.scrollHeight; window.scrollTo(0,document.scrollingElement.scrollHeight); });
  await p.waitForTimeout(2500); c=await count(); console.log(`after scroll ${i}:`,JSON.stringify(c),'| new requests:',net.slice(m2).length); out.steps.push({at:'after scroll '+i,...c,newReq:net.slice(m2)}); }
await p.screenshot({path:`../ev/${TAG}-2-end.png`});
fs.writeFileSync(`../ev/${TAG}-expand.json`,JSON.stringify({...out,net},null,1)); await s.close(); process.exit(0);
