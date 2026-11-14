import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa83'}); const p=s.page; const W=ms=>p.waitForTimeout(ms);
const CUST='72ccef1e-6cf2-4910-a5c6-3e20cbac7e73', VEND='68c72fe7-8fbe-4795-85aa-7e91fbb54c7e';
const box=async sel=>p.locator(sel).first().evaluate(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]}).catch(()=>null);
const rowBox=async re=>p.evaluate(src=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>new RegExp(src).test(x.innerText)); if(!r) return null; const b=r.getBoundingClientRect(); return [b.x,b.y,b.width,b.height];},re);
const cellBox=async (rowRe,cellRe)=>p.evaluate(([a,b])=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>new RegExp(a).test(x.innerText)); if(!r) return null; const c=[...r.querySelectorAll('td,[role=cell],div')].find(x=>x.children.length===0&&new RegExp(b).test(x.innerText.trim())); if(!c) return null; const q=c.getBoundingClientRect(); return [q.x,q.y,q.width,q.height];},[rowRe,cellRe]);
const save=async(n,g)=>{ await p.screenshot({path:`../ev/cap/${n}.png`}); fs.writeFileSync(`../ev/cap/${n}.json`,JSON.stringify({url:p.url(),g},null,1)); console.log(n,p.url(),JSON.stringify(g).slice(0,300)); };
fs.mkdirSync('../ev/cap',{recursive:true});
// A menu
await s.go('/reports/ar-aging-summary'); await W(5000); await p.locator('[data-test-id=filter_chip_asOfDate]').click(); await W(1500);
await save('A-menu-today',{chip:await box('[data-test-id=filter_chip_asOfDate]'),cal:await box('[data-test-id=filter_single_date_asOfDate]'),d15:await box('[aria-label="15 November 2026"]'),d30:await box('[aria-label="30 November 2026"]'),d14:await box('[aria-label="14 November 2026"]'),next:await box('[data-test-id=filter_single_date_asOfDate] [aria-label="Next month"]'),nexty:await box('[data-test-id=filter_single_date_asOfDate] [aria-label="Next year"]'),totals:await rowBox('^\\s*Totals')});
await p.locator('[data-test-id=filter_single_date_asOfDate] [aria-label="Next month"]').click(); await W(1000);
await save('A2-menu-december',{cal:await box('[data-test-id=filter_single_date_asOfDate]'),d31:await box('[aria-label="31 December 2026"]')});
await p.locator('[aria-label="31 December 2026"]').click(); await W(4500);
// B after pick
await save('B-after-dec31',{chip:await box('[data-test-id=filter_chip_asOfDate]'),totals:await rowBox('^\\s*Totals'),row:await box(`[data-test-id=aging_summary_report_row_${CUST}]`),cur:await box('[data-test-id=header_arsum_current]'),d130:await box('[data-test-id=header_arsum_days_1_to_30]')});
// C AR collection drill
await p.locator(`[data-test-id=link_arsum_party_${CUST}]`).click(); await W(5000);
await save('C-ar-collection',{chip:await box('[data-test-id=filter_chip_asOfDate]'),cust:await box('[data-test-id=filter_chip_customerIds]'),row:await rowBox('S2-40221'),pd:await cellBox('S2-40221','^18$'),due:await cellBox('S2-40221','Dec 13, 2026')});
// D AP detail
await s.go(`/reports/ap-aging-detail?asOfDate=2026-12-31&vendorIds=${VEND}`); await W(5000);
const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count()&&await all.isEnabled()){ const t=(await all.innerText()).trim(); if(!/collapse/i.test(t)){await all.click(); await W(3000);} }
await p.evaluate(()=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>/ZZPV10282011/.test(x.innerText)); r&&r.scrollIntoView({block:'center'});}); await W(800);
await save('D-ap-detail',{chip:await box('[data-test-id=filter_chip_asOfDate]'),row:await rowBox('ZZPV10282011'),grp:await rowBox('^[^\\n]*31-60 days past due \\('),pd:await cellBox('ZZPV10282011','^33$'),due:await cellBox('ZZPV10282011','Nov 28, 2026')});
// E bad links
for(const [d,n] of [['2026-11-31','E1-link-1131'],['9999-12-31','E2-link-99991231'],['9999-12-30','E3-link-99991230']]){ await s.go('/reports/ar-aging-summary?asOfDate='+d); await W(5000); await save(n,{chip:await box('[data-test-id=filter_chip_asOfDate]')}); }
await s.close(); process.exit(0);
