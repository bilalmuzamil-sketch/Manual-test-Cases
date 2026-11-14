import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa83'}); const p=s.page; const W=ms=>p.waitForTimeout(ms);
const CUST='72ccef1e-6cf2-4910-a5c6-3e20cbac7e73', VEND='68c72fe7-8fbe-4795-85aa-7e91fbb54c7e';
const box=async sel=>p.locator(sel).first().evaluate(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]}).catch(()=>null);
const rowBox=async re=>p.evaluate(src=>{const r=[...document.querySelectorAll('tr,[role=row]')].filter(x=>new RegExp(src).test(x.innerText)).pop(); if(!r) return null; const b=r.getBoundingClientRect(); return [b.x,b.y,b.width,b.height];},re);
const cellBox=async (rowRe,cellRe)=>p.evaluate(([a,b])=>{const r=[...document.querySelectorAll('tr,[role=row]')].filter(x=>new RegExp(a).test(x.innerText)).pop(); if(!r) return null; const c=[...r.querySelectorAll('*')].find(x=>x.children.length===0&&new RegExp(b).test(x.innerText.trim())); if(!c) return null; const q=c.getBoundingClientRect(); return [q.x,q.y,q.width,q.height];},[rowRe,cellRe]);
const save=async(n,g)=>{ await p.screenshot({path:`../ev/cap/${n}.png`}); fs.writeFileSync(`../ev/cap/${n}.json`,JSON.stringify({url:p.url(),g},null,1)); console.log(n,JSON.stringify(g)); };
await s.go(`/reports/ar-aging-collection?asOfDate=2026-12-31&customerIds=${CUST}`); await W(5000);
console.log('toggles',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*=toggle]')].map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim()).slice(0,5)));
const t=p.locator('[data-test-id*=_toggle_]').filter({hasNotText:/collapse/i}); const tg=p.locator(`[data-test-id$=_toggle_${CUST}]`); if(await tg.count()){ await tg.first().click(); await W(3000);} else { const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count()){ await all.click(); await W(3000);} }
console.log('rows',await p.evaluate(()=>[...document.querySelectorAll('tr,[role=row]')].map(x=>x.innerText.replace(/\s+/g,' ')).filter(t=>/S2-402|Total for/.test(t))));
await save('C-ar-collection',{chip:await box('[data-test-id=filter_chip_asOfDate]'),cust:await box('[data-test-id=filter_chip_customerIds]'),row:await rowBox('S2-40221'),pd:await cellBox('S2-40221','^18$'),due:await cellBox('S2-40221','Dec 13, 2026')});
await s.go(`/reports/ap-aging-detail?asOfDate=2026-12-31&vendorIds=${VEND}`); await W(5000);
const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count()&&!/collapse/i.test(await all.innerText())){await all.click(); await W(3000);} 
await p.evaluate(()=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>/ZZPV10282011/.test(x.innerText)); r&&r.scrollIntoView({block:'center'});}); await W(800);
console.log('grp rows',await p.evaluate(()=>[...document.querySelectorAll('tr,[role=row]')].map(x=>x.innerText.replace(/\s+/g,' ')).filter(t=>/31-60/.test(t))));
await save('D-ap-detail',{chip:await box('[data-test-id=filter_chip_asOfDate]'),row:await rowBox('ZZPV10282011'),grp:await rowBox('31-60 days past due \\('),pd:await cellBox('ZZPV10282011','^33$'),due:await cellBox('ZZPV10282011','Nov 28, 2026')});
await s.close(); process.exit(0);
